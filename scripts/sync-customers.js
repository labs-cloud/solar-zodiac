const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const CUSTOMERS = [
    { displayName: "Adelaar Farms LLC", firstName: "", lastName: "", email: "adelaarfarmsllc@gmail.com", phone: "" },
    { displayName: "Aliments Altra Foods Inc.", firstName: "", lastName: "", email: "", phone: "5142761981" },
    { displayName: "Amazon Einoid", firstName: "", lastName: "", email: "", phone: "" },
    { displayName: "Costco", firstName: "", lastName: "", email: "D179APT@COSTCO.COM", phone: "" },
    { displayName: "Costco Taiwan", firstName: "", lastName: "", email: "", phone: "" },
    { displayName: "Crisp N'fresh LLC", firstName: "Yanky", lastName: "Mandel", email: "office@crispnfresh.com", phone: "347-585-4481" },
    { displayName: "Einoid Food", firstName: "", lastName: "", email: "", phone: "" },
    { displayName: "Faire - Einoid", firstName: "", lastName: "", email: "", phone: "" },
    { displayName: "Faire - Snackatere/Maillo", firstName: "", lastName: "", email: "", phone: "" },
    { displayName: "GROCERY OUTLET INC", firstName: "", lastName: "", email: "invoices@cfgo.com", phone: "510-845-1999" },
    { displayName: "KAYCO, KENOVER MARKETING CORP.", firstName: "SHIMON", lastName: "MEYER", email: "smeyer@kayco.com", phone: "(718) 369-4600 EXT 340" },
    { displayName: "KEHE Distributors", firstName: "", lastName: "", email: "", phone: "" },
    { displayName: "NASSAU CANDY DISTRIBUTORS INC", firstName: "", lastName: "", email: "", phone: "" },
    { displayName: "Nutri Nosh NY", firstName: "Yosef", lastName: "Green", email: "yosef@nutrinoshny.com", phone: "315-626-2337" },
    { displayName: "Shemesh Snackery", firstName: "", lastName: "Shemesh Snackery", email: "sales@snackeryco.com", phone: "908-433-6553" },
    { displayName: "Steins Food", firstName: "Asher", lastName: "Morgenstern", email: "asher@steinsfoods.com", phone: "0208-900-1000" },
    { displayName: "TRADER JOE's Company", firstName: "Angie", lastName: "Martinez", email: "amartinez@traderjoes.com", phone: "626-301-4443" },
    { displayName: "Twenty Four Six Foods LLC", firstName: "", lastName: "", email: "rachel@246foods.com", phone: "718.240.9040" },
    { displayName: "Walmart - Einoid", firstName: "", lastName: "", email: "", phone: "" }
];

async function syncCustomers() {
    console.log('Starting customer import...');

    let createdCount = 0;
    let updatedCount = 0;

    for (const c of CUSTOMERS) {
        // 1. Determine Customer Name (Priority: Display Name -> specific formatting logic)
        let customerName = c.displayName;
        if (!customerName) {
            if (c.firstName && c.lastName) customerName = `${c.firstName} ${c.lastName}`;
            else if (c.firstName) customerName = c.firstName;
            else if (c.lastName) customerName = c.lastName;
            else customerName = "Unknown Customer";
        }

        // 2. Determine Contact Name
        let contactName = null;
        if (c.firstName || c.lastName) {
            contactName = [c.firstName, c.lastName].filter(Boolean).join(" ");
        }

        // 3. Upsert (Update if exists by name, otherwise create)
        // We use findFirst because customer_name might not be unique in schema (though it effectively is for us)
        const existing = await prisma.customer.findFirst({
            where: { customer_name: customerName }
        });

        if (existing) {
            process.stdout.write(`Updating ${customerName}... `);
            await prisma.customer.update({
                where: { id: existing.id },
                data: {
                    contact_name: contactName || existing.contact_name, // Only overwrite if we have a name
                    contact_email: c.email || existing.contact_email,
                    contact_phone: c.phone || existing.contact_phone
                }
            });
            console.log('Done.');
            updatedCount++;
        } else {
            process.stdout.write(`Creating ${customerName}... `);
            await prisma.customer.create({
                data: {
                    customer_name: customerName,
                    contact_name: contactName,
                    contact_email: c.email || null,
                    contact_phone: c.phone || null
                }
            });
            console.log('Done.');
            createdCount++;
        }
    }

    console.log(`\nImport Complete! Created: ${createdCount}, Updated: ${updatedCount}`);
}

syncCustomers()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
