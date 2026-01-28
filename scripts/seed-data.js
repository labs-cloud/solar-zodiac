const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Clearing existing data...');
    // Delete in order of dependencies (child first)
    await prisma.inboundPO.deleteMany();
    await prisma.outboundShipment.deleteMany();
    await prisma.item.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.vendorType.deleteMany();
    await prisma.customer.deleteMany();

    console.log('Seeding Vendor Types...');
    const types = await Promise.all([
        prisma.vendorType.create({ data: { type_name: 'Ingredient', required_docs: 'COI,Kosher,SQF,HACCP,Allergen,Spec Sheet' } }),
        prisma.vendorType.create({ data: { type_name: 'Packaging', required_docs: 'COI,Spec Sheet' } }),
        prisma.vendorType.create({ data: { type_name: 'Logistics', required_docs: 'COI' } }),
    ]);
    const typeMap = types.reduce((acc, t) => ({ ...acc, [t.type_name]: t.id }), {});

    console.log('Seeding Suppliers...');
    const suppliers = await Promise.all([
        prisma.supplier.create({
            data: {
                company_name: 'Kerry Ingredients',
                vendor_type_id: typeMap['Ingredient'],
                contact_name: 'John Smith',
                contact_email: 'john.smith@kerry.com',
                contact_phone: '555-0101',
                address: '123 Flavor Way, Beloit, WI',
                onboarding_status: 'Complete',
                compliance_score: 95,
                coi_uploaded: true,
                coi_expiry: new Date('2026-06-01'),
                sqf_uploaded: true,
                haccp_uploaded: true
            }
        }),
        prisma.supplier.create({
            data: {
                company_name: 'ABC Foods',
                vendor_type_id: typeMap['Ingredient'],
                contact_name: 'Jane Doe',
                contact_email: 'jane@abcfoods.com',
                contact_phone: '555-0102',
                address: '456 Sugar Lane, Miami, FL',
                onboarding_status: 'In Progress',
                compliance_score: 45,
                coi_uploaded: true,
                coi_expiry: new Date('2024-12-01'), // Expired
                sqf_uploaded: false
            }
        }),
        prisma.supplier.create({
            data: {
                company_name: 'Freedman Packaging',
                vendor_type_id: typeMap['Packaging'],
                contact_name: 'Bob Box',
                contact_email: 'bob@freedman.com',
                contact_phone: '555-0103',
                address: '789 Box Cir, Chicago, IL',
                onboarding_status: 'Complete',
                compliance_score: 100,
                coi_uploaded: true,
                coi_expiry: new Date('2026-03-15'), // Expiring soon
            }
        }),
        prisma.supplier.create({
            data: {
                company_name: 'Quick Ship Logistics',
                vendor_type_id: typeMap['Logistics'],
                contact_name: 'Trucker Tom',
                contact_email: 'tom@quickship.com',
                address: 'Highway 1, Austin, TX',
                onboarding_status: 'Complete',
                compliance_score: 80,
            }
        })
    ]);

    const supplierMap = suppliers.reduce((acc, s) => ({ ...acc, [s.company_name]: s.id }), {});

    console.log('Seeding Customers...');
    const customers = await Promise.all([
        prisma.customer.create({
            data: {
                customer_name: 'Whole Foods Market',
                contact_name: 'Buyer Bill',
                contact_email: 'bill@wholefoods.com',
                shipping_address: '550 Bowie St, Austin, TX',
                billing_address: '550 Bowie St, Austin, TX'
            }
        }),
        prisma.customer.create({
            data: {
                customer_name: 'Costco Wholesale',
                contact_name: 'Sarah Buyer',
                contact_email: 'sarah@costco.com',
                shipping_address: '999 Lake Dr, Issaquah, WA',
                billing_address: '999 Lake Dr, Issaquah, WA'
            }
        })
    ]);
    const customerMap = customers.reduce((acc, c) => ({ ...acc, [c.customer_name]: c.id }), {});

    console.log('Seeding Items...');
    await Promise.all([
        prisma.item.create({
            data: {
                sku: 'RM-1001',
                item_name: 'Wheat Flour',
                supplier_id: supplierMap['Kerry Ingredients'],
                spec_sheet_url: 'https://example.com/spec.pdf'
            }
        }),
        prisma.item.create({
            data: {
                sku: 'RM-1002',
                item_name: 'Sugar',
                supplier_id: supplierMap['ABC Foods'],
                allergen_cert_url: 'https://example.com/allergen.pdf'
            }
        }),
        prisma.item.create({
            data: {
                sku: 'PK-5001',
                item_name: 'Cardboard Box',
                supplier_id: supplierMap['Freedman Packaging'],
            }
        })
    ]);

    console.log('Seeding Receiving Logs...');
    await prisma.inboundPO.create({
        data: {
            po_number: 'PO-9901',
            supplier_id: supplierMap['Kerry Ingredients'],
            supplier_name: 'Kerry Ingredients',
            receive_date: new Date(),
            product_name: 'Wheat Flour',
            pallet_count: 10,
            status: 'Complete',
            truck_clean_check: 'Yes',
            truck_damage_check: 'No',
            truck_odor_check: 'No',
            received_by: 'Warehouse Joe'
        }
    });

    await prisma.inboundPO.create({
        data: {
            po_number: 'PO-9902',
            supplier_id: supplierMap['ABC Foods'],
            supplier_name: 'ABC Foods',
            receive_date: new Date(Date.now() - 86400000), // Yesterday
            product_name: 'Sugar',
            pallet_count: 22,
            status: 'Pending',
            truck_clean_check: 'No', // Failed check
            truck_damage_check: 'No',
            truck_odor_check: 'No',
            received_by: 'Warehouse Joe'
        }
    });

    console.log('Seeding Shipping Logs...');
    await prisma.outboundShipment.create({
        data: {
            customer_id: customerMap['Whole Foods Market'],
            customer_name: 'Whole Foods Market',
            customer_po: 'WF-1001',
            ship_datetime: new Date(),
            product_name: 'Granola Bars',
            pallet_count: 5,
            status: 'In Transit',
            shipped_by: 'Shipping Sam'
        }
    });

    console.log('Database seeded successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
