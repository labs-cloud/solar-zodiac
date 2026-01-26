const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function uploadDocuments() {
    // Find the vendor
    const vendor = await prisma.supplier.findFirst({
        where: {
            company_name: {
                contains: 'Once Again',
            }
        },
        include: {
            vendor_type: true
        }
    });

    if (!vendor) {
        console.error('Vendor not found');
        return;
    }

    console.log(`Updating documents for: ${vendor.company_name}`);

    // Define the documents to "upload" with valid expiry dates (1 year from now)
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    // Update the supplier record
    const updatedVendor = await prisma.supplier.update({
        where: { id: vendor.id },
        data: {
            // COI
            coi_uploaded: true,
            coi_expiry: nextYear,
            coi_url: '/uploads/manual_coi_upload.pdf',

            // Kosher
            kosher_uploaded: true,
            kosher_expiry: nextYear,
            kosher_url: '/uploads/manual_kosher_cert.pdf',

            // SQF Level 2
            sqf_uploaded: true,
            sqf_expiry: nextYear,
            sqf_url: '/uploads/manual_sqf_cert.pdf',

            // HACCP
            haccp_uploaded: true,
            haccp_expiry: nextYear,
            haccp_url: '/uploads/manual_haccp_plan.pdf',

            // Organic
            organic_uploaded: true,
            organic_expiry: nextYear,
            organic_url: '/uploads/manual_organic_cert.pdf',

            // Halal
            halal_uploaded: true,
            halal_expiry: nextYear,
            halal_url: '/uploads/manual_halal_cert.pdf',

            // Allergen
            allergen_uploaded: true,
            allergen_expiry: nextYear,
            allergen_url: '/uploads/manual_allergen_policy.pdf',

            // Spec Sheet (no expiry)
            spec_sheet_uploaded: true,
            spec_sheet_url: '/uploads/manual_spec_sheet.pdf',

            onboarding_status: 'Complete'
        }
    });

    // Calculate new score
    const requiredDocs = vendor.vendor_type.required_docs.split(',');
    let uploadedCount = 0;

    if (requiredDocs.includes('COI') && updatedVendor.coi_uploaded) uploadedCount++;
    if (requiredDocs.includes('Kosher') && updatedVendor.kosher_uploaded) uploadedCount++;
    if (requiredDocs.includes('SQF') && updatedVendor.sqf_uploaded) uploadedCount++;
    if (requiredDocs.includes('HACCP') && updatedVendor.haccp_uploaded) uploadedCount++;
    if (requiredDocs.includes('Organic') && updatedVendor.organic_uploaded) uploadedCount++;
    if (requiredDocs.includes('Halal') && updatedVendor.halal_uploaded) uploadedCount++;
    if (requiredDocs.includes('Allergen') && updatedVendor.allergen_uploaded) uploadedCount++;
    if (requiredDocs.includes('Spec Sheet') && updatedVendor.spec_sheet_uploaded) uploadedCount++;
    if (requiredDocs.includes('W9') && updatedVendor.w9_uploaded) uploadedCount++;

    const newScore = Math.round((uploadedCount / requiredDocs.length) * 100);

    await prisma.supplier.update({
        where: { id: vendor.id },
        data: { compliance_score: newScore }
    });

    console.log(`✓ Documents uploaded successfully!`);
    console.log(`✓ New Compliance Score: ${newScore}%`);
    console.log(`✓ Status: Complete`);
    console.log(`\nNavigate to: http://localhost:3000/suppliers/${vendor.id}`);
}

uploadDocuments()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
