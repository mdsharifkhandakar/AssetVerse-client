import { useNavigate } from "react-router";
import { useEffect } from "react";

const UpgradeCancel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("av_pending_upgrade");
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-100 px-4">
      {/* Cancel Icon */}
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
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>

      {/* Cancel Text */}
      <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent mb-4">
        Payment Cancelled
      </h1>
      <p className="text-center text-base-content/70 mb-8 max-w-md">
        Your payment was not completed. You can try again or contact support if you faced any issues.
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

export default UpgradeCancel;
