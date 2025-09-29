import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { adminEmails } from '../data/admins';

export const UserDataContext = createContext({
  user: null,
  userData: null,
  isAdmin: false,
  loading: true,
  updateUserData: async () => ({ success: false, error: 'Not initialized' }),
});

export const useUserDataContext = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (adminEmails.includes(currentUser.email)) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

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
        setUser(currentUser);
      } else {
        setUser(null);
        setUserData(null);
        setIsAdmin(false);
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
    isAdmin,
    loading,
    updateUserData,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};
