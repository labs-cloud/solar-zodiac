const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // 1. Create Vendor Types
    const typePackaging = await prisma.vendorType.create({
        data: {
            type_name: 'Packaging',
            required_docs: 'COI,Spec Sheet',
            description: 'Suppliers of boxes, films, and containers'
        }
    })

    const typeIngredient = await prisma.vendorType.create({
        data: {
            type_name: 'Ingredient',
            required_docs: 'COI,Kosher,SQF,HACCP,Allergen,Spec Sheet',
            description: 'Raw material suppliers'
        }
    })

    const typeLogistics = await prisma.vendorType.create({
        data: {
            type_name: 'Logistics',
            required_docs: 'COI',
            description: 'Trucking and warehousing'
        }
    })

    // 2. Create Suppliers
    // Freedman Packaging - 100% compliant
    const s1 = await prisma.supplier.create({
        data: {
            company_name: 'Freedman Packaging',
            vendor_type_id: typePackaging.id,
            contact_name: 'Bob Freedman',
            contact_email: 'bob@freedmanpack.com',
            onboarding_status: 'Complete',
            coi_uploaded: true,
            coi_expiry: new Date('2026-12-31'),
            coi_url: '/uploads/dummy_coi.pdf',
            spec_sheet_uploaded: true,
            spec_sheet_url: '/uploads/dummy_spec.pdf',
            compliance_score: 100
        }
    })

    // Kerry Ingredients - 85% compliant, 1 expiring
    const s2 = await prisma.supplier.create({
        data: {
            company_name: 'Kerry Ingredients',
            vendor_type_id: typeIngredient.id,
            contact_name: 'Sarah Taste',
            contact_email: 'sarah@kerry.com',
            onboarding_status: 'Complete',
            coi_uploaded: true,
            coi_expiry: new Date('2026-06-01'),
            kosher_uploaded: true,
            kosher_expiry: new Date('2026-02-10'), // Expiring soon (<20 days from Jan 24)
            sqf_uploaded: true,
            sqf_expiry: new Date('2026-09-01'),
            haccp_uploaded: true,
            haccp_expiry: new Date('2026-09-01'),
            allergen_uploaded: true,
            allergen_expiry: new Date('2026-09-01'),
            spec_sheet_uploaded: true,
            compliance_score: 85
        }
    })

    // ABC Foods - 60% compliant, missing docs
    const s3 = await prisma.supplier.create({
        data: {
            company_name: 'ABC Foods',
            vendor_type_id: typeIngredient.id,
            contact_name: 'John Dough',
            contact_email: 'john@abcfoods.com',
            onboarding_status: 'In Progress',
            coi_uploaded: true,
            coi_expiry: new Date('2026-08-01'),
            kosher_uploaded: true,
            kosher_expiry: new Date('2026-08-01'),
            sqf_uploaded: false, // Missing
            haccp_uploaded: false, // Missing
            allergen_uploaded: true,
            allergen_expiry: new Date('2026-08-01'),
            spec_sheet_uploaded: true,
            compliance_score: 60
        }
    })

    // XYZ Trucking - 40% compliant, expired COI
    const s4 = await prisma.supplier.create({
        data: {
            company_name: 'XYZ Trucking',
            vendor_type_id: typeLogistics.id,
            contact_name: 'Mike Haul',
            contact_email: 'mike@xyztrucking.com',
            onboarding_status: 'Not Started',
            coi_uploaded: true,
            coi_expiry: new Date('2025-01-01'), // Expired
            compliance_score: 0 // or low
        }
    })

    // Quality Spices - 100% compliant
    const s5 = await prisma.supplier.create({
        data: {
            company_name: 'Quality Spices',
            vendor_type_id: typeIngredient.id,
            contact_name: 'Lisa Spice',
            contact_email: 'lisa@qualityspices.com',
            onboarding_status: 'Complete',
            coi_uploaded: true,
            coi_expiry: new Date('2026-10-01'),
            kosher_uploaded: true,
            kosher_expiry: new Date('2026-10-01'),
            sqf_uploaded: true,
            sqf_expiry: new Date('2026-10-01'),
            haccp_uploaded: true,
            haccp_expiry: new Date('2026-10-01'),
            allergen_uploaded: true,
            allergen_expiry: new Date('2026-10-01'),
            spec_sheet_uploaded: true,
            compliance_score: 100
        }
    })

    // 3. Create Customers
    const c1 = await prisma.customer.create({
        data: {
            customer_name: 'Walmart Distribution',
            contact_name: 'Sam Buyer',
            contact_email: 'sam@walmart.com',
            shipping_address: '123 Walmart way, Bentonville AR'
        }
    })

    const c2 = await prisma.customer.create({
        data: {
            customer_name: 'Costco Wholesale',
            contact_name: 'Jim Bulk',
            contact_email: 'jim@costco.com'
        }
    })

    const c3 = await prisma.customer.create({
        data: {
            customer_name: 'Local Grocery Co',
            contact_name: 'Mom Pop',
            contact_email: 'mompop@local.com'
        }
    })

    // 4. Create Inbound POs
    await prisma.inboundPO.create({
        data: {
            po_number: 'PO-1001',
            supplier_id: s2.id, // Kerry
            receive_date: new Date('2026-01-20'),
            product_name: 'Wheat Flour',
            pallet_count: 5,
            truck_damage_check: 'NO',
            truck_odor_check: 'NO',
            truck_clean_check: 'YES',
            status: 'Complete',
            received_by: 'Warehouse Mike'
        }
    })

    await prisma.inboundPO.create({
        data: {
            po_number: 'PO-1002',
            supplier_id: s3.id, // ABC
            receive_date: new Date('2026-01-22'),
            product_name: 'Sugar',
            pallet_count: 10,
            truck_damage_check: 'NO',
            truck_odor_check: 'NO',
            truck_clean_check: 'YES',
            status: 'Pending'
        }
    })

    // 5. Create Outbound Shipments
    await prisma.outboundShipment.create({
        data: {
            customer_id: c1.id,
            customer_po: 'WM-999',
            product_name: 'Chips assortment',
            pallet_count: 22,
            truck_damage_check: 'NO',
            truck_odor_check: 'NO',
            truck_clean_check: 'YES',
            seal_number: 'SL-555',
            status: 'In Transit'
        }
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
