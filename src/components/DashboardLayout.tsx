'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { useLanguage } from '@/context/LanguageContext';
import {
    Loader2,
    Bell,
    Search,
    ChevronDown,
    LogOut,
    Settings,
    AlertCircle,
    UserCircle
} from 'lucide-react';
import Link from 'next/link';

type DashboardLayoutProps = {
    children: React.ReactNode;
    role: 'buyer' | 'seller' | 'organizer';
};

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
    const { profile, loading, user, signOut, refreshProfile } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const isMounted = useRef(true);

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [syncRetry, setSyncRetry] = useState(0);

    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    // Master Redirection Controller
    useEffect(() => {
        if (!loading) {
            const checkAuth = async () => {
                try {
                    if (!user) {
                        if (isMounted.current) await router.push('/login');
                        return;
                    }

                    if (profile) {
                        if (profile.role !== role) {
                            if (isMounted.current) await router.push(`/${profile.role}/dashboard`);
                        }
                    }
                } catch (err: any) {
                    // Ignore Next.js internal navigation aborts
                    if (err.name === 'AbortError' || err.message?.includes('signal is aborted')) return;
                    console.error("Auth Guard Failure:", err);
                }
            };
            checkAuth();
        }
    }, [user, profile, loading, role, router]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Professional Loading State
    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}>
                <div style={{ textAlign: 'center' }}>
                    <div className="shimmer" style={{ width: '64px', height: '64px', borderRadius: '16px', margin: '0 auto 1.5rem', background: 'var(--primary-soft)' }}></div>
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Loading...</h3>
                </div>
            </div>
        );
    }

    // Node Sync Failure State (Common when triggers fail)
    if (user && !profile) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-main)', padding: '2rem' }}>
                <div className="card-white" style={{ maxWidth: '440px', padding: '3rem', textAlign: 'center' }}>
                    <div style={{ width: '64px', height: '64px', background: '#fff1f2', color: '#e11d48', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                        <AlertCircle size={32} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Profile Not Found</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>You're signed in as <strong>{user.email}</strong>, but we couldn't load your profile. Please try again.</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button
                            onClick={() => { refreshProfile(); setSyncRetry(s => s + 1); }}
                            className="btn-modern btn-primary-modern"
                            style={{ width: '100%', height: '52px' }}
                        >
                            {syncRetry > 0 ? `Retrying (${syncRetry})...` : 'Try Again'}
                        </button>
                        <button onClick={() => signOut()} className="btn-modern btn-secondary-modern" style={{ width: '100%', height: '52px' }}>
                            Sign in with a different account
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) return null;

    const notifications = [
        { id: 1, title: 'New order received', time: '2 mins ago', type: 'success' },
        { id: 2, title: 'A buyer placed a pre-order', time: '15 mins ago', type: 'info' },
        { id: 3, title: 'Market prices updated', time: '1 hour ago', type: 'update' }
    ];

    return (
        <div className="dashboard-grid">
            <Sidebar role={role} />

            <main style={{ background: 'var(--bg-main)', minWidth: 0 }}>
                <header style={{
                    height: '72px',
                    background: 'white',
                    borderBottom: '1px solid var(--border)',
                    padding: '0 2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 50
                }}>
                    <div style={{ position: 'relative', width: '400px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                        <input
                            type="text"
                            className="input-modern"
                            placeholder={t('search_placeholder')}
                            style={{ paddingLeft: '2.75rem', height: '42px', fontSize: '0.875rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Link href="/market" style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textDecoration: 'none' }}>Market Prices</Link>

                        <div style={{ position: 'relative' }} ref={notificationRef}>
                            <button onClick={() => setShowNotifications(!showNotifications)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', position: 'relative' }}>
                                <Bell size={20} />
                                <div style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', background: 'var(--error)', borderRadius: '50%', border: '2px solid white' }}></div>
                            </button>
                            {showNotifications && (
                                <div className="card-white" style={{ position: 'absolute', top: '100%', right: 0, width: '320px', marginTop: '1rem', padding: '1rem', zIndex: 100 }}>
                                    <h4 style={{ marginBottom: '1rem' }}>Recent Alerts</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {notifications.map(n => (
                                            <div key={n.id} style={{ padding: '0.75rem', background: 'var(--bg-main)', borderRadius: '10px' }}>
                                                <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{n.title}</p>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>{n.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ height: '24px', width: '1px', background: 'var(--border)' }}></div>

                        <div style={{ position: 'relative' }} ref={profileRef}>
                            <div onClick={() => setShowProfileMenu(!showProfileMenu)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--secondary)' }}>{profile.full_name}</p>
                                    <p style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase' }}>{profile.role}</p>
                                </div>
                                <div style={{ width: '36px', height: '36px', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                                    {profile.full_name?.charAt(0) || 'U'}
                                </div>
                            </div>
                            {showProfileMenu && (
                                <div className="card-white" style={{ position: 'absolute', top: '100%', right: 0, width: '200px', marginTop: '1rem', padding: '0.5rem', zIndex: 100 }}>
                                    <Link href="/settings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600 }}><Settings size={18} /> Settings</Link>
                                    <button onClick={() => signOut()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', color: 'var(--error)', background: 'none', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}><LogOut size={18} /> Sign Out</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div style={{ padding: '2.5rem' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
