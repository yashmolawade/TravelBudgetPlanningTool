// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgnlI6__RLVSajECDR8DjDRRTRIe7-daY",
  authDomain: "traveltool-b7317.firebaseapp.com",
  databaseURL:
    "https://traveltool-b7317-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "traveltool-b7317",
  storageBucket: "traveltool-b7317.firebasestorage.app",
  messagingSenderId: "26266143019",
  appId: "1:26266143019:web:32164bf700c8b980d7dd6e",
  measurementId: "G-EE8597QCCB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

export { auth, db, realtimeDb, analytics };
export default app;
