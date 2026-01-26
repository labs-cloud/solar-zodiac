const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const vendors = [
    { name: "A-1 Bakery Supply Inc.", contact: "", phone: "973-977-9400", email: "getzy@a1bakerysupply.com", type: "Ingredient" },
    { name: "ABC Pallets Inc", contact: "", phone: "718-506-6115", email: "mr.abcpallets@gmail.com", type: "Packaging" },
    { name: "Ace Natural", contact: "Zully Sanchez", phone: "718-784-6000 Ext#106", email: "zully@acenatural.com", type: "Ingredient" },
    { name: "Acme-Hardesty Co.", contact: "", phone: "800-223-7054", email: "CSC@acme-hardesty.com", type: "Ingredient" },
    { name: "Agridient Inc.", contact: "", phone: "", email: "TRein@agridient.com", type: "Ingredient" },
    { name: "Aladdin Packaging LLC", contact: "", phone: "631-273-4747", email: "sales@aladdinpackaging.com", type: "Packaging" },
    { name: "Amtech Industrial Inc.", contact: "", phone: "209-505-8985", email: "", type: "Ingredient" },
    { name: "AmTech Ingredients Inc.", contact: "", phone: "715-381-5746", email: "", type: "Ingredient" },
    { name: "Anderson Advanced Ingredients", contact: "Russ Anderson", phone: "949.502.4770", email: "russa@andersonglobalgroup.com", type: "Ingredient" },
    { name: "Barchemy LLC", contact: "Rob Solomon", phone: "(217) 381-8604", email: "robs@barchemyllc.com", type: "Ingredient" },
    { name: "Barentz", contact: "Lynda Frantz", phone: "(201) 687-1852", email: "lynda.frantz@barentz.com", type: "Ingredient" },
    { name: "Bedemco", contact: "Paul Hanney", phone: "(914) 774-6572", email: "paul@bedemco.com", type: "Ingredient" },
    { name: "Bertram Foods", contact: "", phone: "(908) 862-8200", email: "orders@sbertram.com", type: "Ingredient" },
    { name: "BINEX LINE CORPORATION", contact: "Holly Huh", phone: "310-321-3355 Ext.114", email: "hollyhuh@binexline.com", type: "Logistics" },
    { name: "Bloostone Plastics", contact: "", phone: "212-390-8103 ext. 105", email: "orders@bloostone.com", type: "Packaging" },
    { name: "California Cereal Products Inc.", contact: "Cheryl R. Swint", phone: "478-259-4119", email: "poga@californiacereal.com", type: "Ingredient" },
    { name: "Callahan Chemical Company", contact: "", phone: "973-460-9222", email: "slakhan@calchem.com", type: "Ingredient" },
    { name: "CHEP USA", contact: "Jake Zwagerman", phone: "", email: "", type: "Logistics" },
    { name: "Ciranda Inc", contact: "Christine Jensen", phone: "715-808-8888", email: "orders@Ciranda.com", type: "Ingredient" },
    { name: "Dependable Food", contact: "", phone: "732-257-4500 ext. 208", email: "Yisroel@dependablefood.com", type: "Ingredient" },
    { name: "Essex Food Ingredients", contact: "", phone: "(800) 441-1017", email: "customerservice@essexfoodingredients.com", type: "Ingredient" },
    { name: "FabPac Corporation", contact: "", phone: "973-688-4000", email: "orders@fabpac.com", type: "Packaging" },
    { name: "Florida Bulk", contact: "Jennifer Older", phone: "863.668.9000", email: "orders@floridabulksales.com", type: "Ingredient" },
    { name: "Freedman Packaging Corp.", contact: "", phone: "718-336-0593", email: "orders@freedmanpack.com", type: "Packaging" },
    { name: "FruitSmart Inc.", contact: "Lura Jansen", phone: "509-882-9956", email: "ljansen@fruitsmart.com", type: "Ingredient" },
    { name: "Global Ingredients Inc.", contact: "", phone: "(973) 278-6677", email: "griff@globalingredients.net", type: "Ingredient" },
    { name: "GNT USA LLC", contact: "", phone: "704-469-5555", email: "GNT-Orders@gntusa.com", type: "Ingredient" },
    { name: "Golden Barrel (Good Food)", contact: "Robert", phone: "610-273-3776", email: "GF-Sales@goldenbarrel.com", type: "Ingredient" },
    { name: "IFC Solutions Inc", contact: "", phone: "(908) 862-8810", email: "CustomerService@ifc-solutions.com", type: "Ingredient" },
    { name: "Incredible Container Corp.", contact: "", phone: "", email: "Nayra@incrediblecontainer.com", type: "Packaging" },
    { name: "Kerry", contact: "Anthony Salerno", phone: "(608)363-1200", email: "anthony.salerno@kerry.com", type: "Ingredient" },
    { name: "Lally Pak Inc.", contact: "Steve Beckman", phone: "908-351-4141 ext. 417", email: "SBeckman@LallyPak.com", type: "Packaging" },
    { name: "Malt Products Corp.", contact: "John Johansen", phone: "201-845-4420", email: "john@maltproducts.com", type: "Ingredient" },
    { name: "Mantrose-Haeuser Co. Inc.", contact: "Scott Bergeron", phone: "203-454-1800", email: "orders@mantrose.com", type: "Ingredient" },
    { name: "Master Martini", contact: "Vincenza Vallelunga", phone: "844-456-2713", email: "lorenzo.vezzani@unigra.it", type: "Ingredient" },
    { name: "Mgear Supplies", contact: "Joel Gold", phone: "718.337.8898", email: "joel@mgearsupplies.com", type: "Packaging" },
    { name: "M&U International LLC", contact: "Kaitlyn Smith", phone: "610-224-9322", email: "kaitlyn.s@mu-intel.us", type: "Ingredient" },
    { name: "New Brook International", contact: "", phone: "201-891-7923", email: "sales@newbrookintl.com", type: "Ingredient" },
    { name: "NP Nutra", contact: "Kris Fitzgerald", phone: "310.694.3031 Ext. 812", email: "kris.fitzgerald@npnutra.com", type: "Ingredient" },
    { name: "PACKLEIN USA LLC", contact: "Debbie Schwartz", phone: "718.852.1880", email: "Debbie@packlein.com", type: "Packaging" },
    { name: "Palmer Holland Inc", contact: "Ingrid Cordelino", phone: "440-686-2300", email: "orders@palmerholland.com", type: "Ingredient" },
    { name: "Paulaur Corporation", contact: "Gaellyn Ridler", phone: "609-395-8844 Ext 239", email: "gridler@paulaur.com", type: "Ingredient" },
    { name: "PGP International Inc.", contact: "Linda Sakona", phone: "530-668-5056", email: "cs@pgpint.com", type: "Ingredient" },
    { name: "Pollak Flavor Inc", contact: "", phone: "718-643-0221", email: "sales@pollakflavor.com", type: "Ingredient" },
    { name: "Prime Packaging Corp.", contact: "", phone: "718-417-1116", email: "cs@primepackaging.com", type: "Packaging" },
    { name: "South Shore Packaging LLC", contact: "John Norton", phone: "", email: "jnorton.southshorepackaging@gmail.com", type: "Packaging" },
    { name: "Stanpac", contact: "John Norton", phone: "201.320.9335", email: "john.norton@stanpacnet.com", type: "Packaging" },
    { name: "Strahl & Pitsch LLC", contact: "Yousaf Irfan Faisal", phone: "631.339.0342", email: "yfaisal@spwax.com", type: "Ingredient" },
    { name: "Supernatural", contact: "", phone: "", email: "sales@supernaturalkitchen.com", type: "Ingredient" },
    { name: "Suzanne's Specialties Inc.", contact: "Brittany Cook", phone: "800-762-2135", email: "ORDERS@SUZANNES-SPECIALTIES.COM", type: "Ingredient" },
    { name: "Top Health Ingredients", contact: "Bruce Wagner", phone: "844.697.2865", email: "bruce@tophealthingredients.com", type: "Ingredient" },
    { name: "TruColor LLC", contact: "Keith Luper", phone: "909-271-8869", email: "sales@trucolor.org", type: "Ingredient" },
    { name: "Uline", contact: "", phone: "800-295-5510", email: "accounts.receivable@ar.uline.com", type: "Packaging" },
    { name: "US Sweeteners", contact: "Moses Geller", phone: "718.854.8714 x 201", email: "moses@ussweeteners.com", type: "Ingredient" },
    { name: "Vitusa Products Inc.", contact: "Jonathan Stranahan", phone: "908.665.2900", email: "jstranahan@vitusaproducts.com", type: "Ingredient" },
    { name: "Walk Global", contact: "John Conway", phone: "888-583-2479", email: "packaging@walkglobal.com", type: "Packaging" },
    { name: "Webstaurantstore", contact: "", phone: "(717) 392-7472", email: "orders@webstaurantstore.com", type: "Packaging" },
];

async function importVendors() {
    console.log('Starting vendor import...');

    // First, get or create vendor types
    const ingredientType = await prisma.vendorType.upsert({
        where: { id: 'ingredient-type' },
        update: {},
        create: {
            id: 'ingredient-type',
            type_name: 'Ingredient',
            required_docs: 'COI,SQF,Allergen,Spec Sheet',
            description: 'Food ingredient suppliers'
        }
    });

    const packagingType = await prisma.vendorType.upsert({
        where: { id: 'packaging-type' },
        update: {},
        create: {
            id: 'packaging-type',
            type_name: 'Packaging',
            required_docs: 'COI,Spec Sheet',
            description: 'Packaging material suppliers'
        }
    });

    const logisticsType = await prisma.vendorType.upsert({
        where: { id: 'logistics-type' },
        update: {},
        create: {
            id: 'logistics-type',
            type_name: 'Logistics',
            required_docs: 'COI',
            description: 'Transportation and logistics providers'
        }
    });

    let imported = 0;
    let skipped = 0;

    for (const vendor of vendors) {
        try {
            // Determine vendor type ID
            let vendorTypeId;
            if (vendor.type === 'Ingredient') vendorTypeId = ingredientType.id;
            else if (vendor.type === 'Packaging') vendorTypeId = packagingType.id;
            else vendorTypeId = logisticsType.id;

            // Check if vendor already exists
            const existing = await prisma.supplier.findFirst({
                where: { company_name: vendor.name }
            });

            if (existing) {
                console.log(`Skipping ${vendor.name} - already exists`);
                skipped++;
                continue;
            }

            // Create vendor
            await prisma.supplier.create({
                data: {
                    company_name: vendor.name,
                    vendor_type_id: vendorTypeId,
                    contact_name: vendor.contact || null,
                    contact_phone: vendor.phone || null,
                    contact_email: vendor.email || null,
                    onboarding_status: 'Not Started',
                    compliance_score: 0,
                }
            });

            console.log(`✓ Imported ${vendor.name}`);
            imported++;
        } catch (error) {
            console.error(`Error importing ${vendor.name}:`, error.message);
        }
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   Imported: ${imported}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${vendors.length}`);
}

importVendors()
    .catch((e) => {
        console.error('Import failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
