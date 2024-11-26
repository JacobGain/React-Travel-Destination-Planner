// import Firebase modules
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyDNat0aYoGEPsWaAqP7bz_XUbVC0rvLKZg",
    authDomain: "jgain-mk7.firebaseapp.com",
    projectId: "jgain-mk7",
    storageBucket: "jgain-mk7.firebasestorage.app",
    messagingSenderId: "590150446690",
    appId: "1:590150446690:web:32d032d7960036f5b92b3b"
  };

// initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize analytics
const analytics = getAnalytics(app);

// initialize Firebase Authentication
export const auth = getAuth(app);

// Custom Hook for Using Auth
export const useAuth = () => auth;

export default app;