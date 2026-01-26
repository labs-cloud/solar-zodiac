'use client';

import React from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Upload, CheckCircle, AlertTriangle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VendorDashboard() {
    const router = useRouter();

    // Mock Vendor Data
    const VENDOR = {
        name: 'Kerry Ingredients',
        score: 85,
        docs: [
            { id: 1, type: 'COI', status: 'valid', expiry: '2026-06-01' },
            { id: 2, type: 'Kosher Cert', status: 'warning', expiry: '2026-02-10', days: 17 },
            { id: 3, type: 'Spec Sheets', status: 'missing', expiry: null },
        ]
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
            {/* Top Bar */}
            <header style={{ backgroundColor: 'var(--color-secondary)', color: 'white', padding: '16px 24px' }}>
                <div className="container flex justify-between items-center" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <h1 className="text-lg font-bold">The Snackatere <span style={{ opacity: 0.7, fontWeight: 'normal' }}>| Vendor Portal</span></h1>
                    <Button variant="ghost" style={{ color: 'white' }} onClick={() => router.push('/portal/login')}><LogOut size={16} style={{ marginRight: '8px' }} /> Logout</Button>
                </div>
            </header>

            <main className="container" style={{ maxWidth: '1000px', margin: '32px auto', padding: '0 16px' }}>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2">Welcome, {VENDOR.name}</h2>
                    <p className="text-muted">Please keep your compliance documents up to date to ensure uninterrupted business.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                    {/* Document Checklist */}
                    <div className="flex flex-col gap-md">
                        {VENDOR.docs.map(doc => (
                            <Card key={doc.id}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-md">
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            backgroundColor: doc.status === 'valid' ? '#DCFCE7' : doc.status === 'warning' ? '#FEF9C3' : '#FEE2E2',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: doc.status === 'valid' ? '#166534' : doc.status === 'warning' ? '#854D0E' : '#991B1B'
                                        }}>
                                            {doc.status === 'valid' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{doc.type}</h3>
                                            {doc.expiry && <p className="text-sm text-muted">Expires: {doc.expiry}</p>}
                                            {doc.status === 'warning' && <p className="text-sm font-bold" style={{ color: 'var(--color-warning)' }}>Expiring in {doc.days} days</p>}
                                            {doc.status === 'missing' && <p className="text-sm font-bold" style={{ color: 'var(--color-error)' }}>Document Missing</p>}
                                        </div>
                                    </div>
                                    <Button variant={doc.status === 'valid' ? 'secondary' : 'primary'}>
                                        <Upload size={16} style={{ marginRight: '8px' }} /> {doc.status === 'valid' ? 'Update' : 'Upload'}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Score / Stats */}
                    <div>
                        <Card className="text-center">
                            <h3 className="text-lg font-bold mb-4">Compliance Score</h3>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                border: '8px solid var(--color-warning)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                margin: '0 auto 16px'
                            }}>
                                {VENDOR.score}%
                            </div>
                            <p className="text-sm text-muted">You are <span className="font-bold text-warning">85% compliant</span>. Please upload missing documents to reach 100%.</p>
                        </Card>
                    </div>

                </div>
            </main>
        </div>
    );
}
