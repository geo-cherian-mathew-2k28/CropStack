'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Product } from '@/lib/supabase';
import { db, collection, query, orderBy, getDocs } from '@/lib/firebase';
import { useLanguage } from '@/context/LanguageContext';
import {
    Warehouse,
    Search,
    Filter,
    CheckCircle2,
    Database,
    ShieldCheck,
    ArrowRight,
    TrendingUp,
    AlertCircle,
    Info
} from 'lucide-react';
import Link from 'next/link';

export default function OrganizerInventory() {
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllInventory = async () => {
            try {
                const q = query(
                    collection(db, 'products'),
                    orderBy('created_at', 'desc')
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Product));
                setProducts(data);
            } catch (err) {
                console.error('Error fetching inventory:', err);
            }
            setLoading(false);
        };

        fetchAllInventory();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalStock = products.reduce((acc, curr) => acc + curr.quantity_available, 0);

    return (
        <DashboardLayout role="organizer">
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '1.875rem' }}>Node Inventory Governance</h1>
                <p style={{ color: 'var(--text-muted)' }}>Global overview of storable assets across all localized silo clusters.</p>
            </div>

            {/* Hub Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2.5rem' }}>
                {[
                    { label: 'Network Net Volume', val: totalStock.toLocaleString(), unit: t('unit_q'), icon: Database, color: 'var(--primary)' },
                    { label: 'Active Silo Nodes', val: '24', unit: 'Clusters', icon: Warehouse, color: 'var(--secondary)' },
                    { label: 'Security Health', val: '98.8%', unit: 'Optimal', icon: ShieldCheck, color: 'var(--success)' },
                    { label: 'Storage Utilization', val: '72%', unit: 'Cap', icon: TrendingUp, color: 'var(--warning)' }
                ].map((stat, i) => (
                    <div key={i} className="card-white" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase' }}>{stat.label}</span>
                            <stat.icon size={18} color={stat.color} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.125rem' }}>{stat.val} <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: 600 }}>{stat.unit}</span></h2>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                    <input
                        type="text"
                        className="input-modern"
                        placeholder="Search Silo SKU, Batch ID, or Category..."
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
                <div className="shimmer" style={{ height: '400px', borderRadius: '16px' }}></div>
            ) : filteredProducts.length === 0 ? (
                <div className="card-white" style={{ textAlign: 'center', padding: '6rem' }}>
                    <h3>Node Inventory Synchronized</h3>
                    <p style={{ color: 'var(--text-soft)' }}>No assets match your current governance filter.</p>
                </div>
            ) : (
                <div className="card-white" style={{ overflow: 'hidden' }}>
                    <table className="table-modern">
                        <thead>
                            <tr>
                                <th>SILO BATCH / SKU</th>
                                <th>GOVERNANCE CAT</th>
                                <th>NODE CAPACITY</th>
                                <th>UNIT VAL</th>
                                <th>STATUS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                                                <img src={p.image_url || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 800, color: 'var(--secondary)' }}>{p.name}</p>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--text-soft)', fontWeight: 700 }}>#{p.id.slice(0, 10).toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', background: 'var(--primary-soft)', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                                            {p.category}
                                        </span>
                                    </td>
                                    <td>
                                        <p style={{ fontWeight: 800 }}>{p.quantity_available} {t('unit_q')}</p>
                                        <div style={{ height: '4px', width: '60px', background: 'var(--border-soft)', borderRadius: '10px', marginTop: '0.5rem', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: '70%', background: 'var(--success)' }}></div>
                                        </div>
                                    </td>
                                    <td>
                                        <p style={{ fontWeight: 800 }}>{t('currency_symbol')}{p.price_per_unit.toFixed(2)}</p>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-soft)' }}>Market Peer Syncing</p>
                                    </td>
                                    <td>
                                        <span className={`badge-clean ${p.is_active ? 'badge-success' : 'badge-error'}`}>
                                            {p.is_active ? 'GOVERNANCE OK' : 'OFFLINE'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'white', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <Info size={20} color="var(--primary)" />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Organizer Governance Node: You are viewing non-private asset telemetry across the regional warehouse clusters. Private SKU details are restricted to the asset owner.
                </p>
            </div>
        </DashboardLayout>
    );
}
