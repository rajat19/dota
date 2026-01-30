// Type definitions for Dota Counter Picker

export interface Ability {
    name: string;
    type: 'active' | 'passive' | 'toggle' | 'ultimate';
    description: string;
}

export interface Hero {
    id: number;
    name: string;
    internalName: string;
    primaryAttr: 'str' | 'agi' | 'int';
    attackType: 'Melee' | 'Ranged';
    roles: string[];
    image: string;
    baseStr: number;
    baseAgi: number;
    baseInt: number;
    strGain: number;
    agiGain: number;
    intGain: number;
    baseMoveSpeed: number;
    baseHealth: number;
    baseMana: number;
    baseArmor: number;
    abilities: Ability[];
    counters?: number[];
    counteredBy?: number[];
}

export interface Item {
    id: number;
    name: string;
    cost: number;
    image: string;
    category: string;
    description: string;
    components?: string[];
    stats?: Record<string, string | number>;
}

export interface TeamBuild {
    id?: string;
    name: string;
    description?: string;
    radiantTeam: (Hero | null)[];
    direTeam: (Hero | null)[];
    userId?: string;
    isPublic?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface UserProfile {
    displayName: string;
    email: string;
    photoURL?: string;
    createdAt?: string;
    lastLogin?: string;
    updatedAt?: Date;
}

export interface CounterData {
    heroId: number;
    strongAgainst: number[];
    weakAgainst: number[];
    goodWith: number[];
}

export interface HeroCounters {
    [heroId: string]: CounterData;
}

// Firebase/Auth types
export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export interface AuthResult {
    success: boolean;
    user?: AuthUser;
    error?: string;
}

export interface FirestoreResult {
    success: boolean;
    id?: string;
    error?: string;
}
