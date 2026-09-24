import { Link } from "react-router";
import { Home } from "lucide-react";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="text-center space-y-6 p-8">

        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">
          404
        </h1>

        <h2 className="text-4xl font-bold text-base-content">
          Oops! Page Not Found
        </h2>

        <p className="text-lg text-base-content/70 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track!
        </p>

        <Link
          to="/"
          className="btn btn-lg bg-gradient-to-r from-blue-500 to-orange-500 text-white border-0 hover:from-blue-600 hover:to-orange-600"
        >
          <Home className="text-xl" />
          Back to Home
        </Link>
      </div>

      <div className="mt-8">
        <svg
          className="w-64 h-64 opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" className="text-blue-600" />
          <line x1="12" y1="8" x2="12" y2="12" className="text-orange-600" />
          <line x1="12" y1="16" x2="12.01" y2="16" className="text-orange-600" />
        </svg>
      </div>
    </div>
  );
};

export default ErrorPage;
