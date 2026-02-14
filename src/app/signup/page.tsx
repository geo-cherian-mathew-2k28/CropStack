'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Warehouse,
    ArrowRight,
    Loader2,
    ChevronLeft,
    AlertCircle,
    Activity,
    Briefcase,
    Shield,
    Zap,
    ExternalLink,
    ShoppingBag,
    Cpu,
    Fingerprint
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function EntryHub() {
    const { t } = useLanguage();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'buyer' | 'seller' | 'organizer'>('buyer');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showConfigAdvice, setShowConfigAdvice] = useState(false);

    const router = useRouter();
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
            const { data, error: connectError } = await supabase.auth.signInWithPassword({
                email: testEmail,
                password: testPass
            });

            if (!isMounted.current) return;

            if (connectError) {
                setError(`Protocol Error: ${connectError.message}`);
                setLoading(false);
            } else if (data.user) {
                await router.push(`/${targetRole}/dashboard`);
            }
        } catch (err: any) {
            if (isMounted.current) {
                if (err.name === 'AbortError' || err.message?.includes('signal is aborted')) return;
                setError('Network Handshake Failed.');
                setLoading(false);
            }
        }
    };

    const handleAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        setLoading(true);
        setError(null);
        setShowConfigAdvice(false);

        try {
            // Step 1: Attempt Instant Auth Sync
            const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({ email, password });

            if (!isMounted.current) return;

            if (loginData?.user && !loginError) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', loginData.user.id)
                    .single();

                if (isMounted.current) {
                    await router.push(`/${profile?.role || 'buyer'}/dashboard`);
                }
                return;
            }

            // Step 2: Provision New Node if legacy handshake fails
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: role === 'buyer' ? 'Buyer Node' : role === 'seller' ? 'Seller Hub' : 'Network Owner',
                        role: role
                    }
                }
            });

            if (!isMounted.current) return;

            if (signUpError) {
                setError(signUpError.status === 429 ? 'Rate Limit (429): Use specialized bypass nodes.' : signUpError.message);
                setLoading(false);
                return;
            }

            if (signUpData?.session) {
                await router.push(`/${role}/dashboard`);
            } else {
                setError('Verification Pending: Manual override required.');
                setShowConfigAdvice(true);
                setLoading(false);
            }
        } catch (err: any) {
            if (isMounted.current) {
                if (err.name === 'AbortError' || err.message?.includes('signal is aborted')) return;
                setError('Authentication Protocol Interrupted.');
                setLoading(false);
            }
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
            {/* Branding & Dev Bypass */}
            <div style={{ flex: '1.2', background: 'var(--secondary)', color: 'white', padding: '6rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                {/* Background Visuals */}
                <div style={{ position: 'absolute', top: '-10%', right: '-10%', opacity: 0.03 }}>
                    <Cpu size={800} />
                </div>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none', color: 'white', zIndex: 10, position: 'relative' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--primary)', borderRadius: '14px', boxShadow: '0 8px 16px rgba(5, 150, 105, 0.3)' }}>
                        <Warehouse size={28} />
                    </div>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.06em' }}>CropStack <span style={{ color: 'var(--primary)', fontSize: '0.7rem', verticalAlign: 'top', marginLeft: '0.2rem' }}>PRO</span></span>
                </Link>

                <div style={{ zIndex: 10, position: 'relative' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.08)', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.12)', marginBottom: '2rem' }}>
                        <Fingerprint size={16} color="var(--primary)" />
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Verifiable Node Hub</span>
                    </div>
                    <h1 style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 0.95, marginBottom: '2.5rem', letterSpacing: '-0.05em' }}>
                        Secure <br /><span style={{ color: 'var(--primary)' }}>Provisioning.</span>
                    </h1>

                    {/* Developer Bypass Module */}
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
                            <span style={{ fontSize: '0.9rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '2px' }}>Enterprise QuickLink</span>
                        </div>
                        <p style={{ fontSize: '1rem', opacity: 0.7, marginBottom: '2rem', lineHeight: 1.6 }}>
                            Skip manual configuration and connect to a pre-verified institutional node instantly.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button onClick={() => handleQuickConnect('buyer')} className="btn-modern" style={{ width: '100%', height: '52px', background: 'white', color: 'var(--secondary)', border: 'none', fontWeight: 900, borderRadius: '12px' }}>
                                <ShoppingBag size={18} /> INITIALIZE BUYER NODE
                            </button>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={() => handleQuickConnect('seller')} className="btn-modern" style={{ flex: 1, height: '52px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 900, borderRadius: '12px' }}>
                                    <Briefcase size={18} /> SELLER
                                </button>
                                <button onClick={() => handleQuickConnect('organizer')} className="btn-modern" style={{ flex: 1, height: '52px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 900, borderRadius: '12px' }}>
                                    <Shield size={18} /> OWNER
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ zIndex: 10, display: 'flex', gap: '3rem', opacity: 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Activity size={18} color="var(--primary)" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '1px' }}>SYSTEM: OPERATIONAL</span>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem', background: 'white' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <div className="fade-up" style={{ animationDelay: '0.1s' }}>
                        <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Role Clearance</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '3.5rem', fontSize: '1.15rem', fontWeight: 500 }}>Select your node type and establish keys.</p>

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
                                    <Shield size={20} /> <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Owner</span>
                                </button>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--secondary)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Institutional Endpoint</label>
                                    <input type="email" className="input-modern" placeholder="corp@network.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ height: '64px', borderRadius: '16px', fontSize: '1.1rem' }} disabled={loading} />
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 800, fontSize: '0.75rem', color: 'var(--secondary)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Access Passcode</label>
                                    <input type="password" className="input-modern" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ height: '64px', borderRadius: '16px', fontSize: '1.1rem' }} disabled={loading} />
                                </div>
                            </div>

                            {error && (
                                <div className="fade-up" style={{ padding: '1.5rem', background: '#fff1f2', border: '1px solid #fda4af', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.75rem', color: '#e11d48' }}>
                                        <AlertCircle size={24} style={{ flexShrink: 0 }} />
                                        <p style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4 }}>{error}</p>
                                    </div>
                                    {showConfigAdvice && (
                                        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '14px', border: '1px solid #fda4af' }}>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 600, marginBottom: '0.75rem' }}>Handshake blocked by project firewall.</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1rem' }}>The email registry is currently locked. Disable <strong>"Confirm Email"</strong> in Supabase Auth to enable instant node syncing.</p>
                                            <a href="https://supabase.com/dashboard/project/_/auth/providers" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 900, textDecoration: 'none' }}>Open Project Console <ExternalLink size={14} /></a>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button type="submit" className="btn-modern btn-primary-modern" style={{ height: '72px', borderRadius: '20px', fontSize: '1.2rem', boxShadow: '0 10px 20px rgba(5, 150, 105, 0.2)' }} disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" size={28} /> : <>Initialize Sync Hub <ArrowRight size={24} /></>}
                            </button>
                        </form>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 600 }}>
                        Part of a node? <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 900, borderBottom: '2px solid var(--primary-soft)' }}>Identify Terminal</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
