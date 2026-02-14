'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import {
    Warehouse,
    ArrowRight,
    Loader2,
    ChevronLeft,
    AlertCircle,
    Sprout,
    Shield
} from 'lucide-react';

export default function LoginPage() {
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
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (!isMounted.current) return;

            if (authError) {
                setError(authError.message === 'Invalid login credentials' ? 'Wrong email or password. Please try again.' : authError.message);
                setLoading(false);
                return;
            }

            if (data?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single();

                // Hard redirect to avoid race conditions with auth state listener
                window.location.href = `/${profile?.role || 'buyer'}/dashboard`;
                return;
            }
        } catch (err: any) {
            if (!isMounted.current) return;
            if (err.name === 'AbortError' || err.message?.includes('signal is aborted')) {
                // Navigation was aborted — that's OK
            } else {
                setError('Something went wrong. Please try again.');
            }
        }

        if (isMounted.current) setLoading(false);
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
            {/* Branding Side */}
            <div style={{ flex: '1.2', background: 'var(--secondary)', color: 'white', padding: '6rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
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
                    <h1 style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 0.95, marginBottom: '2.5rem', letterSpacing: '-0.05em' }}>
                        Your Farm, <br /><span style={{ color: 'var(--primary)' }}>Your Market.</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', opacity: 0.6, maxWidth: '440px', lineHeight: 1.6 }}>
                        A simple platform for farmers and buyers to sell and buy crops directly — no middlemen needed.
                    </p>
                </div>

                <div style={{ zIndex: 10, display: 'flex', gap: '3rem', opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Shield size={18} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px' }}>SAFE & SECURE</span>
                    </div>
                </div>
            </div>

            {/* Login Side */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem', background: 'white' }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <Link href="/signup" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-soft)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 800, marginBottom: '4rem', padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '10px' }}>
                        <ChevronLeft size={18} /> CREATE ACCOUNT
                    </Link>

                    <div className="fade-up">
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Welcome Back</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '3.5rem', fontSize: '1.15rem', fontWeight: 500 }}>Enter your details to sign in.</p>

                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
                                <div className="fade-up" style={{ padding: '1.5rem', background: '#fff1f2', border: '1px solid #fda4af', borderRadius: '16px', display: 'flex', gap: '0.75rem', color: '#e11d48' }}>
                                    <AlertCircle size={24} style={{ flexShrink: 0 }} />
                                    <p style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4 }}>{error}</p>
                                </div>
                            )}

                            <button type="submit" className="btn-modern btn-primary-modern" style={{ height: '72px', borderRadius: '20px', fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(5, 150, 105, 0.2)' }} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={28} /> : <>Sign In <ArrowRight size={24} /></>}
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>
                        Don't have an account? <Link href="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 900, borderBottom: '2px solid var(--primary-soft)' }}>Sign Up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
