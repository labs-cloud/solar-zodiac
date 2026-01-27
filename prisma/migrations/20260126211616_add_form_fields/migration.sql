-- CreateTable
CREATE TABLE "VendorType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type_name" TEXT NOT NULL,
    "required_docs" TEXT NOT NULL,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_name" TEXT NOT NULL,
    "vendor_type_id" TEXT NOT NULL,
    "contact_name" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "address" TEXT,
    "onboarding_status" TEXT NOT NULL DEFAULT 'Not Started',
    "coi_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "coi_expiry" DATETIME,
    "coi_url" TEXT,
    "kosher_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "kosher_expiry" DATETIME,
    "kosher_url" TEXT,
    "sqf_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "sqf_expiry" DATETIME,
    "sqf_url" TEXT,
    "haccp_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "haccp_expiry" DATETIME,
    "haccp_url" TEXT,
    "organic_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "organic_expiry" DATETIME,
    "organic_url" TEXT,
    "halal_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "halal_expiry" DATETIME,
    "halal_url" TEXT,
    "allergen_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "allergen_expiry" DATETIME,
    "allergen_url" TEXT,
    "spec_sheet_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "spec_sheet_url" TEXT,
    "w9_uploaded" BOOLEAN NOT NULL DEFAULT false,
    "w9_url" TEXT,
    "compliance_score" INTEGER NOT NULL DEFAULT 0,
    "drive_folder_link" TEXT,
    "notes" TEXT,
    CONSTRAINT "Supplier_vendor_type_id_fkey" FOREIGN KEY ("vendor_type_id") REFERENCES "VendorType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_name" TEXT NOT NULL,
    "contact_name" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "billing_address" TEXT,
    "shipping_address" TEXT,
    "notes" TEXT
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "item_name" TEXT NOT NULL,
    "supplier_id" TEXT NOT NULL,
    "spec_sheet_url" TEXT,
    "allergen_cert_url" TEXT,
    CONSTRAINT "Item_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "InboundPO" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "po_number" TEXT NOT NULL,
    "supplier_id" TEXT,
    "supplier_name" TEXT,
    "receive_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipper_name" TEXT,
    "approved_vendor" TEXT,
    "trucking_company" TEXT,
    "product_name" TEXT,
    "pallet_count" INTEGER,
    "bol_quantity_match" TEXT,
    "quantity_mismatch_notes" TEXT,
    "lot_numbers" TEXT,
    "truck_damage_check" TEXT,
    "truck_odor_check" TEXT,
    "truck_clean_check" TEXT,
    "is_gluten_test_item" BOOLEAN NOT NULL DEFAULT false,
    "gluten_test_product" TEXT,
    "gluten_test_kit_lot" TEXT,
    "gluten_test_expiry" DATETIME,
    "is_non_gmo" TEXT,
    "non_gmo_sticker_placed" TEXT,
    "contains_allergen" TEXT,
    "allergen_sticker_placed" TEXT,
    "received_by" TEXT,
    "reviewed_by" TEXT,
    "signature_url" TEXT,
    "bol_url" TEXT,
    "coa_url" TEXT,
    "invoice_url" TEXT,
    "receiving_docs_url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    CONSTRAINT "InboundPO_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OutboundShipment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT,
    "customer_name" TEXT,
    "customer_po" TEXT NOT NULL,
    "ship_datetime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shipper_name" TEXT,
    "shipped_to" TEXT,
    "trucking_company" TEXT,
    "product_name" TEXT,
    "pallet_count" INTEGER,
    "bol_quantity_match" TEXT,
    "lot_numbers" TEXT,
    "truck_damage_check" TEXT,
    "truck_odor_check" TEXT,
    "truck_clean_check" TEXT,
    "seal_number" TEXT,
    "contains_allergen" TEXT,
    "shipped_by" TEXT,
    "reviewed_by" TEXT,
    "signature_url" TEXT,
    "bol_url" TEXT,
    "invoice_url" TEXT,
    "packing_list_url" TEXT,
    "coa_url" TEXT,
    "truck_inspection_url" TEXT,
    "tracking_number" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    CONSTRAINT "OutboundShipment_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
