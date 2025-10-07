import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import getAuth
import { getStorage } from "firebase/storage";
// import { initializeAppCheck, ReCaptchaV3Provider, onTokenChanged } from "firebase/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3OY0A5XQpcOt5ByTICLyFktMxLGue7i0",
  authDomain: "inara-grwm.firebaseapp.com",
  projectId: "inara-grwm",
  storageBucket: "inara-grwm.firebasestorage.app",
  messagingSenderId: "90315279211",
  appId: "1:90315279211:web:625d41309c2fd6ce769a2e",
  measurementId: "G-RQ4W3KNR3D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Auth
const storage = getStorage(app);

export { db, auth, storage };
