'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Badge } from '@/components/Badge';
import { Table } from '@/components/Table';
import {
    CheckCircle,
    XCircle,
    Upload,
    Eye,
    ArrowLeft,
    Calendar,
    Mail,
    Phone,
    X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Supplier {
    id: string;
    company_name: string;
    vendor_type: { type_name: string; required_docs: string };
    compliance_score: number;
    onboarding_status: string;
    contact_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    coi_uploaded: boolean;
    coi_expiry: string | null;
    coi_url: string | null;
    kosher_uploaded: boolean;
    kosher_expiry: string | null;
    kosher_url: string | null;
    sqf_uploaded: boolean;
    sqf_expiry: string | null;
    sqf_url: string | null;
    haccp_uploaded: boolean;
    haccp_expiry: string | null;
    haccp_url: string | null;
    organic_uploaded: boolean;
    organic_expiry: string | null;
    organic_url: string | null;
    halal_uploaded: boolean;
    halal_expiry: string | null;
    halal_url: string | null;
    allergen_uploaded: boolean;
    allergen_expiry: string | null;
    allergen_url: string | null;
    spec_sheet_uploaded: boolean;
    spec_sheet_url: string | null;
    w9_uploaded: boolean;
    w9_url: string | null;
}

export default function SupplierDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
    const [previewDoc, setPreviewDoc] = useState<{ url: string; title: string; type: string } | null>(null);

    useEffect(() => {
        fetchSupplier();
    }, [params.id]);

    const fetchSupplier = async () => {
        try {
            const response = await fetch(`/api/suppliers/${params.id}`);
            const data = await response.json();
            setSupplier(data);
        } catch (error) {
            console.error('Error fetching supplier:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (documentType: string, file: File, expiryDate?: string) => {
        setUploading(true);
        setUploadingDoc(documentType);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('supplierId', params.id);
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
                fetchSupplier(); // Refresh data
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
        title,
        uploaded,
        expiry,
        url,
        documentType
    }: {
        title: string;
        uploaded: boolean;
        expiry: string | null;
        url: string | null;
        documentType: string;
    }) => {
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
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: uploaded ? '#DCFCE7' : '#FEE2E2',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
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
                        style={{
                            padding: '10px',
                            border: '1px solid #E2E8F0',
                            borderRadius: '8px',
                            fontSize: '0.875rem'
                        }}
                    />

                    {['COI', 'Kosher', 'SQF', 'HACCP', 'Organic', 'Halal', 'Allergen'].includes(documentType) && (
                        <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            placeholder="Expiry Date"
                            style={{
                                padding: '10px',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                fontSize: '0.875rem'
                            }}
                        />
                    )}

                    <div className="flex gap-sm">
                        <Button
                            onClick={handleUploadClick}
                            disabled={!selectedFile || uploading}
                            style={{ flex: 1 }}
                        >
                            {uploadingDoc === documentType ? 'Uploading...' : 'Upload'}
                        </Button>
                        {url && (
                            <Button
                                variant="secondary"
                                onClick={() => setPreviewDoc({ url, title, type: documentType })}
                                title="View Document"
                            >
                                <Eye size={16} />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>
        );
    };

    if (loading || !supplier) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                    <p>Loading supplier...</p>
                </div>
            </DashboardLayout>
        );
    }

    const requiredDocs = supplier.vendor_type.required_docs.split(',').map(d => d.trim());

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
                {(supplier.contact_name || supplier.contact_email || supplier.contact_phone) && (
                    <Card title="Contact Information">
                        <div className="flex flex-col" style={{ gap: '12px' }}>
                            {supplier.contact_name && (
                                <div className="flex items-center gap-sm">
                                    <strong style={{ minWidth: '80px' }}>Name:</strong>
                                    <span>{supplier.contact_name}</span>
                                </div>
                            )}
                            {supplier.contact_email && (
                                <div className="flex items-center gap-sm">
                                    <Mail size={16} style={{ minWidth: '80px', color: 'var(--color-primary)' }} />
                                    <a href={`mailto:${supplier.contact_email}`} style={{ color: 'var(--color-primary)' }}>
                                        {supplier.contact_email}
                                    </a>
                                </div>
                            )}
                            {supplier.contact_phone && (
                                <div className="flex items-center gap-sm">
                                    <Phone size={16} style={{ minWidth: '80px', color: 'var(--color-primary)' }} />
                                    <span>{supplier.contact_phone}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                {/* Documents */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Compliance Documents</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                        {requiredDocs.includes('COI') && (
                            <DocumentUploadCard
                                title="Certificate of Insurance (COI)"
                                uploaded={supplier.coi_uploaded}
                                expiry={supplier.coi_expiry}
                                url={supplier.coi_url}
                                documentType="COI"
                            />
                        )}
                        {requiredDocs.includes('Kosher') && (
                            <DocumentUploadCard
                                title="Kosher Certification"
                                uploaded={supplier.kosher_uploaded}
                                expiry={supplier.kosher_expiry}
                                url={supplier.kosher_url}
                                documentType="Kosher"
                            />
                        )}
                        {requiredDocs.includes('SQF') && (
                            <DocumentUploadCard
                                title="SQF Level 2 Certification"
                                uploaded={supplier.sqf_uploaded}
                                expiry={supplier.sqf_expiry}
                                url={supplier.sqf_url}
                                documentType="SQF"
                            />
                        )}
                        {requiredDocs.includes('HACCP') && (
                            <DocumentUploadCard
                                title="HACCP Plan"
                                uploaded={supplier.haccp_uploaded}
                                expiry={supplier.haccp_expiry}
                                url={supplier.haccp_url}
                                documentType="HACCP"
                            />
                        )}
                        {requiredDocs.includes('Organic') && (
                            <DocumentUploadCard
                                title="Organic Certification"
                                uploaded={supplier.organic_uploaded}
                                expiry={supplier.organic_expiry}
                                url={supplier.organic_url}
                                documentType="Organic"
                            />
                        )}
                        {requiredDocs.includes('Halal') && (
                            <DocumentUploadCard
                                title="Halal Certification"
                                uploaded={supplier.halal_uploaded}
                                expiry={supplier.halal_expiry}
                                url={supplier.halal_url}
                                documentType="Halal"
                            />
                        )}
                        {requiredDocs.includes('Allergen') && (
                            <DocumentUploadCard
                                title="Allergen Policy"
                                uploaded={supplier.allergen_uploaded}
                                expiry={supplier.allergen_expiry}
                                url={supplier.allergen_url}
                                documentType="Allergen"
                            />
                        )}
                        {requiredDocs.includes('Spec Sheet') && (
                            <DocumentUploadCard
                                title="Specification Sheet"
                                uploaded={supplier.spec_sheet_uploaded}
                                expiry={null}
                                url={supplier.spec_sheet_url}
                                documentType="Spec Sheet"
                            />
                        )}
                        {requiredDocs.includes('W9') && (
                            <DocumentUploadCard
                                title="W-9 Form"
                                uploaded={supplier.w9_uploaded}
                                expiry={null}
                                url={supplier.w9_url}
                                documentType="W9"
                            />
                        )}
                    </div>
                </div>
            </div>

            {previewDoc && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    zIndex: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px'
                }} onClick={() => setPreviewDoc(null)}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '1000px',
                        height: '85vh',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }} onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center" style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0' }}>
                            <h3 className="font-bold text-lg">{previewDoc.title}</h3>
                            <button
                                onClick={() => setPreviewDoc(null)}
                                style={{ padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                                className="hover:bg-slate-100"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#F1F5F9', padding: '12px' }}>
                            <iframe
                                src={previewDoc.url}
                                style={{ width: '100%', height: '100%', borderRadius: '8px', border: 'none', backgroundColor: 'white' }}
                                title={previewDoc.title}
                            />
                        </div>
                        <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', backgroundColor: 'white' }} className="flex justify-end">
                            <a href={previewDoc.url} download target="_blank" rel="noopener noreferrer">
                                <Button variant="secondary">
                                    Open in New Tab
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
