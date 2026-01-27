import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            ship_datetime,
            customer_id,
            customer_po,
            shipper_name,
            shipped_to,
            trucking_company,
            product_name,
            pallet_count,
            bol_quantity_match,
            lot_numbers,
            seal_number,
            truck_damage_check,
            truck_odor_check,
            truck_clean_check,
            contains_allergen,
            shipped_by,
            reviewed_by
        } = body;

        // Find customer name as backup
        const customer = await prisma.customer.findUnique({
            where: { id: customer_id }
        });

        const newShipment = await prisma.outboundShipment.create({
            data: {
                ship_datetime: new Date(ship_datetime),
                customer_id: customer_id,
                customer_name: customer?.customer_name || shipped_to,
                customer_po: customer_po,
                shipper_name: shipper_name,
                shipped_to: shipped_to,
                trucking_company: trucking_company,
                product_name: product_name,
                pallet_count: Number(pallet_count),
                bol_quantity_match: bol_quantity_match,
                lot_numbers: lot_numbers,
                truck_damage_check: truck_damage_check,
                truck_odor_check: truck_odor_check,
                truck_clean_check: truck_clean_check,
                seal_number: seal_number,
                contains_allergen: contains_allergen,
                shipped_by: shipped_by,
                reviewed_by: reviewed_by,
                status: 'Pending' // Default for now
            }
        });

        return NextResponse.json({ success: true, id: newShipment.id });
    } catch (error) {
        console.error('Error creating shipping record:', error);
        return NextResponse.json({ error: 'Failed to create shipment' }, { status: 500 });
    }
}
