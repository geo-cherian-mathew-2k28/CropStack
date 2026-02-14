'use client';

import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, Profile } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
    user: User | null;
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
    const [user, setUser] = useState<User | null>(null);
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
            const { data, error, status } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (!error && data) {
                if (isMounted.current) setProfile(data);
            } else {
                // Potential race condition: Trigger hasn't finished profile creation
                // Status 406 is typical for .single() when no rows are found
                if (retryCount < 3 && (status === 406 || !data)) {
                    console.log(`Node Profile Synchronization: Retrying in 1s... (Attempt ${retryCount + 1}/3)`);
                    setTimeout(() => {
                        if (isMounted.current) fetchProfile(userId, retryCount + 1);
                    }, 1000);
                } else {
                    console.error("Institutional Identity Error:", {
                        message: error?.message,
                        details: error?.details,
                        hint: error?.hint,
                        status: status
                    });
                    if (isMounted.current) setProfile(null);
                }
            }
        } catch (err) {
            console.error("Network synchronization protocol failure:", err);
            if (isMounted.current) setProfile(null);
        }
    };

    const refreshProfile = async () => {
        if (user) await fetchProfile(user.id);
    };

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (isMounted.current) {
                    setUser(session?.user ?? null);
                    if (session?.user) {
                        await fetchProfile(session.user.id);
                    }
                }
            } catch (err) {
                console.error("Auth initialization error:", err);
            } finally {
                if (isMounted.current) setLoading(false);
            }
        };

        initializeAuth();

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!isMounted.current) return;

            setUser(session?.user ?? null);

            if (session?.user) {
                await fetchProfile(session.user.id);
            } else {
                setProfile(null);
            }

            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
            if (isMounted.current) {
                setUser(null);
                setProfile(null);
                await router.push('/login');
            }
        } catch (err: any) {
            if (err.name === 'AbortError' || err.message?.includes('signal is aborted')) return;
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
