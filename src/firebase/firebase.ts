// Firebase initialization
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import firebaseConfig from './config';

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Initialize Auth
export const auth: Auth = getAuth(app);

export default app;
