'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
    Wallet,
    TrendingUp,
    Database,
    Loader2,
    Thermometer,
    Activity,
    Power,
    ShieldCheck,
    BarChart3
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function SellerDashboard() {
    const { t } = useLanguage();
    const [farmerData, setFarmerData] = useState<any>(null);
    const [sensors, setSensors] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [autoSell, setAutoSell] = useState({ enabled: false, threshold: 0 });

    const fetchData = useCallback(async () => {
        try {
            const [farmerRes, sensorRes] = await Promise.all([
                fetch(`${API_BASE}/farmer/farmer-101`),
                fetch(`${API_BASE}/sensors`),
            ]);

            if (!farmerRes.ok || !sensorRes.ok) throw new Error('API error');
            const fData = await farmerRes.json();
            const sData = await sensorRes.json();

            setFarmerData(fData);
            setSensors(sData.sensors);
            setAutoSell({
                enabled: fData.inventory.auto_sell_enabled,
                threshold: fData.inventory.auto_sell_threshold
            });
            setError(false);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleAutoSell = async () => {
        const nextState = !autoSell.enabled;
        setAutoSell(prev => ({ ...prev, enabled: nextState }));
        await fetch(`${API_BASE}/farmer/farmer-101/auto-sell`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled: nextState, threshold: autoSell.threshold })
        });
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [fetchData]);

    if (loading) return (
        <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 className="animate-spin" size={40} color="var(--primary)" />
        </div>
    );

    if (!farmerData) return <div>Failed to load data.</div>;

    const { inventory, loan_eligibility, market_price, profit_projection } = farmerData;

    return (
        <DashboardLayout role="seller">
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--primary)', background: 'var(--primary-soft)', padding: '0.25rem 0.75rem', borderRadius: '100px' }}>SELLER CENTER</span>
                        <div style={{ width: '6px', height: '6px', background: 'var(--success)', borderRadius: '50%' }}></div>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>Farmer <span style={{ color: 'var(--primary)' }}>Folio.</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
                        Managing inventory at <strong>{inventory.hub}</strong>
                    </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', marginBottom: '0.5rem' }}>WAREHOUSE NODE</p>
                    <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '0.5rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Database size={16} color="var(--secondary)" />
                        <span style={{ fontWeight: 800 }}>{inventory.stored_at}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <div className="card-white" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase' }}>Stored Volume</p>
                        <BarChart3 size={18} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900 }}>{inventory.quantity} <span style={{ fontSize: '1rem', color: 'var(--text-soft)' }}>qtl</span></h2>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '0.5rem' }}>{inventory.crop}</p>
                </div>

                <div className="card-white" style={{ padding: '2rem' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '1rem' }}>Market Price</p>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900 }}>₹{market_price.toLocaleString()}</h2>
                    <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--success)', marginTop: '0.5rem' }}>Value: ₹{loan_eligibility.total_value.toLocaleString()}</p>
                </div>

                <div className="card-white" style={{ padding: '2rem', border: loan_eligibility.eligible ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '1rem' }}>Loan Access</p>
                    {inventory.loan_status !== 'none' ? (
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--primary)' }}>ACTIVE LOAN</h2>
                    ) : (
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: loan_eligibility.eligible ? 'var(--primary)' : 'var(--text-soft)' }}>
                            {loan_eligibility.eligible ? `₹50k+` : 'NOT ELIGIBLE'}
                        </h2>
                    )}
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)', marginTop: '0.5rem' }}>
                        {loan_eligibility.eligible ? 'Eligible for instant credit' : 'Requires value > ₹80,000'}
                    </p>
                </div>

                <div className="card-white glass-dark" style={{ padding: '2rem', color: 'white' }}>
                    <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '1rem' }}>Profit Gain</p>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--primary)' }}>+₹{profit_projection.toLocaleString()}</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6 }}>Locked-in earnings</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem' }}>
                <div className="card-white" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Automation: Smart Sell</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Auto-sell trigger when market hits your target.</p>
                        </div>
                        <div onClick={toggleAutoSell} style={{ width: '64px', height: '34px', background: autoSell.enabled ? 'var(--primary)' : '#e2e8f0', borderRadius: '100px', cursor: 'pointer', position: 'relative', transition: 'all 0.3s' }}>
                            <div style={{ width: '26px', height: '26px', background: 'white', borderRadius: '50%', position: 'absolute', top: '4px', left: autoSell.enabled ? '34px' : '4px', transition: 'all 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '1rem' }}>Selling Threshold (₹)</label>
                            <input
                                type="number"
                                className="input-modern"
                                value={autoSell.threshold}
                                onChange={(e) => setAutoSell(prev => ({ ...prev, threshold: parseInt(e.target.value) }))}
                                style={{ fontSize: '1.75rem', fontWeight: 900, height: '64px' }}
                            />
                        </div>
                        <div style={{ flex: 1, padding: '2rem', background: 'var(--bg-main)', borderRadius: '20px', border: '2px dashed var(--border)' }}>
                            <p style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Execution Mode:</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Power size={18} color={autoSell.enabled ? 'var(--primary)' : 'var(--text-soft)'} />
                                <span style={{ fontWeight: 900, color: autoSell.enabled ? 'var(--primary)' : 'var(--text-soft)' }}>{autoSell.enabled ? 'LIVE MONITORING' : 'OFFLINE'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card-white" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>Device Feed</h3>
                        <ShieldCheck size={20} color="var(--primary)" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <Thermometer size={20} color="var(--primary)" />
                                <div>
                                    <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-soft)' }}>TEMP</p>
                                    <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>{sensors?.temperature.toFixed(1)}°C</p>
                                </div>
                            </div>
                            <div style={{ width: '40px', height: '4px', background: 'var(--border)', borderRadius: '10px' }}>
                                <div style={{ height: '100%', width: '65%', background: 'var(--primary)', borderRadius: '10px' }}></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1, padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '16px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-soft)', marginBottom: '0.25rem' }}>STATUS</p>
                                <p style={{ fontWeight: 900, color: 'var(--primary)' }}>OPTIMAL</p>
                            </div>
                            <div style={{ flex: 1, padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '16px', textAlign: 'center' }}>
                                <p style={{ fontSize: '0.6rem', fontWeight: 800, color: 'var(--text-soft)', marginBottom: '0.25rem' }}>SYNC</p>
                                <p style={{ fontWeight: 900 }}>{sensors?.last_pulse || 'LIVE'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
