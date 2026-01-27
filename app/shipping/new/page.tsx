import { prisma } from '@/lib/prisma';
import ShippingForm from './ShippingForm';

export const dynamic = 'force-dynamic';

export default async function NewShippingPage() {
    const customers = await prisma.customer.findMany({
        select: { id: true, customer_name: true },
        orderBy: { customer_name: 'asc' }
    });

    return <ShippingForm customers={customers} />;
}
