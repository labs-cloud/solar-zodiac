'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Table } from '@/components/Table';
import {
    CheckCircle,
    XCircle,
    Eye,
    ArrowLeft,
    Mail,
    Phone,
    X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SupplierDetailClientProps {
    supplier: any;
    pos: any[];
    shipments: any[];
}

export default function SupplierDetailClient({ supplier: initialSupplier, pos, shipments }: SupplierDetailClientProps) {
    const router = useRouter();
    const [supplier, setSupplier] = useState(initialSupplier);
    const [uploading, setUploading] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string; type: string } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleFileUpload = async (documentType: string, file: File, expiryDate?: string) => {
        setUploading(true);
        setUploadingDoc(documentType);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('supplierId', supplier.id);
            formData.append('documentType', documentType);
            if (expiryDate) {
                formData.append('expiryDate', expiryDate);
            }

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert(`${documentType} uploaded successfully!`);
                // Refresh supplier data
                router.refresh();
            } else {
                alert(`Failed to upload ${documentType}`);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
            setUploadingDoc(null);
        }
    };

    const DocumentUploadCard = ({
        title, uploaded, expiry, url, documentType
    }: any) => {
        const [selectedFile, setSelectedFile] = useState<File | null>(null);
        const [expiryDate, setExpiryDate] = useState('');

        const handleUploadClick = () => {
            if (selectedFile) {
                handleFileUpload(documentType, selectedFile, expiryDate || undefined);
                setSelectedFile(null);
                setExpiryDate('');
            }
        };

        const isExpiringSoon = expiry && new Date(expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        const isExpired = expiry && new Date(expiry) < new Date();

        return (
            <Card style={{ padding: '24px' }}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h4 className="font-bold mb-2" style={{ fontSize: '1.0625rem' }}>{title}</h4>
                        {expiry && (
                            <p className="text-sm" style={{ color: isExpired ? 'var(--color-error)' : isExpiringSoon ? 'var(--color-warning)' : 'var(--color-text-muted)' }}>
                                Expires: {new Date(expiry).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%',
                        backgroundColor: uploaded ? '#DCFCE7' : '#FEE2E2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: uploaded ? '#166534' : '#991B1B'
                    }}>
                        {uploaded ? <CheckCircle size={24} /> : <XCircle size={24} />}
                    </div>
                </div>

                <div className="flex flex-col" style={{ gap: '12px' }}>
                    <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' }}
                    />
                    {['COI', 'Kosher', 'SQF', 'HACCP', 'Organic', 'Halal', 'Allergen'].includes(documentType) && (
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            style={{ padding: '10px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '0.875rem' }}
                        />
                    )}
                    <div className="flex gap-sm">
                        <Button onClick={handleUploadClick} disabled={!selectedFile || uploading} style={{ flex: 1 }}>
                            {uploadingDoc === documentType ? 'Uploading...' : 'Upload'}
                        </Button>
                        {url && (
                            <Button variant="secondary" onClick={() => setPreviewDoc({ url, title, type: documentType })}>
                                <Eye size={16} />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    const requiredDocs = supplier.vendor_type.required_docs.split(',').map((d: string) => d.trim());

    // Columns for POs
    const poColumns = [
        { header: 'PO Number', accessor: 'po_number' as const, className: 'font-bold' },
        { header: 'Date', accessor: (item: any) => new Date(item.receive_date).toLocaleDateString() },
        { header: 'Product', accessor: 'product_name' as const },
        { header: 'Status', accessor: (item: any) => <Badge label={item.status} variant={item.status === 'Complete' ? 'success' : 'neutral'} /> },
        { header: 'Docs', accessor: (item: any) => item.receiving_docs_url ? <Button size="sm" variant="secondary" onClick={() => window.open(item.receiving_docs_url, '_blank')}>View</Button> : '-' }
    ];

    // Columns for Shipments
    const shipColumns = [
        { header: 'Tracking', accessor: (item: any) => item.tracking_number || item.id.substring(0, 8) },
        { header: 'Customer', accessor: 'customer_name' as const },
        { header: 'Product', accessor: 'product_name' as const },
        { header: 'Status', accessor: (item: any) => <Badge label={item.status} variant={item.status === 'Delivered' ? 'success' : 'warning'} /> },
        { header: 'Docs', accessor: (item: any) => item.bol_url ? <Button size="sm" variant="secondary" onClick={() => window.open(item.bol_url, '_blank')}>View</Button> : '-' }
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col" style={{ gap: '32px' }}>
                {/* Header */}
                <div>
                    <Button variant="ghost" onClick={() => router.push('/suppliers')} style={{ marginBottom: '16px' }}>
                        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Suppliers
                    </Button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{supplier.company_name}</h1>
                            <div className="flex items-center gap-md">
                                <Badge label={supplier.vendor_type.type_name} variant="neutral" />
                                <Badge
                                    label={supplier.onboarding_status}
                                    variant={supplier.onboarding_status === 'Complete' ? 'success' : 'warning'}
                                />
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p className="text-sm text-muted mb-1">Compliance Score</p>
                            <h2 className="text-3xl font-bold" style={{
                                color: supplier.compliance_score >= 80 ? 'var(--color-success)' :
                                    supplier.compliance_score >= 50 ? 'var(--color-warning)' :
                                        'var(--color-error)'
                            }}>
                                {supplier.compliance_score}%
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <Card title="Contact Information">
                    <div className="flex flex-col gap-4">
                        {supplier.contact_name && <div><strong>Name:</strong> {supplier.contact_name}</div>}
                        {supplier.contact_email && <div><Mail size={16} className="inline mr-2" /> {supplier.contact_email}</div>}
                    </div>
                </Card>

                {/* Connected Orders */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title={`Inbound POs (${pos.length})`}>
                        {pos.length > 0 ? (
                            <Table data={pos} columns={poColumns} />
                        ) : <p className="text-muted p-4">No inbound POs found.</p>}
                    </Card>

                    <Card title={`Outbound Shipments (${shipments.length})`}>
                        {shipments.length > 0 ? (
                            <Table data={shipments} columns={shipColumns} />
                        ) : <p className="text-muted p-4">No outbound shipments with this product.</p>}
                    </Card>
                </div>

                {/* Documents */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Compliance Documents</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                        {requiredDocs.map((doc: string) => {
                            // Map doc name to field
                            let uploaded = false;
                            let expiry = null;
                            let url = null;
                            const simpleKey = doc.toLowerCase().replace(' ', '_');
                            // Try to find matching fields dynamically or manually
                            if (doc === 'COI') { uploaded = supplier.coi_uploaded; expiry = supplier.coi_expiry; url = supplier.coi_url; }
                            else if (doc === 'Kosher') { uploaded = supplier.kosher_uploaded; expiry = supplier.kosher_expiry; url = supplier.kosher_url; }
                            else if (doc === 'SQF') { uploaded = supplier.sqf_uploaded; expiry = supplier.sqf_expiry; url = supplier.sqf_url; }
                            else if (doc === 'HACCP') { uploaded = supplier.haccp_uploaded; expiry = supplier.haccp_expiry; url = supplier.haccp_url; }
                            else if (doc === 'Organic') { uploaded = supplier.organic_uploaded; expiry = supplier.organic_expiry; url = supplier.organic_url; }
                            else if (doc === 'Halal') { uploaded = supplier.halal_uploaded; expiry = supplier.halal_expiry; url = supplier.halal_url; }
                            else if (doc === 'Allergen') { uploaded = supplier.allergen_uploaded; expiry = supplier.allergen_expiry; url = supplier.allergen_url; }
                            else if (doc === 'Spec Sheet') { uploaded = supplier.spec_sheet_uploaded; url = supplier.spec_sheet_url; }
                            else if (doc === 'W9') { uploaded = supplier.w9_uploaded; url = supplier.w9_url; }

                            return (
                                <DocumentUploadCard
                                    key={doc}
                                    title={doc}
                                    uploaded={uploaded}
                                    expiry={expiry}
                                    url={url}
                                    documentType={doc}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal for Preview */}
            {mounted && previewDoc && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-10 bg-black/70" onClick={() => setPreviewDoc(null)}>
                    <div className="bg-white rounded-xl w-full max-w-4xl h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between p-4 border-b">
                            <h3>{previewDoc.title}</h3>
                            <button onClick={() => setPreviewDoc(null)}><X /></button>
                        </div>
                        <div className="flex-1 bg-gray-100 p-4">
                            <iframe src={previewDoc.url} className="w-full h-full bg-white" />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </DashboardLayout>
    );
}
