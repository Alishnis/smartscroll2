import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);
const AUTH_BOOT_TIMEOUT_MS = 4000;
const AUTH_REQUEST_TIMEOUT_MS = 10000;

const withTimeout = async (promiseFactory, timeoutMs, timeoutMessage) => {
    let timeoutId;

    try {
        return await Promise.race([
            Promise.resolve().then(promiseFactory),
            new Promise((_, reject) => {
                timeoutId = window.setTimeout(() => {
                    reject(new Error(timeoutMessage));
                }, timeoutMs);
            })
        ]);
    } finally {
        window.clearTimeout(timeoutId);
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    const ensureProfile = async (currentUser) => {
        if (!currentUser?.id) return;

        const username =
            currentUser.user_metadata?.username ||
            currentUser.email?.split('@')[0] ||
            'Learner';
        const role =
            currentUser.user_metadata?.role ||
            'Student';

        try {
            const { error } = await withTimeout(
                () => supabase
                    .from('profiles')
                    .upsert([{
                        id: currentUser.id,
                        username,
                        role,
                        updated_at: new Date().toISOString()
                    }], {
                        onConflict: 'id'
                    }),
                AUTH_REQUEST_TIMEOUT_MS,
                'ensureProfile timed out'
            );

            if (error) {
                console.error('Error ensuring profile:', error.message);
            }
        } catch (error) {
            console.error('Error ensuring profile:', error.message || error);
        }
    };

    useEffect(() => {
        let isMounted = true;
        const authTimeout = window.setTimeout(() => {
            if (!isMounted) return;
            setLoading(false);
        }, AUTH_BOOT_TIMEOUT_MS);

        // Get the initial session
        withTimeout(
            () => supabase.auth.getSession(),
            AUTH_REQUEST_TIMEOUT_MS,
            'getSession timed out'
        ).then(({ data: { session } }) => {
            if (!isMounted) return;
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            if (session?.user) {
                void ensureProfile(session.user);
            }
        }).catch((error) => {
            console.error('Error restoring session:', error);
            if (!isMounted) return;
            setLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!isMounted) return;
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
                if (session?.user) {
                    void ensureProfile(session.user);
                }
            }
        );

        return () => {
            isMounted = false;
            window.clearTimeout(authTimeout);
            subscription.unsubscribe();
        };
    }, []);

    const signInWithOAuth = async (provider = 'google') => {
        const { error } = await withTimeout(
            () => supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin,
                },
            }),
            AUTH_REQUEST_TIMEOUT_MS,
            'OAuth sign-in timed out'
        );
        if (error) console.error('Error signing in:', error.message);
    };

    const signInWithEmail = async (email, password) => {
        try {
            const { error } = await withTimeout(
                () => supabase.auth.signInWithPassword({
                    email,
                    password,
                }),
                AUTH_REQUEST_TIMEOUT_MS,
                'Sign-in timed out'
            );
            if (error) console.error('Error signing in:', error.message);
            return { error };
        } catch (error) {
            console.error('Error signing in:', error.message || error);
            return { error };
        }
    };

    const signUpWithEmail = async (email, password, username = '', role = 'Student') => {
        try {
            const { error } = await withTimeout(
                () => supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username: username || email.split('@')[0],
                            role
                        }
                    }
                }),
                AUTH_REQUEST_TIMEOUT_MS,
                'Sign-up timed out'
            );
            if (error) console.error('Error signing up:', error.message);
            return { error };
        } catch (error) {
            console.error('Error signing up:', error.message || error);
            return { error };
        }
    };

    const signOut = async () => {
        setSession(null);
        setUser(null);
        try {
            const { error } = await withTimeout(
                () => supabase.auth.signOut(),
                AUTH_REQUEST_TIMEOUT_MS,
                'Sign-out timed out'
            );
            if (error) {
                console.error('Error signing out:', error.message);
            }
        } catch (error) {
            console.error('Error signing out:', error.message || error);
        }
    };

    const value = {
        user,
        session,
        loading,
        isAuthenticated: !!user,
        signInWithOAuth,
        signInWithEmail,
        signUpWithEmail,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
