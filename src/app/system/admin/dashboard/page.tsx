'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/context/LanguageContext';
import { ShieldCheck, Users, Activity, Loader2, Warehouse, Thermometer } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type SystemStats = {
    total_users: number;
    active_warehouses: number;
    system_health: string;
    last_sync: string;
    total_transactions: number;
};

type HubActivity = {
    id: string;
    name: string;
    status: 'online' | 'offline' | 'warning';
    temperature: number;
    humidity: number;
    last_ping: string;
};

export default function AdminDashboard() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<SystemStats | null>(null);
    const [hubs, setHubs] = useState<HubActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated Admin Data Fetch (Replace with real endpoints later)
        const fetchAdminData = async () => {
            try {
                // Mocking data for now as specific admin endpoints might not exist yet
                // in a real scenario, you'd fetch /api/admin/stats
                setStats({
                    total_users: 1250,
                    active_warehouses: 8,
                    system_health: 'Optimal',
                    last_sync: new Date().toLocaleTimeString(),
                    total_transactions: 45000
                });

                setHubs([
                    { id: 'h1', name: 'North Kerala Hub', status: 'online', temperature: 28.5, humidity: 65, last_ping: 'Just now' },
                    { id: 'h2', name: 'Central Storage', status: 'warning', temperature: 31.2, humidity: 72, last_ping: '2 mins ago' },
                    { id: 'h3', name: 'Coastal Depot', status: 'online', temperature: 27.8, humidity: 60, last_ping: '1 min ago' },
                ]);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
        const interval = setInterval(fetchAdminData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardLayout role="admin">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.05em' }}>System <span style={{ color: 'var(--primary)' }}>Control.</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
                    Global oversight of all regional hubs and user activities.
                </p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
            ) : (
                <>
                    {/* Key Metrics */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Users</span>
                                <Users size={20} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.total_users.toLocaleString()}</h2>
                        </div>

                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Hubs</span>
                                <Warehouse size={20} color="var(--success)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.active_warehouses}</h2>
                        </div>

                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>System Health</span>
                                <Activity size={20} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--success)' }}>{stats?.system_health}</h2>
                        </div>

                        <div className="card-white glass-dark" style={{ padding: '2rem', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Tx Volume</span>
                                <ShieldCheck size={20} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.total_transactions.toLocaleString()}</h2>
                        </div>
                    </div>

                    {/* Regional Hub Monitoring */}
                    <div className="card-white" style={{ padding: '2.5rem' }}>
                        <div style={{ marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Regional Hub Activity</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Real-time status of storage facilities.</p>
                        </div>

                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 800 }}>Hub Name</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 800 }}>Status</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 800 }}>Temperature</th>
                                        <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 800 }}>Humidity</th>
                                        <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 800 }}>Last Ping</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hubs.map((hub) => (
                                        <tr key={hub.id} style={{ background: 'white', borderRadius: '14px', border: '1px solid var(--border-soft)' }}>
                                            <td style={{ padding: '1.5rem 1rem', fontWeight: 800, color: 'var(--secondary)' }}>
                                                {hub.name}
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                                                <span style={{
                                                    padding: '0.5rem 1rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    background: hub.status === 'online' ? 'rgba(16, 185, 129, 0.1)' : hub.status === 'warning' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                    color: hub.status === 'online' ? '#10b981' : hub.status === 'warning' ? '#f59e0b' : '#ef4444'
                                                }}>
                                                    {hub.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                                                {hub.temperature}°C
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem', textAlign: 'center', fontWeight: 700 }}>
                                                {hub.humidity}%
                                            </td>
                                            <td style={{ padding: '1.5rem 1rem', textAlign: 'right', color: 'var(--text-soft)', fontSize: '0.85rem' }}>
                                                {hub.last_ping}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
