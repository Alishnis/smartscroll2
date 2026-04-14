import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

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

        const { error } = await supabase
            .from('profiles')
            .upsert([{
                id: currentUser.id,
                username,
                role: 'Knowledge Explorer',
                updated_at: new Date().toISOString()
            }], {
                onConflict: 'id'
            });

        if (error) {
            console.error('Error ensuring profile:', error.message);
        }
    };

    useEffect(() => {
        // Get the initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                await ensureProfile(session.user);
            }
            setLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await ensureProfile(session.user);
                }
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const signInWithOAuth = async (provider = 'google') => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: window.location.origin,
            },
        });
        if (error) console.error('Error signing in:', error.message);
    };

    const signInWithEmail = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) console.error('Error signing in:', error.message);
        return { error };
    };

    const signUpWithEmail = async (email, password, username = '') => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username || email.split('@')[0]
                }
            }
        });
        if (error) console.error('Error signing up:', error.message);
        return { error };
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) console.error('Error signing out:', error.message);
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
