import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDpKjg8ETuguvGcImwLNPbiPOfHQ4iZFuE",
    authDomain: "furnilandkz.firebaseapp.com",
    projectId: "furnilandkz",
    storageBucket: "furnilandkz.firebasestorage.app",
    messagingSenderId: "237733982858",
    appId: "1:237733982858:web:481130acf967ffba0a3373",
    measurementId: "G-SHFTRJR21J"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
