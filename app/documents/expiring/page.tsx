'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { Download, Mail } from 'lucide-react';

const EXPIRING_DOCS = [
    { id: '1', vendor: 'Kerry Ingredients', doc: 'Kosher Cert', expiry: '2026-02-10', days: 17, status: 'warning' },
    { id: '2', vendor: 'ABC Foods', doc: 'SQF Level 2', expiry: '2026-02-15', days: 22, status: 'warning' },
    { id: '3', vendor: 'Packaging Co', doc: 'Liability Ins', expiry: '2026-02-20', days: 27, status: 'warning' },
    { id: '4', vendor: 'XYZ Trucking', doc: 'COI', expiry: '2025-01-01', days: -25, status: 'expired' },
];

export default function ExpiringReferencePage() {
    const [activeTab, setActiveTab] = useState('30');

    const filteredData = EXPIRING_DOCS.filter(d => {
        if (activeTab === 'expired') return d.status === 'expired';
        if (activeTab === '30') return d.days <= 30 && d.status !== 'expired';
        if (activeTab === '60') return d.days <= 60 && d.status !== 'expired';
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
                    <Button><Download size={16} style={{ marginRight: '8px' }} /> Export Report</Button>
                </div>

                <Card>
                    <div className="flex gap-sm mb-6 border-b border-gray-100 pb-4">
                        <Button variant={activeTab === '30' ? 'primary' : 'ghost'} onClick={() => setActiveTab('30')}>Expiring 30 Days</Button>
                        <Button variant={activeTab === '60' ? 'primary' : 'ghost'} onClick={() => setActiveTab('60')}>Expiring 60 Days</Button>
                        <Button variant={activeTab === 'expired' ? 'danger' : 'ghost'} onClick={() => setActiveTab('expired')}>Expired</Button>
                    </div>

                    <Table
                        data={filteredData}
                        columns={[
                            { header: 'Vendor', accessor: 'vendor', className: 'font-bold' },
                            { header: 'Document', accessor: 'doc' },
                            { header: 'Expiry Date', accessor: 'expiry' },
                            {
                                header: 'Days Remaining',
                                accessor: (item: any) => (
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
                                accessor: () => (
                                    <Button size="sm" variant="secondary"><Mail size={14} style={{ marginRight: '6px' }} /> Remind</Button>
                                )
                            }
                        ]}
                    />
                </Card>
            </div>
        </DashboardLayout>
    );
}
