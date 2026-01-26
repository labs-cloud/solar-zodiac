const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SHEET_VENDORS = [
    "A-1 Bakery Supply Inc.",
    "ABC Pallets Inc",
    "Ace Natural",
    "Acme-Hardesty Co.",
    "Agridient Inc.",
    "Aladdin Packaging LLC",
    "Amazon",
    "Amtech Industrial Inc.",
    "AmTech Ingredients Inc.",
    "Anderson Advanced Ingredients",
    "Assured Environments",
    "Barchemy LLC",
    "Barentz",
    "Bedemco",
    "Bertram Foods",
    "BINEX LINE CORPORATION",
    "Bloodstone Plastics",
    "California Cereal Products Inc.",
    "Callahan Chemical Company",
    "Central Distribution LLC",
    "CHEP USA",
    "Ciranda Inc",
    "Clayton Industries",
    "CONNECT TRANSPORT CORPORATION",
    "Del Express",
    "Dependable Food",
    "DM2 Distributions",
    "Emirates Printing Press L.L.C.",
    "Essex Food Ingredients",
    "FabPac Corporation",
    "FIVE STAR LABEL INC.",
    "Florida Bulk",
    "Freedman Packaging Corp.",
    "FreeWay Carriers",
    "FruitSmart Inc.",
    "Global Ingredients Inc.",
    "GNT USA LLC",
    "Golden Barrel (Good Food)",
    "IFC Solutions Inc",
    "Incredible Container Corp.",
    "INGREDION INCORPORATED",
    "Kerry",
    "Keyence",
    "KULKAO S.A.",
    "Lally Pak Inc.",
    "Lantev Distributing Company",
    "Malt Products Corp.",
    "Mantrose-Haeuser Co. Inc.",
    "Master Martini",
    "Merit Functional Foods",
    "Mgear Supplies",
    "Mooney General Paper Company",
    "M&U International LLC",
    "New Brook International",
    "NP Nutra",
    "Once Again Nut Butter Collective Inc.",
    "Ostreicher Paper",
    "PACKLEIN USA LLC",
    "Paige Company Containers inc",
    "Palmer Holland Inc",
    "Paulaur Corporation",
    "PGP International Inc.",
    "Pollak Flavor Inc",
    "Prime Packaging Corp.",
    "PRODUCERS PEANUT COMPANY",
    "Prototype Packaging",
    "Ready Refresh",
    "SFB Logistics inc",
    "Snackatere Office",
    "South Shore Packaging LLC",
    "Staff Right Solution LLC.",
    "Stanpac",
    "STARPLAST",
    "Strahl & Pitsch LLC",
    "Superb Packaging Inc.",
    "Supernatural",
    "Suzanne's Specialties Inc.",
    "Top Health Ingredients",
    "Tri State Packaging Inc.",
    "TruColor LLC",
    "Uline",
    "US Sweeteners",
    "Vitusa Products Inc.",
    "Walk Global",
    "Webstaurantstore",
    "White Wing Cleaning Consultants",
    "W Hydrocolloids"
];

async function syncVendors() {
    console.log('Starting vendor synchronization...');

    // 1. Get all current vendors
    const currentVendors = await prisma.supplier.findMany();
    console.log(`Current database has ${currentVendors.length} vendors.`);

    // 2. Determine default vendor type (using 'Ingredient' as a safe default if not found)
    let vendorType = await prisma.vendorType.findFirst({ where: { type_name: 'Ingredient' } });
    if (!vendorType) {
        vendorType = await prisma.vendorType.create({
            data: {
                type_name: 'Ingredient',
                required_docs: 'COI, Kosher, SQF, HACCP, Allergen, Spec Sheet'
            }
        });
    }

    // 3. Normalize names for comparison
    const normalize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, '');

    const sheetVendorMap = new Map();
    SHEET_VENDORS.forEach(name => {
        sheetVendorMap.set(normalize(name), name);
    });

    const currentVendorMap = new Map();
    currentVendors.forEach(v => {
        currentVendorMap.set(normalize(v.company_name), v);
    });

    // 4. Identify actions
    const toDelete = [];
    const toCreate = [];
    const toUpdate = []; // Optional: could update casing if needed

    // Check for deletions (In DB but NOT in Sheet)
    currentVendors.forEach(v => {
        if (!sheetVendorMap.has(normalize(v.company_name))) {
            toDelete.push(v);
        }
    });

    // Check for creations (In Sheet but NOT in DB)
    SHEET_VENDORS.forEach(name => {
        if (!currentVendorMap.has(normalize(name))) {
            toCreate.push(name);
        } else {
            // Exists, maybe update casing?
            // const existing = currentVendorMap.get(normalize(name));
            // if (existing.company_name !== name) { ... }
        }
    });

    console.log(`Found ${toDelete.length} vendors to DELETE.`);
    console.log(`Found ${toCreate.length} vendors to CREATE.`);

    // 5. Execute Deletions
    if (toDelete.length > 0) {
        console.log('\n--- DELETING VENDORS ---');
        for (const v of toDelete) {
            console.log(`Deleting: ${v.company_name}`);
            await prisma.supplier.delete({ where: { id: v.id } });
        }
    }

    // 6. Execute Creations
    if (toCreate.length > 0) {
        console.log('\n--- CREATING VENDORS ---');
        for (const name of toCreate) {
            // Determine type based on keywords if you like, or default to Ingredient
            let typeId = vendorType.id;

            // Simple logic to guess type
            if (name.includes('Packaging') || name.includes('Container') || name.includes('Label')) {
                // Find or create Packaging type
                let pkgType = await prisma.vendorType.findFirst({ where: { type_name: 'Packaging' } });
                if (pkgType) typeId = pkgType.id;
            } else if (name.includes('Carrier') || name.includes('Logistics') || name.includes('Transport')) {
                // Find or create Service type
                let svcType = await prisma.vendorType.findFirst({ where: { type_name: 'Service' } });
                if (svcType) typeId = svcType.id;
            }

            console.log(`Creating: ${name}`);
            await prisma.supplier.create({
                data: {
                    company_name: name,
                    vendor_type_id: typeId,
                    compliance_score: 0,
                    onboarding_status: 'Not Started'
                }
            });
        }
    }

    console.log('\nSynchronization Complete!');
}

syncVendors()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
