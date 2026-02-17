'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/context/LanguageContext';
import {
    Users,
    Database,
    Settings2,
    Power,
    Activity,
    Loader2,
    Thermometer,
    Droplets,
    Wind,
    CheckCircle2,
    XCircle
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManagerDashboard() {
    const { t } = useLanguage();
    const [adminData, setAdminData] = useState<any>(null);
    const [sensors, setSensors] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [manualMode, setManualMode] = useState(false);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [adminRes, sensorRes] = await Promise.allSettled([
                fetch(`${API_BASE}/admin/data`),
                fetch(`${API_BASE}/sensors`),
            ]);

            if (adminRes.status === 'fulfilled' && adminRes.value.ok) {
                const aData = await adminRes.value.json();
                setAdminData(aData);
            }

            if (sensorRes.status === 'fulfilled' && sensorRes.value.ok) {
                const sData = await sensorRes.value.json();
                setSensors(sData.sensors);
                setManualMode(sData.sensors.manual_mode);
            }

            if (adminRes.status === 'rejected' || (adminRes.status === 'fulfilled' && !adminRes.value.ok)) {
                setError(true);
            } else {
                setError(false);
            }

        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleMode = async () => {
        const nextMode = !manualMode;
        setManualMode(nextMode);
        try {
            await fetch(`${API_BASE}/control`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ manual_mode: nextMode })
            });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [fetchData]);

    if (loading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>;

    if (error && !adminData) return (
        <DashboardLayout role="manager">
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Connection Lost</h2>
                <p>Unable to reach management API at {API_BASE}</p>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout role="manager">
            <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>Hub <span style={{ color: 'var(--primary)' }}>Control.</span></h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Live monitoring & asset management for your local facility.</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div onClick={toggleMode} style={{
                        padding: '0.75rem 1.5rem',
                        background: manualMode ? 'var(--warning-soft)' : 'var(--primary-soft)',
                        border: '1px solid currentColor',
                        color: manualMode ? 'var(--warning)' : 'var(--primary)',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        fontWeight: 800,
                        fontSize: '0.85rem'
                    }}>
                        <Settings2 size={18} />
                        {manualMode ? 'MANUAL OVERRIDE' : 'AUTO-PILOT ACTIVE'}
                    </div>
                </div>
            </div>

            {/* IoT Metrics Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card-white" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <Thermometer size={24} color="var(--primary)" />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-soft)' }}>TEMP</span>
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900 }}>{sensors?.temperature?.toFixed(1) || '--'}°C</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>OPTIMAL RANGE</p>
                </div>

                <div className="card-white" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <Droplets size={24} color="var(--primary)" />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-soft)' }}>HUMIDITY</span>
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900 }}>{sensors?.humidity?.toFixed(1) || '--'}%</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>WELL VENTILATED</p>
                </div>

                <div className="card-white" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <Wind size={24} color={sensors?.fan_status === 'ON' ? 'var(--primary)' : 'var(--text-soft)'} />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'var(--text-soft)' }}>COOLING</span>
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900 }}>{sensors?.fan_status || '--'}</h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-soft)' }}>DEVICE 01</p>
                </div>

                <div className="card-white glass-dark" style={{ padding: '2rem', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <Activity size={24} color="var(--primary)" />
                        <span style={{ fontSize: '0.7rem', fontWeight: 900, color: 'rgba(255,255,255,0.5)' }}>POWER</span>
                    </div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 900 }}>342 <span style={{ fontSize: '1rem' }}>kWh</span></h2>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.6 }}>Daily Yield</p>
                </div>
            </div>

            {/* Farmer Inventory Directory */}
            <div className="card-white" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Farmer Assets</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Global inventory and credit management for the zone.</p>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-soft)' }}>
                                <th style={{ textAlign: 'left', paddingBottom: '1.5rem', color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900 }}>Farmer Details</th>
                                <th style={{ textAlign: 'left', paddingBottom: '1.5rem', color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900 }}>Crop & Location</th>
                                <th style={{ textAlign: 'left', paddingBottom: '1.5rem', color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900 }}>Stored Quantity</th>
                                <th style={{ textAlign: 'left', paddingBottom: '1.5rem', color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900 }}>Credit Status</th>
                                <th style={{ textAlign: 'right', paddingBottom: '1.5rem', color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {adminData?.farmers?.map((farmer: any, idx: number) => (
                                <tr key={idx} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                                    <td style={{ padding: '1.5rem 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'var(--primary)' }}>{farmer.name.charAt(0)}</div>
                                            <div>
                                                <p style={{ fontWeight: 800, color: 'var(--secondary)' }}>{farmer.name}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>ID: CS-{100 + idx}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 0' }}>
                                        <p style={{ fontWeight: 800, fontSize: '0.9rem' }}>{farmer.crop}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>{farmer.hub} • {farmer.stored_at}</p>
                                    </td>
                                    <td style={{ padding: '1.5rem 0' }}>
                                        <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>{farmer.quantity} <span style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>QTL</span></p>
                                    </td>
                                    <td style={{ padding: '1.5rem 0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: farmer.loan_status === 'approved' ? 'var(--success)' : 'var(--warning)' }}></div>
                                            <span style={{ fontWeight: 800, fontSize: '0.8rem', color: farmer.loan_status === 'approved' ? 'var(--success)' : 'var(--warning)', textTransform: 'uppercase' }}>{farmer.loan_status}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1.5rem 0', textAlign: 'right' }}>
                                        <button className="btn-modern btn-primary-modern" style={{ height: '36px', padding: '0 1rem', fontSize: '0.75rem' }}>Approve Loan</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
