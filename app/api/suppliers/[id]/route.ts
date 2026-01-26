import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single supplier
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id: params.id },
            include: {
                vendor_type: true,
                inbound_pos: {
                    orderBy: { receive_date: 'desc' },
                    take: 10,
                },
            },
        });

        if (!supplier) {
            return NextResponse.json(
                { error: 'Supplier not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(supplier);
    } catch (error) {
        console.error('Error fetching supplier:', error);
        return NextResponse.json(
            { error: 'Failed to fetch supplier' },
            { status: 500 }
        );
    }
}

// PATCH update supplier
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();

        const supplier = await prisma.supplier.update({
            where: { id: params.id },
            data: body,
            include: {
                vendor_type: true,
            },
        });

        return NextResponse.json(supplier);
    } catch (error) {
        console.error('Error updating supplier:', error);
        return NextResponse.json(
            { error: 'Failed to update supplier' },
            { status: 500 }
        );
    }
}

// DELETE supplier
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await prisma.supplier.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting supplier:', error);
        return NextResponse.json(
            { error: 'Failed to delete supplier' },
            { status: 500 }
        );
    }
}
