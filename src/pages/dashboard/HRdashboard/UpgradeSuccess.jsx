import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { getAuth } from "firebase/auth";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "";

const UpgradeSuccess = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useContext(AuthContext);
  const [applying, setApplying] = useState(false);
  const appliedRef = useRef(false);

  useEffect(() => {
    if (appliedRef.current) return;
    appliedRef.current = true;

    const applyUpgrade = async () => {
      const raw = localStorage.getItem("av_pending_upgrade");
      if (!raw) return;

      try {
        const pending = JSON.parse(raw);
        if (!pending?.packageName || !pending?.employeeLimit || !pending?.amount) {
          localStorage.removeItem("av_pending_upgrade");
          return;
        }

        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        setApplying(true);
        const token = await currentUser.getIdToken();
        await axios.patch(
          `${API_URL}/upgrade-package`,
          {
            packageName: pending.packageName,
            employeeLimit: pending.employeeLimit,
            amount: pending.amount,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        localStorage.removeItem("av_pending_upgrade");
        await refreshProfile?.();
        toast.success("Package upgraded successfully!");
      } catch (err) {
        console.error("Upgrade apply failed:", err);
        toast.error(err?.response?.data?.message || "Could not apply package upgrade");
      } finally {
        setApplying(false);
      }
    };

    applyUpgrade();
  }, [refreshProfile]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-100 px-4">
      {/* Success Icon */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 p-6 rounded-full mb-6 shadow-xl animate-pulse">
        <svg
          className="w-16 h-16 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Success Text */}
      <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-4">
        Payment Successful!
      </h1>
      <p className="text-center text-base-content/70 mb-8 max-w-md">
        {applying
          ? "Applying your package upgrade..."
          : "Your package has been upgraded successfully. You can now enjoy all the premium features."}
      </p>

      {/* Go Back Button */}
      <button
        onClick={() => navigate("/dashboard/upgrade")}
        className="px-8 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400
          transition-all duration-300 hover:scale-105 hover:opacity-90 shadow-lg"
      >
        Go Back
      </button>
    </div>
  );
};

export default UpgradeSuccess;
