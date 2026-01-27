const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'labs@optentia.com';
    const password = 'password123';

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: 'Admin User',
                role: 'ADMIN'
            }
        });
        console.log(`Created admin user: ${email} with password: ${password}`);
    } else {
        console.log(`Admin user ${email} already exists.`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
