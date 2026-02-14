'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Package,
    Upload,
    CheckCircle2,
    Loader2,
    ArrowLeft,
    Info,
    Warehouse,
    ShieldCheck,
    Database,
    Globe
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function NewProduct() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price_per_unit: '',
        quantity_available: '',
        category: 'Grains',
        unit: 'quintal (q)',
        image_url: ''
    });

    const categories = ['Grains', 'Rice', 'Wheat', 'Pulses', 'Legumes', 'Spices', 'Seeds'];
    const units = ['kg', 'quintal (q)', 'bag (50kg)', 'ton', 'metric ton'];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase
            .from('products')
            .insert({
                ...formData,
                seller_id: user?.id,
                price_per_unit: parseFloat(formData.price_per_unit),
                quantity_available: parseFloat(formData.quantity_available),
                is_active: true
            });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            router.push('/seller/products');
        }
    };

    return (
        <DashboardLayout role="seller">
            <Link href="/seller/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2.5rem', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> {t('back_to')} {t('dashboard')}
            </Link>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2.5rem' }}>
                <div className="card-white" style={{ padding: '3.5rem' }}>
                    <div style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.875rem', color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('inventory')}</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Initialize a new storage lot in the node network.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Product Node Name</label>
                                <input
                                    type="text"
                                    className="input-modern"
                                    placeholder="e.g. Basmati Rice Batch A4"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Storage Category</label>
                                <select
                                    className="input-modern"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Technical Description</label>
                            <textarea
                                className="input-modern"
                                style={{ minHeight: '120px', padding: '1rem', resize: 'vertical' }}
                                placeholder="Detail the moisture levels, grade, and harvest date..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Unit Segment</label>
                                <select
                                    className="input-modern"
                                    value={formData.unit}
                                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                >
                                    {units.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rate ({t('currency_symbol')})</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="input-modern"
                                    placeholder="0.00"
                                    required
                                    value={formData.price_per_unit}
                                    onChange={(e) => setFormData({ ...formData, price_per_unit: e.target.value })}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Net Quantity</label>
                                <input
                                    type="number"
                                    className="input-modern"
                                    placeholder="0"
                                    required
                                    value={formData.quantity_available}
                                    onChange={(e) => setFormData({ ...formData, quantity_available: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Batch Imagery URL</label>
                            <div style={{ position: 'relative' }}>
                                <Upload size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                                <input
                                    type="url"
                                    className="input-modern"
                                    placeholder="https://images.unsplash.com/..."
                                    style={{ paddingLeft: '2.75rem' }}
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-modern btn-primary-modern"
                            style={{ height: '56px', fontSize: '1rem', marginTop: '1.5rem' }}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>{t('action_publish')}</>}
                        </button>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="card-white" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--primary-soft)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <ShieldCheck size={20} color="var(--primary)" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Verification Active</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', lineHeight: 1.4 }}>Your listing will be automatically validated by the digital storage protocol (Node-Sync v4).</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--success-soft)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Database size={20} color="var(--success)" />
                            </div>
                            <div>
                                <h4 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Real-time Audit</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-soft)', lineHeight: 1.4 }}>Inventory levels are tracked in real-time across regional silos for 100% accuracy.</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-white" style={{ padding: '2.5rem', background: 'var(--secondary)', color: 'white' }}>
                        <h3 style={{ color: 'white', fontSize: '1.125rem', marginBottom: '1.25rem' }}>Regional Node Capacity</h3>
                        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Currently accepting bulk lots in North and West India hubs.</p>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', pb: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <Globe size={20} color="var(--primary)" />
                            <div>
                                <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Pan-India Support</p>
                                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>Full localization enabled for South Indian hubs.</p>
                            </div>
                        </div>

                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Global Sync Status</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }}></div>
                                <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>PROTOCOL OPERATIONAL</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
