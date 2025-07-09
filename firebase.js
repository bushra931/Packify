// Import Firebase modules (via CDN or module system)
console.log("✅ Firebase initialized");

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyDmxp4tLArzL9ujn-nyK3zYaQ3TW_j5lTQ",
  authDomain: "packify-5b749.firebaseapp.com",
  projectId: "packify-5b749",
  storageBucket: "packify-5b749.appspot.com",
  messagingSenderId: "516370034234",
  appId: "1:516370034234:web:9a2cbb6e05876e97cdcf03"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore instance
export { db };
