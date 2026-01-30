// Firebase Authentication service
import {
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth } from './firebase';
import { saveUserProfile } from './firestore';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Save/update user profile in Firestore
        await saveUserProfile(user.uid, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            lastLogin: new Date().toISOString()
        });

        return { success: true, user };
    } catch (error) {
        console.error('Error signing in with Google:', error);
        return { success: false, error: error.message };
    }
};

// Sign in with email/password
export const signInWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: result.user };
    } catch (error) {
        console.error('Error signing in:', error);
        return { success: false, error: error.message };
    }
};

// Sign up with email/password
export const signUpWithEmail = async (email, password, displayName) => {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;

        // Update profile with display name
        await updateProfile(user, { displayName });

        // Save user profile in Firestore
        await saveUserProfile(user.uid, {
            displayName,
            email: user.email,
            createdAt: new Date().toISOString()
        });

        return { success: true, user };
    } catch (error) {
        console.error('Error signing up:', error);
        return { success: false, error: error.message };
    }
};

// Sign out
export const signOut = async () => {
    try {
        await firebaseSignOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Error signing out:', error);
        return { success: false, error: error.message };
    }
};

// Get current user
export const getCurrentUser = () => {
    return auth.currentUser;
};

// Subscribe to auth state changes
export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
};
