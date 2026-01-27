import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Destructure to separate dates or specific formats if needed
        const {
            receive_date,
            supplier_id,
            shipper_name,
            trucking_company,
            product_name,
            pallet_count,
            bol_quantity_match,
            po_number,
            lot_numbers,
            truck_damage_check,
            truck_odor_check,
            truck_clean_check,
            is_gluten_test_item,
            gluten_test_product,
            gluten_test_kit_lot,
            gluten_test_expiry,
            received_by,
            reviewed_by
        } = body;

        // Find supplier name to store as backup/display
        const supplier = await prisma.supplier.findUnique({
            where: { id: supplier_id }
        });

        const newPO = await prisma.inboundPO.create({
            data: {
                receive_date: new Date(receive_date),
                po_number: po_number,
                supplier_id: supplier_id,
                supplier_name: supplier?.company_name || shipper_name,
                shipper_name: shipper_name,
                trucking_company: trucking_company,
                product_name: product_name,
                pallet_count: Number(pallet_count),
                bol_quantity_match: bol_quantity_match,
                lot_numbers: lot_numbers,
                truck_damage_check: truck_damage_check,
                truck_odor_check: truck_odor_check,
                truck_clean_check: truck_clean_check,
                is_gluten_test_item: Boolean(is_gluten_test_item),
                gluten_test_product: gluten_test_product,
                gluten_test_kit_lot: gluten_test_kit_lot,
                gluten_test_expiry: gluten_test_expiry ? new Date(gluten_test_expiry) : null,
                received_by: received_by,
                reviewed_by: reviewed_by,
                status: 'Complete' // Defaulting to complete for now as it's a log
            }
        });

        return NextResponse.json({ success: true, id: newPO.id });
    } catch (error) {
        console.error('Error creating receiving record:', error);
        return NextResponse.json({ error: 'Failed to create record' }, { status: 500 });
    }
}
