'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, Users, UserCircle, Download, Upload, FileText, AlertTriangle } from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Suppliers', href: '/suppliers', icon: Users },
    { label: 'Customers', href: '/customers', icon: UserCircle },
    { label: 'Inbound POs', href: '/receiving', icon: Download },
    { label: 'Outbound Shipments', href: '/shipping', icon: Upload },
    { label: 'Items', href: '/items', icon: FileText },
    { label: 'Expiring Docs', href: '/documents/expiring', icon: AlertTriangle },
];

export function Sidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const user = session?.user;
    const initials = user?.email?.substring(0, 2).toUpperCase() || 'AD';

    return (
        <aside style={{
            width: '250px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>The Snackatere</h2>
                <p style={{ opacity: 0.7, fontSize: '0.75rem', marginTop: '4px' }}>Compliance Dashboard</p>
            </div>

            <nav style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 24px',
                                        color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                                        backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Integration Sync Control */}
            <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-xs text-gray-400 mb-2 uppercase font-bold">Integrations</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', opacity: 0.8 }}>Wherefour</span>
                    <button
                        onClick={async () => {
                            const btn = document.getElementById('sync-btn');
                            if (btn) { btn.innerText = 'Syncing...'; (btn as HTMLButtonElement).disabled = true; }
                            try {
                                await fetch('/api/integrations/wherefour/sync', { method: 'POST' });
                                alert('Sync Complete!');
                            } catch (e) {
                                alert('Sync Failed');
                            } finally {
                                if (btn) { btn.innerText = 'Sync Now'; (btn as HTMLButtonElement).disabled = false; }
                            }
                        }}
                        id="sync-btn"
                        style={{
                            fontSize: '10px', padding: '4px 8px', background: 'var(--color-primary)', border: 'none', borderRadius: '4px',
                            color: 'white', cursor: 'pointer'
                        }}
                    >
                        Sync Now
                    </button>
                </div>
            </div>

            <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.8, marginBottom: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{initials}</span>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: '14px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Admin User'}</p>
                        <p style={{ fontSize: '12px', margin: 0, opacity: 0.7, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'Loading...'}</p>
                    </div>
                </div>
                <button
                    onClick={() => signOut()}
                    style={{
                        width: '100%',
                        padding: '8px',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                    }}
                >
                    Sign Out
                </button>
            </div>
        </aside >
    );
}
