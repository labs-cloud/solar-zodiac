'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomersPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        customer_name: '',
        contact_name: '',
        contact_email: '',
        contact_phone: '',
        shipping_address: '',
        billing_address: ''
    });

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch('/api/customers');
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCustomer)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setNewCustomer({
                    customer_name: '',
                    contact_name: '',
                    contact_email: '',
                    contact_phone: '',
                    shipping_address: '',
                    billing_address: ''
                });
                fetchCustomers();
            } else {
                alert('Failed to create customer');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating customer');
        }
    };

    const filteredData = customers.filter(c =>
        c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        (c.contact_name && c.contact_name.toLowerCase().includes(search.toLowerCase()))
    );

    const columns = [
        { header: 'Customer Name', accessor: 'customer_name' as const, className: 'font-bold' },
        { header: 'Contact', accessor: (item: any) => item.contact_name || 'N/A' },
        { header: 'Email', accessor: (item: any) => item.contact_email || 'N/A' },
        { header: 'Phone', accessor: (item: any) => item.contact_phone || 'N/A' },
        { header: 'Actions', accessor: () => <Button size="sm" variant="secondary">View</Button> },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center p-xl">
                    <p>Loading customers...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-md">
                <div className="flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-sm">
                            <h1 className="text-2xl font-bold">Customers</h1>
                            <div style={{
                                backgroundColor: 'var(--color-primary)',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '999px',
                                fontWeight: 'bold',
                                fontSize: '1.25rem',
                                minWidth: '40px',
                                textAlign: 'center'
                            }}>
                                {customers.length}
                            </div>
                        </div>
                        <p className="text-muted">Manage customer profiles and shipping addresses.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus size={16} style={{ marginRight: '8px' }} /> Add Customer
                    </Button>
                </div>

                <Card>
                    <div style={{ marginBottom: '24px', maxWidth: '300px' }}>
                        <Input
                            placeholder="Search customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ margin: 0 }}
                        />
                    </div>
                    <Table
                        data={filteredData}
                        columns={columns}
                        onRowClick={(item) => router.push(`/customers/${item.id}`)}
                    />
                </Card>

                {/* Add Customer Modal */}
                {isModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div style={{
                            backgroundColor: 'white', padding: '24px', borderRadius: '8px',
                            width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto'
                        }}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">Add New Customer</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateCustomer} className="flex flex-col gap-4">
                                <Input
                                    label="Customer Name"
                                    value={newCustomer.customer_name}
                                    onChange={e => setNewCustomer({ ...newCustomer, customer_name: e.target.value })}
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Contact Name"
                                        value={newCustomer.contact_name}
                                        onChange={e => setNewCustomer({ ...newCustomer, contact_name: e.target.value })}
                                    />
                                    <Input
                                        label="Phone"
                                        value={newCustomer.contact_phone}
                                        onChange={e => setNewCustomer({ ...newCustomer, contact_phone: e.target.value })}
                                    />
                                </div>
                                <Input
                                    label="Email"
                                    type="email"
                                    value={newCustomer.contact_email}
                                    onChange={e => setNewCustomer({ ...newCustomer, contact_email: e.target.value })}
                                />
                                <Input
                                    label="Shipping Address"
                                    value={newCustomer.shipping_address}
                                    onChange={e => setNewCustomer({ ...newCustomer, shipping_address: e.target.value })}
                                />
                                <Input
                                    label="Billing Address"
                                    value={newCustomer.billing_address}
                                    onChange={e => setNewCustomer({ ...newCustomer, billing_address: e.target.value })}
                                />

                                <div className="flex justify-end gap-2 mt-4">
                                    <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" variant="primary">Create Customer</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
