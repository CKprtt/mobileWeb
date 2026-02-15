// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKWnBjBRv9wPDuXyFIgULBN3GJjnCcvmM",
  authDomain: "lab06web-2026.firebaseapp.com",
  projectId: "lab06web-2026",
  storageBucket: "lab06web-2026.firebasestorage.app",
  messagingSenderId: "77993863381",
  appId: "1:77993863381:web:74d4cdda7a6f959413da5c",
  measurementId: "G-6S7QW0L77S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);