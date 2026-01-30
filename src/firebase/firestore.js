// Firestore service functions
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    addDoc
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== TEAM BUILDS ====================

// Save a team build
export const saveTeamBuild = async (userId, teamBuild) => {
    try {
        const buildsRef = collection(db, 'teamBuilds');
        const docRef = await addDoc(buildsRef, {
            ...teamBuild,
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error saving team build:', error);
        return { success: false, error: error.message };
    }
};

// Get user's team builds
export const getUserTeamBuilds = async (userId) => {
    try {
        const buildsRef = collection(db, 'teamBuilds');
        const q = query(
            buildsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(50)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting team builds:', error);
        return [];
    }
};

// Get a single team build
export const getTeamBuild = async (buildId) => {
    try {
        const docRef = doc(db, 'teamBuilds', buildId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error('Error getting team build:', error);
        return null;
    }
};

// Delete a team build
export const deleteTeamBuild = async (buildId) => {
    try {
        await deleteDoc(doc(db, 'teamBuilds', buildId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting team build:', error);
        return { success: false, error: error.message };
    }
};

// ==================== USER PROFILE ====================

// Get or create user profile
export const getUserProfile = async (userId) => {
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
};

// Create or update user profile
export const saveUserProfile = async (userId, profileData) => {
    try {
        const docRef = doc(db, 'users', userId);
        await setDoc(docRef, {
            ...profileData,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error('Error saving user profile:', error);
        return { success: false, error: error.message };
    }
};

// ==================== FAVORITE HEROES ====================

// Add favorite hero
export const addFavoriteHero = async (userId, heroId) => {
    try {
        const docRef = doc(db, 'users', userId, 'favorites', String(heroId));
        await setDoc(docRef, {
            heroId,
            addedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding favorite:', error);
        return { success: false, error: error.message };
    }
};

// Remove favorite hero
export const removeFavoriteHero = async (userId, heroId) => {
    try {
        await deleteDoc(doc(db, 'users', userId, 'favorites', String(heroId)));
        return { success: true };
    } catch (error) {
        console.error('Error removing favorite:', error);
        return { success: false, error: error.message };
    }
};

// Get user's favorite heroes
export const getFavoriteHeroes = async (userId) => {
    try {
        const favoritesRef = collection(db, 'users', userId, 'favorites');
        const snapshot = await getDocs(favoritesRef);
        return snapshot.docs.map(doc => doc.data().heroId);
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
};

// ==================== SHARED BUILDS (PUBLIC) ====================

// Get public/shared team builds
export const getPublicBuilds = async (limitCount = 20) => {
    try {
        const buildsRef = collection(db, 'teamBuilds');
        const q = query(
            buildsRef,
            where('isPublic', '==', true),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting public builds:', error);
        return [];
    }
};

// Toggle build public/private
export const toggleBuildVisibility = async (buildId, isPublic) => {
    try {
        const docRef = doc(db, 'teamBuilds', buildId);
        await updateDoc(docRef, { isPublic, updatedAt: serverTimestamp() });
        return { success: true };
    } catch (error) {
        console.error('Error toggling visibility:', error);
        return { success: false, error: error.message };
    }
};
