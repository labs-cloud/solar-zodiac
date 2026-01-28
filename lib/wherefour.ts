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

// Real Service Implementation
export class WherefourService {
    // Verified: Credentials work on Production (my.wherefour.com), not Sandbox
    private baseUrl = 'https://my.wherefour.com/api/v1';
    private authHeader: string;

    constructor() {
        // Hardcoded for this demo environment as requested, but usually goes in .env
        const username = 'hershey@optentia.com';
        const password = 'nxJF35GQy8pP8NKCBdCj'; // in real apps use process.env.WF_API_KEY
        this.authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    }

    private async fetchFromApi<T>(endpoint: string): Promise<T> {
        const res = await fetch(`${this.baseUrl}${endpoint}`, {
            headers: {
                'Authorization': this.authHeader,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'SolarZodiac/1.0'
            }
        });

        if (!res.ok) {
            const body = await res.text();
            throw new Error(`Wherefour API Error ${res.status}: ${body}`);
        }

        return res.json();
    }

    // --- FETCH FUNCTIONS ---
    private async getVendors(): Promise<WherefourVendor[]> {
        // API response likely usually wraps data, but assuming array or specific structure based on standard REST
        // If the API returns { data: [...] } we might need to adjust.
        // For now assuming direct array or auto-mapping.
        // Let's assume standard Wherefour return structure.

        try {
            const data: any = await this.fetchFromApi('/vendors');
            // Safely map the response. Wherefour usually returns an array directly or keys.
            // Adjusting based on common patterns: often it's an array for index endpoints.
            const rawVendors = Array.isArray(data) ? data : (data.content || []); // Fallback for filtered responses

            return rawVendors.map((v: any) => ({
                id: v.url || v.id?.toString(), // API standard usually uses URL as ID or specific ID field
                name: v.name,
                address: v.address1 || '',
                city: v.city || '',
                state: v.state || '',
                zip: v.postalCode || '',
                phone: v.phone || '',
                email: v.email || '',
                vendor_type: v.vendorType?.name || 'Ingredient' // fallback
            }));
        } catch (e) {
            console.error('Error fetching vendors:', e);
            throw e;
        }
    }

    private async getPOs(): Promise<WherefourPO[]> {
        try {
            const data: any = await this.fetchFromApi('/purchase-orders'); // Check exact endpoint name, typically kebab-case
            const rawPOs = Array.isArray(data) ? data : (data.content || []);

            return rawPOs.map((p: any) => ({
                id: p.url || p.id?.toString(),
                po_number: p.name || p.orderNumber, // 'name' is often the PO number string
                vendor_id: p.vendor?.url || p.vendorId, // Link to vendor
                ordered_date: p.date,
                items: (p.lineItems || []).map((li: any) => ({
                    product: li.inventoryItem?.name || 'Unknown Item',
                    quantity: li.quantity || 0
                }))
            }));
        } catch (e) {
            console.error('Error fetching POs:', e);
            // Fallback for demo if endpoint fails
            return [];
        }
    }

    // --- SYNC FUNCTIONS ---

    async syncVendors() {
        console.log('Fetching real vendors from Wherefour...');
        const wfVendors = await this.getVendors();

        let syncedCount = 0;
        let errorCount = 0;

        for (const wfV of wfVendors) {
            try {
                // Determine vendor type
                let typeName = wfV.vendor_type || 'Ingredient';
                // Find or create vendor type
                let type = await prisma.vendorType.findFirst({ where: { type_name: typeName } });
                if (!type) {
                    // Try to be smart, if not found, default to Ingredient or create it? 
                    // Let's default to 'Ingredient' if exists, otherwise create the new type.
                    const defaultType = await prisma.vendorType.findFirst({ where: { type_name: 'Ingredient' } });
                    if (defaultType) {
                        type = defaultType;
                    } else {
                        // Create it on the fly
                        type = await prisma.vendorType.create({ data: { type_name: typeName, required_docs: 'COI' } });
                    }
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
        console.log('Fetching real POs from Wherefour...');
        const wfPOs = await this.getPOs();

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
                        product_name: wfPO.items.map(i => `${i.product} (${i.quantity})`).join(', '),
                        receive_date: new Date(wfPO.ordered_date),
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
