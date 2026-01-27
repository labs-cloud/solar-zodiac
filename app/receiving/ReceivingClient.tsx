'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { Download, Plus, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';


interface ReceivingClientProps {
    initialData: any[];
}

export default function ReceivingClient({ initialData }: ReceivingClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredData = initialData.filter(item =>
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.supplier.toLowerCase().includes(search.toLowerCase())
    );

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
        {
            header: 'Actions', accessor: (item: any) =>
                <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); if (item.docs_url) setPreviewDoc({ url: item.docs_url, title: `PO ${item.id} Docs` }); }}>Docs</Button>
        },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Inbound Receiving</h1>
                        <p className="text-muted">Log and inspect incoming raw materials and packaging.</p>
                    </div>
                    <Button onClick={() => router.push('/receiving/new')}><Plus size={16} style={{ marginRight: '8px' }} /> New Check-in</Button>
                </div>

                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <div style={{ width: '300px' }} className="relative">
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
                        data={filteredData}
                        columns={columns}
                        onRowClick={(item) => router.push(`/receiving/${item.id}`)}
                    />
                </Card>
            </div>

            {mounted && previewDoc && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-10 bg-black/70" onClick={() => setPreviewDoc(null)}>
                    <div className="bg-white rounded-xl w-full max-w-4xl h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between p-4 border-b">
                            <h3 className="font-bold">{previewDoc.title}</h3>
                            <button onClick={() => setPreviewDoc(null)}><X /></button>
                        </div>
                        <div className="flex-1 bg-gray-100 p-4">
                            <iframe src={previewDoc.url} className="w-full h-full bg-white border-none" />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </DashboardLayout>
    );
}
