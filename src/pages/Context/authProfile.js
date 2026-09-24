const PENDING_PROFILE_KEY = "av_pending_profile";

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const readPendingProfile = () => {
  try {
    const raw = localStorage.getItem(PENDING_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
};

const writePendingProfile = (data) => {
  try {
    localStorage.setItem(PENDING_PROFILE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota / private mode */
  }
};

const clearPendingProfile = () => {
  try {
    localStorage.removeItem(PENDING_PROFILE_KEY);
  } catch {
    /* ignore */
  }
};

export {
  PENDING_PROFILE_KEY,
  normalizeEmail,
  readPendingProfile,
  writePendingProfile,
  clearPendingProfile,
};
