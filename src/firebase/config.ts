// Firebase configuration
// Replace these placeholder values with your actual Firebase config
// Get them from Firebase Console > Project Settings > Your apps > Web app

import { FirebaseOptions } from 'firebase/app';

const firebaseConfig: FirebaseOptions = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

export default firebaseConfig;
