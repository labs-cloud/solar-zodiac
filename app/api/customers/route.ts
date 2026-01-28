import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';


export async function GET() {
    try {
        const customers = await prisma.customer.findMany({
            orderBy: { customer_name: 'asc' }
        });
        return NextResponse.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const customer = await prisma.customer.create({
            data: {
                customer_name: body.customer_name,
                contact_name: body.contact_name,
                contact_email: body.contact_email,
                contact_phone: body.contact_phone,
                shipping_address: body.shipping_address,
                billing_address: body.billing_address,
            }
        });
        return NextResponse.json(customer, { status: 201 });
    } catch (error) {
        console.error('Error creating customer:', error);
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
}
