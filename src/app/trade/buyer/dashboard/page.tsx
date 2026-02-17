'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/context/LanguageContext';
import { ShoppingBag, TrendingUp, Package, Clock, Loader2, ArrowRight, DollarSign, Wallet } from 'lucide-react';
import Link from 'next/link';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function BuyerDashboard() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [market, setMarket] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            // Using Promise.allSettled to avoid full crash if one fails
            const [statsRes, marketRes, ordersRes] = await Promise.allSettled([
                fetch(`${API_BASE}/stats/buyer`),
                fetch(`${API_BASE}/market`),
                fetch(`${API_BASE}/orders`)
            ]);

            if (statsRes.status === 'fulfilled' && statsRes.value.ok) {
                const sData = await statsRes.value.json();
                setStats(sData.stats);
            }

            if (marketRes.status === 'fulfilled' && marketRes.value.ok) {
                const mData = await marketRes.value.json();
                setMarket(mData.commodities || []);
            }

            if (ordersRes.status === 'fulfilled' && ordersRes.value.ok) {
                const oData = await ordersRes.value.json();
                // Limit to recent orders for dashboard
                setOrders((oData.orders || []).slice(0, 5));
            }

            setError(false);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, [fetchData]);

    return (
        <DashboardLayout role="buyer">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.05em' }}>Buyer <span style={{ color: 'var(--primary)' }}>Console.</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
                    {error ? '⚠️ Data sync offline' : 'Real-time market insights and order tracking.'}
                </p>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                    <Loader2 className="animate-spin" size={32} color="var(--primary)" />
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Orders</span>
                                <div style={{ width: '40px', height: '40px', background: 'var(--primary-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ShoppingBag size={20} color="var(--primary)" />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.active_orders || 0}</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Items pending delivery</p>
                        </div>

                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Savings</span>
                                <div style={{ width: '40px', height: '40px', background: 'var(--success-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Wallet size={20} color="var(--success)" />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{t('currency_symbol')}{(stats?.savings || 0).toLocaleString()}</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Compared to market avg</p>
                        </div>

                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Completed</span>
                                <Package size={24} color="var(--secondary)" opacity={0.5} />
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.completed || 0}</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Successful transactions</p>
                        </div>

                        <div className="card-white glass-dark" style={{ padding: '2rem', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '1px' }}>Order Growth</span>
                                <TrendingUp size={20} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>+{stats?.order_growth || 0}%</h2>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>This month</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                        {/* Market Overview */}
                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Market Trends</h3>
                                <Link href="/market" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                                    Full Market <ArrowRight size={16} />
                                </Link>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {market.slice(0, 4).map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--card-bg)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                                                {item.category === 'grain' ? '🌾' : item.category === 'fruit' ? '🍎' : '📦'}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 800, fontSize: '0.95rem' }}>{item.name}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Vol: {item.volume}</p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: 800, fontSize: '1rem' }}>{t('currency_symbol')}{item.price}</p>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: item.change > 0 ? 'var(--success)' : 'var(--error)' }}>
                                                {item.change > 0 ? '+' : ''}{item.change}%
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="card-white" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '2rem' }}>Recent Orders</h3>

                            {orders.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-soft)' }}>
                                    <Package size={32} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                                    <p>No active orders</p>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {orders.map((order, idx) => (
                                        <div key={idx} style={{ paddingBottom: '1rem', borderBottom: idx < orders.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.product_name}</span>
                                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>{order.status}</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-soft)' }}>ID: {order.id.substring(0, 8)}</span>
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{t('currency_symbol')}{order.total_price}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <Link href="/trade/buyer/orders" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textDecoration: 'none' }}>
                                View All Orders
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
