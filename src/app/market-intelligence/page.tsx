'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
    TrendingUp,
    Database,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Layers,
    Loader2
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

type CommodityItem = {
    name: string;
    price: number;
    change: number;
    volume: string;
    trend: string;
    category?: string;
};

type NetworkStats = {
    supply_index: number;
    storage_utilization: number;
    escrow_liquidity: number;
    market_sentiment: string;
};

type ClusterItem = {
    name: string;
    value: number;
    color: string;
};

export default function MarketIntelligence() {
    const { profile } = useAuth();
    const { t } = useLanguage();
    const [commodities, setCommodities] = useState<CommodityItem[]>([]);
    const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
    const [clusterHealth, setClusterHealth] = useState<ClusterItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/market`);
            if (!res.ok) throw new Error('API error');
            const data = await res.json();

            setCommodities(data.commodities || []);
            setNetworkStats(data.network_stats || null);
            setClusterHealth(data.cluster_health || []);
            setError(false);
        } catch (err) {
            console.error('Failed to fetch market data:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const statCards = networkStats ? [
        { label: 'Network Supply Index', val: String(networkStats.supply_index), change: '+1.2%', icon: Layers },
        { label: 'Storage Utilization', val: `${networkStats.storage_utilization}%`, change: '+0.5%', icon: Database },
        { label: 'Escrow Liquidity', val: `₹${networkStats.escrow_liquidity}Cr`, change: '+142%', icon: Activity },
        { label: 'Market Sentiment', val: networkStats.market_sentiment, change: 'Stable', icon: TrendingUp }
    ] : [];

    return (
        <DashboardLayout role={profile?.role as 'buyer' | 'seller' | 'organizer' || 'buyer'}>
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Market Intelligence Hub</h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    {error ? '⚠️ Sensor API offline — showing cached data' : 'Real-time institutional pricing telemetry and regional supply-demand analytics.'}
                </p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
            ) : (
                <>
                    {/* Price Tickers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '3rem' }}>
                        {statCards.map((stat, i) => (
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
                                    {commodities.slice(0, 7).map((c, i) => {
                                        const maxPrice = Math.max(...commodities.map(x => x.price));
                                        const h = maxPrice > 0 ? (c.price / maxPrice) * 90 : 50;
                                        return (
                                            <div key={i} style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                                                <div style={{ height: `${h}%`, background: 'var(--primary)', borderRadius: '6px 6px 0 0', opacity: 0.8, transition: 'height 0.5s ease' }}></div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-soft)', fontSize: '0.75rem', fontWeight: 800 }}>
                                    {commodities.slice(0, 7).map((c, i) => (
                                        <span key={i}>{c.name.split(' ')[0].substring(0, 5).toUpperCase()}</span>
                                    ))}
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
                                                <td style={{ fontWeight: 800 }}>{t('currency_symbol')}{c.price.toLocaleString()}</td>
                                                <td style={{ color: c.change >= 0 ? 'var(--success)' : 'var(--error)', fontWeight: 800 }}>
                                                    {c.change >= 0 ? '+' : ''}{c.change}%
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
                                    {clusterHealth.map((h, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                                <span style={{ fontWeight: 700 }}>{h.name}</span>
                                                <span style={{ fontWeight: 800 }}>{h.value}%</span>
                                            </div>
                                            <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '10px', overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${h.value}%`, background: h.color, transition: 'width 0.5s ease' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="card-white" style={{ padding: '2rem', background: 'var(--secondary)', color: 'white' }}>
                                <h3 style={{ color: 'white', marginBottom: '1rem' }}>AI Insight Node</h3>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '2rem' }}>
                                    Institutional demand signal detected for &quot;Black Gram&quot; across South hubs. Recommendation: Increase storage allocation for Q3.
                                </p>
                                <button className="btn-modern btn-primary-modern" style={{ width: '100%' }}>Download Intelligence Report</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
