import React from 'react';
import { prisma } from '@/lib/prisma';
import ReceivingClient from './ReceivingClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Helper to format date
const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

export default async function ReceivingPage() {
    const inboundPOs = await prisma.inboundPO.findMany({
        orderBy: { receive_date: 'desc' }
    });

    const formattedData = inboundPOs.map(po => {
        // Determine inspection status
        let inspection = 'Pending';
        if (po.truck_clean_check && po.truck_damage_check && po.truck_odor_check) {
            if (po.truck_clean_check === 'YES' && po.truck_damage_check === 'NO' && po.truck_odor_check === 'NO') {
                inspection = 'Passed';
            } else if (po.truck_clean_check === 'Yes' && po.truck_damage_check === 'No' && po.truck_odor_check === 'No') {
                inspection = 'Passed';
            } else {
                inspection = 'Issues';
            }
        } else {
            // If all null, Pending. If some set, maybe Issues or Pending.
            // For simplicity, default to Pending if not all set.

            // Check if we have my new record "PO_3140" which might have no checks yet
            if (po.status === 'Pending') inspection = 'Pending';
        }

        return {
            id: po.po_number,
            date: formatDate(po.receive_date),
            supplier: po.supplier_name || 'Unknown',
            product: po.product_name || '-',
            pallets: po.pallet_count || 0,
            status: po.status,
            inspection: inspection,
            docs_url: po.receiving_docs_url || po.bol_url
        };
    });

    return <ReceivingClient initialData={formattedData} />;
}
