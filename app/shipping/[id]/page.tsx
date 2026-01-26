'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { CheckCircle, XCircle, FileText, Printer, MapPin, Truck } from 'lucide-react';

const SHIP_DATA = {
    id: 'SH-4452',
    date: '2026-01-22',
    time: '14:30',
    status: 'In Transit',
    customer: 'Walmart Distribution',
    address: '123 Walmart Way, Bentonville AR',
    po: 'WM-999',
    product: 'Chips Assortment',
    pallets: 22,
    lot: 'L-88219, L-88220',
    trucking: 'JB Hunt',
    tracking: 'TRK-88219900',
    seal: 'SL-55521',
    checks: {
        damage: 'NO',
        odor: 'NO',
        clean: 'YES'
    },
    shippedBy: 'Mike Warehouse',
};

export default function ShippingDetailPage({ params }: { params: { id: string } }) {

    const CheckItem = ({ label, pass }: { label: string, pass: boolean }) => (
        <div className="flex justify-between items-center p-3 border-b border-gray-100">
            <span className="font-medium">{label}</span>
            {pass ? (
                <span className="flex items-center gap-xs text-sm" style={{ color: 'var(--color-success)' }}>
                    <CheckCircle size={16} /> PASSED
                </span>
            ) : (
                <span className="flex items-center gap-xs text-sm" style={{ color: 'var(--color-error)' }}>
                    <XCircle size={16} /> FAILED
                </span>
            )}
        </div>
    );

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-sm mb-1">
                            <h1 className="text-2xl font-bold">{SHIP_DATA.id}</h1>
                            <Badge label={SHIP_DATA.status} variant="warning" />
                        </div>
                        <p className="text-muted">Shipped on {SHIP_DATA.date} at {SHIP_DATA.time}</p>
                    </div>
                    <div className="flex gap-sm">
                        <Button variant="secondary"><Printer size={16} style={{ marginRight: '8px' }} /> Print BOL</Button>
                        <Button variant="primary">Edit Shipment</Button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                    <div className="flex flex-col gap-md">
                        {/* Customer Info */}
                        <Card title="Destination">
                            <div className="flex items-start gap-md mb-4">
                                <div style={{ padding: '12px', background: '#F1F5F9', borderRadius: '8px' }}>
                                    <MapPin size={24} color="#64748B" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{SHIP_DATA.customer}</h3>
                                    <p className="text-muted">{SHIP_DATA.address}</p>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                                <div>
                                    <p className="text-xs text-muted uppercase font-bold">Customer PO</p>
                                    <p className="font-medium">{SHIP_DATA.po}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted uppercase font-bold">Trucking Co</p>
                                    <p className="font-medium">{SHIP_DATA.trucking}</p>
                                </div>
                            </div>
                        </Card>

                        <Card title="Product Details">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <p className="text-xs text-muted uppercase font-bold">Product</p>
                                    <p className="font-medium">{SHIP_DATA.product}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted uppercase font-bold">Pallet Count</p>
                                    <p className="font-medium">{SHIP_DATA.pallets}</p>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <p className="text-xs text-muted uppercase font-bold">Lot Numbers</p>
                                    <p className="font-medium">{SHIP_DATA.lot}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Inspection Checklist */}
                        <Card title="Trailer Inspection Checklist">
                            <CheckItem label="Trailer Damage Check" pass={SHIP_DATA.checks.damage === 'NO'} />
                            <CheckItem label="Odor Check" pass={SHIP_DATA.checks.odor === 'NO'} />
                            <CheckItem label="Cleanliness Check" pass={SHIP_DATA.checks.clean === 'YES'} />
                        </Card>
                    </div>

                    <div className="flex flex-col gap-md">
                        {/* Tracking */}
                        <Card>
                            <p className="text-sm text-muted mb-2">Tracking Number</p>
                            <div className="flex items-center gap-sm mb-4">
                                <Truck size={20} />
                                <span className="font-bold text-lg">{SHIP_DATA.tracking}</span>
                            </div>

                            <p className="text-sm text-muted mb-1">Seal Number</p>
                            <p className="font-bold mb-4">{SHIP_DATA.seal}</p>

                            <p className="text-sm text-muted mb-1">Shipped By</p>
                            <p className="font-bold">{SHIP_DATA.shippedBy}</p>

                            <div style={{ marginTop: '24px', borderTop: '1px solid #E2E8F0', paddingTop: '16px' }}>
                                <p className="text-xs font-bold uppercase text-muted mb-2">Signature</p>
                                <div style={{ height: '60px', backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span className="text-muted italic">Signed Electronically</span>
                                </div>
                            </div>
                        </Card>

                        {/* Attachments */}
                        <Card title="Documents">
                            <div className="flex flex-col gap-sm">
                                <Button variant="secondary" size="sm" className="justify-start"><FileText size={14} style={{ marginRight: '8px' }} /> View BOL</Button>
                                <Button variant="secondary" size="sm" className="justify-start"><FileText size={14} style={{ marginRight: '8px' }} /> View Packing List</Button>
                                <Button variant="secondary" size="sm" className="justify-start"><FileText size={14} style={{ marginRight: '8px' }} /> View Invoice</Button>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
