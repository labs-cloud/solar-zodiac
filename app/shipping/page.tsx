import React from 'react';
import { prisma } from '@/lib/prisma';
import ShippingClient from './ShippingClient';

const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
};

export default async function ShippingPage() {
    const shipments = await prisma.outboundShipment.findMany({
        orderBy: { ship_datetime: 'desc' }
    });

    const formattedData = shipments.map(sh => {
        // Construct display ID
        const displayId = sh.tracking_number || sh.id.substring(0, 8).toUpperCase();

        return {
            id: displayId,
            date: formatDate(sh.ship_datetime),
            customer: sh.customer_name || 'Unknown',
            po: sh.customer_po,
            product: sh.product_name || '-',
            status: sh.status,
            docs_url: sh.bol_url || sh.packing_list_url
        };
    });

    return <ShippingClient initialData={formattedData} />;
}
