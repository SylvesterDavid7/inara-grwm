import { useEffect, useState, useCallback } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

const useUserData = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const auth = getAuth();
  const db = getFirestore();

  const fetchUserData = useCallback(async (user) => {
    if (user) {
      setLoading(true);
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        // Create a new document for the user if it doesn't exist
        const initialData = {
          email: user.email,
          createdAt: new Date(),
          assessmentCompleted: false, // Explicitly set to false
          routine: null,             // Initialize as null
          assessments: [],
          outputs: [],
          scorecards: [],
        };
        await setDoc(userDocRef, initialData);
        setUserData(initialData);
      }
      setUser(user);
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, fetchUserData]);

  const updateUserData = async (newData) => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        // Merge new data with existing data in Firestore
        await setDoc(userDocRef, newData, { merge: true });
        // Update local state by merging new data with previous state
        setUserData(prevData => ({ ...prevData, ...newData }));
      } catch (error) {
        console.error("Error updating user data:", error);
        // Optionally, handle the error (e.g., show a notification)
      }
    }
  };

  return { user, userData, loading, updateUserData, fetchUserData }; // Export loading and fetchUserData
};

export default useUserData;
