const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DRIVE_LINK = 'https://drive.google.com/drive/folders/18wwDl3jrauPtSl5XtwH94hDAZUHzsYG3?usp=sharing';

async function main() {
    // 1. Get IDs
    const supplier = await prisma.supplier.findFirst({
        where: { company_name: { contains: 'Once Again' } }
    });
    if (!supplier) throw new Error("Supplier 'Once Again' not found");

    const customer = await prisma.customer.findFirst({
        where: { customer_name: { contains: 'Aliments Altra' } }
    });
    if (!customer) throw new Error("Customer 'Aliments Altra' not found");

    console.log(`Found Supplier: ${supplier.company_name} (${supplier.id})`);
    console.log(`Found Customer: ${customer.customer_name} (${customer.id})`);

    // 2. Create Inbound PO (PO_3140)
    const po = await prisma.inboundPO.create({
        data: {
            po_number: 'PO_3140',
            supplier_id: supplier.id,
            supplier_name: supplier.company_name,
            receive_date: new Date('2026-01-23'),
            product_name: 'Organic Peanut Butter, Creamy Cashew Butter',
            approved_vendor: 'Yes',
            status: 'Pending',
            notes: 'Please expedite this order! (Draft)',
            receiving_docs_url: DRIVE_LINK,
            invoice_url: DRIVE_LINK,
            bol_url: DRIVE_LINK
        }
    });
    console.log(`Created Inbound PO: ${po.po_number}`);

    // 3. Create Outbound Shipments (SO_407, SO_403, SO_406)
    // Linking them conceptually to the Inbound PO via notes or product matches

    // SO_407
    const so407 = await prisma.outboundShipment.create({
        data: {
            customer_id: customer.id,
            customer_name: customer.customer_name,
            customer_po: 'SO_407',
            shipped_to: `${customer.customer_name} - Montreal`,
            product_name: 'Once Again Squeezable Roasted Peanut Butter, Creamy Cashew Butter',
            lot_numbers: 'LOT-OA-2026-001',
            status: 'In Transit',
            tracking_number: 'TRK-SO407-EXP',
            notes: 'Fulfillment of PO_3140 inventory',
            bol_url: DRIVE_LINK,
            packing_list_url: DRIVE_LINK
        }
    });
    console.log(`Created Outbound Shipment: ${so407.customer_po}`);

    // SO_403
    const so403 = await prisma.outboundShipment.create({
        data: {
            customer_id: customer.id,
            customer_name: customer.customer_name,
            customer_po: 'SO_403',
            shipped_to: customer.customer_name,
            product_name: 'Once Again Organic Almond Butter',
            lot_numbers: 'LOT-OA-2026-002',
            status: 'Delivered',
            tracking_number: 'TRK-SO403-FedEx',
            notes: 'Earlier shipment',
            bol_url: DRIVE_LINK
        }
    });
    console.log(`Created Outbound Shipment: ${so403.customer_po}`);

    // SO_406
    const so406 = await prisma.outboundShipment.create({
        data: {
            customer_id: customer.id,
            customer_name: customer.customer_name,
            customer_po: 'SO_406',
            shipped_to: customer.customer_name,
            product_name: 'Once Again Bulk Tahini',
            lot_numbers: 'LOT-OA-2026-003',
            status: 'Pending',
            notes: 'Awaiting truck assignment',
            bol_url: DRIVE_LINK
        }
    });
    console.log(`Created Outbound Shipment: ${so406.customer_po}`);

}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
