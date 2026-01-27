const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fixing compliance scores and document links...');

    try {
        // 1. Downgrade ALL suppliers to non-compliant (e.g. 40%)
        await prisma.supplier.updateMany({
            data: {
                compliance_score: 40,
                onboarding_status: 'Pending'
            }
        });
        console.log('Downgraded all suppliers.');

        // 2. Set "Once Again Nut Butter" to 100%
        // Search by name approx
        const onceAgain = await prisma.supplier.findFirst({
            where: { company_name: { contains: 'Once Again' } }
        });

        if (onceAgain) {
            await prisma.supplier.update({
                where: { id: onceAgain.id },
                data: {
                    compliance_score: 100,
                    onboarding_status: 'Complete'
                }
            });
            console.log(`Updated Once Again (${onceAgain.id}) to 100%`);
        } else {
            console.error('Once Again supplier not found!');
        }

        // 3. Update PO 3140 Docs URL to Google Sheet Preview (Embedded View)
        // We search by po_number
        const po = await prisma.inboundPO.findFirst({
            where: { po_number: 'PO_3140' }
        });

        if (po) {
            await prisma.inboundPO.update({
                where: { id: po.id },
                data: {
                    // Pointing to the specific "Snacketere PO" sheet in preview mode
                    receiving_docs_url: 'https://docs.google.com/spreadsheets/d/17RU5nbH6BO4iDsVb6CcqmkbL63n-C_t1Mt1CW4OSxGw/preview'
                }
            });
            console.log('Updated PO_3140 docs url.');
        }

        // 4. Update Shipment SO_407 Docs URL
        // Search by customer_po
        const so = await prisma.outboundShipment.findFirst({
            where: { customer_po: 'SO_407' }
        });

        // Also try finding by tracking if needed, but SO_407 worked before.
        if (so) {
            await prisma.outboundShipment.update({
                where: { id: so.id },
                data: {
                    // Pointing to "Snacketere Shipments" sheet
                    bol_url: 'https://docs.google.com/spreadsheets/d/17NHDm0jjgibLWAJ41zcR0PFd5_HDyL8oyi4BgTz6hI8/preview'
                }
            });
            console.log('Updated SO_407 bol url.');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
