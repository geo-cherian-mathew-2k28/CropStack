'use client';

import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useLanguage } from '@/context/LanguageContext';
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    Truck,
    User,
    Package
} from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ManagerQueuePage() {
    const { t } = useLanguage();
    const [queue, setQueue] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchQueue = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/orders`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            // In a real app, this would be a specific queue endpoint
            // For now we show orders that need management
            setQueue(data.orders || []);
            setError(false);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 10000);
        return () => clearInterval(interval);
    }, [fetchQueue]);

    const handleAction = async (orderId: string, action: 'approve' | 'reject') => {
        // Logic to update order status
        console.log(`Order ${orderId} ${action}ed`);
    };

    if (loading) return <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader2 className="animate-spin" /></div>;

    return (
        <DashboardLayout role="manager">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>Hub <span style={{ color: 'var(--primary)' }}>Queue.</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Manage incoming pickups, storage requests, and logistics.</p>
            </div>

            <div className="card-white" style={{ padding: '2.5rem' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-soft)' }}>
                                <th style={{ textAlign: 'left', paddingBottom: '1.5rem', color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900 }}>Arrival / Time</th>
                                <th style={{ textAlign: 'left', paddingBottom: '1.5rem', color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900 }}>Entity</th>
                                <th style={{ textAlign: 'left', paddingBottom: '1.5rem', color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900 }}>Details</th>
                                <th style={{ textAlign: 'left', paddingBottom: '1.5rem', color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900 }}>Status</th>
                                <th style={{ textAlign: 'right', paddingBottom: '1.5rem', color: 'var(--text-soft)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 900 }}>Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queue.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-soft)' }}>
                                        <Truck size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                                        <p>No active entities in queue.</p>
                                    </td>
                                </tr>
                            ) : (
                                queue.map((item: any, idx: number) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                                        <td style={{ padding: '1.5rem 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Clock size={18} color="var(--primary)" />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: 800 }}>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                    <p style={{ fontSize: '0.7rem', color: 'var(--text-soft)', fontWeight: 600 }}>T-MINUS 12m</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <User size={16} color="var(--text-soft)" />
                                                <p style={{ fontWeight: 800 }}>{item.buyer_name || 'Logistic Partner'}</p>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <Package size={16} color="var(--text-soft)" />
                                                <p style={{ fontWeight: 700 }}>{item.product_name} ({item.quantity} qtl)</p>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.5rem 0' }}>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 900,
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '100px',
                                                background: item.status === 'reserved' ? 'var(--warning-soft)' : 'var(--success-soft)',
                                                color: item.status === 'reserved' ? 'var(--warning)' : 'var(--success)',
                                                textTransform: 'uppercase'
                                            }}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem 0', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleAction(item.id, 'approve')} className="action-btn" style={{ padding: '0.5rem' }}>
                                                    <CheckCircle2 size={18} color="var(--success)" />
                                                </button>
                                                <button onClick={() => handleAction(item.id, 'reject')} className="action-btn" style={{ padding: '0.5rem' }}>
                                                    <XCircle size={18} color="var(--error)" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
