'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { CheckCircle, XCircle, FileText, Printer } from 'lucide-react';

const PO_DATA = {
    id: 'PO-1001',
    date: '2026-01-20',
    status: 'Complete',
    supplier: 'Kerry Ingredients',
    shipper: 'Glanbia Nutritionals',
    product: 'Wheat Flour',
    pallets: 5,
    lot: 'L-88219, L-88220',
    trucking: 'Swift Transport',
    bolMatch: 'YES',
    checks: {
        damage: 'NO',
        odor: 'NO',
        clean: 'YES'
    },
    special: {
        gluten: false,
        allergen: 'Yes (Wheat)',
        sticker: 'Yes'
    },
    receivedBy: 'Mike Warehouse',
    reviewedBy: 'Alex QA'
};

export default function ReceivingDetailPage({ params }: { params: { id: string } }) {

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
                        <h1 className="text-2xl font-bold">{PO_DATA.id}</h1>
                        <p className="text-muted">Received on {PO_DATA.date}</p>
                    </div>
                    <div className="flex gap-sm">
                        <Button variant="secondary"><Printer size={16} style={{ marginRight: '8px' }} /> Print Report</Button>
                        <Button variant="primary">Edit Record</Button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>

                    <div className="flex flex-col gap-md">
                        {/* Product Info */}
                        <Card title="Product & Supplier">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <p className="text-xs text-muted uppercase font-bold">Supplier</p>
                                    <p className="font-medium">{PO_DATA.supplier}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted uppercase font-bold">Shipper (BOL)</p>
                                    <p className="font-medium">{PO_DATA.shipper}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted uppercase font-bold">Product</p>
                                    <p className="font-medium">{PO_DATA.product}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted uppercase font-bold">Pallet Count</p>
                                    <p className="font-medium">{PO_DATA.pallets}</p>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <p className="text-xs text-muted uppercase font-bold">Lot Numbers</p>
                                    <p className="font-medium">{PO_DATA.lot}</p>
                                </div>
                            </div>
                        </Card>

                        {/* Inspection Checklist */}
                        <Card title="Truck Inspection Checklist">
                            <CheckItem label="Truck Damage Check (No holes/leaks)" pass={PO_DATA.checks.damage === 'NO'} />
                            <CheckItem label="Odor Check (No strong/foul odors)" pass={PO_DATA.checks.odor === 'NO'} />
                            <CheckItem label="Cleanliness Check (Swept/Dry)" pass={PO_DATA.checks.clean === 'YES'} />
                            <CheckItem label="BOL Quantity Match" pass={PO_DATA.bolMatch === 'YES'} />
                        </Card>

                        {/* Handling */}
                        <Card title="Special Handling">
                            <div className="flex flex-col gap-sm">
                                <div className="flex justify-between p-2">
                                    <span>Contains Allergen?</span>
                                    <span className="font-bold">{PO_DATA.special.allergen}</span>
                                </div>
                                <div className="flex justify-between p-2">
                                    <span>Allergen Sticker Applied?</span>
                                    <Badge label={PO_DATA.special.sticker} variant="success" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="flex flex-col gap-md">
                        {/* Status */}
                        <Card>
                            <p className="text-sm text-muted mb-2">Current Status</p>
                            <Badge label={PO_DATA.status} variant="success" className="text-lg px-3 py-1 mb-4" />

                            <p className="text-sm text-muted mb-1">Received By</p>
                            <p className="font-bold mb-4">{PO_DATA.receivedBy}</p>

                            <p className="text-sm text-muted mb-1">Reviewed By</p>
                            <p className="font-bold">{PO_DATA.reviewedBy}</p>

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
                                <Button variant="secondary" size="sm" className="justify-start"><FileText size={14} style={{ marginRight: '8px' }} /> View COA</Button>
                                <Button variant="secondary" size="sm" className="justify-start"><FileText size={14} style={{ marginRight: '8px' }} /> View Invoice</Button>
                                <Button variant="secondary" size="sm" className="justify-start"><FileText size={14} style={{ marginRight: '8px' }} /> Truck Photos</Button>
                            </div>
                        </Card>
                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
