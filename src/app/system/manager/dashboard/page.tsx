'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/context/LanguageContext';
import { Truck, ClipboardList, Search, Loader2, QrCode, ArrowRight, ShieldCheck, Warehouse, Thermometer, Droplets, Sprout, Wind, Activity } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

type OrderItem = {
    id: string;
    pickup_code: string;
    buyer_name: string;
    product_name: string;
    quantity: number;
    total_price: number;
    product_id: string;
    status: string;
    created_at: string;
};

type ManagerStats = {
    active_queue: number;
    gate_traffic: number;
    hub_security: number;
    flow_volume: number;
};

type SensorData = {
    temperature: number;
    humidity: number;
    fan_status?: string;
    last_pulse?: string;
    soil_moisture: number;
    light_intensity: number;
    ph_level: number;
    wind_speed: number;
    rainfall: number;
    co2_level: number;
    pressure: number;
    uv_index: number;
};



export default function ManagerDashboard() {
    const { t } = useLanguage();
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [stats, setStats] = useState<ManagerStats | null>(null);
    const [sensors, setSensors] = useState<SensorData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirming, setConfirming] = useState<string | null>(null);
    const [error, setError] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [orgRes, sensorRes] = await Promise.all([
                fetch(`${API_BASE}/stats/organizer`),
                fetch(`${API_BASE}/sensors`),
            ]);

            if (!orgRes.ok || !sensorRes.ok) throw new Error('API error');

            const orgData = await orgRes.json();
            const sensorData = await sensorRes.json();

            setStats(orgData.stats);
            setOrders(orgData.orders || []);
            setSensors(sensorData.sensors);
            setError(false);
        } catch (err) {
            console.error('Failed to fetch data:', err);
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

    const handleConfirmPickup = async (order: OrderItem) => {
        if (confirming) return;
        setConfirming(order.id);

        try {
            const res = await fetch(`${API_BASE}/orders/${order.id}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) throw new Error('Failed to complete order');
            await fetchData();
        } catch (err) {
            console.error('Finalization protocol error:', err);
            alert('Failed to complete order. Please try again.');
        } finally {
            setConfirming(null);
        }
    };

    const filteredOrders = orders.filter(o =>
        o.status === 'reserved' && (
            o.pickup_code?.toUpperCase().includes(searchTerm.toUpperCase()) ||
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.buyer_name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <DashboardLayout role="manager">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.05em' }}>Regional Hub <span style={{ color: 'var(--primary)' }}>Manager.</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
                    {error ? '⚠️ Sensor API offline — showing cached data' : 'Operational visibility for storage node cluster.'}
                </p>
            </div>

            {/* Sensor Strip */}
            {sensors && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    {[
                        { label: 'Temperature', value: `${sensors.temperature.toFixed(1)}°C`, icon: Thermometer, color: sensors.temperature > 30 ? 'var(--error)' : 'var(--primary)' },
                        { label: 'Humidity', value: `${sensors.humidity.toFixed(1)}%`, icon: Droplets, color: sensors.humidity > 70 ? 'var(--error)' : 'var(--primary)' },
                        { label: 'Fan Control', value: sensors.fan_status || 'OFF', icon: Wind, color: sensors.fan_status === 'ON' ? 'var(--success)' : 'var(--text-soft)' },
                        { label: 'Last Pulse', value: sensors.last_pulse || 'Never', icon: Activity, color: sensors.last_pulse && sensors.last_pulse !== 'Never' ? 'var(--primary)' : 'var(--text-soft)' },
                    ].map((s, i) => (
                        <div key={i} style={{ padding: '0.875rem 1rem', background: '#f8fafc', border: '1px solid var(--border-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <s.icon size={18} color={s.color} />
                            <div>
                                <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-soft)', textTransform: 'uppercase' }}>{s.label}</p>
                                <p style={{ fontSize: s.label === 'Last Pulse' ? '0.75rem' : '1rem', fontWeight: 800, color: s.label === 'Fan Control' && s.value === 'ON' ? 'var(--success)' : 'var(--secondary)' }}>{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}



            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <Loader2 size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Queue</span>
                                <div style={{ width: '40px', height: '40px', background: 'var(--primary-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ClipboardList size={20} color="var(--primary)" />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.active_queue || filteredOrders.length}</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Lots pending clearance</p>
                        </div>

                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Gate Traffic</span>
                                <div style={{ width: '40px', height: '40px', background: 'var(--success-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Truck size={20} color="var(--success)" />
                                </div>
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.gate_traffic || 0}</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Scheduled dispatch</p>
                        </div>

                        <div className="card-white" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Hub Security</span>
                                <ShieldCheck size={24} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{stats?.hub_security || 0}%</h2>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Node Health Index</p>
                        </div>

                        <div className="card-white glass-dark" style={{ padding: '2rem', color: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Flow Volume</span>
                                <Warehouse size={20} color="var(--primary)" />
                            </div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{t('currency_symbol')}{(stats?.flow_volume || 0).toLocaleString()}</h2>
                            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Settlement velocity</p>
                        </div>
                    </div>

                    <div className="card-white" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Clearance Terminal</h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Scan and verify Pickup PINs for outbound release.</p>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ position: 'relative', width: '320px' }}>
                                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                                    <input
                                        type="text"
                                        className="input-modern"
                                        placeholder="Filter by PIN or Buyer..."
                                        style={{ paddingLeft: '2.75rem', height: '48px', fontSize: '0.9rem' }}
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <button className="btn-modern btn-primary-modern" style={{ height: '48px', padding: '0 1.5rem' }}>
                                    <QrCode size={18} /> Launch Scanner
                                </button>
                            </div>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '6rem', background: 'var(--bg-main)', borderRadius: '24px', border: '1px dashed var(--border)' }}>
                                <Warehouse size={48} color="#94a3b8" style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)' }}>Hub Synchronized</h4>
                                <p style={{ color: 'var(--text-soft)', fontSize: '0.95rem', fontWeight: 500, marginTop: '0.5rem' }}>No active pre-order lots currently scheduled for release.</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
                                    <thead>
                                        <tr style={{ color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 800 }}>Validation PIN</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 800 }}>Counterparty</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 800 }}>Storage Lot</th>
                                            <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 800 }}>Audit Val</th>
                                            <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 800 }}>Protocol</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map((order) => (
                                            <tr key={order.id} style={{ background: 'white', borderRadius: '14px' }}>
                                                <td style={{ padding: '1.5rem 1rem' }}>
                                                    <span style={{ fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px', background: 'var(--primary-soft)', padding: '0.625rem 1rem', borderRadius: '10px', fontSize: '1rem', border: '1px solid rgba(5, 150, 105, 0.1)' }}>
                                                        {order.pickup_code}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '1.5rem 1rem' }}>
                                                    <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--secondary)' }}>{order.buyer_name || 'Anonymous Node'}</p>
                                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-soft)', fontWeight: 800, textTransform: 'uppercase' }}>Verified Network ID</p>
                                                </td>
                                                <td style={{ padding: '1.5rem 1rem' }}>
                                                    <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--secondary)' }}>{order.product_name}</p>
                                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{order.quantity} {t('unit_q')} (Slot {order.product_id.slice(0, 4).toUpperCase()})</p>
                                                </td>
                                                <td style={{ padding: '1.5rem 1rem' }}>
                                                    <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--secondary)' }}>{t('currency_symbol')}{order.total_price.toFixed(2)}</span>
                                                </td>
                                                <td style={{ padding: '1.5rem 1rem', textAlign: 'right' }}>
                                                    <button
                                                        onClick={() => handleConfirmPickup(order)}
                                                        className="btn-modern btn-primary-modern"
                                                        style={{ height: '42px', padding: '0 1.25rem', borderRadius: '12px' }}
                                                        disabled={!!confirming}
                                                    >
                                                        {confirming === order.id ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <>Verify Release <ArrowRight size={16} /></>}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
