import { useState, useContext } from "react";
import { Link, useLocation } from "react-router";
import { AuthContext } from "../Context/AuthContext";
import { AlertCircle, Lock, ArrowLeft, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const location = useLocation();
  const { resetPassword, loading } = useContext(AuthContext);

  const [email, setEmail] = useState(location.state?.email || "");
  const [sending, setSending] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const resetEmail = email || e.target.email.value;

    if (!resetEmail) {
      toast.error("Enter your email");
      return;
    }

    setSending(true);
    try {
      await resetPassword(resetEmail);
      toast.success("Password reset email sent");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        toast.error("No account found");
      } else if (err.code === "auth/invalid-email") {
        toast.error("Please enter a valid email address");
      } else {
        toast.error(err.message || "Failed to send reset email");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-200 py-12 px-4">
      <title>Forgot Password</title>
      <div className="max-w-md w-full bg-base-100 rounded-2xl shadow-xl p-8">

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex justify-center items-center mx-auto mb-6">
            <span className="text-5xl text-white">
              <Lock />
            </span>
          </div>

          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500 mb-2">
            Forgot Password?
          </h2>

          <p className="text-base-content/70">
            Enter your email and we&apos;ll send a reset link
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">

          <div>
            <label className="text-sm font-semibold text-base-content mb-2 block">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="w-full border-2 border-base-300 bg-base-200 p-3 rounded-lg focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={sending || loading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-orange-600 transition disabled:opacity-70"
          >
            {sending ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>

        <div className="mt-8 bg-base-200 border border-base-300 p-4 rounded-lg">
          <p className="text-base-content/80 flex items-start gap-2">
            <span className="text-xl text-blue-600">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
            </span>
            Check your inbox for the reset link.
          </p>
        </div>

        <div className="text-center mt-4">
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-orange-600 hover:underline inline-flex items-center gap-1"
          >
            Open Gmail <ExternalLink size={14} />
          </a>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;
