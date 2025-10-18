import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
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
    // onAuthStateChanged returns an unsubscribe function for cleanup
    const authUnsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const userRef = doc(db, 'users', authUser.uid);
        
        // Set up a real-time listener for user data
        const dataUnsubscribe = onSnapshot(userRef, async (docSnap) => {
          const defaultData = {
            checkInStreak: 0,
            totalCheckIns: 0,
            lastCheckIn: null,
            points: 0,
          };

          if (docSnap.exists()) {
            // Merge fetched data with defaults to ensure all fields are present
            const fetchedData = docSnap.data();
            const completeUserData = { ...defaultData, ...fetchedData };
            setUserData(completeUserData);
            setIsAdmin(adminEmails.includes(completeUserData.email));
          } else {
            // If the user document doesn't exist, create it
            const newUser = {
              ...defaultData,
              email: authUser.email,
              uid: authUser.uid,
              displayName: authUser.displayName,
              photoURL: authUser.photoURL,
              createdAt: serverTimestamp(),
            };
            await setDoc(userRef, newUser);
            // The snapshot listener will automatically update the state with the new user data
          }
          // Set the user and indicate that loading is complete
          setUser(authUser);
          setLoading(false);
        }, (error) => {
          console.error("Error with snapshot listener:", error);
          setLoading(false);
        });

        // Return the data listener's unsubscribe function for cleanup
        return () => dataUnsubscribe();
      } else {
        // No authenticated user, so clear all user state and stop loading
        setUser(null);
        setUserData(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    // Return the auth listener's unsubscribe function for cleanup
    return () => authUnsubscribe();
  }, []);

  const updateUserData = async (newData) => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      try {
        // Use updateDoc for partial updates. The onSnapshot listener will handle UI changes.
        await updateDoc(userRef, newData);
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
