import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const AuthDetails = ({ layout = 'horizontal' }) => {
  const [authUser, setAuthUser] = useState(null);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      listen();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

  const containerClasses = layout === 'vertical'
    ? 'flex flex-col space-y-2'
    : 'flex items-center space-x-2';

  const buttonClasses = layout === 'vertical'
    ? 'w-full text-center'
    : '';

  return (
    <div>
      {authUser ? (
        <div className={containerClasses}>
          <Link
            to="/profile"
            className={`px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 ${buttonClasses}`}
          >
            Profile
          </Link>
          <button
            onClick={userSignOut}
            className={`px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 ${buttonClasses}`}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className={containerClasses}>
          <Link
            to="/login"
            className={`px-3 py-2 text-sm font-medium text-slate-800 border border-slate-300 rounded-md hover:bg-slate-50 hover:border-slate-400 hover:text-slate-950 transform hover:scale-105 transition-all duration-300 ${buttonClasses}`}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className={`px-3 py-2 text-sm font-medium text-slate-800 border border-slate-300 rounded-md hover:bg-slate-50 hover:border-slate-400 hover:text-slate-950 transform hover:scale-105 transition-all duration-300 ${buttonClasses}`}
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthDetails;
