import { useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { auth } from "../Firebase/firebase.init";
import {
  normalizeEmail,
  readPendingProfile,
  clearPendingProfile,
} from "./authProfile";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  // idle | loading | ready | missing | error
  const [profileStatus, setProfileStatus] = useState("idle");
  const [profileError, setProfileError] = useState(null);
  const loadSeqRef = useRef(0);

  const API_URL = import.meta.env.VITE_API_URL || "";

  const applyProfile = (data) => {
    setProfile(data || null);
    setRole(data?.role || null);
    setProfileStatus(data?.role ? "ready" : "missing");
    setProfileError(null);
    if (data?.role) clearPendingProfile();
  };

  const fetchProfileDocument = async (email) => {
    if (!API_URL) {
      throw new Error("VITE_API_URL is not configured");
    }
    const { data } = await axios.get(
      `${API_URL}/users/${encodeURIComponent(email)}`,
      { timeout: 8000 }
    );
    // Guard against SPA/index.html responses if API_URL is wrong
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("Invalid profile response from API");
    }
    return data;
  };

  const trySyncPendingProfile = async (email) => {
    const pending = readPendingProfile();
    if (!pending?.role) return false;
    if (normalizeEmail(pending.email) !== email) return false;
    if (!API_URL) return false;

    try {
      const payload = {
        email,
        name: pending.name || user?.displayName || email.split("@")[0],
        role: pending.role,
      };
      if (pending.companyName) payload.companyName = pending.companyName;
      if (pending.companyLogo) payload.companyLogo = pending.companyLogo;
      if (pending.profileImage) payload.profileImage = pending.profileImage;
      if (pending.dateOfBirth) payload.dateOfBirth = pending.dateOfBirth;
      if (pending.position) payload.position = pending.position;

      await axios.post(`${API_URL}/users`, payload, { timeout: 10000 });
      const data = await fetchProfileDocument(email);
      applyProfile(data);
      return Boolean(data?.role);
    } catch (err) {
      // Profile may already exist (400) — re-fetch
      if (err?.response?.status === 400) {
        try {
          const data = await fetchProfileDocument(email);
          applyProfile(data);
          return Boolean(data?.role);
        } catch {
          return false;
        }
      }
      return false;
    }
  };

  const loadProfile = async (email) => {
    const seq = ++loadSeqRef.current;
    const target = normalizeEmail(email);

    if (!target) {
      setProfile(null);
      setRole(null);
      setProfileStatus("missing");
      setProfileError(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);
    setProfileStatus((prev) => (prev === "ready" ? "ready" : "loading"));
    setProfileError(null);

    try {
      let lastError = null;
      const maxAttempts = 3;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        if (seq !== loadSeqRef.current) return;

        try {
          const data = await fetchProfileDocument(target);
          if (seq !== loadSeqRef.current) return;
          if (!data.role) {
            setProfile(data);
            setRole(null);
            setProfileStatus("missing");
            setProfileError(null);
            return;
          }
          applyProfile(data);
          return;
        } catch (err) {
          lastError = err;
          const status = err?.response?.status;

          if (status === 404) {
            if (seq !== loadSeqRef.current) return;
            const synced = await trySyncPendingProfile(target);
            if (seq !== loadSeqRef.current) return;
            if (synced) return;

            // Real missing profile — not a transport failure
            setProfile(null);
            setRole(null);
            setProfileStatus("missing");
            setProfileError(null);
            return;
          }

          // Transient (network / 5xx / timeout): retry, keep prior profile
          if (attempt < maxAttempts) {
            await new Promise((resolve) => setTimeout(resolve, 350 * attempt));
            continue;
          }

          if (seq !== loadSeqRef.current) return;
          // Do NOT wipe a previously loaded profile on temporary failure
          setProfileError(lastError?.message || "Failed to load profile");
          setProfileStatus((prev) => (prev === "ready" ? "ready" : "error"));
          return;
        }
      }
    } finally {
      if (seq === loadSeqRef.current) {
        setProfileLoading(false);
        setProfileStatus((prev) => {
          if (prev === "loading") return "error";
          return prev;
        });
      }
    }
  };

  const createUser = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        normalizeEmail(email),
        password
      );
      if (name || photoURL) {
        await updateProfile(result.user, {
          displayName: name || result.user.displayName,
          photoURL: photoURL || result.user.photoURL,
        });
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      return await signInWithEmailAndPassword(
        auth,
        normalizeEmail(email),
        password
      );
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      return await signInWithPopup(auth, provider);
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      loadSeqRef.current += 1;
      setUser(null);
      setRole(null);
      setProfile(null);
      setProfileLoading(false);
      setProfileStatus("idle");
      setProfileError(null);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, normalizeEmail(email));
  };

  const refreshProfile = async () => {
    if (!user?.email) return;
    await loadProfile(user.email);
  };

  // One-tap recovery when Firebase user exists but Mongo profile is missing
  // (e.g. registration interrupted, or profile never synced).
  const completeProfile = async (selectedRole, extra = {}) => {
    const email = normalizeEmail(user?.email);
    if (!email) throw new Error("Not signed in");
    if (selectedRole !== "hr" && selectedRole !== "employee") {
      throw new Error("Role must be hr or employee");
    }
    if (!API_URL) throw new Error("VITE_API_URL is not configured");

    const name =
      extra.name ||
      user?.displayName ||
      email.split("@")[0];

    const payload = {
      email,
      name,
      role: selectedRole,
      ...extra,
    };

    try {
      await axios.post(`${API_URL}/users`, payload, { timeout: 10000 });
    } catch (err) {
      if (err?.response?.status !== 400) throw err;
      // already exists — fall through to fetch
    }

    const data = await fetchProfileDocument(email);
    applyProfile(data);
    if (!data?.role) {
      throw new Error("Profile is missing a role");
    }
    return data;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const email = normalizeEmail(currentUser.email);
        setUser({
          uid: currentUser.uid,
          email,
          displayName: currentUser.displayName || "",
          photoURL: currentUser.photoURL || "",
        });
        setLoading(false);
        await loadProfile(email);
      } else {
        loadSeqRef.current += 1;
        setUser(null);
        setRole(null);
        setProfile(null);
        setProfileLoading(false);
        setProfileStatus("idle");
        setProfileError(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL]);

  const authInfo = {
    user,
    role,
    profile,
    loading,
    profileLoading,
    profileStatus,
    profileError,
    createUser,
    loginUser,
    loginWithGoogle,
    logOut,
    resetPassword,
    refreshProfile,
    completeProfile,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
