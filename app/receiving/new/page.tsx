import { prisma } from '@/lib/prisma';
import ReceivingForm from './ReceivingForm';

export const dynamic = 'force-dynamic';

export default async function NewReceivingPage() {
    const suppliers = await prisma.supplier.findMany({
        select: { id: true, company_name: true },
        orderBy: { company_name: 'asc' }
    });

    return <ReceivingForm suppliers={suppliers} />;
}
