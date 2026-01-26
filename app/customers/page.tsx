'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CustomersPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
                    <Button><Plus size={16} style={{ marginRight: '8px' }} /> Add Customer</Button>
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
            </div>
        </DashboardLayout>
    );
}
