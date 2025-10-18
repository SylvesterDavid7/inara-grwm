import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { FaGoogle, FaFacebook, FaApple, FaSpinner } from 'react-icons/fa';
import '../styles/social-logins.css';

const SocialLogins = () => {
    const [loading, setLoading] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleGoogleSignIn = async () => {
        setLoading('google');
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userRef);

            if (!docSnap.exists()) {
                await setDoc(userRef, {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: serverTimestamp(),
                    assessmentCompleted: false,
                });
                navigate("/user-info");
            } else {
                await setDoc(userRef, { photoURL: user.photoURL }, { merge: true });
                navigate("/profile");
            }
        } catch (error) {
            console.error("Google sign-in error:", error.message);
            setLoading(null);
        }
    };

    const handleFacebookSignIn = () => {
        setLoading('facebook');
        console.log("Facebook login is not implemented yet.");
        setTimeout(() => setLoading(null), 1000); // Simulate API call
    };

    const handleAppleSignIn = () => {
        setLoading('apple');
        console.log("Apple login is not implemented yet.");
        setTimeout(() => setLoading(null), 1000); // Simulate API call
    };

    return (
        <div className="social-logins-container">
            <div className="social-logins-divider">
                <div className="social-logins-divider-line" />
                <p className="social-logins-divider-text">Or continue with</p>
            </div>
            <div className="social-logins-buttons">
                <button 
                    onClick={handleGoogleSignIn} 
                    className="social-login-button"
                    disabled={loading}
                >
                    {loading === 'google' ? <FaSpinner className="animate-spin social-login-icon" /> : <FaGoogle className="social-login-icon" />}
                </button>
                <button 
                    onClick={handleFacebookSignIn} 
                    className="social-login-button"
                    disabled={loading}
                >
                    {loading === 'facebook' ? <FaSpinner className="animate-spin social-login-icon" /> : <FaFacebook className="social-login-icon" />}
                </button>
                <button 
                    onClick={handleAppleSignIn} 
                    className="social-login-button"
                    disabled={loading}
                >
                    {loading === 'apple' ? <FaSpinner className="animate-spin social-login-icon" /> : <FaApple className="social-login-icon" />}
                </button>
            </div>
        </div>
    );
};

export default SocialLogins;
