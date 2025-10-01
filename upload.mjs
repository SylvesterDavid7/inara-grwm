
// This is a temporary script to upload articles to Firestore.
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { articles } from './src/data/articles.js';

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
const articlesCollectionRef = collection(db, 'articles');

const uploadArticles = async () => {
  console.log('Starting article upload...');
  try {
    for (const article of articles) {
      const { id, ...articleData } = article; // Firestore will generate its own ID, so we exclude the old one.
      await addDoc(articlesCollectionRef, articleData);
      console.log(`Uploaded article: ${articleData.title}`);
    }
    console.log('\n------------------------------------------');
    console.log('All articles have been uploaded successfully!');
    console.log('------------------------------------------\n');

  } catch (error) {
    console.error("Error uploading articles:", error);
  } finally {
    // Node.js process doesn't automatically exit in some Firebase SDK versions,
    // so we can exit manually. But we should wait for writes to complete.
    // For this simple script, we can just log and let it finish.
  }
};

uploadArticles();
