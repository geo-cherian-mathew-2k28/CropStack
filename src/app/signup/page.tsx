'use client';

import React, { useState, useEffect, useRef } from 'react';
import { auth, db, doc, setDoc, getDoc, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from '@/lib/firebase';
import Link from 'next/link';
import {
    Warehouse,
    ArrowRight,
    Loader2,
    ChevronLeft,
    AlertCircle,
    Briefcase,
    Shield,
    Zap,
    ShoppingBag,
    Sprout,
    Fingerprint
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function SignUpPage() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'buyer' | 'seller' | 'organizer'>('buyer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleQuickConnect = async (targetRole: 'buyer' | 'seller' | 'organizer') => {
        if (loading) return;
        setLoading(true);
        setError(null);

        const testEmail = targetRole === 'buyer' ? 'buyer@cropstack.com' : targetRole === 'seller' ? 'seller@cropstack.com' : 'owner@cropstack.com';
        const testPass = 'password123';

        try {
            const userCredential = await signInWithEmailAndPassword(auth, testEmail, testPass);

            if (!isMounted.current) return;

            if (userCredential.user) {
                window.location.href = `/${targetRole}/dashboard`;
                return;
            }
        } catch (err: any) {
            if (!isMounted.current) return;
            if (err.name === 'AbortError' || err.message?.includes('signal is aborted')) {
                // Navigation aborted — that's okay
            } else {
                setError(`Login failed: ${err.message}`);
            }
        }

        if (isMounted.current) setLoading(false);
    };

    const handleAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            // Step 1: Try to sign in first (maybe account already exists)
            try {
                const loginCredential = await signInWithEmailAndPassword(auth, email, password);

                if (!isMounted.current) return;

                if (loginCredential.user) {
                    const profileSnap = await getDoc(doc(db, 'profiles', loginCredential.user.uid));
                    const profileRole = profileSnap.exists() ? profileSnap.data().role : 'buyer';

                    window.location.href = `/${profileRole}/dashboard`;
                    return;
                }
            } catch (loginErr: any) {
                // Login failed — that's expected for new users, continue to sign up
                if (loginErr.code !== 'auth/invalid-credential' &&
                    loginErr.code !== 'auth/wrong-password' &&
                    loginErr.code !== 'auth/user-not-found') {
                    throw loginErr; // Re-throw unexpected errors
                }
            }

            if (!isMounted.current) return;

            // Step 2: Create new account with Firebase
            const signUpCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = signUpCredential.user;

            if (!isMounted.current) return;

            // Set display name
            const displayName = role === 'buyer' ? 'Buyer' : role === 'seller' ? 'Seller' : 'Manager';
            await updateProfile(newUser, { displayName });

            // Create profile in Firestore
            await setDoc(doc(db, 'profiles', newUser.uid), {
                email: email,
                full_name: displayName,
                role: role,
                avatar_url: null,
                created_at: new Date().toISOString(),
            });

            window.location.href = `/${role}/dashboard`;
            return;

        } catch (err: any) {
            if (!isMounted.current) return;
            if (err.name === 'AbortError' || err.message?.includes('signal is aborted')) {
                // Navigation aborted — that's okay
            } else if (err.code === 'auth/email-already-in-use') {
                setError('An account with this email already exists. Try signing in instead.');
            } else if (err.code === 'auth/weak-password') {
                setError('Password is too weak. Please use at least 6 characters.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
            } else if (err.code === 'auth/too-many-requests') {
                setError('Too many requests. Please wait a moment and try again.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        }

        if (isMounted.current) setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
            {/* Branding & Quick Login */}
            <div style={{ flex: '1.2', background: 'var(--secondary)', color: 'white', padding: '6rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                {/* Background Visuals */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.03 }}>
                    <Sprout size={800} />
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'white', zIndex: 10, position: 'relative' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--primary)', borderRadius: '14px', boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3)' }}>
                        <Warehouse size={28} />
                    </div>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.06em' }}>CropStack</span>
                </Link>

                <div style={{ zIndex: 10, position: 'relative' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.12)', marginBottom: '2rem' }}>
                        <Fingerprint size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Trusted by Farmers</span>
                    </div>
                    <h1 style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 0.95, marginBottom: '2.5rem', letterSpacing: '-0.05em' }}>
                        Start <br /><span style={{ color: 'var(--primary)' }}>Selling Today.</span>
                    </h1>

                    {/* Demo Login Module */}
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(20px)',
                        padding: '2.5rem',
                        borderRadius: '32px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        maxWidth: '460px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <Zap size={20} color="var(--primary)" fill="var(--primary)" />
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Quick Demo Login</span>
                        </div>
                        <p style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '2rem', lineHeight: 1.6 }}>
                            Try the app instantly with a demo account — no sign-up needed.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button onClick={() => handleQuickConnect('buyer')} className="btn-modern" style={{ width: '100%', height: '52px', background: 'white', color: 'var(--secondary)', border: 'none', fontWeight: 900, borderRadius: '12px' }}>
                                <ShoppingBag size={18} /> LOGIN AS BUYER
                            </button>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => handleQuickConnect('seller')} className="btn-modern" style={{ flex: 1, height: '52px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, borderRadius: '12px' }}>
                                    <Briefcase size={18} /> SELLER
                                </button>
                                <button onClick={() => handleQuickConnect('organizer')} className="btn-modern" style={{ flex: 1, height: '52px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 900, borderRadius: '12px' }}>
                                    <Shield size={18} /> MANAGER
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ zIndex: 10, display: 'flex', gap: '3rem', opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Sprout size={18} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px' }}>MADE FOR FARMERS</span>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem', background: 'white' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <div className="fade-up" style={{ animationDelay: '0.1s' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Create Account</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '3.5rem', fontSize: '1.15rem', fontWeight: 500 }}>Choose your role and set up your account.</p>

                        <form onSubmit={handleAccess} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '0.75rem',
                                padding: '0.625rem',
                                background: '#f1f5f9',
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <button type="button" onClick={() => setRole('buyer')} style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '14px',
                                    background: role === 'buyer' ? 'white' : 'transparent',
                                    color: role === 'buyer' ? 'var(--primary)' : 'var(--text-soft)',
                                    fontWeight: 800, cursor: 'pointer', border: 'none',
                                    boxShadow: role === 'buyer' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}>
                                    <ShoppingBag size={20} /> <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Buyer</span>
                                </button>
                                <button type="button" onClick={() => setRole('seller')} style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '14px',
                                    background: role === 'seller' ? 'white' : 'transparent',
                                    color: role === 'seller' ? 'var(--primary)' : 'var(--text-soft)',
                                    fontWeight: 800, cursor: 'pointer', border: 'none',
                                    boxShadow: role === 'seller' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}>
                                    <Briefcase size={20} /> <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Seller</span>
                                </button>
                                <button type="button" onClick={() => setRole('organizer')} style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem', borderRadius: '14px',
                                    background: role === 'organizer' ? 'white' : 'transparent',
                                    color: role === 'organizer' ? 'var(--primary)' : 'var(--text-soft)',
                                    fontWeight: 800, cursor: 'pointer', border: 'none',
                                    boxShadow: role === 'organizer' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                                }}>
                                    <Shield size={20} /> <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Manager</span>
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--secondary)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Email Address</label>
                                    <input type="email" className="input-modern" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ height: '64px', borderRadius: '16px', fontSize: '1.1rem' }} disabled={loading} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--secondary)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Password</label>
                                    <input type="password" className="input-modern" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ height: '64px', borderRadius: '16px', fontSize: '1.1rem' }} disabled={loading} />
                                </div>
                            </div>

                            {error && (
                                <div className="fade-up" style={{ padding: '1.5rem', background: '#fff1f2', border: '1px solid #fda4af', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', color: '#e11d48' }}>
                                        <AlertCircle size={24} style={{ flexShrink: 0 }} />
                                        <p style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4 }}>{error}</p>
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="btn-modern btn-primary-modern" style={{ height: '72px', borderRadius: '20px', fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(5, 150, 105, 0.2)' }} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={28} /> : <>Create Account <ArrowRight size={24} /></>}
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>
                        Already have an account? <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 900, borderBottom: '2px solid var(--primary-soft)' }}>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
