
// This is a temporary script to upload articles to Firestore.
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const { articles } = require('./src/data/articles.js'); // Import directly

const firebaseConfig = {
    apiKey: "AIzaSyB3OY0A5XQpcOt5ByTICLyFktMxLGue7i0",
    authDomain: "inara-grwm.firebaseapp.com",
    projectId: "inara-grwm",
    storageBucket: "inara-grwm.firebasestorage.app",
    messagingSenderId: "90315279211",
    appId: "1:90315279211:web:625d41309c2fd6ce769a2e",
    measurementId: "G-RQ4W3KNR3D"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const articlesCollectionRef = collection(db, 'articles');

const uploadArticles = async () => {
  console.log('Starting article upload...');
  try {
    for (const article of articles) {
      // We are not setting a specific ID, Firestore will generate one automatically
      const { id, ...articleData } = article; 
      await addDoc(articlesCollectionRef, articleData);
      console.log(`Uploaded article: ${articleData.title}`);
    }
    console.log('------------------------------------------');
    console.log('All articles have been uploaded successfully!');
    console.log('------------------------------------------');

  } catch (error) {
    console.error("Error uploading articles:", error);
  } 
};

uploadArticles();

