import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET dashboard metrics
export async function GET(request: NextRequest) {
    try {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        // Total suppliers
        const totalSuppliers = await prisma.supplier.count();

        // Documents expiring in 30 days
        const expiringDocs = await prisma.supplier.findMany({
            where: {
                OR: [
                    {
                        coi_expiry: {
                            gte: today,
                            lte: thirtyDaysFromNow,
                        },
                    },
                    {
                        kosher_expiry: {
                            gte: today,
                            lte: thirtyDaysFromNow,
                        },
                    },
                    {
                        sqf_expiry: {
                            gte: today,
                            lte: thirtyDaysFromNow,
                        },
                    },
                    {
                        haccp_expiry: {
                            gte: today,
                            lte: thirtyDaysFromNow,
                        },
                    },
                ],
            },
        });

        // Expired documents
        const expiredDocs = await prisma.supplier.findMany({
            where: {
                OR: [
                    { coi_expiry: { lt: today } },
                    { kosher_expiry: { lt: today } },
                    { sqf_expiry: { lt: today } },
                    { haccp_expiry: { lt: today } },
                ],
            },
        });

        // Average compliance score
        const suppliers = await prisma.supplier.findMany({
            select: { compliance_score: true },
        });
        const avgCompliance =
            suppliers.length > 0
                ? Math.round(
                    suppliers.reduce((sum, s) => sum + s.compliance_score, 0) /
                    suppliers.length
                )
                : 0;

        // Pending inbound POs
        const pendingPOs = await prisma.inboundPO.count({
            where: { status: 'Pending' },
        });

        // Pending outbound shipments
        const pendingShipments = await prisma.outboundShipment.count({
            where: { status: { in: ['Pending', 'In Transit'] } },
        });

        return NextResponse.json({
            totalSuppliers,
            expiringDocsCount: expiringDocs.length,
            expiredDocsCount: expiredDocs.length,
            avgCompliance,
            pendingPOs,
            pendingShipments,
        });
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        return NextResponse.json(
            { error: 'Failed to fetch metrics' },
            { status: 500 }
        );
    }
}
