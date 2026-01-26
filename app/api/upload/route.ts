import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const supplierId = formData.get('supplierId') as string;
        const documentType = formData.get('documentType') as string;
        const expiryDate = formData.get('expiryDate') as string | null;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename
        const timestamp = Date.now();
        const filename = `${supplierId}_${documentType}_${timestamp}_${file.name}`;
        const filepath = join(process.cwd(), 'public', 'uploads', filename);

        // Write file to disk
        await writeFile(filepath, buffer);

        // Update supplier record in database
        const updateData: any = {};
        const urlPath = `/uploads/${filename}`;

        switch (documentType) {
            case 'COI':
                updateData.coi_uploaded = true;
                updateData.coi_url = urlPath;
                if (expiryDate) updateData.coi_expiry = new Date(expiryDate);
                break;
            case 'Kosher':
                updateData.kosher_uploaded = true;
                updateData.kosher_url = urlPath;
                if (expiryDate) updateData.kosher_expiry = new Date(expiryDate);
                break;
            case 'SQF':
                updateData.sqf_uploaded = true;
                updateData.sqf_url = urlPath;
                if (expiryDate) updateData.sqf_expiry = new Date(expiryDate);
                break;
            case 'HACCP':
                updateData.haccp_uploaded = true;
                updateData.haccp_url = urlPath;
                if (expiryDate) updateData.haccp_expiry = new Date(expiryDate);
                break;
            case 'Organic':
                updateData.organic_uploaded = true;
                updateData.organic_url = urlPath;
                if (expiryDate) updateData.organic_expiry = new Date(expiryDate);
                break;
            case 'Halal':
                updateData.halal_uploaded = true;
                updateData.halal_url = urlPath;
                if (expiryDate) updateData.halal_expiry = new Date(expiryDate);
                break;
            case 'Allergen':
                updateData.allergen_uploaded = true;
                updateData.allergen_url = urlPath;
                if (expiryDate) updateData.allergen_expiry = new Date(expiryDate);
                break;
            case 'Spec Sheet':
                updateData.spec_sheet_uploaded = true;
                updateData.spec_sheet_url = urlPath;
                break;
            case 'W9':
                updateData.w9_uploaded = true;
                updateData.w9_url = urlPath;
                break;
            default:
                return NextResponse.json(
                    { error: 'Invalid document type' },
                    { status: 400 }
                );
        }

        // Update supplier in database
        const supplier = await prisma.supplier.update({
            where: { id: supplierId },
            data: updateData,
        });

        // Recalculate compliance score
        await recalculateComplianceScore(supplierId);

        return NextResponse.json({
            success: true,
            url: urlPath,
            filename,
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}

async function recalculateComplianceScore(supplierId: string) {
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id: supplierId },
            include: { vendor_type: true },
        });

        if (!supplier) return;

        const requiredDocs = supplier.vendor_type.required_docs.split(',');
        let validDocs = 0;
        const today = new Date();

        requiredDocs.forEach((doc) => {
            const docType = doc.trim();
            switch (docType) {
                case 'COI':
                    if (supplier.coi_uploaded && (!supplier.coi_expiry || supplier.coi_expiry > today)) {
                        validDocs++;
                    }
                    break;
                case 'Kosher':
                    if (supplier.kosher_uploaded && (!supplier.kosher_expiry || supplier.kosher_expiry > today)) {
                        validDocs++;
                    }
                    break;
                case 'SQF':
                    if (supplier.sqf_uploaded && (!supplier.sqf_expiry || supplier.sqf_expiry > today)) {
                        validDocs++;
                    }
                    break;
                case 'HACCP':
                    if (supplier.haccp_uploaded && (!supplier.haccp_expiry || supplier.haccp_expiry > today)) {
                        validDocs++;
                    }
                    break;
                case 'Organic':
                    if (supplier.organic_uploaded && (!supplier.organic_expiry || supplier.organic_expiry > today)) {
                        validDocs++;
                    }
                    break;
                case 'Halal':
                    if (supplier.halal_uploaded && (!supplier.halal_expiry || supplier.halal_expiry > today)) {
                        validDocs++;
                    }
                    break;
                case 'Allergen':
                    if (supplier.allergen_uploaded && (!supplier.allergen_expiry || supplier.allergen_expiry > today)) {
                        validDocs++;
                    }
                    break;
                case 'Spec Sheet':
                    if (supplier.spec_sheet_uploaded) validDocs++;
                    break;
                case 'W9':
                    if (supplier.w9_uploaded) validDocs++;
                    break;
            }
        });

        const score = Math.round((validDocs / requiredDocs.length) * 100);

        await prisma.supplier.update({
            where: { id: supplierId },
            data: { compliance_score: score },
        });
    } catch (error) {
        console.error('Error recalculating compliance score:', error);
    }
}
