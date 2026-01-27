import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET expiring documents
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days') || '30');

        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);

        const suppliers = await prisma.supplier.findMany({
            include: {
                vendor_type: true,
            },
        });

        const expiringDocs: any[] = [];

        suppliers.forEach((supplier) => {
            const checkDoc = (
                docType: string,
                expiry: Date | null,
                uploaded: boolean
            ) => {
                if (uploaded && expiry) {
                    const daysUntilExpiry = Math.ceil(
                        (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    if (daysUntilExpiry <= days && daysUntilExpiry >= 0) {
                        expiringDocs.push({
                            vendor: supplier.company_name,
                            vendorId: supplier.id,
                            doc: docType,
                            expiry: expiry.toISOString().split('T')[0],
                            days: daysUntilExpiry,
                            status: daysUntilExpiry < 0 ? 'expired' : 'warning',
                        });
                    } else if (daysUntilExpiry < 0) {
                        expiringDocs.push({
                            vendor: supplier.company_name,
                            vendorId: supplier.id,
                            doc: docType,
                            expiry: expiry.toISOString().split('T')[0],
                            days: daysUntilExpiry,
                            status: 'expired',
                        });
                    }
                }
            };

            checkDoc('COI', supplier.coi_expiry, supplier.coi_uploaded);
            checkDoc('Kosher Cert', supplier.kosher_expiry, supplier.kosher_uploaded);
            checkDoc('SQF Level 2', supplier.sqf_expiry, supplier.sqf_uploaded);
            checkDoc('HACCP Plan', supplier.haccp_expiry, supplier.haccp_uploaded);
            checkDoc('Organic Cert', supplier.organic_expiry, supplier.organic_uploaded);
            checkDoc('Halal Cert', supplier.halal_expiry, supplier.halal_uploaded);
            checkDoc('Allergen Policy', supplier.allergen_expiry, supplier.allergen_uploaded);
        });

        // Sort by days until expiry
        expiringDocs.sort((a, b) => a.days - b.days);

        return NextResponse.json(expiringDocs);
    } catch (error) {
        console.error('Error fetching expiring documents:', error);
        return NextResponse.json(
            { error: 'Failed to fetch expiring documents' },
            { status: 500 }
        );
    }
}
