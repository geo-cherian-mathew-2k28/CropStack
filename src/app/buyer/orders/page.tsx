'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Order, Product } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
    Clock,
    CheckCircle2,
    ArrowRight,
    Search,
    Filter,
    History,
    Package,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    QrCode
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

type OrderWithProduct = Order & { products: Product };

export default function ActiveStock() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [orders, setOrders] = useState<OrderWithProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            const { data, error } = await supabase
                .from('orders')
                .select('*, products(*)')
                .eq('buyer_id', user.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setOrders(data);
            }
            setLoading(false);
        };

        fetchOrders();
    }, [user]);

    const filteredOrders = orders.filter(o =>
        o.products.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.id.includes(searchTerm)
    );

    return (
        <DashboardLayout role="buyer">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.875rem' }}>{t('orders')}</h1>
                <p style={{ color: 'var(--text-muted)' }}>Track and manage all your orders.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                    <input
                        type="text"
                        className="input-modern"
                        placeholder="Search order number or crop name..."
                        style={{ paddingLeft: '2.75rem', height: '48px' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn-modern btn-secondary-modern" style={{ height: '48px' }}>
                    <Filter size={18} /> Filters
                </button>
            </div>

            {loading ? (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {[1, 2, 3].map(i => <div key={i} className="shimmer" style={{ height: '100px', borderRadius: '16px' }}></div>)}
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="card-white" style={{ textAlign: 'center', padding: '6rem' }}>
                    <div style={{ width: '64px', height: '64px', background: 'var(--bg-main)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <History size={32} color="var(--text-soft)" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No orders yet</h3>
                    <p style={{ color: 'var(--text-soft)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Browse crops and place your first order.</p>
                    <Link href="/buyer/catalog" className="btn-modern btn-primary-modern">Browse Crops</Link>
                </div>
            ) : (
                <div className="card-white" style={{ overflow: 'hidden' }}>
                    <table className="table-modern">
                        <thead>
                            <tr>
                                <th>CROP</th>
                                <th>QUANTITY</th>
                                <th>AMOUNT</th>
                                <th>STATUS</th>
                                <th style={{ textAlign: 'right' }}>ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', background: 'var(--primary-soft)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <QrCode size={18} color="var(--primary)" />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 800, color: 'var(--secondary)' }}>{order.products.name}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>#{order.id.slice(0, 8).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <Package size={14} /> {order.quantity} {t('unit_q')}
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', marginTop: '0.25rem' }}>Product: {order.product_id.slice(0, 6)}</p>
                                    </td>
                                    <td>
                                        <p style={{ fontWeight: 800, fontSize: '1rem' }}>{t('currency_symbol')}{order.total_price.toFixed(2)}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 700 }}>PAID</p>
                                    </td>
                                    <td>
                                        <span className={`badge-clean ${order.status === 'completed' ? 'badge-success' : 'badge-pending'}`}>
                                            {order.status === 'completed' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                            {order.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <Link href={`/buyer/orders/${order.id}`} className="btn-modern btn-secondary-modern" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                            View Receipt <ChevronRight size={14} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}
