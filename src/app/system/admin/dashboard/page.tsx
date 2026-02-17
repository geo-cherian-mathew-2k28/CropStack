'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/context/LanguageContext';
import {
    Users,
    ShieldAlert,
    Activity,
    Database,
    Lock,
    Settings,
    Search,
    Loader2,
    ArrowUpRight,
    ArrowDownRight,
    Server,
    Zap
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

type SystemStats = {
    total_users: number;
    active_sessions: number;
    system_load: number;
    uptime: string;
};

export default function AdminDashboard() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            // In a real app, this would be an admin-only endpoint
            const res = await fetch(`${API_BASE}/stats/admin`).catch(() => null);

            if (res && res.ok) {
                const data = await res.json();
                setStats(data.stats);
            } else {
                // Mock data for demonstration if API is not yet updated
                setStats({
                    total_users: 14200,
                    active_sessions: 842,
                    system_load: 12.4,
                    uptime: '14d 6h 22m'
                });
            }
            setError(false);
        } catch (err) {
            console.error('Failed to fetch admin data:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return (
        <DashboardLayout role="admin">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.05em' }}>System <span style={{ color: 'var(--primary)' }}>Administrator.</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
                    Global infrastructure control and user management.
                </p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Global Users</span>
                                <div style={{ width: '40px', height: '40px', background: 'var(--primary-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={20} color="var(--primary)" />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.total_users.toLocaleString()}</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>+42 today</p>
                        </div>

                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Nodes</span>
                                <div style={{ width: '40px', height: '40px', background: 'var(--success-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Activity size={20} color="var(--success)" />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.active_sessions}</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Live connections</p>
                        </div>

                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>System Load</span>
                                <Zap size={24} color="var(--warning)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.system_load}%</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>CPU Efficiency</p>
                        </div>

                        <div className="card-white glass-dark" style={{ padding: '2rem', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>System Uptime</span>
                                <Server size={20} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.uptime}</h2>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Cluster Status: Stable</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                        <div className="card-white" style={{ padding: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem' }}>Security Logs</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { event: 'Root access granted', user: 'admin@cropstack.com', time: '2 mins ago', type: 'info' },
                                    { event: 'Suspicious login attempt blocked', user: 'Unknown IP (103.x.x.x)', time: '14 mins ago', type: 'alert' },
                                    { event: 'Database backup completed', user: 'System', time: '1 hour ago', type: 'success' },
                                    { event: 'SSL Certificate renewed', user: 'System', time: '2 hours ago', type: 'success' },
                                ].map((log, i) => (
                                    <div key={i} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ padding: '0.5rem', background: log.type === 'alert' ? '#fff1f2' : '#f1f5f9', borderRadius: '10px' }}>
                                                {log.type === 'alert' ? <ShieldAlert size={18} color="#e11d48" /> : <Lock size={18} color="var(--text-soft)" />}
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--secondary)' }}>{log.event}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>{log.user}</p>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)' }}>{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card-white" style={{ padding: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <button className="btn-modern btn-primary-modern" style={{ width: '100%', height: '56px', justifyContent: 'flex-start', padding: '0 1.5rem' }}>
                                    <Users size={18} /> Manage Users
                                </button>
                                <button className="btn-modern btn-secondary-modern" style={{ width: '100%', height: '56px', justifyContent: 'flex-start', padding: '0 1.5rem', background: '#f1f5f9', border: 'none' }}>
                                    <Database size={18} /> Database Explorer
                                </button>
                                <button className="btn-modern btn-secondary-modern" style={{ width: '100%', height: '56px', justifyContent: 'flex-start', padding: '0 1.5rem', background: '#f1f5f9', border: 'none' }}>
                                    <Settings size={18} /> Global Config
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
