import React from 'react';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import '../styles/social-logins.css';

const SocialLogins = () => {
  return (
    <div className="social-logins-container">
      <div className="social-logins-divider">
        <div className="social-logins-divider-line" />
        <p className="social-logins-divider-text">Or continue with</p>
      </div>
      <div className="social-logins-buttons">
        <button className="social-login-button">
          <FaGoogle className="social-login-icon" />
        </button>
        <button className="social-login-button">
          <FaFacebook className="social-login-icon" />
        </button>
        <button className="social-login-button">
          <FaApple className="social-login-icon" />
        </button>
      </div>
    </div>
  );
};

export default SocialLogins;
