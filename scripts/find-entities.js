const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findEntities() {
    const supplier = await prisma.supplier.findFirst({
        where: { company_name: { contains: 'Once Again' } }
    });

    const customer = await prisma.customer.findFirst({
        where: { customer_name: { contains: 'Aliments Altra' } }
    });

    console.log('Supplier:', supplier ? `${supplier.company_name} (${supplier.id})` : 'Not Found');
    console.log('Customer:', customer ? `${customer.customer_name} (${customer.id})` : 'Not Found');
}

findEntities()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
