'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { Upload, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SHIPPING_LOG = [
    { id: 'SH-4452', date: '2026-01-22', customer: 'Walmart Distribution', po: 'WM-999', product: 'Chips Assortment', status: 'In Transit' },
    { id: 'SH-4450', date: '2026-01-15', customer: 'Costco Wholesale', po: 'CO-551', product: 'Pretzels', status: 'Delivered' },
    { id: 'SH-4448', date: '2026-01-10', customer: 'Local Grocery', po: 'LG-112', product: 'Chips Assortment', status: 'Delivered' },
];

export default function ShippingPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const columns = [
        { header: 'Shipment ID', accessor: 'id' as const, className: 'font-bold' },
        { header: 'Date', accessor: 'date' as const },
        { header: 'Customer', accessor: 'customer' as const },
        { header: 'Customer PO', accessor: 'po' as const },
        { header: 'Product', accessor: 'product' as const },
        {
            header: 'Status',
            accessor: (item: any) => {
                const variant = item.status === 'Delivered' ? 'success' : item.status === 'In Transit' ? 'warning' : 'neutral';
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
                        <h1 className="text-2xl font-bold">Outbound Shipping</h1>
                        <p className="text-muted">Track customer shipments and inspections.</p>
                    </div>
                    <Button><Plus size={16} style={{ marginRight: '8px' }} /> New Shipment</Button>
                </div>

                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <div style={{ width: '300px' }}>
                            <Input
                                placeholder="Search Customer or PO..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ margin: 0 }}
                            />
                        </div>
                        <Button variant="secondary"><Upload size={16} style={{ marginRight: '8px' }} /> Export Log</Button>
                    </div>

                    <Table
                        data={SHIPPING_LOG}
                        columns={columns}
                        onRowClick={(item) => router.push(`/shipping/${item.id}`)}
                    />
                </Card>
            </div>
        </DashboardLayout>
    );
}
