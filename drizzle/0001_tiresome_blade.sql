CREATE TABLE "digital_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"variant_id" integer,
	"product_id" integer,
	"serial_code" text,
	"file_url" text,
	"is_dispatched" boolean DEFAULT false,
	"assigned_order_id" integer
);
--> statement-breakpoint
CREATE TABLE "store_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"sender_name" text DEFAULT 'Narendra Infotech',
	"sender_email" text,
	"email_subject_template" text,
	"email_body_template" text,
	"shipping_origin_address" text
);
--> statement-breakpoint
CREATE TABLE "variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"title" text NOT NULL,
	"sku" text,
	"price" numeric(10, 2) NOT NULL,
	"compare_at_price" numeric(10, 2),
	"inventory_management" boolean DEFAULT true,
	"inventory_quantity" integer DEFAULT 0,
	"requires_shipping" boolean DEFAULT false,
	"image_url" text
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "variant_id" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_gateway" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "gateway_order_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_status" text DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "fulfillment_status" text DEFAULT 'unfulfilled';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tracking_number" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "tracking_status" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "vendor" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "tags" text;--> statement-breakpoint
ALTER TABLE "digital_assets" ADD CONSTRAINT "digital_assets_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digital_assets" ADD CONSTRAINT "digital_assets_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."variants"("id") ON DELETE no action ON UPDATE no action;