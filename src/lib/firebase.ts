import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCAPbJYexCtTnZqNO8ozzFAYubri8sNCks",
  authDomain: "btc-hackathon.firebaseapp.com",
  projectId: "btc-hackathon",
  storageBucket: "btc-hackathon.firebasestorage.app",
  messagingSenderId: "594013333645",
  appId: "1:594013333645:web:ccafb38356ec10d2039ac4",
  measurementId: "G-Q47TP4BSXE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };