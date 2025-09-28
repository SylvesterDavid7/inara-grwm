import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { useUserData } from '../contexts/UserDataContext';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthDetails = () => {
  const { user, loading } = useUserData();

  const userSignOut = () => {
    signOut(auth)
      .then(() => console.log('Sign out successful'))
      .catch(error => console.log('Error signing out: ', error));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      {user ? (
        <>
          <p className="text-lg font-semibold">{`Signed in as ${user.email}`}</p>
          <button onClick={userSignOut} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Sign Out
          </button>
        </>
      ) : (
        <p>Not signed in</p>
      )}
    </div>
  );
};

export default AuthDetails;
