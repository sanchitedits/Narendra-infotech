import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDb } from './src/db/index.js';
import * as schema from './src/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // Import CSV
  app.post('/api/import-csv', async (req, res) => {
    try {
        const db = getDb();
        if (!db) {
            return res.status(400).json({ success: false, message: 'Database not connected' });
        }

        const { csvText } = req.body;
        if (!csvText) {
            return res.status(400).json({ success: false, message: 'No CSV data provided' });
        }

        const Papa = (await import('papaparse')).default;
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });

        let importedCount = 0;
        let lastValidName = '';

        for (const row of parsed.data as any[]) {
            const wName = row['Name'];
            const sName = row['Title'];

            let name = wName || sName || '';
            if (name) lastValidName = name;
            else if (!name && lastValidName) name = lastValidName;
            else continue;

            const description = row['Body (HTML)'] || row['Description'] || row['Short description'] || '';
            const priceRaw = row['Variant Price'] || row['Sale price'] || row['Regular price'] || '0';
            const originalPriceRaw = row['Variant Compare At Price'] || (row['Sale price'] ? row['Regular price'] : null);
            const image = row['Image Src'] || row['Images']?.split(',')[0] || '';
            const categoryName = row['Type'] || row['Categories']?.split(',')[0] || 'Imported';
            const stock = parseInt(row['Variant Inventory Qty'] || row['Stock'] || '10') || 10;

            // Category Setup
            let categoryId = null;
            if (categoryName) {
                const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const [cat] = await db.insert(schema.categories).values({
                    name: categoryName,
                    slug: slug
                }).onConflictDoUpdate({ target: schema.categories.slug, set: { name: categoryName } }).returning();
                categoryId = cat.id;
            }

            const price = parseFloat(String(priceRaw).replace(/[^0-9.]/g, '')) || 0;
            let originalPrice: null | number = null;
            if (originalPriceRaw) {
                originalPrice = parseFloat(String(originalPriceRaw).replace(/[^0-9.]/g, '')) || null;
            }

            try {
                await db.insert(schema.products).values({
                    name,
                    description,
                    price: price.toString(),
                    originalPrice: originalPrice ? originalPrice.toString() : null,
                    image,
                    categoryId,
                    stock,
                    status: 'active'
                });
                importedCount++;
            } catch (e) {
                console.error(`Skipping row due to error:`, e);
            }
        }

        res.json({ success: true, message: `Successfully imported ${importedCount} products!` });
    } catch (error) {
        console.error('CSV Import Error:', error);
        res.status(500).json({ success: false, error: 'Failed to process CSV' });
    }
  });

  // Run migrations
  try {
      const db = getDb();
      if (db) {
          console.log('Running database migrations...');
          await migrate(db, { migrationsFolder: './drizzle' });
          console.log('Migrations completed successfully.');
      }
  } catch (error) {
      console.error('Failed to run migrations:', error);
  }

  // API Routes
  
  // Checkout API - Connects to Cashfree and Resend if keys are present
  app.post('/api/checkout', async (req, res) => {
    try {
      const { items, customer, total } = req.body;
      
      const cashfreeAppId = process.env.CASHFREE_APP_ID;
      const cashfreeSecret = process.env.CASHFREE_SECRET_KEY;
      const env = process.env.CASHFREE_ENVIRONMENT || 'SANDBOX';
      
      let paymentSessionId = 'mock_session_' + Date.now();
      let orderId = 'ORD_' + Date.now();
      
      // Save order to database if connected
      const db = getDb();
      if (db) {
        // Simple order creation logic
        try {
           const [newCustomer] = await db.insert(schema.customers).values({
               firstName: customer?.name?.split(' ')[0] || 'Guest',
               lastName: customer?.name?.split(' ').slice(1).join(' ') || 'User',
               email: customer?.email || 'guest@example.com',
               phone: customer?.phone || '9999999999'
           }).onConflictDoUpdate({ target: schema.customers.email, set: { phone: customer?.phone } }).returning();

           const [newOrder] = await db.insert(schema.orders).values({
               orderNumber: orderId,
               customerId: newCustomer.id,
               total: total,
               status: 'pending'
           }).returning();

           for (const item of items) {
               await db.insert(schema.orderItems).values({
                   orderId: newOrder.id,
                   productId: item.id,
                   quantity: item.quantity,
                   price: String(item.price).replace(/[^0-9.]/g, '') || "0"
               });
           }
        } catch (e) {
            console.error('Error saving order to db:', e);
        }
      }

      // Pluggable Cashfree Gateway logic
      if (cashfreeAppId && cashfreeSecret) {
         console.log('Using Cashfree Gateway for payment creation...');
         const baseUrl = env === 'PRODUCTION' ? 'https://api.cashfree.com/pg/orders' : 'https://sandbox.cashfree.com/pg/orders';
         
         const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-version': '2023-08-01',
                'x-client-id': cashfreeAppId,
                'x-client-secret': cashfreeSecret
            },
            body: JSON.stringify({
                order_id: orderId,
                order_amount: total || 1,
                order_currency: 'INR',
                customer_details: {
                    customer_id: 'CUST_' + Date.now(),
                    customer_name: customer?.name || 'Guest User',
                    customer_email: customer?.email || 'guest@example.com',
                    customer_phone: customer?.phone || '9999999999'
                },
                order_meta: {
                    return_url: `http://localhost:${PORT}/checkout/success?order_id={order_id}`
                }
            })
         });

         if (response.ok) {
             const data = await response.json();
             paymentSessionId = data.payment_session_id;
             if (db) {
                 await db.update(schema.orders).set({ paymentSessionId }).where(eq(schema.orders.orderNumber, orderId));
             }
         } else {
             console.error('Cashfree API error:', await response.text());
             // Fallback to mock session if API call fails for demonstration
         }
      } else {
         console.log('Cashfree API keys not found, using mock checkout...');
      }

      // Pluggable Resend Email logic
      const resendApiKey = process.env.RESEND_API_KEY;
      if (resendApiKey) {
         console.log('Using Resend for order confirmation email...');
         await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Narendra Infotech <onboarding@resend.dev>',
                to: customer?.email || 'customer@example.com',
                subject: `Order Confirmation #${orderId}`,
                html: `<p>Thank you for your order! Your payment session is active.</p>`
            })
         });
      }

      res.json({ 
        success: true, 
        order_id: orderId,
        payment_session_id: paymentSessionId, 
        message: "Checkout initialized" 
      });
    } catch (error) {
      console.error('Checkout error:', error);
      res.status(500).json({ success: false, error: 'Failed to process checkout' });
    }
  });

  // Seed Database with Mock Data
  app.post('/api/seed', async (req, res) => {
    try {
      const db = getDb();
      if (!db) {
         return res.status(400).json({ success: false, message: 'Database not connected' });
      }
      
      const { products, categories, seedVariants, seedDigitalAssets } = await import('./src/data.js');
      
      // Clear existing for a clean seed (optional but good for testing)
      await db.delete(schema.digitalAssets).execute();
      await db.delete(schema.variants).execute();
      await db.delete(schema.products).execute();
      await db.delete(schema.categories).execute();
      await db.delete(schema.storeSettings).execute();

      // Seed Store Settings
      await db.insert(schema.storeSettings).values({
          senderName: 'Narendra Infotech Dispatcher',
          senderEmail: 'noreply@narendrainfotech.com',
          emailSubjectTemplate: 'Your Order {order_id} is Confirmed',
          emailBodyTemplate: 'Thank you for your purchase. Here are your credentials: {credentials}',
          shippingOriginAddress: '123 Tech Lane, Mumbai, MH, 400001'
      });
      
      // Seed Categories
      for (const cat of categories) {
          const slug = cat.name.toLowerCase().replace(/ /g, '-');
          await db.insert(schema.categories).values({
              name: cat.name,
              slug: slug
          }).onConflictDoNothing();
      }

      // Seed Products & Store their inserted IDs
      const dbCategories = await db.select().from(schema.categories);
      const insertedProducts: any[] = [];
      for (const prod of products) {
          let categoryId = null;
          if (prod.category) {
              const cat = dbCategories.find(c => c.name.toLowerCase() === prod.category.toLowerCase());
              if (cat) categoryId = cat.id;
          }
          const [insertedProd] = await db.insert(schema.products).values({
              name: prod.name,
              description: prod.description,
              vendor: prod.vendor,
              tags: prod.tags,
              image: prod.image,
              price: prod.price.replace('₹', '').replace(/,/g, ''),
              originalPrice: prod.originalPrice ? prod.originalPrice.replace('₹', '').replace(/,/g, '') : null,
              categoryId: categoryId,
              status: 'active'
          }).returning();
          insertedProducts.push(insertedProd);
      }

      // Seed Variants
      const insertedVariants: any[] = [];
      for (const variant of seedVariants) {
          // find the matching inserted product. Our mock data uses id 1 and 2 conceptually.
          const realProductId = insertedProducts[variant.productId - 1]?.id;
          if (realProductId) {
              const [insertedVar] = await db.insert(schema.variants).values({
                  productId: realProductId,
                  title: variant.title,
                  sku: variant.sku,
                  price: variant.price,
                  compareAtPrice: variant.compareAtPrice,
                  inventoryManagement: variant.inventoryManagement,
                  inventoryQuantity: variant.inventoryQuantity,
                  requiresShipping: variant.requiresShipping,
                  imageUrl: variant.imageUrl
              }).returning();
              insertedVariants.push(insertedVar);
          }
      }

      // Seed Digital Assets
      for (const asset of seedDigitalAssets) {
          // Find matching variant based on index
          const realVariantId = insertedVariants[asset.variantIndex]?.id;
          const realProductId = insertedVariants[asset.variantIndex]?.productId;
          if (realVariantId && realProductId) {
               await db.insert(schema.digitalAssets).values({
                   variantId: realVariantId,
                   productId: realProductId,
                   serialCode: asset.serialCode,
                   fileUrl: asset.fileUrl,
                   isDispatched: asset.isDispatched
               });
          }
      }

      // Seed Customers and Orders for mock analytics
      const mockCustomers = [
          { firstName: 'Garv', lastName: 'Kumar', email: 'garv@example.com', phone: '9000000001' },
          { firstName: 'Narendra', lastName: 'Modi', email: 'narendra@example.com', phone: '9000000002' },
          { firstName: 'Shorya', lastName: 'Sharma', email: 'shorya@example.com', phone: '9000000003' }
      ];
      
      const insertedCustomers = [];
      for (const c of mockCustomers) {
          const [cust] = await db.insert(schema.customers).values(c).onConflictDoUpdate({ target: schema.customers.email, set: { phone: c.phone } }).returning();
          insertedCustomers.push(cust);
      }

      const mockOrders = [
          { orderNumber: 'ORD-1001', customerId: insertedCustomers[0].id, total: '14999', status: 'delivered' },
          { orderNumber: 'ORD-1002', customerId: insertedCustomers[1].id, total: '3999', status: 'processing' },
          { orderNumber: 'ORD-1003', customerId: insertedCustomers[2].id, total: '12900', status: 'pending' }
      ];

      for (const o of mockOrders) {
          await db.insert(schema.orders).values(o).onConflictDoNothing();
      }

      res.json({ success: true, message: 'Database seeded successfully with Categories, Products, Variants, Digital Assets, and Analytics Data' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Failed to seed database' });
    }
  });

  // Health check endpoint
  app.get('/healthz', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get Config Status
  app.get('/api/config', (req, res) => {
    res.json({
        database: !!process.env.DATABASE_URL,
        resend: !!process.env.RESEND_API_KEY,
        cashfree: !!process.env.CASHFREE_APP_ID && !!process.env.CASHFREE_SECRET_KEY,
    });
  });

  // Delete Product
  app.delete('/api/products/:id', async (req, res) => {
    try {
      const db = getDb();
      if (!db) {
         return res.status(400).json({ success: false, message: 'Database not connected' });
      }
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
          return res.status(400).json({ success: false, message: 'Invalid ID' });
      }
      
      // Delete child references first
      await db.delete(schema.orderItems).where(eq(schema.orderItems.productId, productId));
      await db.delete(schema.digitalAssets).where(eq(schema.digitalAssets.productId, productId));
      await db.delete(schema.variants).where(eq(schema.variants.productId, productId));
      await db.delete(schema.products).where(eq(schema.products.id, productId));
      
      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, error: 'Failed to delete product' });
    }
  });

  // Update Product
  app.put('/api/products/:id', async (req, res) => {
    try {
      const db = getDb();
      if (!db) {
         return res.status(400).json({ success: false, message: 'Database not connected' });
      }
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
          return res.status(400).json({ success: false, message: 'Invalid ID' });
      }
      
      const { name, price, stock, description, image } = req.body;
      
      await db.update(schema.products).set({
          name,
          price: price ? String(price) : "0",
          stock: stock || 0,
          description: description || '',
          image: image || null
      }).where(eq(schema.products.id, productId));
      
      res.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, error: 'Failed to update product' });
    }
  });

  // Add Product
  app.post('/api/products', async (req, res) => {
    try {
      const db = getDb();
      if (!db) {
         return res.status(400).json({ success: false, message: 'Database not connected' });
      }
      
      const { name, price, stock, description, image, categoryId } = req.body;
      if (!name) {
         return res.status(400).json({ success: false, message: 'Name is required' });
      }
      
      const [newProduct] = await db.insert(schema.products).values({
          name,
          price: price ? String(price) : "0",
          stock: stock || 0,
          description: description || '',
          image: image || null,
          categoryId: categoryId || null,
          status: 'active'
      }).returning();
      
      res.json({ success: true, product: newProduct });
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, error: 'Failed to add product' });
    }
  });

  // Get Products
  app.get('/api/products', async (req, res) => {
    try {
      const db = getDb();
      if (db) {
         const productsData = await db.select().from(schema.products);
         const variantsData = await db.select().from(schema.variants);
         const categoriesData = await db.select().from(schema.categories);
         
         const enrichedProducts = productsData.map(p => {
             const productVariants = variantsData.filter(v => v.productId === p.id);
             const categoryRecord = categoriesData.find(c => c.id === p.categoryId);
             return {
                 ...p,
                 image: p.image || null, // null avoids React's empty string warning on src
                 category: categoryRecord ? categoryRecord.name : 'Uncategorized',
                 // append variants string array based on title
                 variants: productVariants.map(v => v.title)
             };
         });
         
         res.json({ source: 'database', products: enrichedProducts });
      } else {
         res.json({ source: 'mock', products: [] }); 
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // Get Analytics
  app.get('/api/analytics', async (req, res) => {
    try {
      const db = getDb();
      if (db) {
         const allOrders = await db.select().from(schema.orders);
         const totalRevenue = allOrders.reduce((sum, order) => sum + Number(order.total), 0);
         const totalOrders = allOrders.length;
         
         const allCustomers = await db.select().from(schema.customers);
         const activeCustomers = allCustomers.length;

         // Get recent orders (last 5)
         const recentOrdersData = await db.select({
             id: schema.orders.id,
             orderNumber: schema.orders.orderNumber,
             total: schema.orders.total,
             status: schema.orders.status,
             createdAt: schema.orders.createdAt,
             firstName: schema.customers.firstName,
             lastName: schema.customers.lastName,
         })
         .from(schema.orders)
         .leftJoin(schema.customers, eq(schema.orders.customerId, schema.customers.id))
         .orderBy(desc(schema.orders.createdAt))
         .limit(5);

         res.json({ source: 'database', stats: { totalRevenue, totalOrders, activeCustomers }, recentOrders: recentOrdersData });
      } else {
         res.json({ source: 'mock', stats: { totalRevenue: 0, totalOrders: 0, activeCustomers: 0 }, recentOrders: [] }); 
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Get Orders
  app.get('/api/orders', async (req, res) => {
    try {
      const db = getDb();
      if (db) {
         const ordersData = await db.select({
             id: schema.orders.id,
             orderNumber: schema.orders.orderNumber,
             total: schema.orders.total,
             status: schema.orders.status,
             createdAt: schema.orders.createdAt,
             firstName: schema.customers.firstName,
             lastName: schema.customers.lastName,
             email: schema.customers.email,
         })
         .from(schema.orders)
         .leftJoin(schema.customers, eq(schema.orders.customerId, schema.customers.id))
         .orderBy(desc(schema.orders.createdAt));

         res.json({ source: 'database', orders: ordersData });
      } else {
         res.json({ source: 'mock', orders: [] }); 
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // Update Order Status
  app.put('/api/orders/:id', async (req, res) => {
    try {
      const db = getDb();
      if (!db) {
         return res.status(400).json({ success: false, message: 'Database not connected' });
      }
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
          return res.status(400).json({ success: false, message: 'Invalid ID' });
      }
      
      const { status } = req.body;
      
      await db.update(schema.orders).set({
          status
      }).where(eq(schema.orders.id, orderId));
      
      res.json({ success: true, message: 'Order updated successfully' });
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, error: 'Failed to update order' });
    }
  });

  // Delete Order
  app.delete('/api/orders/:id', async (req, res) => {
    try {
      const db = getDb();
      if (!db) {
         return res.status(400).json({ success: false, message: 'Database not connected' });
      }
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
          return res.status(400).json({ success: false, message: 'Invalid ID' });
      }
      
      await db.delete(schema.orderItems).where(eq(schema.orderItems.orderId, orderId));
      await db.delete(schema.orders).where(eq(schema.orders.id, orderId));
      
      res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, error: 'Failed to delete order' });
    }
  });

  // Get Order Items
  app.get('/api/orders/:id/items', async (req, res) => {
    try {
      const db = getDb();
      if (db) {
        const orderId = parseInt(req.params.id);
        if (isNaN(orderId)) {
          return res.status(400).json({ success: false, message: 'Invalid ID' });
        }
        
        const items = await db.select({
           id: schema.orderItems.id,
           quantity: schema.orderItems.quantity,
           price: schema.orderItems.price,
           productName: schema.products.name,
           productImage: schema.products.image
        })
        .from(schema.orderItems)
        .leftJoin(schema.products, eq(schema.orderItems.productId, schema.products.id))
        .where(eq(schema.orderItems.orderId, orderId));
        
        res.json({ success: true, items });
      } else {
         res.json({ success: true, items: [] });
      }
    } catch (error) {
       console.error(error);
       res.status(500).json({ success: false, error: 'Failed to fetch order items' });
    }
  });

  // Get Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const db = getDb();
      if (db) {
         const categoriesData = await db.select().from(schema.categories);
         const productsData = await db.select().from(schema.products);
         
         const enrichedCategories = categoriesData.map(c => {
             const count = productsData.filter(p => p.categoryId === c.id).length;
             return {
                 ...c,
                 count: `${count} Product${count !== 1 ? 's' : ''}`
             };
         });
         
         res.json({ source: 'database', categories: enrichedCategories });
      } else {
         res.json({ source: 'mock', categories: [] }); 
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch categories' });
    }
  });

  // Chatbot API
  let cachedBusinessInfo = '';
  try {
      const fs = await import('fs');
      cachedBusinessInfo = fs.readFileSync(path.join(process.cwd(), 'src', 'business_info.txt'), 'utf8');
  } catch (err) {
      console.warn("Could not read business_info.txt");
  }

  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Key is not configured.' });
      }
      
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      
      // Get Products for Prompt
      const db = getDb();
      let productContext = '';
      if (db) {
          const products = await db.select().from(schema.products).limit(50);
          productContext = "\nOur current catalog of products:\n" + products.map(p => `- ${p.name}: ₹${p.price} (${p.description?.substring(0, 50)}...)`).join('\n');
      }

      const systemInstruction = cachedBusinessInfo + productContext;
      
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: systemInstruction,
        },
      });

      // Restore History
      if (history && history.length > 0) {
        // Just simulating context by passing simple string, or could build full history mapping
        // To be safe we will just append the recent conversations inside generating content
      }

      // Format previous history into the prompt
      let fullPrompt = "";
      if (history && history.length > 0) {
         fullPrompt += "Previous conversation context:\n";
         history.forEach((msg: any) => {
            fullPrompt += `${msg.role === 'user' ? 'User' : 'You'}: ${msg.content}\n`;
         });
         fullPrompt += "\nNew Message from User: " + message;
      } else {
         fullPrompt = message;
      }
      
      const response = await chat.sendMessage({ message: fullPrompt });
      
      res.json({ reply: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to chat' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
