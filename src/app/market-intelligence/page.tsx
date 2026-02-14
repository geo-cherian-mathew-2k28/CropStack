'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
    TrendingUp,
    BarChart3,
    Globe,
    Database,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Layers,
    PieChart,
    CandlestickChart
} from 'lucide-react';

export default function MarketIntelligence() {
    const { profile } = useAuth();
    const { t } = useLanguage();

    const commodities = [
        { name: 'Basmati Rice (Batch A)', price: '4,540', change: '+4.2%', volume: '142k q', trend: 'bulish' },
        { name: 'Red Wheat (Institutional)', price: '2,110', change: '-1.5%', volume: '89k q', trend: 'bearish' },
        { name: 'Sona Masuri', price: '3,850', change: '+0.8%', volume: '56k q', trend: 'stable' },
        { name: 'Black Gram', price: '7,200', change: '+12.4%', volume: '12k q', trend: 'bulish' },
        { name: 'Yellow Maize', price: '1,885', change: '-2.1%', volume: '204k q', trend: 'bearish' }
    ];

    return (
        <DashboardLayout role={profile?.role as any || 'buyer'}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Market Intelligence Hub</h1>
                <p style={{ color: 'var(--text-muted)' }}>Real-time institutional pricing telemetry and regional supply-demand analytics.</p>
            </div>

            {/* Price Tickers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
                {[
                    { label: 'Network Supply Index', val: '84.2', change: '+1.2%', icon: Layers },
                    { label: 'Storage Utilization', val: '72.4%', change: '+0.5%', icon: Database },
                    { label: 'Escrow Liquidity', val: '₹420Cr', change: '+142%', icon: Activity },
                    { label: 'Market Sentiment', val: 'Bullish', change: 'Stable', icon: TrendingUp }
                ].map((stat, i) => (
                    <div key={i} className="card-white" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                            <div style={{ padding: '0.5rem', background: 'var(--primary-soft)', borderRadius: '8px' }}>
                                <stat.icon size={18} color="var(--primary)" />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase' }}>{stat.label}</span>
                        </div>
                        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{stat.val}</h2>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>{stat.change} Node Syncing</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                {/* Main Charts area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card-white" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem' }}>Regional Price Analytics (1D-Node)</h3>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-modern btn-secondary-modern" style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.7rem' }}>1D</button>
                                <button className="btn-modern btn-primary-modern" style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.7rem' }}>1W</button>
                                <button className="btn-modern btn-secondary-modern" style={{ height: '32px', padding: '0 0.75rem', fontSize: '0.7rem' }}>1M</button>
                            </div>
                        </div>
                        <div style={{ height: '300px', width: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', gap: '1.5rem', paddingBottom: '2rem', borderBottom: '1px solid var(--border-soft)' }}>
                            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                                {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: '100%', height: '1px', background: 'var(--border-soft)' }}></div>)}
                            </div>
                            {[60, 45, 80, 55, 90, 70, 85].map((h, i) => (
                                <div key={i} style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                                    <div className="shimmer" style={{ height: `${h}%`, background: 'var(--primary)', borderRadius: '6px 6px 0 0', opacity: 0.8 }}></div>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-soft)', fontSize: '0.75rem', fontWeight: 800 }}>
                            <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
                        </div>
                    </div>

                    <div className="card-white" style={{ padding: '0' }}>
                        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-soft)' }}>
                            <h3 style={{ fontSize: '1.1rem' }}>Active Market Peers</h3>
                        </div>
                        <table className="table-modern">
                            <thead>
                                <tr>
                                    <th>Asset Node</th>
                                    <th>Price/q</th>
                                    <th>Node Change</th>
                                    <th>Volume Flow</th>
                                </tr>
                            </thead>
                            <tbody>
                                {commodities.map((c, i) => (
                                    <tr key={i}>
                                        <td style={{ fontWeight: 700 }}>{c.name}</td>
                                        <td style={{ fontWeight: 800 }}>{t('currency_symbol')}{c.price}</td>
                                        <td style={{ color: c.trend === 'bulish' ? 'var(--success)' : 'var(--error)', fontWeight: 800 }}>
                                            {c.change}
                                        </td>
                                        <td style={{ color: 'var(--text-soft)', fontSize: '0.8rem', fontWeight: 600 }}>{c.volume}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sidebar area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card-white" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Cluster Supply Health</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {[
                                { Hub: 'North-WH Cluster', val: 88, color: 'var(--primary)' },
                                { Hub: 'West-Silo Cluster', val: 42, color: 'var(--warning)' },
                                { Hub: 'South-Storage Grid', val: 65, color: 'var(--primary)' },
                                { Hub: 'East-Node Hub', val: 24, color: 'var(--error)' }
                            ].map((h, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                        <span style={{ fontWeight: 700 }}>{h.Hub}</span>
                                        <span style={{ fontWeight: 800 }}>{h.val}%</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${h.val}%`, background: h.color }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-white" style={{ padding: '2rem', background: 'var(--secondary)', color: 'white' }}>
                        <h3 style={{ color: 'white', marginBottom: '1rem' }}>AI Insight Node</h3>
                        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '2rem' }}>
                            Institutional demand signal detected for "Black Gram" across South hubs. Recommendation: Increase storage allocation for Q3.
                        </p>
                        <button className="btn-modern btn-primary-modern" style={{ width: '100%' }}>Download Intelligence Report</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
