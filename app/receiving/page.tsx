'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { Download, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const RECEIVING_LOG = [
    { id: 'PO-1001', date: '2026-01-20', supplier: 'Kerry Ingredients', product: 'Wheat Flour', pallets: 5, status: 'Complete', inspection: 'Passed' },
    { id: 'PO-1002', date: '2026-01-22', supplier: 'ABC Foods', product: 'Sugar', pallets: 10, status: 'Pending', inspection: 'Pending' },
    { id: 'PO-0950', date: '2025-12-15', supplier: 'Freedman Packaging', product: 'Films', pallets: 20, status: 'Complete', inspection: 'Passed' },
];

export default function ReceivingPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const columns = [
        { header: 'PO Number', accessor: 'id' as const, className: 'font-bold' },
        { header: 'Date', accessor: 'date' as const },
        { header: 'Supplier', accessor: 'supplier' as const },
        { header: 'Product', accessor: 'product' as const },
        { header: 'Pallets', accessor: 'pallets' as const },
        {
            header: 'Truck Inspection',
            accessor: (item: any) => {
                if (item.inspection === 'Passed') return <Badge label="Passed" variant="success" />;
                if (item.inspection === 'Pending') return <Badge label="Pending" variant="neutral" />;
                return <Badge label="Issues" variant="warning" />;
            }
        },
        {
            header: 'Status',
            accessor: (item: any) => {
                const variant = item.status === 'Complete' ? 'success' : 'warning';
                return <Badge label={item.status} variant={variant} />;
            }
        },
        { header: 'Actions', accessor: () => <Button size="sm" variant="secondary">View</Button> },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Inbound Receiving</h1>
                        <p className="text-muted">Log and inspect incoming raw materials and packaging.</p>
                    </div>
                    <Button><Plus size={16} style={{ marginRight: '8px' }} /> New Check-in</Button>
                </div>

                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <div style={{ width: '300px' }}>
                            <Input
                                placeholder="Search PO or Supplier..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ margin: 0 }}
                            />
                        </div>
                        <Button variant="secondary"><Download size={16} style={{ marginRight: '8px' }} /> Export Log</Button>
                    </div>

                    <Table
                        data={RECEIVING_LOG}
                        columns={columns}
                        onRowClick={(item) => router.push(`/receiving/${item.id}`)}
                    />
                </Card>
            </div>
        </DashboardLayout>
    );
}
