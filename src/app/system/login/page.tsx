'use client';

import React, { useState, useEffect, useRef } from 'react';
import { auth, db, doc, getDoc, signInWithEmailAndPassword } from '@/lib/firebase';
import Link from 'next/link';
import {
    Warehouse,
    ArrowRight,
    Loader2,
    ChevronLeft,
    AlertCircle,
    Shield,
    Lock,
    Zap
} from 'lucide-react';

export default function SystemLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            if (!isMounted.current) return;

            const firebaseUser = userCredential.user;

            if (firebaseUser) {
                const profileSnap = await getDoc(doc(db, 'profiles', firebaseUser.uid));
                const profileRole = profileSnap.exists() ? profileSnap.data().role : 'buyer';

                if (profileRole !== 'manager' && profileRole !== 'admin') {
                    setError('Unauthorized access. This platform is for Managers and Administrators only.');
                    setLoading(false);
                    return;
                }

                window.location.href = `/system/${profileRole}/dashboard`;
                return;
            }
        } catch (err: any) {
            if (!isMounted.current) return;
            if (err.name === 'AbortError' || err.message?.includes('signal is aborted')) {
                // Navigation was aborted — that's OK
            } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Wrong email or password. Please try again.');
            } else {
                setError('Authentication failed. Please try again.');
            }
        }

        if (isMounted.current) setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#0f172a', fontFamily: 'var(--font-heading)', color: 'white' }}>
            {/* Branding Side */}
            <div style={{ flex: '1.2', background: 'var(--secondary)', color: 'white', padding: '6rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'white', zIndex: 10, position: 'relative' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--primary)', borderRadius: '14px', boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3)' }}>
                        <Lock size={28} />
                    </div>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.06em' }}>CropStack <span style={{ color: 'var(--primary)' }}>System</span></span>
                </Link>

                <div style={{ zIndex: 10, position: 'relative' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(5, 150, 105, 0.15)', borderRadius: '100px', border: '1px solid var(--primary)', marginBottom: '2rem' }}>
                        <Zap size={14} color="var(--primary)" fill="var(--primary)" />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary)' }}>Secure Node Management</span>
                    </div>
                    <h1 style={{ fontSize: '4.5rem', fontWeight: 900, lineHeight: 0.95, marginBottom: '2.5rem', letterSpacing: '-0.05em' }}>
                        Platform <br /><span style={{ color: 'var(--primary)' }}>Governance.</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.6, maxWidth: '440px', lineHeight: 1.6 }}>
                        Authorized access only. Monitor marketplace nodes, manage regional hubs, and oversee global system health.
                    </p>
                </div>

                <div style={{ zIndex: 10, display: 'flex', gap: '3rem', opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Shield size={18} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px' }}>SYSTEM LEVEL 4 ACCESS</span>
                    </div>
                </div>
            </div>

            {/* Login Side */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem', background: '#0f172a' }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <div className="fade-up">
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>System Login</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '3.5rem', fontSize: '1.15rem', fontWeight: 500 }}>Management Terminal</p>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-soft)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Operator Email</label>
                                    <input
                                        type="email"
                                        className="input-modern"
                                        placeholder="operator@cropstack.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ height: '64px', borderRadius: '16px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--text-soft)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Security Key</label>
                                    <input
                                        type="password"
                                        className="input-modern"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ height: '64px', borderRadius: '16px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="fade-up" style={{ padding: '1.5rem', background: 'rgba(225, 29, 72, 0.1)', border: '1px solid rgba(225, 29, 72, 0.3)', borderRadius: '16px', display: 'flex', gap: '0.75rem', color: '#fb7185' }}>
                                    <AlertCircle size={24} style={{ flexShrink: 0 }} />
                                    <p style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4 }}>{error}</p>
                                </div>
                            )}

                            <button type="submit" className="btn-modern btn-primary-modern" style={{ height: '72px', borderRadius: '20px', fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(5, 150, 105, 0.1)' }} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={28} /> : <>Verify Identity <ArrowRight size={24} /></>}
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '4rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', fontWeight: 600 }}>
                        Need to trade? <Link href="/trade/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 900 }}>Trade Platform</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
