'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase, Product, Order } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    ShoppingCart,
    ShieldCheck,
    Info,
    Loader2,
    Warehouse,
    TrendingUp,
    CheckCircle2,
    Lock,
    Globe
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function ProductDetail() {
    const { id } = useParams() as { id: string };
    const { user } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [reserving, setReserving] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (!error && data) {
                setProduct(data);
            }
            setLoading(false);
        };

        fetchProduct();
    }, [id]);

    const handleReserve = async () => {
        if (!user || !product) return;
        setReserving(true);

        const pickup_code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const reservation_expiry = new Date();
        reservation_expiry.setDate(reservation_expiry.getDate() + 7);

        const { data, error } = await supabase
            .from('orders')
            .insert({
                buyer_id: user.id,
                product_id: product.id,
                quantity: quantity,
                total_price: product.price_per_unit * quantity,
                status: 'reserved',
                pickup_code,
                reservation_expiry: reservation_expiry.toISOString()
            })
            .select()
            .single();

        if (error) {
            alert(error.message);
            setReserving(false);
        } else {
            router.push(`/buyer/orders/${data.id}`);
        }
    };

    if (loading) return (
        <DashboardLayout role="buyer">
            <div className="shimmer" style={{ height: '600px', borderRadius: '24px' }}></div>
        </DashboardLayout>
    );

    if (!product) return (
        <DashboardLayout role="buyer">
            <div className="card-white" style={{ textAlign: 'center', padding: '5rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Resource Node Not Found</h2>
                <Link href="/buyer/catalog" className="btn-modern btn-primary-modern">Return to Exchange</Link>
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout role="buyer">
            <Link href="/buyer/catalog" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> {t('back_to')} {t('catalog')}
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '2.5rem' }}>
                <div className="card-white" style={{ padding: '3rem' }}>
                    <div style={{ display: 'flex', gap: '3rem', marginBottom: '3rem' }}>
                        <div style={{ width: '320px', height: '320px', borderRadius: '20px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }}>
                            <img src={product.image_url || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <span className="badge-clean badge-success" style={{ background: 'var(--success-soft)' }}>
                                    <ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Institutional Grade
                                </span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-soft)' }}>ID: {product.id.slice(0, 8)}</span>
                            </div>
                            <h1 style={{ fontSize: '2.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>{product.name}</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '2rem' }}>{product.description || 'Verified agricultural asset secured in regional node silos with real-time moisture monitoring and theft protection protocols.'}</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-soft)' }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Regional Origin</p>
                                    <p style={{ fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Globe size={16} color="var(--primary)" /> North India Silo Hub
                                    </p>
                                </div>
                                <div style={{ padding: '1.25rem', background: 'var(--bg-main)', borderRadius: '16px', border: '1px solid var(--border-soft)' }}>
                                    <p style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Moisture Level</p>
                                    <p style={{ fontWeight: 800, color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <TrendingUp size={16} /> 12.4% (Optimal)
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', color: 'var(--secondary)', marginBottom: '1.5rem' }}>Storage Protocol Details</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Warehouse size={24} color="var(--primary)" />
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Cold-Storage Sync</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Automated temp control.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Lock size={24} color="var(--primary)" />
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Escrow Bonded</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% Capital protection.</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <CheckCircle2 size={24} color="var(--primary)" />
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>QA Validated</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Grade-A Certification.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Order Panel */}
                <div style={{ position: 'sticky', top: '90px' }}>
                    <div className="card-white" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>{t('buy')}</h3>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Rate / {t('unit_q')}</span>
                                <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '1.25rem' }}>{t('currency_symbol')}{product.price_per_unit.toFixed(2)}</span>
                            </div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Allocation Qty ({t('unit_q')})</label>
                            <input
                                type="number"
                                className="input-modern"
                                min="1"
                                max={product.quantity_available}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                style={{ height: '48px', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 600 }}>Capacity: {product.quantity_available} {t('unit_q')} available</p>
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>Total Final Val</span>
                                <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{t('currency_symbol')}{(product.price_per_unit * quantity).toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            className="btn-modern btn-primary-modern"
                            style={{ width: '100%', height: '56px', fontSize: '1rem' }}
                            onClick={handleReserve}
                            disabled={reserving || quantity <= 0 || quantity > product.quantity_available}
                        >
                            {reserving ? <Loader2 className="animate-spin" size={20} /> : <><Lock size={18} /> {t('action_reserve')}</>}
                        </button>

                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-main)', borderRadius: '12px', display: 'flex', gap: '0.75rem' }}>
                            <Info size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>Funds are held in neutral escrow until you scan your digital receipt at the regional warehouse terminal.</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
