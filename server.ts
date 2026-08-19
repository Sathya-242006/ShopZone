import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { db, initialUsers } from './server/db.js';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Helper for lazy Gemini initialization
let aiClient: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  return aiClient;
}

// Current active session simulation helper
let currentUserId = 'user-cust-1'; // Default to Alex Mercer (Customer)

async function startServer() {
  const app = express();

  // Render provides PORT through environment variables
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Middleware to attach user
  app.use((req, res, next) => {
    const headerUserId = req.headers['x-user-id'] as string;

    if (headerUserId) {
      currentUserId = headerUserId;
    }

    next();
  });

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  });

  // --- Auth & Users ---

  app.get('/api/auth/me', (req: Request, res: Response) => {
    const user = db.getUserById(currentUserId) || db.getUsers()[1];

    res.json({ user });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, name, role } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }

    let user = db.getUserByEmail(email);

    if (!user) {
      // Create user automatically for seamless demo experience
      user = db.createUser({
        name: name || email.split('@')[0].replace('.', ' '),
        email,
        role:
          role ||
          (email.toLowerCase().includes('admin') ||
          email.toLowerCase().includes('sathya')
            ? 'admin'
            : 'customer'),
        avatar:
          'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      });
    } else if (name && name.trim() && user.name !== name.trim()) {
      // Allow updating the customer name directly on login if edited
      user.name = name.trim();
    }

    currentUserId = user.id;

    res.json({
      success: true,
      user
    });
  });

  app.put('/api/auth/profile', (req: Request, res: Response) => {
    const {
      name,
      email,
      phone,
      street,
      city,
      state,
      zipCode,
      country
    } = req.body;

    const user = db.getUserById(currentUserId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    if (name) user.name = name.trim();
    if (email) user.email = email.trim();
    if (phone !== undefined) user.phone = phone;

    if (
      street !== undefined ||
      city !== undefined ||
      state !== undefined ||
      zipCode !== undefined
    ) {
      user.address = {
        street:
          street !== undefined
            ? street
            : user.address?.street || '',

        city:
          city !== undefined
            ? city
            : user.address?.city || '',

        state:
          state !== undefined
            ? state
            : user.address?.state || '',

        zipCode:
          zipCode !== undefined
            ? zipCode
            : user.address?.zipCode || '',

        country:
          country ||
          user.address?.country ||
          'United States'
      };
    }

    res.json({
      success: true,
      user
    });
  });

  app.post('/api/auth/register', (req: Request, res: Response) => {
    const {
      name,
      email,
      role,
      phone,
      street,
      city,
      state,
      zipCode
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required'
      });
    }

    const existing = db.getUserByEmail(email);

    if (existing) {
      if (name) existing.name = name.trim();

      currentUserId = existing.id;

      return res.json({
        success: true,
        user: existing
      });
    }

    const newUser = db.createUser({
      name: name.trim(),
      email: email.trim(),
      role: role === 'admin' ? 'admin' : 'customer',
      avatar: `https://images.unsplash.com/photo-${
        role === 'admin'
          ? '1494790108377-be9c29b29330'
          : '1534528741775-53994a69daeb'
      }?auto=format&fit=crop&w=200&q=80`,
      phone: phone || '+1 (555) 019-2831',
      address: street
        ? {
            street,
            city: city || 'San Francisco',
            state: state || 'CA',
            zipCode: zipCode || '94105',
            country: 'United States'
          }
        : undefined
    });

    currentUserId = newUser.id;

    res.json({
      success: true,
      user: newUser
    });
  });

  app.post('/api/auth/switch', (req: Request, res: Response) => {
    const { role, userId } = req.body;

    if (userId) {
      const user = db.getUserById(userId);

      if (user) {
        currentUserId = user.id;

        return res.json({
          success: true,
          user
        });
      }
    }

    if (role === 'admin') {
      currentUserId = 'user-admin-1';
    } else {
      currentUserId = 'user-cust-1';
    }

    const user = db.getUserById(currentUserId)!;

    res.json({
      success: true,
      user
    });
  });

  app.get('/api/users', (req: Request, res: Response) => {
    const users = db.getUsers();

    res.json({ users });
  });

  // --- Categories ---

  app.get('/api/categories', (req: Request, res: Response) => {
    const categories = db.getCategories();

    res.json({ categories });
  });

  // --- Products ---

  app.get('/api/products', (req: Request, res: Response) => {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      inStock,
      sortBy
    } = req.query;

    const products = db.getProducts({
      category: category as string,
      search: search as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStock: inStock === 'true',
      sortBy: sortBy as string
    });

    res.json({
      products,
      total: products.length
    });
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    const reviews = db.getReviewsForProduct(product.id);

    const related = db
      .getProducts({
        category: product.category
      })
      .filter(p => p.id !== product.id)
      .slice(0, 4);

    res.json({
      product,
      reviews,
      related
    });
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const currentUser = db.getUserById(currentUserId);

    if (currentUser?.role !== 'admin') {
      return res.status(403).json({
        error: 'Only administrators can create products'
      });
    }

    const {
      title,
      description,
      price,
      originalPrice,
      category,
      stock,
      images,
      featured,
      tags,
      specs
    } = req.body;

    if (!title || !price || !category) {
      return res.status(400).json({
        error: 'Title, price, and category are required'
      });
    }

    const newProduct = db.createProduct({
      title,
      description:
        description ||
        'Premium product designed for modern lifestyle and high performance.',
      price: Number(price),
      originalPrice:
        originalPrice ? Number(originalPrice) : undefined,
      category,
      stock: Number(stock) || 10,
      images:
        images && images.length > 0
          ? images
          : [
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'
            ],
      featured: Boolean(featured),
      isNew: true,
      tags: tags || ['Featured', 'New Arrival'],
      specs: specs || []
    });

    res.status(201).json({
      success: true,
      product: newProduct
    });
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const currentUser = db.getUserById(currentUserId);

    if (currentUser?.role !== 'admin') {
      return res.status(403).json({
        error: 'Only administrators can update products'
      });
    }

    const updated = db.updateProduct(
      req.params.id,
      req.body
    );

    if (!updated) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      product: updated
    });
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const currentUser = db.getUserById(currentUserId);

    if (currentUser?.role !== 'admin') {
      return res.status(403).json({
        error: 'Only administrators can delete products'
      });
    }

    const deleted = db.deleteProduct(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  });

  app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
    const { rating, comment } = req.body;

    const product = db.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    const user = db.getUserById(currentUserId) || {
      id: 'anon',
      name: 'Verified Customer',
      avatar:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
    };

    const review = db.addReview({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: Math.min(
        5,
        Math.max(1, Number(rating) || 5)
      ),
      comment:
        comment ||
        'Excellent quality and fast delivery! Highly recommended.',
      verifiedPurchase: true
    });

    res.status(201).json({
      success: true,
      review
    });
  });

  // --- Coupons ---

  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        valid: false,
        message: 'Please enter a coupon code'
      });
    }

    const result = db.validateCoupon(
      code,
      Number(subtotal) || 0
    );

    res.json(result);
  });

  // --- Orders & Tracking ---

  app.get('/api/orders', (req: Request, res: Response) => {
    const user = db.getUserById(currentUserId);

    const orders = db.getOrders(
      currentUserId,
      user?.role
    );

    res.json({
      orders,
      userRole: user?.role
    });
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.id);

    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    res.json({ order });
  });

  app.post('/api/checkout', (req: Request, res: Response) => {
    const {
      items,
      shippingAddress,
      couponCode,
      paymentMethod,
      shippingOption
    } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        error: 'Cart cannot be empty'
      });
    }

    const user = db.getUserById(currentUserId) || {
      id: 'cust-temp',
      name:
        shippingAddress?.fullName ||
        'Valued Customer',
      email:
        shippingAddress?.email ||
        'customer@example.com'
    };

    const order = db.createOrder({
      userId: user.id,
      customerName:
        shippingAddress?.fullName ||
        user.name,
      customerEmail:
        shippingAddress?.email ||
        user.email,
      shippingAddress:
        shippingAddress || {
          fullName: user.name,
          email: user.email,
          phone: '+1 (555) 123-4567',
          street: '123 Market Street',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'United States'
        },
      items,
      couponCode,
      paymentMethod:
        paymentMethod || 'Credit Card',
      shippingOption
    });

    res.status(201).json({
      success: true,
      order
    });
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const {
      status,
      note,
      location
    } = req.body;

    if (!status) {
      return res.status(400).json({
        error: 'Status is required'
      });
    }

    const updatedOrder = db.updateOrderStatus(
      req.params.id,
      status,
      note,
      location
    );

    if (!updatedOrder) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: updatedOrder
    });
  });

  // --- Admin Analytics ---

  app.get('/api/admin/stats', (req: Request, res: Response) => {
    const user = db.getUserById(currentUserId);

    if (user?.role !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required'
      });
    }

    const stats = db.getAdminStats();

    res.json({ stats });
  });

  // --- AI Features (Powered by Gemini with smart resilient fallback) ---

  app.post(
    '/api/ai/generate-product-copy',
    async (req: Request, res: Response) => {
      const {
        title,
        category,
        keywords
      } = req.body;

      const ai = getAI();

      if (ai) {
        try {
          const response =
            await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `You are an expert e-commerce copywriter. Generate a compelling product description and 4 key technical bullet specifications for this product:
Title: ${title}
Category: ${category}
Keywords: ${
                keywords ||
                'premium, durable, high quality'
              }

Return ONLY valid JSON in this exact structure (no markdown fences, just JSON):
{
  "description": "2-3 sentence engaging product description emphasizing benefits and build quality.",
  "specs": [
    {"name": "Material", "value": "e.g. Aerospace Aluminum"},
    {"name": "Battery / Power", "value": "e.g. 40 hours continuous"},
    {"name": "Dimensions", "value": "e.g. Compact 180g"},
    {"name": "Warranty", "value": "2-Year Manufacturer Warranty"}
  ],
  "suggestedPrice": 129.99
}`
            });

          const text = response.text || '';

          const cleanJson = text
            .replace(/```json/gi, '')
            .replace(/```/gi, '')
            .trim();

          const parsed = JSON.parse(cleanJson);

          return res.json({
            success: true,
            ...parsed
          });
        } catch (err) {
          console.error(
            'Gemini error, fallback copy:',
            err
          );
        }
      }

      // High quality intelligent fallback
      res.json({
        success: true,
        description: `Crafted with premium materials and precision engineering, the ${
          title || 'product'
        } delivers an elevated experience for modern lifestyles. Built for reliability, optimal performance, and timeless aesthetic appeal.`,
        specs: [
          {
            name: 'Build Material',
            value: 'High-grade anodized finish'
          },
          {
            name: 'Performance',
            value: 'Optimized efficiency & low power draw'
          },
          {
            name: 'Compatibility',
            value: 'Universal cross-platform integration'
          },
          {
            name: 'Warranty',
            value: '2-Year Full Manufacturer Warranty'
          }
        ],
        suggestedPrice: 99.99
      });
    }
  );

  app.post(
    '/api/ai/ask-assistant',
    async (req: Request, res: Response) => {
      const { query } = req.body;

      const products = db.getProducts();

      const productCatalogSummary = products
        .map(
          p =>
            `- ${p.title} ($${p.price}) [Category: ${p.category}]: ${p.description}`
        )
        .join('\n');

      const ai = getAI();

      if (ai) {
        try {
          const response =
            await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `You are Zone, the friendly AI shopping concierge for ShopZone online store.
Here is our current store catalog:
${productCatalogSummary}

Customer Question: "${query}"

Provide a concise, helpful, friendly answer in 2-3 sentences. Recommend the best matching product(s) from our catalog with reasons, and mention our current promo code 'SAVE20' (for 20% off orders >$100).`
            });

          return res.json({
            response: response.text
          });
        } catch (err) {
          console.error(
            'Gemini error in shopping assistant:',
            err
          );
        }
      }

      // Smart fallback recommendation
      const lower = (query || '').toLowerCase();

      let reply =
        "Hello! I'm Zone, your ShopZone shopping assistant. ";

      if (
        lower.includes('cosmetic') ||
        lower.includes('makeup') ||
        lower.includes('lipstick') ||
        lower.includes('skin') ||
        lower.includes('serum') ||
        lower.includes('beauty')
      ) {
        reply +=
          "For beauty and skincare, I recommend our Lumina Velvet Matte Luxe Lipstick Trio ($38.00) or Radiant Botanical Glow Niacinamide Serum ($45.00). Use coupon SAVE20 on orders over $100!";
      } else if (
        lower.includes('jewel') ||
        lower.includes('necklace') ||
        lower.includes('ring') ||
        lower.includes('bracelet') ||
        lower.includes('gold') ||
        lower.includes('pearl')
      ) {
        reply +=
          "You'll adore our Celestial 18K Gold Solitaire Pendant ($129.00) and Shimmering Sterling Silver Tennis Bracelet ($115.00)! Enter coupon code SAVE20 for 20% off!";
      } else if (
        lower.includes('dress') ||
        lower.includes('costume') ||
        lower.includes('gown') ||
        lower.includes('party') ||
        lower.includes('wedding') ||
        lower.includes('clothes')
      ) {
        reply +=
          "Take a look at our stunning Emerald Silk Satin Evening Gala Gown ($189.00) or Royal Zari Velvet Embroidered Costume Dress ($210.00). Use promo code SAVE20 at checkout!";
      } else if (
        lower.includes('headphone') ||
        lower.includes('audio') ||
        lower.includes('music')
      ) {
        reply +=
          "I highly recommend our NovaSound Spatial ANC Headphones ($299.99) with 50-hour battery and 42dB noise cancellation! Don't forget to use coupon SAVE20 for 20% off!";
      } else if (
        lower.includes('keyboard') ||
        lower.includes('typing') ||
        lower.includes('desk')
      ) {
        reply +=
          "Check out our Keyforge Mechanical 75% Custom Keyboard ($169.50) with lubricated linear switches and CNC aluminum chassis. Use coupon SAVE20 at checkout!";
      } else if (
        lower.includes('watch') ||
        lower.includes('fitness') ||
        lower.includes('health')
      ) {
        reply +=
          "Our AeroPulse Chrono Smartwatch Pro ($389.00) in titanium with AMOLED display and 14-day battery is our customer favorite!";
      } else {
        reply +=
          "Explore our curated collections of cosmetics, fine jewelry, designer gala dresses, tech, and lifestyle gear. Enter coupon code SAVE20 at checkout for 20% off orders over $100!";
      }

      res.json({
        response: reply
      });
    }
  );

  // --- Vite / Static Assets Middleware ---

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(
      process.cwd(),
      'dist'
    );

    app.use(express.static(distPath));

    app.get('*', (req: Request, res: Response) => {
      res.sendFile(
        path.join(distPath, 'index.html')
      );
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(
      `E-Commerce Server running on http://0.0.0.0:${PORT}`
    );
  });
}

startServer().catch(err => {
  console.error(
    'Failed to start server:',
    err
  );
});