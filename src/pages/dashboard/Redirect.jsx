import { useContext, useState } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "../../Context/AuthContext";
import RobotLoader from "../../components/RobotLoader/RobotLoader";
import "../../components/RobotLoader/RobotLoader.css";
import toast from "react-hot-toast";

const Redirect = () => {
    const {
        user,
        role,
        loading,
        profileLoading,
        profileStatus,
        refreshProfile,
        completeProfile,
    } = useContext(AuthContext);

    const [completing, setCompleting] = useState(false);

    const stillLoading =
        loading ||
        profileLoading ||
        profileStatus === "loading" ||
        profileStatus === "idle";

    if (stillLoading) {
        return <RobotLoader text="Loading your dashboard..." />;
    }

    if (!user?.email) {
        return <Navigate to="/login" replace />;
    }

    if (role === "hr") {
        return <Navigate to="/dashboard/asset" replace />;
    }

    if (role === "employee") {
        return <Navigate to="/dashboard/my-assets" replace />;
    }

    // Firebase session is valid but MongoDB has no profile for this user.
    // Complete registration (sync) instead of a dead-end error.
    if (profileStatus === "missing") {
        const handleComplete = async (selectedRole) => {
            setCompleting(true);
            try {
                await completeProfile(selectedRole);
                toast.success(
                    selectedRole === "hr"
                        ? "HR profile ready — opening dashboard..."
                        : "Employee profile ready — opening dashboard..."
                );
            } catch (err) {
                console.error(err);
                toast.error("Could not complete profile. Please try again.");
            } finally {
                setCompleting(false);
            }
        };

        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center bg-base-200 py-10 rounded-2xl">
                <h2 className="text-2xl font-bold text-base-content mb-2">
                    Complete your profile
                </h2>
                <p className="text-base-content/70 mb-6 max-w-md">
                    You&apos;re signed in as <span className="font-medium">{user.email}</span>,
                    but your AssetVerse profile is not set up yet. Choose how you
                    use AssetVerse to open the right dashboard.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        disabled={completing}
                        onClick={() => handleComplete("employee")}
                        className="px-5 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 transition disabled:opacity-70"
                    >
                        {completing ? "Saving..." : "Continue as Employee"}
                    </button>
                    <button
                        disabled={completing}
                        onClick={() => handleComplete("hr")}
                        className="px-5 py-2 rounded-lg font-semibold border-2 border-base-300 text-base-content hover:bg-base-100 disabled:opacity-70"
                    >
                        {completing ? "Saving..." : "Continue as HR Manager"}
                    </button>
                </div>
            </div>
        );
    }

    // Transient fetch failure after retries — previous good profile (if any) is kept
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
            <h2 className="text-2xl font-bold text-base-content mb-2">
                Dashboard unavailable
            </h2>
            <p className="text-base-content/70 mb-6 max-w-md">
                Your profile could not be loaded, so we cannot determine which
                dashboard to show. Check your connection and try again.
            </p>
            <div className="flex gap-3">
                <button
                    onClick={() => refreshProfile()}
                    className="px-5 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:scale-105 transition-transform"
                >
                    Retry
                </button>
                <button
                    onClick={() => window.location.reload()}
                    className="px-5 py-2 rounded-lg font-semibold border border-base-300 text-base-content hover:bg-base-200"
                >
                    Reload
                </button>
            </div>
        </div>
    );
};

export default Redirect;
