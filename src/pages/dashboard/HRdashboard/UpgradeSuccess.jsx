import { useNavigate } from "react-router";

const UpgradeSuccess = () => {
  const navigate = useNavigate();

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
        Your package has been upgraded successfully. You can now enjoy all the premium features.
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
