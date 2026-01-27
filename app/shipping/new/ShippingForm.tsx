'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ArrowLeft, Save } from 'lucide-react';

interface Customer {
    id: string;
    customer_name: string;
}

interface ShippingFormProps {
    customers: Customer[];
}

export default function ShippingForm({ customers }: ShippingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        ship_datetime: new Date().toISOString().split('T')[0],
        ship_time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
        customer_id: '',
        customer_po: '',
        shipper_name: '',
        shipped_to: '',
        trucking_company: '',
        product_name: '',
        pallet_count: '' as string | number,
        bol_quantity_match: 'Yes',
        lot_numbers: '',
        seal_number: '',
        truck_damage_check: 'No',
        truck_odor_check: 'No',
        truck_clean_check: 'Yes',
        contains_allergen: 'No',
        shipped_by: '',
        reviewed_by: ''
        // No signature_url upload implemented yet, just text name for simplicity or separate upload step
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
            const response = await fetch('/api/shipping', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                router.push('/shipping');
            } else {
                alert('Failed to save shipping record');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving record');
        } finally {
            setLoading(false);
        }
    };

    const customerOptions = customers.map(c => ({ label: c.customer_name, value: c.id }));

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft size={16} className="mr-2" /> Back
                </Button>

                <h1 className="text-2xl font-bold mb-6">New Shipping Record</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6">
                        <Card title="Shipment Details">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Date" type="date" name="ship_datetime" value={formData.ship_datetime} onChange={handleChange} required />
                                <Input label="Time" type="time" name="ship_time" value={formData.ship_time} onChange={handleChange} />
                                <Select label="Customer" name="customer_id" value={formData.customer_id} onChange={handleChange} options={customerOptions} required />
                                <Input label="Customer PO#" name="customer_po" value={formData.customer_po} onChange={handleChange} required />
                                <Input label="Shipper Name" name="shipper_name" value={formData.shipper_name} onChange={handleChange} />
                                <Input label="Shipped To (Address/Location)" name="shipped_to" value={formData.shipped_to} onChange={handleChange} />
                            </div>
                        </Card>

                        <Card title="Transport">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Trucking Company" name="trucking_company" value={formData.trucking_company} onChange={handleChange} />
                                <Input label="Seal Number" name="seal_number" value={formData.seal_number} onChange={handleChange} />
                            </div>
                        </Card>

                        <Card title="Cargo Details">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Product Name" name="product_name" value={formData.product_name} onChange={handleChange} required />
                                <Input label="Pallet Count" type="number" name="pallet_count" value={formData.pallet_count} onChange={handleChange} required />
                                <Select label="Quantity Matches BOL?" name="bol_quantity_match" value={formData.bol_quantity_match} onChange={handleChange} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                                <div className="col-span-2">
                                    <Input label="Lot Numbers (comma separated)" name="lot_numbers" value={formData.lot_numbers} onChange={handleChange} placeholder="L123, L456..." />
                                </div>
                                <Select label="Contains Allergen (Peanut/Soy)?" name="contains_allergen" value={formData.contains_allergen} onChange={handleChange} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                            </div>
                        </Card>

                        <Card title="Truck Inspection">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Select label="Visible Damage/Leaks?" name="truck_damage_check" value={formData.truck_damage_check} onChange={handleChange} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                                <Select label="Bad Odors?" name="truck_odor_check" value={formData.truck_odor_check} onChange={handleChange} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                                <Select label="Clean (No Dirt/Pests)?" name="truck_clean_check" value={formData.truck_clean_check} onChange={handleChange} options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]} />
                            </div>
                        </Card>

                        <Card title="Sign-off">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Shipped By" name="shipped_by" value={formData.shipped_by} onChange={handleChange} required />
                                <Input label="Reviewed By" name="reviewed_by" value={formData.reviewed_by} onChange={handleChange} />
                            </div>
                        </Card>

                        <Button type="submit" disabled={loading} className="w-full md:w-auto self-end">
                            <Save size={16} className="mr-2" /> {loading ? 'Saving...' : 'Submit Shipment'}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
