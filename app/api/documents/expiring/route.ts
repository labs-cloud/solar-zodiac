import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const daysParam = searchParams.get('days') || '60';
        const limit = parseInt(daysParam);

        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + limit);

        const suppliers = await prisma.supplier.findMany({
            where: {
                OR: [
                    { coi_expiry: { lte: futureDate } },
                    { kosher_expiry: { lte: futureDate } },
                    { sqf_expiry: { lte: futureDate } },
                    { haccp_expiry: { lte: futureDate } },
                    { organic_expiry: { lte: futureDate } },
                    { halal_expiry: { lte: futureDate } },
                    { allergen_expiry: { lte: futureDate } },
                    // Check for nulls if we consider "missing" as expiring soon? No, usually separate.
                    // Just expiring docs for now.
                ]
            }
        });

        const expiringDocs: Array<{
            id: string;
            vendor: string;
            vendorId: string;
            doc: string;
            expiry: string;
            days: number;
            status: string;
        }> = [];

        for (const s of suppliers) {
            const checkDoc = (date: Date | null, name: string) => {
                if (!date) return;
                const daysUntil = Math.ceil((new Date(date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                if (daysUntil <= limit) {
                    expiringDocs.push({
                        id: `${s.id}-${name}`,
                        vendor: s.company_name,
                        vendorId: s.id,
                        doc: name,
                        expiry: date.toISOString().split('T')[0],
                        days: daysUntil,
                        status: daysUntil < 0 ? 'expired' : 'warning'
                    });
                }
            };

            checkDoc(s.coi_expiry, 'Certificate of Insurance');
            checkDoc(s.kosher_expiry, 'Kosher Certificate');
            checkDoc(s.sqf_expiry, 'SQF Certification');
            checkDoc(s.haccp_expiry, 'HACCP Plan');
            checkDoc(s.allergen_expiry, 'Allergen Policy');
        }

        // Sort by days ascending (most urgent first)
        expiringDocs.sort((a, b) => a.days - b.days);

        return NextResponse.json(expiringDocs);
    } catch (error) {
        console.error('Error fetching expiring docs:', error);
        return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
}
