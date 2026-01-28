import { prisma } from './prisma';

// Helper types for Wherefour data
interface WherefourVendor {
    id: string; // The URL/ID from Wherefour
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    vendor_type: string;
}

interface WherefourPO {
    id: string;
    po_number: string;
    vendor_id: string;
    ordered_date: string;
    items: {
        product: string;
        quantity: number;
    }[];
}

interface WherefourSO {
    id: string;
    order_number: string;
    customer_name: string;
    ship_date: string;
    // ...
}

// MOCK Service - Replace with real fetch calls when API Key provided
export class WherefourService {
    private apiKey: string;
    private baseUrl = 'https://api.wherefour.com/v1'; // Example URL

    constructor() {
        this.apiKey = process.env.WHEREFOUR_API_KEY || 'mock_key';
    }

    // --- MOCK DATA GENERATORS ---
    private getMockVendors(): WherefourVendor[] {
        return [
            {
                id: 'wf-vendor-111',
                name: 'Wherefour Ingredients Inc',
                address: '123 Cloud St',
                city: 'San Francisco',
                state: 'CA',
                zip: '94105',
                phone: '555-WF-01',
                email: 'orders@wf-ingredients.com',
                vendor_type: 'Ingredient'
            },
            {
                id: 'wf-vendor-222',
                name: 'Global Packaging Solutions',
                address: '450 Logistics Blvd',
                city: 'Atlanta',
                state: 'GA',
                zip: '30303',
                phone: '555-WF-02',
                email: 'sales@globalpack.com',
                vendor_type: 'Packaging'
            }
        ];
    }

    private getMockPOs(): WherefourPO[] {
        return [
            {
                id: 'wf-po-101',
                po_number: 'PO-WF-1001',
                vendor_id: 'wf-vendor-111',
                ordered_date: new Date().toISOString(),
                items: [{ product: 'Organic Flour', quantity: 50 }]
            },
            {
                id: 'wf-po-102',
                po_number: 'PO-WF-1002',
                vendor_id: 'wf-vendor-222',
                ordered_date: new Date().toISOString(),
                items: [{ product: 'Corrugated Boxes', quantity: 5000 }]
            }
        ];
    }

    // --- SYNC FUNCTIONS ---

    async syncVendors() {
        console.log('Fetching vendors from Wherefour...');
        const wfVendors = this.getMockVendors(); // Replace with axios.get

        let syncedCount = 0;
        let errorCount = 0;

        for (const wfV of wfVendors) {
            try {
                // Determine vendor type
                let typeName = wfV.vendor_type || 'Ingredient';
                // Find or create vendor type
                let type = await prisma.vendorType.findFirst({ where: { type_name: typeName } });
                if (!type) {
                    type = await prisma.vendorType.findFirst({ where: { type_name: 'Ingredient' } });
                }

                if (!type) {
                    console.error('No vendor type found for sync fallback.');
                    continue;
                }

                // Upsert Supplier
                await prisma.supplier.upsert({
                    where: { wherefour_id: wfV.id },
                    update: {
                        company_name: wfV.name,
                        address: `${wfV.address}, ${wfV.city}, ${wfV.state} ${wfV.zip}`,
                        contact_phone: wfV.phone,
                        contact_email: wfV.email,
                    },
                    create: {
                        wherefour_id: wfV.id,
                        company_name: wfV.name,
                        vendor_type_id: type.id,
                        address: `${wfV.address}, ${wfV.city}, ${wfV.state} ${wfV.zip}`,
                        contact_phone: wfV.phone,
                        contact_email: wfV.email,
                        onboarding_status: 'Complete' // Assume synced vendors are verified
                    }
                });
                syncedCount++;
            } catch (error) {
                console.error(`Failed to sync vendor ${wfV.name}:`, error);
                errorCount++;
            }
        }
        return { synced: syncedCount, errors: errorCount };
    }

    async syncPurchaseOrders() {
        console.log('Fetching POs from Wherefour...');
        const wfPOs = this.getMockPOs();

        let syncedCount = 0;

        for (const wfPO of wfPOs) {
            try {
                const existing = await prisma.inboundPO.findUnique({ where: { wherefour_id: wfPO.id } });
                if (existing) continue; // Skip if already exists

                // Find local supplier
                const supplier = await prisma.supplier.findUnique({ where: { wherefour_id: wfPO.vendor_id } });

                await prisma.inboundPO.create({
                    data: {
                        wherefour_id: wfPO.id,
                        po_number: wfPO.po_number,
                        supplier_id: supplier?.id, // Link if found
                        supplier_name: supplier ? supplier.company_name : 'Unknown WF Vendor',
                        product_name: wfPO.items.map(i => i.product).join(', '),
                        receive_date: new Date(), // Default to now for 'Pending'
                        status: 'Pending'
                    }
                });
                syncedCount++;
            } catch (e) {
                console.error(`Error syncing PO ${wfPO.po_number}`, e);
            }
        }
        return { synced: syncedCount };
    }
}
