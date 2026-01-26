const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findVendor() {
    const vendor = await prisma.supplier.findFirst({
        where: {
            company_name: {
                contains: 'Once Again',
            }
        },
        include: {
            vendor_type: true,
        }
    });

    if (vendor) {
        console.log('✓ Found vendor:');
        console.log(`ID: ${vendor.id}`);
        console.log(`Name: ${vendor.company_name}`);
        console.log(`Type: ${vendor.vendor_type.type_name}`);
        console.log(`Contact: ${vendor.contact_name || 'N/A'}`);
        console.log(`Email: ${vendor.contact_email || 'N/A'}`);
        console.log(`\nNavigate to: http://localhost:3000/suppliers/${vendor.id}`);
    } else {
        console.log('Vendor not found. Listing all vendors:');
        const all = await prisma.supplier.findMany({
            select: { id: true, company_name: true }
        });
        all.forEach(v => console.log(`- ${v.company_name}`));
    }
}

findVendor()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
