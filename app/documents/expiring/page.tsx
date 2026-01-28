'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import { Download, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ExpiringDoc {
    id: string;
    vendor: string;
    vendorId: string;
    doc: string;
    expiry: string;
    days: number;
    status: string;
}

export default function ExpiringReferencePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('30');
    const [docs, setDocs] = useState<ExpiringDoc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocs();
    }, []);

    const fetchDocs = async () => {
        try {
            const res = await fetch('/api/documents/expiring?days=90');
            const data = await res.json();
            if (Array.isArray(data)) {
                setDocs(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = () => {
        if (!docs.length) return alert('No data to export');

        const csvContent = [
            ['Vendor', 'Document', 'Expiry Date', 'Days Remaining', 'Status'],
            ...filteredData.map(d => [d.vendor, d.doc, d.expiry, d.days, d.status])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `expiring_docs_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleRemind = (doc: ExpiringDoc) => {
        alert(`Reminder sent to ${doc.vendor} for ${doc.doc} (Simulated)`);
    };

    const filteredData = docs.filter(d => {
        if (activeTab === 'expired') return d.days < 0;
        if (activeTab === '30') return d.days >= 0 && d.days <= 30;
        if (activeTab === '60') return d.days > 0 && d.days <= 60; // Just showing buckets
        return true;
    });

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Document Compliance</h1>
                        <p className="text-muted">Track expiring and expired vendor certifications.</p>
                    </div>
                    <Button onClick={handleExport}><Download size={16} style={{ marginRight: '8px' }} /> Export Report</Button>
                </div>

                <Card>
                    <div className="flex gap-sm mb-6 border-b border-gray-100 pb-4">
                        <Button variant={activeTab === '30' ? 'primary' : 'ghost'} onClick={() => setActiveTab('30')}>Expiring 30 Days</Button>
                        <Button variant={activeTab === '60' ? 'primary' : 'ghost'} onClick={() => setActiveTab('60')}>Expiring 60 Days</Button>
                        <Button variant={activeTab === 'expired' ? 'danger' : 'ghost'} onClick={() => setActiveTab('expired')}>Expired</Button>
                    </div>

                    {loading ? <p className="p-4 text-muted">Loading...</p> : (
                        <Table
                            data={filteredData}
                            columns={[
                                {
                                    header: 'Vendor',
                                    accessor: (item: ExpiringDoc) => (
                                        <a href={`/suppliers/${item.vendorId}`} className="text-primary hover:underline font-bold">
                                            {item.vendor}
                                        </a>
                                    )
                                },
                                { header: 'Document', accessor: 'doc' },
                                { header: 'Expiry Date', accessor: 'expiry' },
                                {
                                    header: 'Days Remaining',
                                    accessor: (item: ExpiringDoc) => (
                                        <span style={{
                                            color: item.days < 0 ? 'var(--color-error)' : 'var(--color-warning)',
                                            fontWeight: 'bold'
                                        }}>
                                            {item.days < 0 ? `${Math.abs(item.days)} Days Overdue` : `${item.days} Days`}
                                        </span>
                                    )
                                },
                                {
                                    header: 'Action',
                                    accessor: (item: ExpiringDoc) => (
                                        <Button size="sm" variant="secondary" onClick={() => handleRemind(item)}>
                                            <Mail size={14} style={{ marginRight: '6px' }} /> Remind
                                        </Button>
                                    )
                                }
                            ]}
                        />
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
}
