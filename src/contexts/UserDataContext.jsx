import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const UserDataContext = createContext();

export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          const newUser = {
            email: currentUser.email,
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            createdAt: serverTimestamp(),
            assessments: [],
            outputs: [],
            scorecards: [],
          };
          await setDoc(userRef, newUser);
          setUserData(newUser);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserData = async (newData) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userRef, newData, { merge: true });
        setUserData(prevData => ({ ...prevData, ...newData }));
        return { success: true };
      } catch (error) {
        console.error('Error updating user data:', error);
        return { success: false, error };
      }
    }
    return { success: false, error: 'No user is authenticated' };
  };

  const value = {
    user,
    userData,
    loading,
    updateUserData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {!loading && children}
    </UserDataContext.Provider>
  );
};
