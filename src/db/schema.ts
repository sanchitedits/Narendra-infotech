import { pgTable, serial, text, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  vendor: text("vendor"),
  tags: text("tags"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  image: text("image"),
  stock: integer("stock").notNull().default(0),
  status: text("status").notNull().default("active"), // 'active', 'draft'
  categoryId: integer("category_id").references(() => categories.id),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const variants = pgTable("variants", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id).notNull(),
  title: text("title").notNull(),
  sku: text("sku"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
  inventoryManagement: boolean("inventory_management").default(true),
  inventoryQuantity: integer("inventory_quantity").default(0),
  requiresShipping: boolean("requires_shipping").default(false),
  imageUrl: text("image_url"),
});

export const digitalAssets = pgTable("digital_assets", {
  id: serial("id").primaryKey(),
  variantId: integer("variant_id").references(() => variants.id),
  productId: integer("product_id").references(() => products.id),
  serialCode: text("serial_code"),
  fileUrl: text("file_url"),
  isDispatched: boolean("is_dispatched").default(false),
  assignedOrderId: integer("assigned_order_id"),
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerId: integer("customer_id").references(() => customers.id),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  paymentGateway: text("payment_gateway"),
  paymentSessionId: text("payment_session_id"),
  gatewayOrderId: text("gateway_order_id"),
  paymentStatus: text("payment_status").default("pending"),
  fulfillmentStatus: text("fulfillment_status").default("unfulfilled"),
  trackingNumber: text("tracking_number"),
  trackingStatus: text("tracking_status"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  variantId: integer("variant_id").references(() => variants.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export const storeSettings = pgTable("store_settings", {
  id: serial("id").primaryKey(),
  senderName: text("sender_name").default("Narendra Infotech"),
  senderEmail: text("sender_email"),
  emailSubjectTemplate: text("email_subject_template"),
  emailBodyTemplate: text("email_body_template"),
  shippingOriginAddress: text("shipping_origin_address"),
});
