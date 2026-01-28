import { NextResponse } from 'next/server';
import { WherefourService } from '@/lib/wherefour';

export const dynamic = 'force-dynamic';

export async function POST() {
    try {
        const service = new WherefourService();

        // Sync Vendors
        const vendorResults = await service.syncVendors();

        // Sync POs
        const poResults = await service.syncPurchaseOrders();

        // (Optional) Sync Items, Customers, SalesOrders...

        return NextResponse.json({
            success: true,
            message: 'Wherefour sync completed',
            details: {
                vendors: vendorResults,
                pos: poResults,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Wherefour sync failed:', error);
        return NextResponse.json({ success: false, error: 'Sync failed' }, { status: 500 });
    }
}
