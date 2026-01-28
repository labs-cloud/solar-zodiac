import { prisma } from '@/lib/prisma';
import SupplierDetailClient from './SupplierDetailClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SupplierDetailPage({ params }: { params: { id: string } }) {
    const supplier = await prisma.supplier.findUnique({
        where: { id: params.id },
        include: { vendor_type: true }
    });

    if (!supplier) {
        notFound();
    }

    // Pass data to client component
    return <SupplierDetailClient supplier={supplier} />;
}
