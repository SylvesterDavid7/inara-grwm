import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import SocialLogins from "../components/SocialLogins";
import "../styles/form.css";
import "../styles/glass-card.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/profile");
    } catch (error) {
      setLoading(false);
      switch (error.code) {
        case "auth/invalid-credential":
          setError("Incorrect password or email. Please try again.");
          break;
        case "auth/user-not-found":
          setError("No account found with this email address.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password. Please try again.");
          break;
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled.");
          break;
        case "auth/too-many-requests":
          setError("Too many login attempts. Please reset your password or try again later.");
          break;
        default:
          setError("An unexpected error occurred. Please try again.");
          break;
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center p-4 lg:p-6">
      <div className="flex w-full max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden h-[90vh]">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2 bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-center font-heading">
          <div className="w-full max-w-sm mx-auto space-y-5">
            {/* Logo */}
            <div className="flex justify-between items-center">
              <img className="h-6 w-auto" src="/Inara_Logo.svg" alt="Inara-GRWM" />
            </div>

            {/* Headings */}
            <div>
              <h2 className="text-2xl font-heading text-gray-900">Hello!</h2>
              <p className="text-sm text-gray-500 mt-1">
                To sign in to your account, please enter your email address and password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-green-500"
                  placeholder="Your email address"
                />
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-gray-100 rounded-lg border-0 focus:ring-2 focus:ring-green-500"
                  placeholder="Your password"
                />
              </div>

              <div className="text-xs text-left">
                <Link to="/forgot-password" className="font-medium text-green-600 hover:text-green-500">
                  Forgot password?
                </Link>
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-3">
                  <p className="text-xs font-medium text-red-800">{error}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none disabled:opacity-50"
                >
                  {loading ? 'Signing In...' : 'Next step'}
                </button>
              </div>
            </form>

            {/* Sign up & Socials */}
            <div className="mt-3 space-y-3">
              <p className="text-xs text-gray-600">
                Don’t have an account?{" "}
                <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
                  Sign up
                </Link>
              </p>
              <SocialLogins />
            </div>

            {/* Footer */}
            <div className="mt-4 text-center space-y-1">
              <p className="text-xs text-gray-500">
                Need help?{" "}
                <a href="mailto:support@inaragroups.com" className="font-medium text-green-600">
                  support@inaragroups.com
                </a>
              </p>
              <p className="text-[11px] text-gray-400">
                All rights reserved Inara Groups 2025
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center">
          <img
            src="/lab.webp"
            alt="Inara Lab"
            className="absolute h-full w-full object-cover"
          />
          <div className="glass-card2 h-[70vh] p-6 m-6 max-w-md text-white z-10 font-heading">
            <h3 className="text-2xl font-heading mb-3">
            Advanced Skincare, Powered by Science and Precision
            </h3>
            <p className="text-sm">
            Personalized skincare routines driven by real-time diagnostics, tailored formulations, and evidence-based results.           
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
