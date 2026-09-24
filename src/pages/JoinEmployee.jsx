import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import LogoImage from "../assets/assetverse_logo.png";
import { AuthContext, } from "../Context/AuthContext";
import {
    normalizeEmail,
    writePendingProfile,
    clearPendingProfile,
} from "../Context/authProfile";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "";

const JoinEmployee = () => {
    const { createUser, logOut } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        dateOfBirth: "",
        profileImage: "", // optional input
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const cleanupFirebaseUser = async (firebaseUser) => {
        if (!firebaseUser) return false;
        try {
            const token = await firebaseUser.getIdToken();
            await axios.post(
                `${API_URL}/auth/cleanup-failed-signup`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 8000,
                }
            );
            return true;
        } catch (cleanupErr) {
            console.warn("Firebase cleanup after failed signup:", cleanupErr?.message || cleanupErr);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Password validation (same as old project)
        if (formData.password.length < 6) {
            return toast.error("Password must be 6+ chars");
        }
        if (!/[A-Z]/.test(formData.password)) {
            return toast.error("Password must have uppercase");
        }
        if (!/[a-z]/.test(formData.password)) {
            return toast.error("Password must have lowercase");
        }

        setLoading(true);
        let firebaseUser = null;
        const email = normalizeEmail(formData.email);

        // Persist registration intent so AuthProvider can sync Mongo if this step fails later
        writePendingProfile({
            role: "employee",
            email,
            name: formData.name,
            dateOfBirth: formData.dateOfBirth,
            profileImage: formData.profileImage || "",
        });

        // 1) Create user in Firebase
        try {
            const result = await createUser(
                email,
                formData.password,
                formData.name,
                formData.profileImage || ""
            );
            firebaseUser = result.user;
        } catch (err) {
            console.error(err);
            if (err.code === "auth/email-already-in-use") {
                toast.error("This email is already registered. Please login instead.");
            } else if (err.code === "auth/invalid-email") {
                toast.error("Please enter a valid email address.");
            } else if (err.code === "auth/weak-password") {
                toast.error("Password is too weak. Use at least 6 characters.");
            } else {
                toast.error(err.message || "Could not create Firebase account.");
            }
            clearPendingProfile();
            setLoading(false);
            return;
        }

        // 2) Backend profile
        const userData = {
            name: formData.name,
            email,
            password: formData.password, // backend will hash it
            role: "employee",
            dateOfBirth: formData.dateOfBirth,
            profileImage: formData.profileImage || firebaseUser.photoURL || "",
            createdAt: new Date(),
        };

        try {
            await axios.post(`${API_URL}/users`, userData, { timeout: 10000 });
            clearPendingProfile();
            await logOut();
            toast.success("Employee registered successfully! Login Now!");
            navigate("/login");
        } catch (err) {
            console.error(err);
            const status = err.response?.status;
            const serverMsg = err.response?.data?.message;
            const dbDown =
                status === 503 ||
                err.response?.data?.code === "DB_UNAVAILABLE" ||
                status === 404;

            const cleaned = await cleanupFirebaseUser(firebaseUser);
            if (cleaned) clearPendingProfile();

            if (dbDown) {
                toast.error(
                    cleaned
                        ? "Backend database is unavailable. Temporary account was removed — please try signup again later."
                        : "Backend database is unavailable, so profile setup failed. Please try again later or login with this email."
                );
            } else {
                toast.error(
                    serverMsg ||
                        "Account was created in Firebase, but backend profile setup failed." +
                            (cleaned ? " Temporary account removed — try again." : "")
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4">
            <title>Join As Employee</title>
            <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <img
                        src={LogoImage}
                        alt="AssetVerse Logo"
                        className="w-16 h-16 mx-auto mb-3 rounded-xl object-contain"
                    />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 text-transparent bg-clip-text mb-2">
                        Create Account
                    </h2>
                    <p className="text-base-content/70">Join AssetVerse as Employee</p>
                </div>

                {/* Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Full Name"
                            className="w-full border-2 border-base-300 bg-base-200 p-3 rounded-lg focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your.email@example.com"
                            className="w-full border-2 border-base-300 bg-base-200 p-3 rounded-lg focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Create password"
                                className="w-full border-2 border-base-300 bg-base-200 p-3 rounded-lg focus:border-blue-500 transition pr-11"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                        <p className="text-xs text-base-content/60 mt-1">
                            Min 6 chars, 1 uppercase, 1 lowercase
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                            className="w-full border-2 border-base-300 bg-base-200 p-3 rounded-lg focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-base-content mb-2">
                            Profile Image URL
                        </label>
                        <input
                            type="url"
                            name="profileImage"
                            value={formData.profileImage}
                            onChange={handleChange}
                            className="w-full border-2 border-base-300 bg-base-200 p-3 rounded-lg focus:border-blue-500 transition"
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-orange-600 transition disabled:opacity-70"
                    >
                        {loading ? "Registering..." : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-sm text-base-content/70 mt-4">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default JoinEmployee;
