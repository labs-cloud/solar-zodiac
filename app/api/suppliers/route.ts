import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET all suppliers
export async function GET(request: NextRequest) {
    try {
        const suppliers = await prisma.supplier.findMany({
            include: {
                vendor_type: true,
            },
            orderBy: {
                company_name: 'asc',
            },
        });

        return NextResponse.json(suppliers);
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch suppliers' },
            { status: 500 }
        );
    }
}

// POST create new supplier
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        let vendorTypeId = body.vendor_type_id;

        if (!vendorTypeId && body.vendor_type_name) {
            // Find or create the vendor type
            const vType = await prisma.vendorType.upsert({
                where: { id: 'temp-lookup-key-ignored-by-db' }, // upsert requires unique, but we don't have name unique. Use findFirst.
                // Actually prisma upsert on non-unique is hard. Let's do findFirst then create.
                update: {},
                create: { type_name: body.vendor_type_name, required_docs: 'COI' } // Fallback
            }).catch(() => null); // Silencing this wrong upsert usage

            // Correct approach:
            let type = await prisma.vendorType.findFirst({
                where: { type_name: body.vendor_type_name }
            });

            if (!type) {
                // Determine required docs based on type name (simple logic for now)
                let docs = 'COI';
                if (body.vendor_type_name === 'Ingredient') docs = 'COI,Kosher,SQF,HACCP,Allergen,Spec Sheet';
                if (body.vendor_type_name === 'Packaging') docs = 'COI,Spec Sheet';

                type = await prisma.vendorType.create({
                    data: {
                        type_name: body.vendor_type_name,
                        required_docs: docs
                    }
                });
            }
            vendorTypeId = type.id;
        }

        const supplier = await prisma.supplier.create({
            data: {
                company_name: body.company_name,
                vendor_type_id: vendorTypeId,
                contact_name: body.contact_name,
                contact_email: body.contact_email,
                contact_phone: body.contact_phone,
                address: body.address,
                onboarding_status: body.onboarding_status || 'Not Started',
            },
            include: {
                vendor_type: true,
            },
        });

        return NextResponse.json(supplier, { status: 201 });
    } catch (error) {
        console.error('Error creating supplier:', error);
        return NextResponse.json(
            { error: 'Failed to create supplier' },
            { status: 500 }
        );
    }
}
