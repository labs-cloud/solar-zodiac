'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Search, Bell, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardMetrics {
    totalSuppliers: number;
    expiringDocsCount: number;
    expiredDocsCount: number;
    avgCompliance: number;
    pendingPOs: number;
    pendingShipments: number;
}

interface ExpiringDoc {
    vendor: string;
    vendorId: string;
    doc: string;
    expiry: string;
    days: number;
    status: string;
}

interface Supplier {
    id: string;
    company_name: string;
    vendor_type: { type_name: string };
    compliance_score: number;
    onboarding_status: string;
}

export default function Home() {
    const router = useRouter();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [expiringDocs, setExpiringDocs] = useState<ExpiringDoc[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [metricsRes, docsRes, suppliersRes] = await Promise.all([
                fetch('/api/dashboard'),
                fetch('/api/documents/expiring?days=60'), // Increased range for timeline
                fetch('/api/suppliers'),
            ]);

            const metricsData = await metricsRes.json();
            const docsData = await docsRes.json();
            const suppliersData = await suppliersRes.json();

            setMetrics(metricsData);
            setExpiringDocs(docsData);
            setSuppliers(suppliersData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction: number) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
        }
    };

    if (loading || !metrics) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center h-screen bg-[#06060a] text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6366f1]"></div>
                </div>
            </DashboardLayout>
        );
    }

    // Calculations for Rings
    const circumference = 2 * Math.PI * 146; // r=146
    const compliantOffset = circumference * (1 - metrics.avgCompliance / 100);

    // Mini donut calcs
    const miniCircumference = 2 * Math.PI * 28; // r=28

    // Recalculate compliant metrics based on actual supplier scores
    const compliantCount = suppliers.filter(s => s.compliance_score >= 80).length;
    const compliantPct = metrics.totalSuppliers > 0 ? Math.round((compliantCount / metrics.totalSuppliers) * 100) : 0;
    const expiringPct = metrics.totalSuppliers > 0 ? Math.round((metrics.expiringDocsCount / metrics.totalSuppliers) * 100) : 0;
    const expiredPct = metrics.totalSuppliers > 0 ? Math.round((metrics.expiredDocsCount / metrics.totalSuppliers) * 100) : 0;

    return (
        <DashboardLayout>
            <div className="radial-dashboard">
                <div className="ambient">
                    <div className="ambient-orb"></div>
                    <div className="ambient-orb"></div>
                    <div className="ambient-orb"></div>
                </div>

                <div className="app-container">
                    {/* Header */}
                    <header className="header">
                        <div className="logo">
                            <div className="logo-ring">
                                <div className="logo-inner">S</div>
                            </div>
                            <div className="logo-text">
                                <h1>Snackatere</h1>
                                <span>Compliance Hub</span>
                            </div>
                        </div>
                        <div className="header-actions">
                            <button className="btn-circle"><Search size={20} /></button>
                            <button className="btn-circle"><Bell size={20} /></button>
                            <Link href="/suppliers/new">
                                <button className="btn-pill"><Plus size={16} /> Add Supplier</button>
                            </Link>
                        </div>
                    </header>

                    {/* Hero Section - Main Ring */}
                    <section className="hero-section">
                        <div className="main-ring">
                            <div className="ring-bg"></div>
                            <div className="ring-progress">
                                <svg viewBox="0 0 340 340">
                                    {/* Main Compliance Score Ring */}
                                    <circle className="ring-segment" cx="170" cy="170" r="146"
                                        stroke="var(--green)"
                                        strokeDasharray={circumference}
                                        strokeDashoffset={circumference * (1 - metrics.avgCompliance / 100)}
                                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                                    />
                                </svg>
                            </div>
                            <div className="ring-center">
                                <div className="ring-score">{metrics.avgCompliance}%</div>
                                <div className="ring-label">Overall Compliance</div>
                            </div>
                        </div>

                        <div className="mini-rings">
                            <div className="mini-ring-item" onClick={() => router.push('/suppliers?status=compliant')}>
                                <div className="mini-ring">
                                    <svg viewBox="0 0 64 64">
                                        <circle className="mini-ring-bg" cx="32" cy="32" r="28" />
                                        <circle className="mini-ring-progress" cx="32" cy="32" r="28"
                                            stroke="var(--green)"
                                            strokeDasharray={miniCircumference}
                                            strokeDashoffset={miniCircumference * (1 - compliantPct / 100)}
                                        />
                                    </svg>
                                    <span className="mini-ring-value" style={{ color: 'var(--green)' }}>{compliantPct}%</span>
                                </div>
                                <div className="mini-ring-info">
                                    <h3>Compliant</h3>
                                    <p>All documents valid</p>
                                </div>
                                <span className="mini-ring-count" style={{ color: 'var(--green)' }}>{compliantCount}</span>
                            </div>

                            <div className="mini-ring-item" onClick={() => router.push('/documents/expiring')}>
                                <div className="mini-ring">
                                    <svg viewBox="0 0 64 64">
                                        <circle className="mini-ring-bg" cx="32" cy="32" r="28" />
                                        <circle className="mini-ring-progress" cx="32" cy="32" r="28"
                                            stroke="var(--yellow)"
                                            strokeDasharray={miniCircumference}
                                            strokeDashoffset={miniCircumference * (1 - expiringPct / 100)}
                                        />
                                    </svg>
                                    <span className="mini-ring-value" style={{ color: 'var(--yellow)' }}>{expiringPct}%</span>
                                </div>
                                <div className="mini-ring-info">
                                    <h3>Expiring Soon</h3>
                                    <p>Within 30-60 days</p>
                                </div>
                                <span className="mini-ring-count" style={{ color: 'var(--yellow)' }}>{metrics.expiringDocsCount}</span>
                            </div>

                            <div className="mini-ring-item" onClick={() => router.push('/documents/expiring')}>
                                <div className="mini-ring">
                                    <svg viewBox="0 0 64 64">
                                        <circle className="mini-ring-bg" cx="32" cy="32" r="28" />
                                        <circle className="mini-ring-progress" cx="32" cy="32" r="28"
                                            stroke="var(--red)"
                                            strokeDasharray={miniCircumference}
                                            strokeDashoffset={miniCircumference * (1 - expiredPct / 100)}
                                        />
                                    </svg>
                                    <span className="mini-ring-value" style={{ color: 'var(--red)' }}>{expiredPct}%</span>
                                </div>
                                <div className="mini-ring-info">
                                    <h3>Non-Compliant</h3>
                                    <p>Action required</p>
                                </div>
                                <span className="mini-ring-count" style={{ color: 'var(--red)' }}>{metrics.expiredDocsCount}</span>
                            </div>
                        </div>
                    </section>

                    {/* Swipeable Vendor Cards */}
                    <section className="vendors-section">
                        <div className="section-header">
                            <h2 className="section-title">Verified Vendors</h2>
                            <div className="swipe-controls">
                                <button className="swipe-btn" onClick={() => scroll(-1)}><ChevronLeft size={20} /></button>
                                <button className="swipe-btn" onClick={() => scroll(1)}><ChevronRight size={20} /></button>
                            </div>
                        </div>
                        <div className="swipe-container" ref={scrollRef}>
                            <div className="swipe-track">
                                {(suppliers || []).map((supplier) => {
                                    let statusClass = 'compliant';
                                    if (supplier.compliance_score < 50) statusClass = 'expired';
                                    else if (supplier.compliance_score < 80) statusClass = 'expiring';

                                    return (
                                        <div key={supplier.id} className={`vendor-card ${statusClass}`} onClick={() => router.push(`/suppliers/${supplier.id}`)}>
                                            <div className="vendor-avatar-ring">
                                                <div className="vendor-avatar-inner">{supplier.company_name.substring(0, 1)}</div>
                                            </div>
                                            <div className="vendor-name">{supplier.company_name}</div>
                                            <div className="vendor-type">{supplier.vendor_type.type_name}</div>
                                            <div className="vendor-stats">
                                                <div className="vendor-stat">
                                                    <div className={`vendor-stat-value ${statusClass === 'compliant' ? 'green' : statusClass === 'expiring' ? 'yellow' : 'red'}`}>
                                                        {supplier.compliance_score}%
                                                    </div>
                                                    <div className="vendor-stat-label">Score</div>
                                                </div>
                                                <div className="vendor-stat">
                                                    <div className="vendor-stat-value">{metrics.pendingPOs > 0 ? Math.floor(Math.random() * 5) + 1 : '-'}</div>
                                                    <div className="vendor-stat-label">Active POs</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </section>

                    {/* Expiring Timeline */}
                    <section className="timeline-section">
                        <div className="section-header">
                            <h2 className="section-title">Expiring Timeline (Next 60 Days)</h2>
                        </div>
                        <div className="timeline">
                            {(expiringDocs || []).length === 0 ? (
                                <p style={{ color: 'var(--text-3)', padding: '20px' }}>No documents expiring soon.</p>
                            ) : (expiringDocs || []).map((doc, idx) => {
                                let statusClass = 'warning';
                                if (doc.days < 0) statusClass = 'expired';
                                else if (doc.days < 14) statusClass = 'critical';

                                return (
                                    <div key={idx} className={`timeline-item ${statusClass}`} onClick={() => router.push(`/suppliers/${doc.vendorId}`)}>
                                        <div className="timeline-dot"></div>
                                        <div className="timeline-days">{doc.days < 0 ? doc.days : `+${doc.days}`}</div>
                                        <div className="timeline-vendor font-bold truncate w-full">{doc.vendor}</div>
                                        <div className="timeline-doc truncate w-full">{doc.doc}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Quick Stats Bubbles */}
                    <section className="bubbles-section">
                        <div className="section-header">
                            <h2 className="section-title">Quick Stats</h2>
                        </div>
                        <div className="bubbles-grid">
                            <Link href="/receiving">
                                <div className="bubble receiving">
                                    <div className="bubble-value">{metrics.pendingPOs}</div>
                                    <div className="bubble-label">Receiving</div>
                                </div>
                            </Link>
                            <Link href="/shipping">
                                <div className="bubble shipping">
                                    <div className="bubble-value">{metrics.pendingShipments}</div>
                                    <div className="bubble-label">Shipments</div>
                                </div>
                            </Link>
                            <Link href="/items">
                                <div className="bubble items">
                                    <div className="bubble-value">{metrics.totalSuppliers}</div>
                                    {/* Using total suppliers as proxy for SKU count logic isn't perfect but visual placeholder */}
                                    <div className="bubble-label">Vendors</div>
                                </div>
                            </Link>
                            <Link href="/documents/expiring">
                                <div className="bubble alerts">
                                    <div className="bubble-value">{metrics.expiredDocsCount}</div>
                                    <div className="bubble-label">Alerts</div>
                                </div>
                            </Link>
                        </div>
                    </section>
                </div>

                <style jsx global>{`
                    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');

                    :root {
                        --bg: #06060a;
                        --surface: #111118;
                        --surface-2: #1a1a24;
                        --border: #2a2a3a;
                        --accent: #6366f1;
                        --accent-2: #818cf8;
                        --green: #10b981;
                        --yellow: #f59e0b;
                        --red: #ef4444;
                        --text: #f8fafc;
                        --text-2: #94a3b8;
                        --text-3: #475569;
                    }

                    .radial-dashboard {
                        font-family: 'Sora', sans-serif;
                        background: var(--bg);
                        color: var(--text);
                        min-height: 100vh;
                        padding: 32px;
                        /* Override layout container */
                        margin: -32px; 
                        margin-left: -32px; /* Pull left if container adds margin */
                    }

                    .ambient {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        z-index: 0;
                        overflow: hidden;
                        pointer-events: none;
                    }

                    .ambient-orb {
                        position: absolute;
                        border-radius: 50%;
                        filter: blur(100px);
                        opacity: 0.3;
                        animation: float 20s ease-in-out infinite;
                    }

                    .ambient-orb:nth-child(1) { width: 600px; height: 600px; background: var(--accent); top: -200px; right: -200px; }
                    .ambient-orb:nth-child(2) { width: 400px; height: 400px; background: var(--green); bottom: -100px; left: -100px; animation-delay: -5s; }
                    .ambient-orb:nth-child(3) { width: 300px; height: 300px; background: var(--red); top: 50%; left: 50%; animation-delay: -10s; }

                    @keyframes float {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        33% { transform: translate(30px, -30px) scale(1.05); }
                        66% { transform: translate(-20px, 20px) scale(0.95); }
                    }

                    .app-container {
                        position: relative;
                        z-index: 10;
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; }
                    .logo { display: flex; align-items: center; gap: 16px; }
                    .logo-ring { width: 56px; height: 56px; border-radius: 50%; background: conic-gradient(var(--accent) 0deg, var(--accent-2) 120deg, var(--green) 240deg, var(--accent) 360deg); padding: 3px; animation: spin 10s linear infinite; }
                    
                    @keyframes spin { to { transform: rotate(360deg); } }

                    .logo-inner { width: 100%; height: 100%; background: var(--bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 22px; color: white; }
                    .logo-text h1 { font-size: 24px; font-weight: 700; color: white; margin: 0; }
                    .logo-text span { font-size: 12px; color: var(--accent-2); text-transform: uppercase; letter-spacing: 2px; }

                    .header-actions { display: flex; gap: 12px; }
                    .btn-circle { width: 48px; height: 48px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); color: var(--text-2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                    .btn-circle:hover { border-color: var(--accent); color: var(--accent); transform: scale(1.05); }
                    .btn-pill { padding: 14px 28px; border-radius: 50px; border: none; background: var(--accent); color: white; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.2s; }
                    .btn-pill:hover { transform: scale(1.02); box-shadow: 0 10px 40px rgba(99, 102, 241, 0.3); }

                    /* Hero Section */
                    .hero-section { display: flex; align-items: center; justify-content: center; gap: 80px; margin-bottom: 60px; flex-wrap: wrap; }
                    .main-ring { position: relative; width: 340px; height: 340px; flex-shrink: 0; }
                    .ring-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 50%; border: 24px solid var(--surface-2); }
                    .ring-progress { position: absolute; top: 0; left: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
                    .ring-segment { fill: none; stroke-width: 24; stroke-linecap: round; }
                    .ring-center { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center; }
                    .ring-score { font-size: 72px; font-weight: 800; line-height: 1; background: linear-gradient(135deg, var(--green) 0%, var(--accent) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                    .ring-label { font-size: 14px; color: var(--text-2); margin-top: 8px; text-transform: uppercase; letter-spacing: 2px; }

                    .mini-rings { display: flex; flex-direction: column; gap: 24px; }
                    .mini-ring-item { display: flex; align-items: center; gap: 20px; padding: 20px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; cursor: pointer; transition: all 0.2s; min-width: 300px; }
                    .mini-ring-item:hover { transform: translateX(8px); border-color: var(--accent); }
                    .mini-ring { width: 64px; height: 64px; position: relative; flex-shrink: 0; }
                    .mini-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
                    .mini-ring-bg { fill: none; stroke: var(--surface-2); stroke-width: 6; }
                    .mini-ring-progress { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 1s ease; }
                    .mini-ring-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 14px; font-weight: 700; }
                    .mini-ring-info h3 { font-size: 18px; font-weight: 700; margin-bottom: 4px; color: white; }
                    .mini-ring-info p { font-size: 13px; color: var(--text-3); margin: 0; }
                    .mini-ring-count { margin-left: auto; font-size: 32px; font-weight: 800; }

                    /* Vendors Section */
                    .vendors-section { margin-bottom: 60px; }
                    .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
                    .section-title { font-size: 20px; font-weight: 700; color: white; }
                    .swipe-controls { display: flex; gap: 8px; }
                    .swipe-btn { width: 40px; height: 40px; border-radius: 50%; border: 1px solid var(--border); background: var(--surface); color: var(--text-2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
                    .swipe-btn:hover { background: var(--accent); border-color: var(--accent); color: white; }
                    
                    .swipe-container { position: relative; overflow: hidden; margin: 0 -10px; padding: 10px; }
                    .swipe-track { display: flex; gap: 20px; transition: transform 0.4s ease; }
                    
                    .vendor-card { flex: 0 0 280px; background: var(--surface); border: 1px solid var(--border); border-radius: 24px; padding: 28px; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
                    .vendor-card:hover { transform: translateY(-8px); border-color: var(--accent); box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
                    .vendor-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; }
                    
                    .vendor-card.compliant::before { background: var(--green); }
                    .vendor-card.expiring::before { background: var(--yellow); }
                    .vendor-card.expired::before { background: var(--red); }

                    .vendor-avatar-ring { width: 72px; height: 72px; border-radius: 50%; padding: 3px; margin-bottom: 20px; }
                    .vendor-card.compliant .vendor-avatar-ring { background: conic-gradient(var(--green) 100%, var(--surface-2) 0); }
                    .vendor-card.expiring .vendor-avatar-ring { background: conic-gradient(var(--yellow) 85%, var(--surface-2) 0); }
                    .vendor-card.expired .vendor-avatar-ring { background: conic-gradient(var(--red) 40%, var(--surface-2) 0); }

                    .vendor-avatar-inner { width: 100%; height: 100%; background: var(--surface); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 24px; color: white; }
                    .vendor-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                    .vendor-type { font-size: 13px; color: var(--text-3); margin-bottom: 20px; }
                    
                    .vendor-stats { display: flex; justify-content: space-between; padding-top: 20px; border-top: 1px solid var(--border); }
                    .vendor-stat { text-align: center; }
                    .vendor-stat-value { font-size: 20px; font-weight: 700; color: white; }
                    .vendor-stat-value.green { color: var(--green); }
                    .vendor-stat-value.yellow { color: var(--yellow); }
                    .vendor-stat-value.red { color: var(--red); }
                    .vendor-stat-label { font-size: 11px; color: var(--text-3); text-transform: uppercase; letter-spacing: 0.5px; }

                    /* Timeline */
                    .timeline-section { margin-top: 60px; margin-bottom: 60px; }
                    .timeline { display: flex; gap: 16px; overflow-x: auto; padding: 20px 0; scrollbar-width: none; }
                    .timeline::-webkit-scrollbar { display: none; }
                    
                    .timeline-item { flex: 0 0 200px; position: relative; padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 20px; transition: all 0.2s; cursor: pointer; }
                    .timeline-item:hover { border-color: var(--accent); }
                    
                    .timeline-dot { width: 16px; height: 16px; border-radius: 50%; position: absolute; top: -8px; left: 50%; transform: translateX(-50%); }
                    .timeline-item.expired .timeline-dot { background: var(--red); box-shadow: 0 0 20px var(--red); }
                    .timeline-item.critical .timeline-dot { background: var(--red); }
                    .timeline-item.warning .timeline-dot { background: var(--yellow); }
                    
                    .timeline-days { font-size: 32px; font-weight: 800; margin-bottom: 8px; color: white; }
                    .timeline-item.expired .timeline-days { color: var(--red); }
                    .timeline-item.critical .timeline-days { color: var(--red); }
                    .timeline-item.warning .timeline-days { color: var(--yellow); }
                    
                    .timeline-vendor { font-size: 14px; font-weight: 600; margin-bottom: 4px; color: white; }
                    .timeline-doc { font-size: 12px; color: var(--text-3); }

                    /* Bubbles */
                    .bubbles-section { margin-top: 60px; }
                    .bubbles-grid { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
                    
                    .bubble { width: 160px; height: 160px; border-radius: 50%; background: var(--surface); border: 2px solid var(--border); display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; position: relative; }
                    .bubble:hover { transform: scale(1.1); border-color: var(--accent); }
                    
                    .bubble-value { font-size: 36px; font-weight: 800; line-height: 1; }
                    .bubble-label { font-size: 11px; color: var(--text-2); text-transform: uppercase; letter-spacing: 1px; margin-top: 8px; }
                    
                    .bubble.receiving { border-color: var(--accent); }
                    .bubble.receiving .bubble-value { color: var(--accent); }
                    .bubble.shipping { border-color: var(--green); }
                    .bubble.shipping .bubble-value { color: var(--green); }
                    .bubble.items { border-color: var(--yellow); }
                    .bubble.items .bubble-value { color: var(--yellow); }
                    .bubble.alerts { border-color: var(--red); }
                    .bubble.alerts .bubble-value { color: var(--red); }
                `}</style>
            </div>
        </DashboardLayout>
    );
}
