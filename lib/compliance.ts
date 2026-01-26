import { prisma } from '@/lib/prisma';

export async function calculateVendorCompliance(supplierId: string) {
    // Logic to calculate score based on documents
    // 1. Fetch vendor type and required docs
    // 2. Fetch supplier and uploaded docs
    // 3. Compare and returning percentage
    return 0;
}
