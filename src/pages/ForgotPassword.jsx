import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import "../styles/form.css";
import "../styles/glass-card.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const auth = getAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setError(error.message);
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
              <h2 className="text-2xl font-heading text-gray-900">Forgot Password</h2>
              <p className="text-sm text-gray-500 mt-1">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleResetPassword} className="space-y-4">
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

              {error && (
                <div className="rounded-md bg-red-50 p-3">
                  <p className="text-xs font-medium text-red-800">{error}</p>
                </div>
              )}
                {message && (
                <div className="rounded-md bg-green-50 p-3">
                  <p className="text-xs font-medium text-green-800">{message}</p>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none"
                >
                  Send Reset Link
                </button>
              </div>
            </form>

            {/* Back to login */}
            <div className="mt-3 space-y-3">
              <p className="text-xs text-gray-600">
                Remembered your password?{" "}
                <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
                  Sign in
                </Link>
              </p>
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
            src="/loginback2.webp"
            alt="Inara"
            className="absolute h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;