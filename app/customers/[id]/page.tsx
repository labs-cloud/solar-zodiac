import { prisma } from '@/lib/prisma';
import CustomerDetailClient from './CustomerDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
    const customer = await prisma.customer.findUnique({
        where: { id: params.id },
        include: { shipments: true } // Include shipment history
    });

    if (!customer) {
        notFound();
    }

    return <CustomerDetailClient customer={customer} />;
}
