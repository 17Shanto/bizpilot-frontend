import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD6-rtyt_mD3K4UKFEy2O29Sw94k3Ei4BM",
  authDomain: "bizpilot-authentication.firebaseapp.com",
  projectId: "bizpilot-authentication",
  storageBucket: "bizpilot-authentication.firebasestorage.app",
  messagingSenderId: "996745920823",
  appId: "1:996745920823:web:5046d25ec198fa567b9ab2",
  measurementId: "G-P8W0RFS1Y4",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
