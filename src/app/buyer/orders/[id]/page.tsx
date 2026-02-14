'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Order, Product, Profile } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, MapPin, Printer, Share2, Loader2, QrCode, ShieldCheck, Download, Info, Lock } from 'lucide-react';
import Link from 'next/link';
import { format, differenceInDays } from 'date-fns';
import { useLanguage } from '@/context/LanguageContext';

export default function OrderReceipt() {
    const { id } = useParams() as { id: string };
    const { t } = useLanguage();
    const [order, setOrder] = useState<(Order & { products: Product }) | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*, products(*)')
                .eq('id', id)
                .single();

            if (!error && data) {
                setOrder(data);
            }
            setLoading(false);
        };

        fetchOrder();
    }, [id]);

    if (loading) return (
        <DashboardLayout role="buyer">
            <div className="shimmer" style={{ height: '500px', borderRadius: '24px' }}></div>
        </DashboardLayout>
    );

    if (!order) return (
        <DashboardLayout role="buyer">
            <div className="card-white" style={{ textAlign: 'center', padding: '5rem' }}>
                <AlertCircle size={40} color="var(--error)" style={{ marginBottom: '1.5rem' }} />
                <h2>Order Protocol Not Found</h2>
                <Link href="/buyer/dashboard" className="btn-modern btn-primary-modern" style={{ marginTop: '2rem' }}>Return to Hub</Link>
            </div>
        </DashboardLayout>
    );

    const daysRemaining = order.reservation_expiry ? differenceInDays(new Date(order.reservation_expiry), new Date()) : 0;

    return (
        <DashboardLayout role="buyer">
            <Link href="/buyer/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> {t('back_to')} {t('dashboard')}
            </Link>

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div className="card-white" style={{ padding: '4rem', overflow: 'hidden', position: 'relative' }}>

                    {/* Header Protocol */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '2.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                                <div style={{ padding: '0.4rem', background: 'var(--primary)', borderRadius: '6px' }}>
                                    <ShieldCheck color="white" size={18} />
                                </div>
                                <span style={{ fontWeight: 800, color: 'var(--text-soft)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Encrypted Fulfillment Protocol</span>
                            </div>
                            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>Batch Distribution Node</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Protocol ID: <strong style={{ color: 'var(--secondary)' }}>{order.id}</strong></p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className={`badge-clean ${order.status === 'reserved' ? 'badge-pending' : 'badge-success'}`} style={{ padding: '0.5rem 1rem' }}>
                                {order.status.toUpperCase()}
                            </span>
                            <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-soft)', fontWeight: 700 }}>Issued {format(new Date(order.created_at), 'PPP')}</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
                        {/* Pickup Security Section */}
                        <div>
                            <h3 style={{ fontSize: '1rem', color: 'var(--secondary)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Clearance</h3>

                            <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ padding: '1rem', background: 'white', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
                                        <QrCode size={48} color="var(--secondary)" />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-soft)', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.25rem' }}>Terminal PIN</p>
                                        <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', letterSpacing: '3px', lineHeight: 1 }}>{order.pickup_code}</p>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '36px', height: '36px', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin size={18} color="var(--primary)" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Central Silo Node WH-04</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sector 12-B, Industrial Hub, National Hwy 102</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ width: '36px', height: '36px', background: 'white', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Clock size={18} color="var(--warning)" />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Clearance Deadline</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Protocol expires in {daysRemaining} days ({format(new Date(order.reservation_expiry!), 'PPP')})</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Calculation */}
                        <div>
                            <div style={{ background: 'var(--secondary)', padding: '2rem', borderRadius: '16px', color: 'white' }}>
                                <h3 style={{ color: 'white', fontSize: '0.9rem', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Allocation Value</h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{order.products.name}</p>
                                            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Qty: {order.quantity} {t('unit_q')}</p>
                                        </div>
                                        <span style={{ fontWeight: 700 }}>{t('currency_symbol')}{order.total_price.toFixed(2)}</span>
                                    </div>

                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.25rem', marginTop: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Escrow Final</p>
                                            <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 900 }}>{t('currency_symbol')}{order.total_price.toFixed(2)}</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--warning-soft)', borderRadius: '12px', display: 'flex', gap: '0.75rem' }}>
                                <Info size={16} color="var(--warning)" style={{ flexShrink: 0 }} />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-main)', lineHeight: 1.4, fontWeight: 500 }}>
                                    Requires biometric or PIN verification at the terminal for asset release.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3.5rem', borderTop: '1px solid var(--border-soft)', paddingTop: '2.5rem' }}>
                        <button className="btn-modern btn-secondary-modern" onClick={() => window.print()} style={{ height: '44px' }}>
                            <Printer size={16} /> Print Receipt
                        </button>
                        <button className="btn-modern btn-secondary-modern" style={{ height: '44px' }}>
                            <Download size={16} /> Export JSON
                        </button>
                        <button className="btn-modern btn-secondary-modern" style={{ height: '44px' }}>
                            <Share2 size={16} /> Secure Share
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
