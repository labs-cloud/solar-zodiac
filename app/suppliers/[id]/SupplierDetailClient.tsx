'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

interface Supplier {
    id: string;
    company_name: string;
    vendor_type: { type_name: string };
    contact_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    address: string | null;
    onboarding_status: string;
    compliance_score: number;
    // Docs
    coi_uploaded: boolean;
    coi_expiry: Date | string | null;
    coi_url: string | null;
    kosher_uploaded: boolean;
    sqf_uploaded: boolean;
    haccp_uploaded: boolean;
    allergen_uploaded: boolean;
    spec_sheet_uploaded: boolean;
    // Add other fields as needed for display
}

export default function SupplierDetailClient({ supplier }: { supplier: Supplier }) {
    const router = useRouter();
    const [uploading, setUploading] = useState<string | null>(null);

    // Helper to render doc status row
    const renderDocRow = (label: string, uploaded: boolean, expiry?: string | Date | null, url?: string | null, docTypeKey?: string) => {
        return (
            <div className="flex items-center justify-between p-4 border rounded-lg mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${uploaded ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        <FileText size={20} />
                    </div>
                    <div>
                        <p className="font-bold">{label}</p>
                        {expiry && <p className="text-xs text-muted">Expires: {new Date(expiry).toLocaleDateString()}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {uploaded ? (
                        <>
                            <Badge label="Valid" variant="success" />
                            {url && (
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                                    View <ExternalLink size={12} />
                                </a>
                            )}
                        </>
                    ) : (
                        <Badge label="Missing" variant="error" />
                    )}

                    {/* Upload mechanism would go here - simplified for now */}
                    <Button size="sm" variant="secondary" onClick={() => alert('Upload modal would open here. Use the Upload API.')}>
                        <Upload size={14} className="mr-1" /> Upload
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft size={16} className="mr-2" /> Back to Suppliers
                </Button>

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{supplier.company_name}</h1>
                        <div className="flex items-center gap-3">
                            <Badge label={supplier.vendor_type.type_name} variant="neutral" />
                            <Badge label={supplier.onboarding_status} variant={supplier.onboarding_status === 'Complete' ? 'success' : 'warning'} />
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-muted mb-1">Compliance Score</div>
                        <div className="text-4xl font-bold text-primary">{supplier.compliance_score}%</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Check out the main content */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <Card title="Compliance Documents">
                            {renderDocRow('Certificate of Insurance (COI)', supplier.coi_uploaded, supplier.coi_expiry, supplier.coi_url, 'COI')}
                            {renderDocRow('Kosher Certificate', supplier.kosher_uploaded, null, null, 'Kosher')}
                            {renderDocRow('SQF / GFSI Certification', supplier.sqf_uploaded, null, null, 'SQF')}
                            {renderDocRow('HACCP Plan', supplier.haccp_uploaded, null, null, 'HACCP')}
                            {renderDocRow('Allergen Policy', supplier.allergen_uploaded, null, null, 'Allergen')}
                            {renderDocRow('Specification Sheets', supplier.spec_sheet_uploaded, null, null, 'Spec Sheet')}
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="flex flex-col gap-6">
                        <Card title="Contact Information">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-xs text-muted uppercase font-bold">Main Contact</label>
                                    <p>{supplier.contact_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted uppercase font-bold">Email</label>
                                    <p className="text-blue-600">{supplier.contact_email || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted uppercase font-bold">Phone</label>
                                    <p>{supplier.contact_phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-muted uppercase font-bold">Address</label>
                                    <p className="text-sm">{supplier.address || 'N/A'}</p>
                                </div>
                            </div>
                        </Card>

                        <Card title="Notes">
                            <p className="text-sm text-muted italic">No notes added yet.</p>
                            <Button size="sm" variant="ghost" className="mt-2 text-primary">+ Add Note</Button>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
