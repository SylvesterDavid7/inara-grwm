import React from 'react';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import '../styles/social-logins.css';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SocialLogins = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Google sign-in error:", error.message);
      });
  };

  const handleFacebookSignIn = () => {
    console.log("Facebook login is not implemented yet.");
  };

  const handleAppleSignIn = () => {
    console.log("Apple login is not implemented yet.");
  };

  return (
    <div className="social-logins-container">
      <div className="social-logins-divider">
        <div className="social-logins-divider-line" />
        <p className="social-logins-divider-text">Or continue with</p>
      </div>
      <div className="social-logins-buttons">
        <button onClick={handleGoogleSignIn} className="social-login-button">
          <FaGoogle className="social-login-icon" />
        </button>
        <button onClick={handleFacebookSignIn} className="social-login-button">
          <FaFacebook className="social-login-icon" />
        </button>
        <button onClick={handleAppleSignIn} className="social-login-button">
          <FaApple className="social-login-icon" />
        </button>
      </div>
    </div>
  );
};

export default SocialLogins;
