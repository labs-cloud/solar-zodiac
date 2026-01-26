'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Table } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { MapPin, Mail, Phone, ShoppingBag, Plus } from 'lucide-react';

const HISTORY = [
    { id: '4452', date: '2026-01-22', po: 'WM-999', product: 'Chips Assortment', tracking: 'TRK-8821', status: 'In Transit' },
    { id: '4450', date: '2026-01-15', po: 'WM-850', product: 'Pretzels', tracking: 'TRK-7712', status: 'Delivered' },
    { id: '4448', date: '2026-01-10', po: 'WM-800', product: 'Chips Assortment', tracking: 'TRK-6632', status: 'Delivered' },
];

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
    // Mock Customer
    const CUSTOMER = {
        id: '1',
        name: 'Walmart Distribution',
        contact: {
            name: 'Sam Buyer',
            email: 'sam@walmart.com',
            phone: '(555) 999-8888',
        },
        billing: '123 Walmart Way, Bentonville AR',
        shipping: 'Distribution Center #4, Dallas TX'
    };

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-md">

                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{CUSTOMER.name}</h1>
                            <div className="flex gap-md text-sm text-muted mb-4">
                                <span className="flex items-center gap-xs"><Mail size={14} /> {CUSTOMER.contact.email}</span>
                                <span className="flex items-center gap-xs"><Phone size={14} /> {CUSTOMER.contact.phone}</span>
                            </div>
                            <div className="flex gap-lg">
                                <div>
                                    <p className="text-xs font-bold uppercase text-muted mb-1">Billing Address</p>
                                    <p className="text-sm flex items-start gap-xs"><MapPin size={14} className="mt-1" /> {CUSTOMER.billing}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-muted mb-1">Default Shipping</p>
                                    <p className="text-sm flex items-start gap-xs"><MapPin size={14} className="mt-1" /> {CUSTOMER.shipping}</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="mb-2">
                                <span className="text-2xl font-bold">124</span>
                                <p className="text-xs text-muted font-bold uppercase">Total Shipments</p>
                            </div>
                            <Button variant="secondary">Edit Details</Button>
                        </div>
                    </div>
                </Card>

                <Card title="Shipment History" action={<Button size="sm"><Plus size={14} style={{ marginRight: '6px' }} /> New Shipment</Button>}>
                    <Table
                        data={HISTORY}
                        columns={[
                            { header: 'Date', accessor: 'date' },
                            { header: 'Customer PO', accessor: 'po' },
                            { header: 'Product', accessor: 'product' },
                            { header: 'Tracking #', accessor: 'tracking' },
                            {
                                header: 'Status',
                                accessor: (item: any) => {
                                    const variant = item.status === 'Delivered' ? 'success' : item.status === 'In Transit' ? 'warning' : 'neutral';
                                    return <Badge label={item.status} variant={variant} />;
                                }
                            },
                            { header: 'Action', accessor: () => <Button size="sm" variant="secondary">View</Button> }
                        ]}
                    />
                </Card>
            </div>
        </DashboardLayout>
    );
}
