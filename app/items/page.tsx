'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { CheckCircle, XCircle, Plus } from 'lucide-react';

const ITEMS = [
    { id: '1', sku: 'RM-1001', name: 'Wheat Flour', supplier: 'Kerry Ingredients', spec: true, allergen: true },
    { id: '2', sku: 'RM-1002', name: 'Sugar', supplier: 'ABC Foods', spec: true, allergen: true },
    { id: '3', sku: 'PK-5001', name: 'Film Roll A', supplier: 'Freedman Packaging', spec: true, allergen: false }, // Allergen N/A
    { id: '4', sku: 'RM-1003', name: 'Spices Mix', supplier: 'Quality Spices', spec: true, allergen: true },
];

export default function ItemsPage() {
    const [search, setSearch] = useState('');

    const filteredData = ITEMS.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.sku.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { header: 'SKU', accessor: 'sku' as const, className: 'font-bold' },
        { header: 'Item Name', accessor: 'name' as const },
        { header: 'Supplier', accessor: 'supplier' as const },
        {
            header: 'Spec Sheet',
            accessor: (item: any) => item.spec ? <CheckCircle size={20} color="var(--color-success)" /> : <XCircle size={20} color="var(--color-error)" />
        },
        {
            header: 'Allergen Cert',
            accessor: (item: any) => item.allergen ? <CheckCircle size={20} color="var(--color-success)" /> : <span className="text-muted">-</span>
        },
        { header: 'Actions', accessor: () => <Button size="sm" variant="secondary">Edit</Button> },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Items Master</h1>
                        <p className="text-muted">Manage raw materials and packaging items.</p>
                    </div>
                    <Button><Plus size={16} style={{ marginRight: '8px' }} /> Add Item</Button>
                </div>

                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <div style={{ width: '300px' }}>
                            <Input
                                placeholder="Search SKU or Name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ margin: 0 }}
                            />
                        </div>
                    </div>

                    <Table data={filteredData} columns={columns} />
                </Card>
            </div>
        </DashboardLayout>
    );
}
