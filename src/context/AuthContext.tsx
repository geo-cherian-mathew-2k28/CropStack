'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/lib/types';
import {
    auth,
    db,
    doc,
    getDoc,
    onAuthStateChanged,
    firebaseSignOut,
    type FirebaseUser
} from '@/lib/firebase';

type AuthContextType = {
    user: FirebaseUser | null;
    profile: Profile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    loading: true,
    signOut: async () => { },
    refreshProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    const fetchProfile = async (userId: string, retryCount = 0) => {
        try {
            const profileRef = doc(db, 'profiles', userId);
            const profileSnap = await getDoc(profileRef);

            if (profileSnap.exists()) {
                const data = profileSnap.data();
                if (isMounted.current) {
                    setProfile({
                        id: profileSnap.id,
                        email: data.email || '',
                        full_name: data.full_name || null,
                        role: data.role || 'buyer',
                        avatar_url: data.avatar_url || null,
                        created_at: data.created_at || new Date().toISOString(),
                    } as Profile);
                }
            } else {
                // Profile might not exist yet after sign-up — retry
                if (retryCount < 3) {
                    console.log(`Profile sync: Retrying in 1s... (Attempt ${retryCount + 1}/3)`);
                    setTimeout(() => {
                        if (isMounted.current) fetchProfile(userId, retryCount + 1);
                    }, 1000);
                } else {
                    console.error("Profile not found after retries for user:", userId);
                    if (isMounted.current) setProfile(null);
                }
            }
        } catch (err) {
            console.error("Auth state error:", err);
            if (isMounted.current) setProfile(null);
        }
    };

    const refreshProfile = async () => {
        if (user) await fetchProfile(user.uid);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!isMounted.current) return;

            setUser(firebaseUser);

            if (firebaseUser) {
                await fetchProfile(firebaseUser.uid);
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const signOut = async () => {
        try {
            // Clear local state immediately so the UI reacts right away
            setUser(null);
            setProfile(null);
            // Sign out from Firebase
            await firebaseSignOut(auth);
            // Navigate — use replace so back button won't return to dashboard
            router.replace('/login');
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('signal is aborted')) return;
            console.error('Sign out error:', err);
            // Even on error, redirect to login
            router.replace('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
