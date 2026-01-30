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
import type { TeamBuild, UserProfile, FirestoreResult } from '../types';

// ==================== TEAM BUILDS ====================

interface TeamBuildData {
    name: string;
    description?: string;
    radiantTeam: (number | null)[];
    direTeam: (number | null)[];
    isPublic?: boolean;
}

// Save a team build
export const saveTeamBuild = async (userId: string, teamBuild: TeamBuildData): Promise<FirestoreResult> => {
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
        return { success: false, error: (error as Error).message };
    }
};

// Get user's team builds
export const getUserTeamBuilds = async (userId: string): Promise<TeamBuild[]> => {
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
        })) as TeamBuild[];
    } catch (error) {
        console.error('Error getting team builds:', error);
        return [];
    }
};

// Get a single team build
export const getTeamBuild = async (buildId: string): Promise<TeamBuild | null> => {
    try {
        const docRef = doc(db, 'teamBuilds', buildId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as TeamBuild;
        }
        return null;
    } catch (error) {
        console.error('Error getting team build:', error);
        return null;
    }
};

// Delete a team build
export const deleteTeamBuild = async (buildId: string): Promise<FirestoreResult> => {
    try {
        await deleteDoc(doc(db, 'teamBuilds', buildId));
        return { success: true };
    } catch (error) {
        console.error('Error deleting team build:', error);
        return { success: false, error: (error as Error).message };
    }
};

// ==================== USER PROFILE ====================

// Get or create user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
};

// Create or update user profile
export const saveUserProfile = async (userId: string, profileData: Partial<UserProfile>): Promise<FirestoreResult> => {
    try {
        const docRef = doc(db, 'users', userId);
        await setDoc(docRef, {
            ...profileData,
            updatedAt: serverTimestamp()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error('Error saving user profile:', error);
        return { success: false, error: (error as Error).message };
    }
};

// ==================== FAVORITE HEROES ====================

// Add favorite hero
export const addFavoriteHero = async (userId: string, heroId: number): Promise<FirestoreResult> => {
    try {
        const docRef = doc(db, 'users', userId, 'favorites', String(heroId));
        await setDoc(docRef, {
            heroId,
            addedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        console.error('Error adding favorite:', error);
        return { success: false, error: (error as Error).message };
    }
};

// Remove favorite hero
export const removeFavoriteHero = async (userId: string, heroId: number): Promise<FirestoreResult> => {
    try {
        await deleteDoc(doc(db, 'users', userId, 'favorites', String(heroId)));
        return { success: true };
    } catch (error) {
        console.error('Error removing favorite:', error);
        return { success: false, error: (error as Error).message };
    }
};

// Get user's favorite heroes
export const getFavoriteHeroes = async (userId: string): Promise<number[]> => {
    try {
        const favoritesRef = collection(db, 'users', userId, 'favorites');
        const snapshot = await getDocs(favoritesRef);
        return snapshot.docs.map(doc => doc.data().heroId as number);
    } catch (error) {
        console.error('Error getting favorites:', error);
        return [];
    }
};

// ==================== SHARED BUILDS (PUBLIC) ====================

// Get public/shared team builds
export const getPublicBuilds = async (limitCount = 20): Promise<TeamBuild[]> => {
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
        })) as TeamBuild[];
    } catch (error) {
        console.error('Error getting public builds:', error);
        return [];
    }
};

// Toggle build public/private
export const toggleBuildVisibility = async (buildId: string, isPublic: boolean): Promise<FirestoreResult> => {
    try {
        const docRef = doc(db, 'teamBuilds', buildId);
        await updateDoc(docRef, { isPublic, updatedAt: serverTimestamp() });
        return { success: true };
    } catch (error) {
        console.error('Error toggling visibility:', error);
        return { success: false, error: (error as Error).message };
    }
};
