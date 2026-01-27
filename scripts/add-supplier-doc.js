const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Adding dummy COI doc to Once Again supplier...');
    const supplier = await prisma.supplier.findFirst({
        where: { company_name: { contains: 'Once Again' } }
    });

    if (supplier) {
        await prisma.supplier.update({
            where: { id: supplier.id },
            data: {
                coi_url: 'https://docs.google.com/spreadsheets/d/17RU5nbH6BO4iDsVb6CcqmkbL63n-C_t1Mt1CW4OSxGw/preview',
                coi_uploaded: true
            }
        });
        console.log('Updated COI url.');
    }
    await prisma.$disconnect();
}

main();
