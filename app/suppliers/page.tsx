'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { Badge } from '@/components/Badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Supplier {
    id: string;
    company_name: string;
    vendor_type: { type_name: string };
    compliance_score: number;
    onboarding_status: string;
    contact_name: string | null;
}

export default function SuppliersPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const response = await fetch('/api/suppliers');
            const data = await response.json();
            setSuppliers(data);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredData = suppliers.filter(s =>
        s.company_name.toLowerCase().includes(search.toLowerCase()) &&
        (filterType === 'All' || s.vendor_type.type_name === filterType)
    );

    const columns = [
        { header: 'Company Name', accessor: 'company_name' as const, className: 'font-bold' },
        { header: 'Type', accessor: (item: Supplier) => item.vendor_type.type_name },
        {
            header: 'Compliance Score',
            accessor: (item: Supplier) => {
                let color = 'var(--color-success)';
                if (item.compliance_score < 50) color = 'var(--color-error)';
                else if (item.compliance_score < 80) color = 'var(--color-warning)';

                return (
                    <div className="flex items-center gap-sm">
                        <div style={{ width: '100px', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${item.compliance_score}%`, height: '100%', backgroundColor: color }} />
                        </div>
                        <span style={{ fontWeight: 600 }}>{item.compliance_score}%</span>
                    </div>
                );
            }
        },
        {
            header: 'Status',
            accessor: (item: Supplier) => {
                const variant = item.onboarding_status === 'Complete' ? 'success' : item.onboarding_status === 'In Progress' ? 'warning' : 'neutral';
                return <Badge label={item.onboarding_status} variant={variant} />;
            }
        },
        { header: 'Contact', accessor: (item: Supplier) => item.contact_name || 'N/A' },
        { header: 'Actions', accessor: () => <Button size="sm" variant="secondary">View</Button> },
    ];

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center" style={{ minHeight: '400px' }}>
                    <p>Loading suppliers...</p>
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
                            <h1 className="text-2xl font-bold">Suppliers</h1>
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
                                {suppliers.length}
                            </div>
                        </div>
                        <p className="text-muted">Manage your approved vendor list and compliance status.</p>
                    </div>
                    <Link href="/suppliers/new">
                        <Button><Plus size={16} style={{ marginRight: '8px' }} /> Add Supplier</Button>
                    </Link>
                </div>

                <Card>
                    <div className="flex justify-between items-center" style={{ marginBottom: '24px' }}>
                        <div style={{ width: '300px' }}>
                            <Input
                                placeholder="Search suppliers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ margin: 0 }}
                            />
                        </div>
                        <div className="flex gap-sm">
                            <Button variant="secondary" onClick={() => setFilterType('All')}>All</Button>
                            <Button variant="secondary" onClick={() => setFilterType('Ingredient')}>Ingredients</Button>
                            <Button variant="secondary" onClick={() => setFilterType('Packaging')}>Packaging</Button>
                            <Button variant="secondary" onClick={() => setFilterType('Logistics')}>Logistics</Button>
                        </div>
                    </div>

                    <Table
                        data={filteredData}
                        columns={columns}
                        onRowClick={(item) => router.push(`/suppliers/${item.id}`)}
                    />
                </Card>
            </div>
        </DashboardLayout>
    );
}
