'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ArrowLeft, MapPin, Phone, Mail, User } from 'lucide-react';
import { Table } from '@/components/Table';

interface Customer {
    id: string;
    customer_name: string;
    contact_name: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    billing_address: string | null;
    shipping_address: string | null;
    notes: string | null;
    shipments: any[];
}

export default function CustomerDetailClient({ customer }: { customer: Customer }) {
    const router = useRouter();

    const shipmentColumns = [
        { header: 'PO #', accessor: 'customer_po' as const },
        { header: 'Date', accessor: (item: any) => new Date(item.ship_datetime).toLocaleDateString() },
        { header: 'Product', accessor: 'product_name' as const },
        { header: 'Pallets', accessor: 'pallet_count' as const },
        { header: 'Status', accessor: 'status' as const },
    ];

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft size={16} className="mr-2" /> Back to Customers
                </Button>

                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-bold">{customer.customer_name}</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <Card title="Shipment History">
                            {customer.shipments && customer.shipments.length > 0 ? (
                                <Table data={customer.shipments} columns={shipmentColumns} />
                            ) : (
                                <p className="text-muted italic">No shipment history found.</p>
                            )}
                        </Card>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Card title="Contact Info">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-3">
                                    <User size={18} className="text-muted mt-1" />
                                    <div>
                                        <p className="font-bold">Contact Name</p>
                                        <p>{customer.contact_name || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Mail size={18} className="text-muted mt-1" />
                                    <div>
                                        <p className="font-bold">Email</p>
                                        <p className="text-blue-600">{customer.contact_email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Phone size={18} className="text-muted mt-1" />
                                    <div>
                                        <p className="font-bold">Phone</p>
                                        <p>{customer.contact_phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card title="Addresses">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-muted mt-1" />
                                    <div>
                                        <p className="font-bold">Shipping Address</p>
                                        <p className="text-sm text-muted">{customer.shipping_address || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MapPin size={18} className="text-muted mt-1" />
                                    <div>
                                        <p className="font-bold">Billing Address</p>
                                        <p className="text-sm text-muted">{customer.billing_address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
