import { Link, useLocation, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../Context/AuthContext";
import LogoImage from "../assets/assetverse_logo.png";
import toast from "react-hot-toast";

const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18A10.96 10.96 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
);

const Login = () => {
    const { loginUser, loginWithGoogle, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || location.state?.from || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }
        setBtnLoading(true);
        try {
            await loginUser(email, password);
            toast.success("Login successful!");
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
                toast.error("Invalid email or password");
            } else if (err.code === "auth/user-not-found") {
                toast.error("No account found with this email.");
            } else if (err.code === "auth/too-many-requests") {
                toast.error("Too many attempts. Please try again later.");
            } else {
                toast.error(err.message || "Login failed. Please try again.");
            }
        } finally {
            setBtnLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        try {
            await loginWithGoogle();
            toast.success("Google login successful!");
            // New Google users land on /dashboard → role select if profile missing
            navigate("/dashboard", { replace: true });
        } catch (err) {
            console.error(err);
            if (err.code !== "auth/popup-closed-by-user") {
                toast.error(err.message || "Google login failed.");
            }
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-base-200 py-12 px-4">
            <title>Login</title>
            <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl p-8">

                <div className="mb-6 text-center">
                    <img
                        src={LogoImage}
                        alt="AssetVerse Logo"
                        className="w-16 h-16 mx-auto mb-3 rounded-xl object-contain"
                    />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 text-transparent bg-clip-text mb-2">
                        Sign In
                    </h2>
                    <p className="text-base-content/70">Welcome back to AssetVerse</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">

                    <div>
                        <label className="text-sm font-semibold text-base-content mb-2 block">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="your.email@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-lg border-2 border-base-300 bg-base-200 focus:border-blue-500 transition"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-base-content mb-2 block">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-base-300 bg-base-200 focus:border-blue-500 transition pr-11"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-base-content/70"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="text-right">
                        <Link
                            to="/forgot-password"
                            state={{ email }}
                            className="text-sm font-semibold text-orange-500 hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={btnLoading || loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-orange-500 text-white font-semibold py-3 rounded-lg hover:from-blue-600 hover:to-orange-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {btnLoading || loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="divider text-base-content/60">OR</div>

                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={googleLoading || loading}
                    className="flex w-full items-center justify-center gap-3 py-3 rounded-lg border-2 border-base-300 text-base-content hover:bg-base-200 transition disabled:opacity-70"
                >
                    <GoogleIcon />
                    {googleLoading ? "Signing in..." : "Sign in with Google"}
                </button>

                <p className="text-center text-sm text-base-content/70 mt-4">
                    Don&apos;t have an account?{" "}
                    <Link to="/join-employee" className="text-blue-600 font-semibold hover:underline">
                        Join as Employee
                    </Link>{" "}
                    or{" "}
                    <Link to="/join-hr" className="text-blue-600 font-semibold hover:underline">
                        Join as HR
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
