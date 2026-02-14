'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
    User,
    Shield,
    Bell,
    Globe,
    Save,
    Loader2,
    Key,
    Smartphone,
    Mail,
    ChevronRight,
    Activity,
    CheckCircle2,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type SettingsTab = 'profile' | 'security' | 'governance' | 'notifications';

export default function SettingsPage() {
    const { profile, user } = useAuth();
    const { t, language, setLanguage } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [fullName, setFullName] = useState(profile?.full_name || '');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Security States
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', user?.id);

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Institutional identity updated on node.' });
        }
        setLoading(false);
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Security Protocol: Password must be at least 6 characters.' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) {
                // Handle 422 error which usually means password is too weak or same as current
                if (error.status === 422) {
                    setMessage({ type: 'error', text: 'Update Failed: The new password does not meet security requirements or is already in use.' });
                } else {
                    setMessage({ type: 'error', text: error.message });
                }
            } else {
                setMessage({ type: 'success', text: 'Credentials rotated successfully.' });
                setNewPassword('');
                setCurrentPassword('');
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: 'Network synchronization failed.' });
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Identity Analytics', icon: User },
        { id: 'security', label: 'Security & Keys', icon: Shield },
        { id: 'governance', label: 'Data Governance', icon: Globe },
        { id: 'notifications', label: 'Node Notifications', icon: Bell }
    ];

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'hi', label: 'हिन्दी' },
        { code: 'te', label: 'తెలుగు' },
        { code: 'ml', label: 'മലയാളം' },
        { code: 'ta', label: 'தமிழ்' },
        { code: 'kn', label: 'ಕನ್ನಡ' }
    ];

    return (
        <DashboardLayout role={profile?.role as any || 'buyer'}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem' }}>{t('settings')}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Manage your regional node credentials and institutional protocols.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '3.5rem' }}>
                {/* Side Nav */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as SettingsTab); setMessage(null); }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem 1.25rem',
                                borderRadius: '12px',
                                border: '1px solid transparent',
                                background: activeTab === tab.id ? 'white' : 'transparent',
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                textAlign: 'left',
                                cursor: 'pointer',
                                boxShadow: activeTab === tab.id ? 'var(--shadow-sm)' : 'none',
                                borderColor: activeTab === tab.id ? 'var(--border)' : 'transparent',
                                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                            }}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                            {activeTab === tab.id && <ChevronRight size={16} style={{ marginLeft: 'auto' }} />}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div style={{ minWidth: 0 }} className="fade-up">
                    {activeTab === 'profile' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="card-white" style={{ padding: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Institutional Identity</h3>
                                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Node Operator Name</label>
                                            <input
                                                type="text"
                                                className="input-modern"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Email Endpoint</label>
                                            <input
                                                type="email"
                                                className="input-modern"
                                                value={user?.email || ''}
                                                disabled
                                                style={{ background: 'var(--bg-main)', cursor: 'not-allowed' }}
                                            />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Role Clearance</label>
                                            <div style={{ padding: '0.875rem 1.125rem', background: 'var(--bg-main)', borderRadius: '12px', color: 'var(--secondary)', fontWeight: 700, border: '1px solid var(--border)' }}>
                                                {profile?.role?.toUpperCase()}
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Language Node</label>
                                            <select
                                                className="input-modern"
                                                value={language}
                                                onChange={(e) => setLanguage(e.target.value as any)}
                                            >
                                                {languages.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    {message && activeTab === 'profile' && (
                                        <div style={{ padding: '1rem', background: message.type === 'success' ? 'var(--success-soft)' : 'var(--error-soft)', color: message.type === 'success' ? 'var(--success)' : 'var(--error)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                            {message.type === 'success' ? <CheckCircle2 size={18} /> : <Activity size={18} />}
                                            {message.text}
                                        </div>
                                    )}

                                    <button type="submit" className="btn-modern btn-primary-modern" style={{ width: 'fit-content', height: '52px', padding: '0 2.5rem' }} disabled={loading}>
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Update Node Details</>}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <div className="card-white" style={{ padding: '2.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>Access Credentials</h3>
                                <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>New Access Key</label>
                                        <div style={{ position: 'relative' }}>
                                            <Lock size={18} style={{ position: 'absolute', left: '1.125rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                                            <input
                                                type={showPasswords ? "text" : "password"}
                                                className="input-modern"
                                                style={{ paddingLeft: '3rem' }}
                                                placeholder="Enter new complex password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(!showPasswords)}
                                                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-soft)' }}
                                            >
                                                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {message && activeTab === 'security' && (
                                        <div style={{ padding: '1rem', background: message.type === 'success' ? 'var(--success-soft)' : 'var(--error-soft)', color: message.type === 'success' ? 'var(--success)' : 'var(--error)', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700 }}>
                                            {message.text}
                                        </div>
                                    )}

                                    <button type="submit" className="btn-modern btn-primary-modern" style={{ width: 'fit-content', height: '52px' }} disabled={loading || !newPassword}>
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : 'Initiate Secure Rotation'}
                                    </button>
                                </form>
                            </div>

                            <div className="card-white" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <h3 style={{ fontSize: '1.25rem' }}>Biometric & 2FA Node</h3>
                                    <span className="badge-clean badge-pending">System Enabled</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <Smartphone size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Mobile Authenticator</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Use Google Authenticator or Authy for node verification.</p>
                                        <button className="btn-modern btn-secondary-modern" style={{ width: '100%', fontSize: '0.8rem' }}>Configure App</button>
                                    </div>
                                    <div style={{ padding: '1.5rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <Key size={24} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                                        <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Hardware Security Key</h4>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Authenticate using physical YubiKey or Titan security keys.</p>
                                        <button className="btn-modern btn-secondary-modern" style={{ width: '100%', fontSize: '0.8rem' }}>Register Key</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'governance' && (
                        <div className="card-white" style={{ padding: '3rem', textAlign: 'center' }}>
                            <Globe size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Global Data Sovereignty</h3>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
                                Configure how your warehouse telemetry is shared across regional nodes. Your data remains your property under Node-Sync v4 protocols.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                                {[
                                    { label: 'Share Volume Analytics', desc: 'Allows regional hubs to see non-SKU volume trends.', active: true },
                                    { label: 'Public Ticker Presence', desc: 'Your node will appear in global market activity lists.', active: false },
                                    { label: 'Audit Log Archiving', desc: 'Securely archive all storage receipts for 7 years.', active: true }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px' }}>
                                        <div style={{ textAlign: 'left' }}>
                                            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>{item.desc}</p>
                                        </div>
                                        <div style={{ width: '40px', height: '20px', borderRadius: '20px', background: item.active ? 'var(--primary)' : 'var(--text-soft)', padding: '2px', cursor: 'pointer' }}>
                                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', marginLeft: item.active ? '20px' : '0', transition: 'all 0.2s' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="card-white" style={{ padding: '3rem', textAlign: 'center' }}>
                            <Bell size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Node Communication Hub</h3>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 2rem' }}>
                                Stay updated on regional hub events and allocation updates.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                                {[
                                    { label: 'Push Allocation Updates', active: true },
                                    { label: 'Email Receipt Confirmations', active: true },
                                    { label: 'Weekly Performance Digest', active: false }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px' }}>
                                        <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.label}</p>
                                        <div style={{ width: '40px', height: '20px', borderRadius: '20px', background: item.active ? 'var(--primary)' : 'var(--text-soft)', padding: '2px', cursor: 'pointer' }}>
                                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'white', marginLeft: item.active ? '20px' : '0', transition: 'all 0.2s' }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
