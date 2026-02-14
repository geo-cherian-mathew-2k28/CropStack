'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ShoppingBag, Calendar, History, TrendingUp, ArrowUpRight, ArrowDownRight, Info, ChevronRight, LayoutGrid } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function BuyerDashboard() {
    const { t } = useLanguage();

    return (
        <DashboardLayout role="buyer">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', color: 'var(--secondary)', letterSpacing: '-0.03em' }}>{t('welcome')}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Node-Sync Activity: All regional clusters synchronized.</p>
            </div>

            {/* Modern Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {[
                    { key: 'active_orders', val: '14', icon: ShoppingBag, color: 'var(--primary)' },
                    { key: 'reservations', val: '08', icon: Calendar, color: 'var(--warning)' },
                    { key: 'completed', val: '102', unit: 'q', icon: LayoutGrid, color: 'var(--success)' },
                    { key: 'savings', val: '4,200', prefix: true, icon: TrendingUp, color: 'var(--secondary)' }
                ].map((stat, i) => (
                    <div key={i} className="card-white" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {t('stats.' + stat.key)}
                            </span>
                            <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-soft)' }}>
                                <stat.icon size={18} color={stat.color} />
                            </div>
                        </div>
                        <h2 style={{ fontSize: '1.875rem', color: 'var(--secondary)', marginBottom: '0.25rem', fontWeight: 900 }}>
                            {stat.prefix && t('currency_symbol')}{stat.val}{stat.unit && ` ${t('unit_q')}`}
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700 }}>
                            <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center' }}><ArrowUpRight size={14} /> +12.4%</span>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                {/* Activity Card */}
                <div className="card-white" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{t('recent_activity')}</h3>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Inventory movement analytics</p>
                        </div>
                        <Link href="/buyer/orders" className="btn-modern btn-secondary-modern" style={{ padding: '0.5rem 1rem', height: 'auto', fontSize: '0.8rem' }}>
                            {t('view_all')} <ChevronRight size={14} />
                        </Link>
                    </div>

                    <div style={{ height: '240px', display: 'flex', alignItems: 'flex-end', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-soft)' }}>
                        {[40, 70, 45, 90, 65, 80, 55, 75, 50, 85, 60, 95].map((h, i) => (
                            <div key={i} style={{ flex: 1, position: 'relative' }}>
                                <div
                                    className="shimmer"
                                    style={{
                                        height: `${h}%`,
                                        background: i === 9 ? 'var(--primary)' : 'var(--border-soft)',
                                        borderRadius: '6px 6px 0 0',
                                        transition: 'all 0.3s ease'
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-soft)', fontSize: '0.7rem', fontWeight: 800 }}>
                        <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span>SEP</span><span>NOV</span>
                    </div>
                </div>

                {/* Market Trends Card */}
                <div className="card-white" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>{t('market_trends')}</h3>
                        <Info size={16} color="var(--text-soft)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                            { label: 'Basmati Rice', price: '45.40', trend: '+4.2%', up: true },
                            { label: 'Wheat (Grade A)', price: '21.10', trend: '-1.5%', up: false },
                            { label: 'Maize (Bulk)', price: '18.85', trend: '+12.4%', up: true },
                            { label: 'Soybeans', price: '32.22', trend: '+0.8%', up: true },
                            { label: 'Pulses (Mix)', price: '65.35', trend: '-2.1%', up: false },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#fcfcfc', border: '1px solid var(--border-soft)', borderRadius: '12px' }}>
                                <div>
                                    <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--secondary)' }}>{item.label}</p>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('currency_symbol')}{item.price} / {t('unit_q')}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: 800, color: item.up ? 'var(--success)' : 'var(--error)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.125rem' }}>
                                        {item.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {item.trend}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link href="/market-intelligence" className="btn-modern btn-primary-modern" style={{ width: '100%', marginTop: '1.75rem', height: '52px' }}>
                        Market Intelligence Hub
                    </Link>
                </div>
            </div>
        </DashboardLayout>
    );
}
