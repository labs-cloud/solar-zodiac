import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET all items
export async function GET(request: NextRequest) {
    try {
        const items = await prisma.item.findMany({
            include: {
                supplier: true,
            },
            orderBy: {
                sku: 'asc', // or item_name
            },
        });

        return NextResponse.json(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch items' },
            { status: 500 }
        );
    }
}

// POST create new item
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validation: Ensure supplier exists (if passed as ID) OR lookup?
        // Let's assume frontend passes supplier_id.

        const item = await prisma.item.create({
            data: {
                sku: body.sku,
                item_name: body.item_name,
                supplier_id: body.supplier_id,
                spec_sheet_url: body.spec_sheet_url || null,
                allergen_cert_url: body.allergen_cert_url || null,
            },
            include: {
                supplier: true,
            }
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error('Error creating item:', error);
        return NextResponse.json(
            { error: 'Failed to create item' },
            { status: 500 }
        );
    }
}
