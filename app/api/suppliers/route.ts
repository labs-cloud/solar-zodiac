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

        const supplier = await prisma.supplier.create({
            data: {
                company_name: body.company_name,
                vendor_type_id: body.vendor_type_id,
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
