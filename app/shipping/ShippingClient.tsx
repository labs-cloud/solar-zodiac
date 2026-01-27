'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { Upload, Plus, ExternalLink, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ShippingClientProps {
    initialData: any[];
}

export default function ShippingClient({ initialData }: ShippingClientProps) {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredData = initialData.filter(item =>
        item.customer.toLowerCase().includes(search.toLowerCase()) ||
        item.po.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase())
    );

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
        {
            header: 'Actions', accessor: (item: any) =>
                <div className="flex gap-2">
                    {item.docs_url &&
                        <Button size="sm" variant="secondary" onClick={(e) => { e.stopPropagation(); setPreviewDoc({ url: item.docs_url, title: `Shipment ${item.id} Docs` }); }}>
                            <ExternalLink size={12} />
                        </Button>
                    }
                    <Button size="sm" variant="secondary">View</Button>
                </div>
        },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Outbound Shipping</h1>
                        <p className="text-muted">Track customer shipments and inspections.</p>
                    </div>
                    <Button onClick={() => router.push('/shipping/new')}><Plus size={16} style={{ marginRight: '8px' }} /> New Shipment</Button>
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
                        data={filteredData}
                        columns={columns}
                        onRowClick={(item) => router.push(`/shipping/${item.id}`)}
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
