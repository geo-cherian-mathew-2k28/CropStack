'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Warehouse,
  ShieldCheck,
  BarChart3,
  Globe,
  Zap,
  ChevronRight,
  Database,
  Sprout,
  Lock,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Award
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div style={{ background: 'white', color: 'var(--secondary)', overflowX: 'hidden' }}>
      {/* SaaS Navbar */}
      <nav style={{
        height: '84px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 8%',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid var(--border-soft)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)' }}>
            <Warehouse color="white" size={22} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--secondary)', letterSpacing: '-0.05em' }}>{t('app_name')}</span>
        </div>

        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <Link href="#solutions" style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Features</Link>
          <Link href="#network" style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Coverage</Link>
          <div style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
          <Link href="/trade/login" style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>{t('cta_login')}</Link>
          <Link href="/trade/signup" className="btn-modern btn-primary-modern" style={{ height: '48px', padding: '0 1.75rem', borderRadius: '12px' }}>
            {t('cta_start')}
          </Link>
        </div>
      </nav>

      {/* Modern Hero */}
      <section style={{
        padding: '200px 8% 120px',
        background: 'radial-gradient(120% 120% at 50% 10%, #fff 40%, var(--primary-soft) 100%)',
        position: 'relative'
      }}>
        {/* Decorative Grid Line */}
        <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '100%', pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 1px 1px, #e2e8f0 1.5px, transparent 0)', backgroundSize: '64px 64px', opacity: 0.5 }}></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem 1.25rem', background: 'white', border: '1px solid var(--border)', borderRadius: '100px', marginBottom: '3rem', boxShadow: 'var(--shadow-sm)' }}>
            <Activity size={16} color="var(--primary)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trusted by 14,000+ Farmers</span>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--success)' }}></div>
          </div>

          <h1 style={{ fontSize: '5.5rem', lineHeight: 1, maxWidth: '1000px', margin: '0 auto 2.5rem', letterSpacing: '-0.05em', color: 'var(--secondary)', fontWeight: 900 }}>
            <span style={{ color: 'var(--primary)' }}>Buy & Sell</span> <br /> Crops Online.
          </h1>
          <p style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '750px', margin: '0 auto 4rem', lineHeight: 1.6, fontWeight: 500 }}>
            A trusted platform for Indian farmers to sell crops <br />
            directly to buyers — fair prices, no middlemen.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
            <Link href="/signup" className="btn-modern btn-primary-modern" style={{ height: '64px', padding: '0 3rem', fontSize: '1.1rem', borderRadius: '16px' }}>
              Get Started Free <ArrowRight size={22} />
            </Link>
            <Link href="/login" className="btn-modern btn-secondary-modern" style={{ height: '64px', padding: '0 3rem', fontSize: '1.1rem', borderRadius: '16px' }}>
              Sign In
            </Link>
          </div>
        </motion.div>

        {/* Floating Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '100px' }}>
          {[
            { label: 'Total Sales', val: '₹942 Cr', icon: Database },
            { label: 'Verified Farmers', val: '14,200', icon: ShieldCheck },
            { label: 'Better Prices', val: '+12.4%', icon: TrendingUp }
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="card-white"
              style={{ padding: '1.5rem 2.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}
            >
              <div style={{ padding: '0.75rem', background: 'var(--primary-soft)', borderRadius: '12px' }}>
                <s.icon size={24} color="var(--primary)" />
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-soft)', textTransform: 'uppercase' }}>{s.label}</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--secondary)' }}>{s.val}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Network Map Section */}
      <section id="network" style={{ padding: '120px 8%', background: 'var(--secondary)', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%', opacity: 0.05, backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }}></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: '3.5rem', color: 'white', marginBottom: '2rem', lineHeight: 1.1 }}>Available Across <br /><span style={{ color: 'var(--primary)' }}>All 28 States.</span></h2>
            <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.6)', marginBottom: '3rem', lineHeight: 1.7 }}>
              Whether you're in Punjab, Kerala, or anywhere in between — CropStack connects you to buyers and sellers across India. Available in 6+ languages.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <Award size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Quality Verified</h4>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>Every seller and crop listing is checked for accuracy.</p>
              </div>
              <div>
                <Zap size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                <h4 style={{ color: 'white', fontSize: '1.1rem', marginBottom: '0.5rem' }}>Fast Payments</h4>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>Get paid directly to your bank account within 24 hours.</p>
              </div>
            </div>
          </div>
          <div className="card-white" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <Globe size={160} color="rgba(255,255,255,0.05)" />
              <p style={{ color: 'var(--primary)', fontWeight: 800, marginTop: '2rem', fontSize: '1.25rem', letterSpacing: '2px' }}>ALL-INDIA COVERAGE</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>Available in 6+ Indian languages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="solutions" style={{ padding: '120px 8%' }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '3rem', color: 'var(--secondary)', marginBottom: '1.25rem' }}>Why Farmers Choose Us.</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', marginInline: 'auto' }}>Simple tools built for selling grains, seeds, and pulses online.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
          {[
            { title: 'Secure Transactions', desc: 'Every payment is protected. Your money is safe until the order is confirmed and delivered.', icon: Lock },
            { title: 'Fair Pricing', desc: 'See real-time market prices and get the best deal — no hidden fees or middlemen.', icon: ShieldCheck },
            { title: 'Easy to Use', desc: 'Manage your crops, orders, and payments from one simple dashboard — available in your language.', icon: Database },
          ].map((feat, i) => (
            <div key={i} className="card-white" style={{ padding: '3.5rem' }}>
              <div style={{ width: '56px', height: '56px', background: 'var(--primary-soft)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)' }}>
                <feat.icon size={28} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.525rem', marginBottom: '1rem' }}>{feat.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '120px 8%', textAlign: 'center' }}>
        <div style={{ background: 'var(--primary-soft)', padding: '6rem 4rem', borderRadius: '48px', border: '1px solid rgba(5, 150, 105, 0.1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05, transform: 'rotate(15deg)' }}>
            <Warehouse size={400} />
          </div>

          <h2 style={{ fontSize: '4rem', color: 'var(--secondary)', marginBottom: '2rem', letterSpacing: '-0.04em', fontWeight: 900 }}>Start Selling <br /> Your Crops Today.</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.3rem', marginBottom: '4rem', maxWidth: '600px', marginInline: 'auto', fontWeight: 500 }}>
            Join thousands of farmers and buyers across India.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center' }}>
            <Link href="/signup" className="btn-modern btn-primary-modern" style={{ height: '72px', padding: '0 4rem', fontSize: '1.25rem', borderRadius: '20px' }}>
              Create Free Account <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '6rem 8% 4rem', background: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-soft)', paddingBottom: '4rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '2rem' }}>
              <Warehouse color="var(--primary)" size={28} />
              <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>{t('app_name')}</span>
            </div>
            <p style={{ color: 'var(--text-soft)', fontSize: '0.95rem', lineHeight: 1.6 }}>&copy; 2026 CropStack.<br />India's trusted crop trading platform.<br />Made for farmers, by farmers.</p>
          </div>
          <div style={{ display: 'flex', gap: '6rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.1em' }}>Platform</p>
              <Link href="/trade/login" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.925rem', fontWeight: 600 }}>Buy Crops</Link>
              <Link href="/trade/login" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.925rem', fontWeight: 600 }}>Sell Crops</Link>
              <Link href="/system/login" style={{ textDecoration: 'none', color: 'var(--primary)', fontSize: '0.925rem', fontWeight: 800 }}>System Login</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.1em' }}>Support</p>
              <Link href="#" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.925rem', fontWeight: 600 }}>Help Center</Link>
              <Link href="#" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.925rem', fontWeight: 600 }}>Terms of Use</Link>
              <Link href="#" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.925rem', fontWeight: 600 }}>Privacy Policy</Link>
            </div>
          </div>
        </div>
        <div style={{ padding: '2rem 0', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Available across all of India • 6+ Languages Supported</p>
        </div>
      </footer >
    </div >
  );
}
