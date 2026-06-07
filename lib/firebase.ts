import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPPxDM8Qq2C6phH9RnMLHCX_D9F-AjM44",
  authDomain: "tssr-trainer.firebaseapp.com",
  projectId: "tssr-trainer",
  storageBucket: "tssr-trainer.firebasestorage.app",
  messagingSenderId: "830296601755",
  appId: "1:830296601755:web:aa1ebbf6ed04ef7f13823e",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);