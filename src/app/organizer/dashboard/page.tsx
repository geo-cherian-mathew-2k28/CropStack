'use client';

import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Order, Product, Profile } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Truck, ClipboardList, AlertCircle, CheckCircle2, Search, Loader2, QrCode, ArrowRight, ShieldCheck, Warehouse } from 'lucide-react';
import { addHours } from 'date-fns';

type OrderWithDetails = Order & {
    products: Product;
    profiles: Profile
};

export default function OrganizerDashboard() {
    const { t } = useLanguage();
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirming, setConfirming] = useState<string | null>(null);
    const isMounted = useRef(true);

    const fetchOrders = async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*, products(*), profiles:buyer_id(*)')
                .eq('status', 'reserved')
                .order('created_at', { ascending: false });

            if (!isMounted.current) return;

            if (!error && data) {
                setOrders(data as OrderWithDetails[]);
            }
        } catch (err) {
            console.error("Order fetch failure:", err);
        } finally {
            if (isMounted.current) setLoading(false);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchOrders();

        const channel = supabase
            .channel('organizer_orders')
            .on('postgres_changes' as any, { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => {
            isMounted.current = false;
            supabase.removeChannel(channel);
        };
    }, []);

    const handleConfirmPickup = async (order: OrderWithDetails) => {
        if (confirming) return;
        setConfirming(order.id);

        try {
            const { error: orderError } = await supabase
                .from('orders')
                .update({ status: 'completed' })
                .eq('id', order.id);

            if (orderError) {
                alert(orderError.message);
                return;
            }

            const available_at = addHours(new Date(), 24).toISOString();
            await supabase
                .from('transactions')
                .insert({
                    order_id: order.id,
                    seller_id: order.products.seller_id,
                    amount: order.total_price,
                    status: 'held',
                    available_at
                });

            await fetchOrders();
        } catch (err) {
            console.error("Finalization protocol error:", err);
        } finally {
            if (isMounted.current) setConfirming(null);
        }
    };

    const filteredOrders = orders.filter(o =>
        o.pickup_code?.toUpperCase().includes(searchTerm.toUpperCase()) ||
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="organizer">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 900, letterSpacing: '-0.05em' }}>Regional Hub <span style={{ color: 'var(--primary)' }}>Manager.</span></h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>Operational visibility for storage node cluster.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card-white" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Queue</span>
                        <div style={{ width: '40px', height: '40px', background: 'var(--primary-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <ClipboardList size={20} color="var(--primary)" />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{orders.length}</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Lots pending clearance</p>
                </div>

                <div className="card-white" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Gate Traffic</span>
                        <div style={{ width: '40px', height: '40px', background: 'var(--success-soft)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Truck size={20} color="var(--success)" />
                        </div>
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{orders.filter(o => o.status === 'reserved').length}</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Scheduled dispatch</p>
                </div>

                <div className="card-white" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px' }}>Hub Security</span>
                        <ShieldCheck size={24} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>99.8%</h2>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Node Health Index</p>
                </div>

                <div className="card-white glass-dark" style={{ padding: '2rem', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px' }}>Flow Volume</span>
                        <Warehouse size={20} color="var(--primary)" />
                    </div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{t('currency_symbol')}0</h2>
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

                {loading ? (
                    <div className="shimmer" style={{ height: '400px', borderRadius: '20px' }}></div>
                ) : filteredOrders.length === 0 ? (
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
                                    <tr key={order.id} className="hover-soft" style={{ background: 'white', borderRadius: '14px' }}>
                                        <td style={{ padding: '1.5rem 1rem' }}>
                                            <span style={{ fontWeight: 900, color: 'var(--primary)', letterSpacing: '2px', background: 'var(--primary-soft)', padding: '0.625rem 1rem', borderRadius: '10px', fontSize: '1rem', border: '1px solid rgba(5, 150, 105, 0.1)' }}>
                                                {order.pickup_code}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.5rem 1rem' }}>
                                            <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--secondary)' }}>{order.profiles?.full_name || 'Anonymous Node'}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-soft)', fontWeight: 800, textTransform: 'uppercase' }}>Verified Network ID</p>
                                        </td>
                                        <td style={{ padding: '1.5rem 1rem' }}>
                                            <p style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--secondary)' }}>{order.products?.name}</p>
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
                                                {confirming === order.id ? <Loader2 className="animate-spin" size={18} /> : <>Verify Release <ArrowRight size={16} /></>}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
