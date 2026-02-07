import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKWnBjBRv9wPDuXyFIgULBN3GJjnCcvmM",
  authDomain: "lab06web-2026.firebaseapp.com",
  projectId: "lab06web-2026",
  storageBucket: "lab06web-2026.firebasestorage.app",
  messagingSenderId: "77993863381",
  appId: "1:77993863381:web:74d4cdda7a6f959413da5c"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);