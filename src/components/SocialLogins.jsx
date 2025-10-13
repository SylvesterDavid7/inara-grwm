import React from 'react';
import { FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import '../styles/social-logins.css';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const SocialLogins = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // New user, create a document with their name and photo
        await setDoc(userRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
          assessmentCompleted: false,
        });
        // Redirect to a page to complete their profile
        navigate("/user-info");
      } else {
        // Existing user, update their photoURL just in case it changed
        await setDoc(userRef, { photoURL: user.photoURL }, { merge: true });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google sign-in error:", error.message);
    }
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
