const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addOnceAgain() {
    // Get ingredient type
    const ingredientType = await prisma.vendorType.findFirst({
        where: { type_name: 'Ingredient' }
    });

    if (!ingredientType) {
        console.error('Ingredient type not found');
        return;
    }

    // Create Once Again Nut Butter
    const vendor = await prisma.supplier.create({
        data: {
            company_name: 'Once Again Nut Butter Collective Inc.',
            vendor_type_id: ingredientType.id,
            contact_name: null,
            contact_email: null,
            contact_phone: null,
            onboarding_status: 'In Progress',
            compliance_score: 0,
        }
    });

    console.log('✓ Created vendor:');
    console.log(`ID: ${vendor.id}`);
    console.log(`Name: ${vendor.company_name}`);
    console.log(`\nNavigate to: http://localhost:3000/suppliers/${vendor.id}`);
}

addOnceAgain()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
