'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ArrowLeft, Save } from 'lucide-react';

interface Supplier {
    id: string;
    company_name: string;
}

interface ReceivingFormProps {
    suppliers: Supplier[];
}

export default function ReceivingForm({ suppliers }: ReceivingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        receive_date: new Date().toISOString().split('T')[0],
        receive_time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        shipper_name: '',
        supplier_id: '',
        trucking_company: '',
        product_name: '',
        pallet_count: '' as string | number,
        bol_quantity_match: 'Yes',
        po_number: '',
        lot_numbers: '',
        truck_damage_check: 'No',
        truck_odor_check: 'No',
        truck_clean_check: 'Yes',
        is_gluten_test_item: false,
        gluten_test_product: '',
        gluten_test_kit_lot: '',
        gluten_test_expiry: '',
        received_by: '',
        reviewed_by: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/receiving', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                router.push('/receiving');
            } else {
                alert('Failed to save receiving record');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving record');
        } finally {
            setLoading(false);
        }
    };

    const supplierOptions = suppliers.map(s => ({ label: s.company_name, value: s.id }));

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </Button>

                <h1 className="text-2xl font-bold mb-6">New Receiving Record</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        <Card title="General Info">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Date" type="date" name="receive_date" value={formData.receive_date} onChange={handleChange} required />
                                <Input label="Time" type="time" name="receive_time" value={formData.receive_time} onChange={handleChange} />
                                <Select label="Approved Vendor" name="supplier_id" value={formData.supplier_id} onChange={handleChange} options={supplierOptions} required />
                                <Input label="Shipper Name" name="shipper_name" value={formData.shipper_name} onChange={handleChange} />
                                <Input label="Trucking Company" name="trucking_company" value={formData.trucking_company} onChange={handleChange} />
                                <Input label="PO Number" name="po_number" value={formData.po_number} onChange={handleChange} required />
                            </div>
                        </Card>

                        <Card title="Product Details">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Product Name" name="product_name" value={formData.product_name} onChange={handleChange} required />
                                <Input label="Pallet Count" type="number" name="pallet_count" value={formData.pallet_count} onChange={handleChange} required />
                                <Select label="Quantity Matches BOL?" name="bol_quantity_match" value={formData.bol_quantity_match} onChange={handleChange} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                                <div className="col-span-2">
                                    <Input label="Lot Numbers (comma separated)" name="lot_numbers" value={formData.lot_numbers} onChange={handleChange} placeholder="L123, L456..." />
                                </div>
                            </div>
                        </Card>

                        <Card title="Truck Condition">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Select label="Visible Damage/Leaks?" name="truck_damage_check" value={formData.truck_damage_check} onChange={handleChange} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                                <Select label="Bad Odors?" name="truck_odor_check" value={formData.truck_odor_check} onChange={handleChange} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                                <Select label="Clean (No Dirt/Pests)?" name="truck_clean_check" value={formData.truck_clean_check} onChange={handleChange} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                            </div>
                        </Card>

                        <Card title="Quality Checks">
                            <div className="flex items-center gap-2 mb-4">
                                <input type="checkbox" id="gluten" name="is_gluten_test_item" checked={formData.is_gluten_test_item} onChange={handleChange} className="w-4 h-4" />
                                <label htmlFor="gluten" className="font-medium">Requires Gluten Testing?</label>
                            </div>

                            {formData.is_gluten_test_item && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <Input label="Tested Product" name="gluten_test_product" value={formData.gluten_test_product} onChange={handleChange} placeholder="e.g. Crisp Rice" />
                                    <Input label="Test Kit Lot #" name="gluten_test_kit_lot" value={formData.gluten_test_kit_lot} onChange={handleChange} />
                                    <Input label="Kit Expiry" type="date" name="gluten_test_expiry" value={formData.gluten_test_expiry} onChange={handleChange} />
                                </div>
                            )}
                        </Card>

                        <Card title="Sign-off">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Received By" name="received_by" value={formData.received_by} onChange={handleChange} required />
                                <Input label="Reviewed By" name="reviewed_by" value={formData.reviewed_by} onChange={handleChange} />
                            </div>
                        </Card>

                        <Button type="submit" disabled={loading} className="w-full md:w-auto self-end">
                            <Save size={16} className="mr-2" /> {loading ? 'Saving...' : 'Submit Record'}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
