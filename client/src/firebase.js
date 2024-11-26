// import Firebase modules
import { initializeApp } from "firebase/app";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    sendEmailVerification,
    signInWithEmailAndPassword
} from "firebase/auth";

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

// initialize Firebase Authentication
const auth = getAuth(app);

// custom Hook for Using Auth
const useAuth = () => auth;

export const createAccount = async (email, password, nickname) => {
    try {
        // create a new user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // update the user's display name (nickname)
        await updateProfile(userCredential.user, {
            displayName: nickname,
        });

        console.log("Account created for:", userCredential.user);

        // send email verification
        await sendEmailVerification(userCredential.user);
        console.log("Verification email sent to:", email);

        return {
            success: true,
            message: `Account created. Verification email sent to ${email}.`,
        };
    } catch (error) {
        console.error("Error creating account:", error.message);
        return {
            success: false,
            message: error.message,
        };
    }
};

export { auth, useAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword };