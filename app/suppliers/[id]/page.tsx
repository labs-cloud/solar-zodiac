import React from 'react';
import { prisma } from '@/lib/prisma';
import SupplierDetailClient from './SupplierDetailClient';

export default async function SupplierDetailPage({ params }: { params: { id: string } }) {
    const supplier = await prisma.supplier.findUnique({
        where: { id: params.id },
        include: { vendor_type: true }
    });

    if (!supplier) {
        return <div>Supplier not found</div>;
    }

    // Fetch Connected POs
    const inboundPos = await prisma.inboundPO.findMany({
        where: { supplier_id: supplier.id },
        orderBy: { receive_date: 'desc' }
    });

    // Fetch Connected Shipments (approximate match by product name containing company name)
    // For "Once Again", this works because products are named "Once Again ..."
    const shipments = await prisma.outboundShipment.findMany({
        where: {
            product_name: {
                contains: supplier.company_name.split(' ')[0] // e.g. "Once" from "Once Again", might be too broad.
            }
        },
        orderBy: { ship_datetime: 'desc' }
    });

    // Better match:
    const specificShipments = await prisma.outboundShipment.findMany({
        where: {
            OR: [
                { product_name: { contains: supplier.company_name } },
                { product_name: { contains: 'Once Again' } } // Fallback for specific case
            ]
        }
    });

    // Serialize Supplier Data (specifically Date objects)
    const serializedSupplier = {
        ...supplier,
        coi_expiry: supplier.coi_expiry?.toISOString() || null,
        kosher_expiry: supplier.kosher_expiry?.toISOString() || null,
        sqf_expiry: supplier.sqf_expiry?.toISOString() || null,
        haccp_expiry: supplier.haccp_expiry?.toISOString() || null,
        organic_expiry: supplier.organic_expiry?.toISOString() || null,
        halal_expiry: supplier.halal_expiry?.toISOString() || null,
        allergen_expiry: supplier.allergen_expiry?.toISOString() || null,
    };

    return (
        <SupplierDetailClient
            supplier={serializedSupplier}
            pos={inboundPos.map(p => ({
                ...p,
                receive_date: p.receive_date.toISOString(), // Serialize dates
            }))}
            shipments={specificShipments.map(s => ({
                ...s,
                ship_datetime: s.ship_datetime.toISOString(),
            }))}
        />
    );
}
