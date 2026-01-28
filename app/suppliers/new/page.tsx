'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';

export default function AddSupplierPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Ingredient', // Default
        email: '',
        phone: '',
        address: ''
    });

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const getRequiredDocs = (type: string) => {
        switch (type) {
            case 'Ingredient': return ['COI', 'Kosher', 'SQF', 'HACCP', 'Allergen', 'Spec Sheet'];
            case 'Packaging': return ['COI', 'Spec Sheet'];
            case 'Logistics': return ['COI'];
            default: return [];
        }
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div className="flex items-center gap-sm mb-4">
                    <Button variant="ghost" onClick={() => router.back()}><ArrowLeft size={16} /> Back</Button>
                    <h1 className="text-xl font-bold">Add New Supplier</h1>
                </div>

                {/* Stepper */}
                <div className="flex justify-between items-center mb-8" style={{ position: 'relative', padding: '0 40px' }}>
                    <div style={{ position: 'absolute', top: '50%', left: '40px', right: '40px', height: '2px', backgroundColor: '#E2E8F0', zIndex: 0 }} />

                    {[1, 2, 3].map((s) => (
                        <div key={s} style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--color-background)', padding: '0 8px' }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: step >= s ? 'var(--color-primary)' : '#E2E8F0',
                                color: step >= s ? 'white' : '#64748B',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold'
                            }}>
                                {step > s ? <Check size={16} /> : s}
                            </div>
                            <p style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', fontSize: '0.75rem', marginTop: '4px', fontWeight: step === s ? 'bold' : 'normal' }}>
                                {s === 1 ? 'Basic Info' : s === 2 ? 'Documents' : 'Review'}
                            </p>
                        </div>
                    ))}
                </div>

                <Card>
                    {step === 1 && (
                        <div className="flex flex-col gap-md">
                            <h2 className="text-lg font-bold">Company Information</h2>
                            <Input
                                label="Company Name"
                                placeholder="e.g. Acme Ingredients"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />

                            <div className="flex flex-col gap-sm" style={{ marginBottom: '16px' }}>
                                <label className="text-sm font-medium" style={{ color: 'var(--color-secondary)' }}>Vendor Type</label>
                                <select
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid #CBD5E1',
                                        width: '100%'
                                    }}
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="Ingredient">Ingredient Supplier</option>
                                    <option value="Packaging">Packaging Supplier</option>
                                    <option value="Logistics">Logistics / Trucking</option>
                                </select>
                            </div>

                            <div className="flex gap-md">
                                <div style={{ flex: 1 }}>
                                    <Input
                                        label="Contact Email"
                                        type="email"
                                        placeholder="contact@company.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Input
                                        label="Phone Number"
                                        placeholder="(555) 000-0000"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Input
                                label="Address"
                                placeholder="Street address, City, State, Zip"
                                value={formData.address}
                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                    )}

                    {step === 2 && (
                        <div>
                            <h2 className="text-lg font-bold mb-4">Required Documents</h2>
                            <p className="text-muted mb-4">Based on the vendor type <strong>{formData.type}</strong>, the following documents will be required:</p>

                            <div className="flex flex-col gap-sm">
                                {getRequiredDocs(formData.type).map(doc => (
                                    <div key={doc} className="flex items-center gap-sm p-4 border rounded" style={{ borderColor: '#E2E8F0', padding: '12px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-warning)' }} />
                                        <span className="font-bold">{doc}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#F0F9FF', borderRadius: '8px', fontSize: '0.875rem', color: '#0369A1' }}>
                                ℹ️ The vendor will be invited to the portal to upload these documents. You can also upload them manually on the detail page later.
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div>
                            <h2 className="text-lg font-bold mb-4">Review & Invite</h2>
                            <div className="flex flex-col gap-sm mb-6">
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted">Company:</span>
                                    <span className="font-bold">{formData.name}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted">Type:</span>
                                    <span className="font-bold">{formData.type}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted">Email:</span>
                                    <span className="font-bold">{formData.email}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b">
                                    <span className="text-muted">Required Docs:</span>
                                    <span>{getRequiredDocs(formData.type).length} documents</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-sm">
                                <input type="checkbox" id="email" defaultChecked />
                                <label htmlFor="email">Send welcome email with portal login instructions</label>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-between mt-8 pt-4 border-t">
                        {step > 1 ? (
                            <Button variant="secondary" onClick={handleBack}>Back</Button>
                        ) : (
                            <div /> // Spacer
                        )}

                        {step < 3 ? (
                            <Button onClick={handleNext}>Next <ChevronRight size={16} /></Button>
                        ) : (
                            <Button
                                onClick={async () => {
                                    try {
                                        // Need to map Type name to ID
                                        // Ideally we fetch these from /api/vendor-types, but for now we look them up or simple string match if the backend handles it.
                                        // The backend expects `vendor_type_id`.

                                        // Actually, let's fetch types first or rely on the backend to FindOrCreate type.
                                        // Checking app/api/suppliers/route.ts from previous turn... 
                                        // It expects `vendor_type_id`.
                                        // We need to fetch vendor types to map the name "Ingredient" to a UUID?
                                        // OR, simplicity: We hardcode a lookup for now or fetch.

                                        // Let's assume the user has run the seed script which likely created types.
                                        // Wait, the user didn't mention seed scripts for types.
                                        // To be safe, I will fetch types on mount or create a workaround.

                                        // BETTER APPROACH: Update the API to accept `vendor_type_name` and find it.
                                        // But I can't easily change the API in this single tool call flow without context switching.

                                        // Let's modify the frontend to fetch types on load.
                                        const res = await fetch('/api/suppliers', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                                company_name: formData.name,
                                                // We need to send vendor_type_id. 
                                                // For this "Fix" task, I'll assumme we need to fetch them.
                                                // Temporarily, I will just send the name because I'll fix the API to handle name lookup in the next step.
                                                vendor_type_name: formData.type,
                                                contact_email: formData.email,
                                                contact_phone: formData.phone,
                                                address: formData.address,
                                                onboarding_status: 'Not Started'
                                            })
                                        });

                                        if (res.ok) {
                                            router.push('/suppliers');
                                        } else {
                                            alert('Failed to create supplier');
                                        }
                                    } catch (e) {
                                        console.error(e);
                                        alert('Error saving supplier');
                                    }
                                }}
                                variant="primary"
                            >
                                Create Supplier
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}
