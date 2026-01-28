'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Table } from '@/components/Table';
import { CheckCircle, XCircle, Plus, X } from 'lucide-react';

interface Item {
    id: string;
    sku: string;
    item_name: string;
    supplier_id: string;
    supplier: { company_name: string };
    spec_sheet_url: string | null;
    allergen_cert_url: string | null;
}

interface Supplier {
    id: string;
    company_name: string;
}

export default function ItemsPage() {
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Item[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [search, setSearch] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        sku: '',
        item_name: '',
        supplier_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [itemsRes, suppliersRes] = await Promise.all([
                fetch('/api/items'),
                fetch('/api/suppliers')
            ]);

            if (itemsRes.ok) {
                const data = await itemsRes.json();
                setItems(data);
            }
            if (suppliersRes.ok) {
                const data = await suppliersRes.json();
                setSuppliers(data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setNewItem({ sku: '', item_name: '', supplier_id: '' });
                fetchData(); // Refresh
            } else {
                alert('Failed to create item');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating item');
        }
    };

    const filteredData = items.filter(i =>
        i.item_name.toLowerCase().includes(search.toLowerCase()) ||
        i.sku.toLowerCase().includes(search.toLowerCase())
    );

    const columns = [
        { header: 'SKU', accessor: 'sku' as const, className: 'font-bold' },
        { header: 'Item Name', accessor: 'item_name' as const },
        {
            header: 'Supplier',
            accessor: (item: Item) => (
                <a
                    href={`/suppliers/${item.supplier_id}`}
                    className="text-primary hover:underline"
                    onClick={(e) => {
                        e.stopPropagation(); // prevent row click if table has one
                    }}
                >
                    {item.supplier?.company_name || 'N/A'}
                </a>
            )
        },
        {
            header: 'Spec Sheet',
            accessor: (item: Item) => item.spec_sheet_url ? <CheckCircle size={20} color="var(--color-success)" /> : <XCircle size={20} color="var(--color-error)" />
        },
        {
            header: 'Allergen Cert',
            accessor: (item: Item) => item.allergen_cert_url ? <CheckCircle size={20} color="var(--color-success)" /> : <span className="text-muted">-</span>
        },
        { header: 'Actions', accessor: () => <Button size="sm" variant="secondary">Edit</Button> },
    ];

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">Items Master</h1>
                        <p className="text-muted">Manage raw materials and packaging items.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus size={16} style={{ marginRight: '8px' }} /> Add Item
                    </Button>
                </div>

                <Card>
                    <div className="flex justify-between items-center mb-6">
                        <div style={{ width: '300px' }}>
                            <Input
                                placeholder="Search SKU or Name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ margin: 0 }}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-muted">Loading items...</div>
                    ) : (
                        <Table data={filteredData} columns={columns} />
                    )}
                </Card>

                {/* Simple Modal */}
                {isModalOpen && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <div style={{
                            backgroundColor: 'white', padding: '24px', borderRadius: '8px',
                            width: '400px', maxWidth: '90%'
                        }}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold">Add New Item</h3>
                                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateItem} className="flex flex-col gap-4">
                                <Input
                                    label="SKU"
                                    value={newItem.sku}
                                    onChange={e => setNewItem({ ...newItem, sku: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Item Name"
                                    value={newItem.item_name}
                                    onChange={e => setNewItem({ ...newItem, item_name: e.target.value })}
                                    required
                                />
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">Supplier</label>
                                    <select
                                        className="p-2 border rounded"
                                        value={newItem.supplier_id}
                                        onChange={e => setNewItem({ ...newItem, supplier_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Supplier...</option>
                                        {suppliers.map(s => (
                                            <option key={s.id} value={s.id}>{s.company_name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 mt-4">
                                    <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    <Button type="submit" variant="primary">Create Item</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
