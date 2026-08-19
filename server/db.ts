import { Product, User, Order, Category, Coupon, Review, OrderStatus } from '../src/types';

export interface DatabaseState {
  users: User[];
  products: Product[];
  orders: Order[];
  reviews: Review[];
  coupons: Coupon[];
  categories: Category[];
}

export const initialCategories: Category[] = [
  {
    id: 'cat-cosmetics',
    name: 'Cosmetics & Beauty',
    slug: 'cosmetics',
    description: 'Luxury organic skincare, velvet lip colors, hydrating serums, and mineral palettes.',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    productCount: 4,
  },
  {
    id: 'cat-jewelry',
    name: 'Fine Jewelry & Ornaments',
    slug: 'jewelry',
    description: '18K gold vermeil pendants, sterling silver tennis bracelets, and freshwater pearl drops.',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    productCount: 4,
  },
  {
    id: 'cat-costumes',
    name: 'Costumes & Dresses',
    slug: 'costumes-dresses',
    description: 'Silk satin gala gowns, embroidered royal ethnic costumes, and chic cocktail dresses.',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=600&q=80',
    productCount: 4,
  },
  {
    id: 'cat-1',
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    description: 'Next-gen audio, smart home devices, and computing essentials.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    productCount: 4,
  },
  {
    id: 'cat-2',
    name: 'Wearables & Audio',
    slug: 'wearables',
    description: 'Premium noise-cancelling headphones, wireless earbuds, and smartwatches.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    productCount: 3,
  },
  {
    id: 'cat-3',
    name: 'Home & Workspace',
    slug: 'home-workspace',
    description: 'Ergonomic accessories, ambient lighting, and minimalist desk gear.',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80',
    productCount: 3,
  },
  {
    id: 'cat-4',
    name: 'Apparel & Lifestyle',
    slug: 'lifestyle',
    description: 'Performance backpacks, everyday carry items, and minimal travel accessories.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',
    productCount: 2,
  },
];

export const initialUsers: User[] = [
  {
    id: 'user-admin-1',
    name: 'Sathya (Admin)',
    email: 'sathya@shopzone.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 234-5678',
    address: {
      street: '100 Silicon Way, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94107',
      country: 'United States',
    },
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'user-cust-1',
    name: 'Alex Mercer',
    email: 'alex.mercer@gmail.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 876-5432',
    address: {
      street: '742 Evergreen Terrace',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'United States',
    },
    createdAt: '2026-02-01T12:30:00.000Z',
  },
  {
    id: 'user-cust-2',
    name: 'Elena Rostova',
    email: 'elena.r@outlook.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 345-9876',
    address: {
      street: '450 Oak Avenue, Apt 3B',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'United States',
    },
    createdAt: '2026-02-10T14:15:00.000Z',
  },
  {
    id: 'user-cust-3',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    phone: '+91 98765 43210',
    address: {
      street: 'Flat 402, Lotus Towers, MG Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      zipCode: '560038',
      country: 'India',
    },
    createdAt: '2026-02-12T09:00:00.000Z',
  },
];

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    title: 'NovaSound Spatial ANC Headphones',
    description: 'Flagship wireless over-ear headphones featuring bespoke 40mm beryllium drivers, active hybrid noise cancellation up to 42dB, and 50-hour ultra-long battery life with rapid charging.',
    price: 299.99,
    originalPrice: 349.99,
    category: 'wearables',
    rating: 4.9,
    reviewCount: 128,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isNew: true,
    tags: ['Audio', 'ANC', 'Wireless', 'Bluetooth 5.3', 'High-Res'],
    specs: [
      { name: 'Driver Size', value: '40mm Custom Beryllium' },
      { name: 'Battery Life', value: '50 hours ANC on / 65 hours off' },
      { name: 'Weight', value: '254 grams' },
      { name: 'Connectivity', value: 'Bluetooth 5.3 + 3.5mm AUX' },
      { name: 'Fast Charge', value: '15 mins = 8 hours playback' },
    ],
    createdAt: '2026-01-20T10:00:00.000Z',
  },
  {
    id: 'prod-2',
    title: 'AeroPulse Chrono Smartwatch Pro',
    description: 'Precision aerospace titanium casing with vivid 1.43" AMOLED sapphire glass display, continuous heart rate, SpO2, ECG monitoring, offline GPS navigation, and 10ATM water resistance.',
    price: 389.00,
    originalPrice: 429.00,
    category: 'wearables',
    rating: 4.8,
    reviewCount: 94,
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isNew: true,
    tags: ['Smartwatch', 'Fitness', 'Titanium', 'GPS', 'Heart Rate'],
    specs: [
      { name: 'Case Material', value: 'Grade 5 Titanium' },
      { name: 'Display', value: '1.43" AMOLED 1000 nits' },
      { name: 'Water Resistance', value: '10 ATM (100 meters)' },
      { name: 'Battery Life', value: 'Up to 14 days' },
    ],
    createdAt: '2026-01-22T14:30:00.000Z',
  },
  {
    id: 'prod-3',
    title: 'Lumina Studio 4K Ultra-Wide Monitor Light Bar',
    description: 'Asymmetric optical design zero-screen glare lamp with wireless touch desktop dial, CRI ≥ 97 color rendering, auto-dimming ambient sensor, and magnetic ball joint pivot.',
    price: 79.99,
    originalPrice: 99.99,
    category: 'home-workspace',
    rating: 4.7,
    reviewCount: 65,
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isNew: false,
    tags: ['Desk Setup', 'Lighting', 'Ergonomic', 'USB-C'],
    specs: [
      { name: 'Power Input', value: 'USB-C 5V / 2A' },
      { name: 'Color Temperature', value: '2700K - 6500K Stepless' },
      { name: 'CRI Index', value: 'Ra ≥ 97' },
      { name: 'Mounting', value: 'Counter-weighted clip (1-5cm)' },
    ],
    createdAt: '2026-02-01T09:15:00.000Z',
  },
  {
    id: 'prod-4',
    title: 'Keyforge Mechanical 75% Custom Keyboard',
    description: 'Hot-swappable gasket-mounted mechanical keyboard crafted with CNC anodized aluminum frame, factory-lubed linear switches, PBT dye-sub keycaps, and RGB per-key backlighting.',
    price: 169.50,
    originalPrice: 199.00,
    category: 'electronics',
    rating: 4.9,
    reviewCount: 210,
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isNew: false,
    tags: ['Mechanical Keyboard', 'Gasket Mount', 'Hot-swap', 'RGB', 'Aluminum'],
    specs: [
      { name: 'Layout', value: '75% (82 Keys)' },
      { name: 'Switches', value: 'Custom Gateron Oil Kings (Pre-lubed)' },
      { name: 'Body', value: '6063 CNC Machined Aluminum' },
      { name: 'Connectivity', value: 'Tri-mode: 2.4G / BT 5.1 / Type-C' },
    ],
    createdAt: '2026-01-10T11:20:00.000Z',
  },
  {
    id: 'prod-5',
    title: 'Nomad Tech Commuter 24L Waterproof Backpack',
    description: 'Engineered with recycled 840D Cordura ballistic nylon, dedicated 16-inch fleece laptop suspension pocket, hidden luggage pass-through strap, and water-repellent YKK AquaGuard zippers.',
    price: 145.00,
    originalPrice: 175.00,
    category: 'lifestyle',
    rating: 4.8,
    reviewCount: 88,
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isNew: true,
    tags: ['Backpack', 'Travel', 'Waterproof', 'Laptop Bag', 'Cordura'],
    specs: [
      { name: 'Volume Capacity', value: '24 Liters' },
      { name: 'Laptop Compartment', value: 'Up to 16-inch MacBook Pro' },
      { name: 'Material', value: '840D Ballistic Cordura Nylon' },
      { name: 'Weight', value: '1.1 kg' },
    ],
    createdAt: '2026-02-05T16:00:00.000Z',
  },
  {
    id: 'prod-6',
    title: 'ZenDesk Walnut Solid Wood Dual Monitor Riser',
    description: 'Handcrafted from FSC-certified solid American Black Walnut with matte black powder-coated aluminum legs, cork footpads, and integrated cable routing channel.',
    price: 119.00,
    originalPrice: 139.00,
    category: 'home-workspace',
    rating: 4.6,
    reviewCount: 47,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isNew: false,
    tags: ['Desk Riser', 'Solid Wood', 'Walnut', 'Ergonomics'],
    specs: [
      { name: 'Dimensions', value: '105cm (L) x 23cm (W) x 11cm (H)' },
      { name: 'Weight Capacity', value: 'Up to 45 kg (100 lbs)' },
      { name: 'Material', value: '100% Solid American Walnut' },
    ],
    createdAt: '2026-01-28T13:45:00.000Z',
  },
  {
    id: 'prod-7',
    title: 'NovaPod Pro Active True Wireless Earbuds',
    description: 'Compact Hi-Res certified earbuds featuring custom 11mm coaxial drivers, 6-microphone crystal call clarity, IPX7 water resistance, and wireless Qi charge case.',
    price: 139.99,
    originalPrice: 169.99,
    category: 'wearables',
    rating: 4.7,
    reviewCount: 156,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isNew: false,
    tags: ['Earbuds', 'TWS', 'Wireless Charging', 'IPX7', 'ANC'],
    specs: [
      { name: 'Playtime', value: '8 hours (32 hours with case)' },
      { name: 'Waterproof', value: 'IPX7 Water & Sweat Resistant' },
      { name: 'Codecs', value: 'LDAC, AAC, SBC' },
    ],
    createdAt: '2026-02-02T10:10:00.000Z',
  },
  {
    id: 'prod-8',
    title: 'ApexCharge 140W GaN Fast Charger Multi-Port',
    description: 'Next-generation Gallium Nitride III powerhouse charging hub with 3x USB-C PD 3.1 and 1x USB-A ports, capable of fast-charging two laptops simultaneously at full speed.',
    price: 64.99,
    originalPrice: 79.99,
    category: 'electronics',
    rating: 4.9,
    reviewCount: 182,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609592426868-6d2745303a89?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isNew: false,
    tags: ['GaN', 'Fast Charger', '140W', 'USB-C', 'Power Delivery'],
    specs: [
      { name: 'Max Output', value: '140 Watts PD 3.1' },
      { name: 'Ports', value: '3x USB-C, 1x USB-A' },
      { name: 'Safety Features', value: 'Over-voltage, Thermal Guard' },
    ],
    createdAt: '2026-01-18T08:30:00.000Z',
  },
  {
    id: 'prod-9',
    title: 'AuraSense Smart Air Quality & Climate Sensor',
    description: 'Precision indoor air monitor measuring PM2.5 particulate matter, VOCs, CO2, humidity, and temperature with e-ink display and smart home ecosystem sync.',
    price: 99.00,
    originalPrice: 119.00,
    category: 'electronics',
    rating: 4.6,
    reviewCount: 39,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isNew: true,
    tags: ['Smart Home', 'Sensor', 'Air Quality', 'E-Ink'],
    specs: [
      { name: 'Display', value: '3.5" Crisp E-Ink Screen' },
      { name: 'Sensors', value: 'Laser PM2.5, NDIR CO2, Temp/Humidity' },
      { name: 'Battery', value: 'Rechargeable USB-C (6-month standby)' },
    ],
    createdAt: '2026-02-12T15:00:00.000Z',
  },
  {
    id: 'prod-10',
    title: 'Titanium Everyday Carry Minimalist Wallet',
    description: 'RFID-blocking cardholder CNC-machined from space-grade grade 5 titanium with integrated money clip, elastic expansion for up to 12 cards, and lifetime warranty.',
    price: 49.00,
    originalPrice: 65.00,
    category: 'lifestyle',
    rating: 4.8,
    reviewCount: 72,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isNew: false,
    tags: ['EDC', 'Wallet', 'Titanium', 'RFID Blocking'],
    specs: [
      { name: 'Capacity', value: '1-12 Cards + Cash' },
      { name: 'Material', value: 'Aerospace Grade 5 Titanium' },
      { name: 'Weight', value: '48 grams' },
    ],
    createdAt: '2026-01-25T11:00:00.000Z',
  },
  // --- Cosmetics & Beauty Products ---
  {
    id: 'prod-cos-1',
    title: 'Lumina Velvet Matte Luxe Lipstick Trio',
    description: 'Hydrating velvet matte lipsticks infused with cold-pressed rosehip oil, vitamin E, and micro-pigments for up to 16 hours of smudge-free satin finish. Set includes 3 flattering universal shades.',
    price: 38.00,
    originalPrice: 48.00,
    category: 'cosmetics',
    rating: 4.9,
    reviewCount: 142,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isNew: true,
    tags: ['Cosmetics', 'Lipstick', 'Matte', 'Vegan', 'Cruelty-Free'],
    specs: [
      { name: 'Finish', value: 'Velvet Satin Matte' },
      { name: 'Key Ingredients', value: 'Rosehip Seed Oil, Hyaluronic Acid, Vitamin E' },
      { name: 'Quantity', value: '3 x 3.5g Shades (Nude Bloom, Ruby Velvet, Warm Mocha)' },
      { name: 'Formula', value: 'Paraben-Free & 100% Vegan' },
    ],
    createdAt: '2026-02-14T09:00:00.000Z',
  },
  {
    id: 'prod-cos-2',
    title: 'Radiant Botanical Glow Face Elixir & Niacinamide Serum',
    description: 'Deep-penetrating organic antioxidant serum with 10% Niacinamide, triple Hyaluronic Acid complex, and fermented green tea to restore skin barrier and natural luminous glow.',
    price: 45.00,
    originalPrice: 58.00,
    category: 'cosmetics',
    rating: 4.8,
    reviewCount: 189,
    stock: 32,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608248597359-07b99c750b3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isNew: true,
    tags: ['Skincare', 'Serum', 'Glow', 'Hydration', 'Organic'],
    specs: [
      { name: 'Volume', value: '50 ml / 1.7 fl oz' },
      { name: 'Skin Type', value: 'All skin types (Dermatologist Tested)' },
      { name: 'Benefit', value: 'Brightening, Deep Hydration & Pore Refining' },
      { name: 'Fragrance', value: 'Fragrance-Free / Essential Oil Infused' },
    ],
    createdAt: '2026-02-15T11:30:00.000Z',
  },
  {
    id: 'prod-cos-3',
    title: 'Celestial 18-Shade Rose Gold Mineral Eyeshadow Palette',
    description: 'Multi-finish mineral eye shadow palette featuring 18 ultra-pigmented buttery mattes, molten duo-chromes, and sparkling pressed pearls designed for day-to-night artistry.',
    price: 52.00,
    originalPrice: 65.00,
    category: 'cosmetics',
    rating: 4.9,
    reviewCount: 96,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isNew: true,
    tags: ['Cosmetics', 'Eyeshadow', 'Mineral Makeup', 'High-Pigment'],
    specs: [
      { name: 'Shades', value: '18 (9 Mattes, 6 Metallics, 3 Duo-Chromatics)' },
      { name: 'Mirror', value: 'Integrated High-Definition Vanity Mirror' },
      { name: 'Net Weight', value: '24g' },
    ],
    createdAt: '2026-02-10T14:20:00.000Z',
  },
  {
    id: 'prod-cos-4',
    title: 'Luminous Silk Cushion Compact SPF 50+ & Hydrating Concealer',
    description: 'Featherweight buildable coverage cushion foundation offering all-day hydration, broad-spectrum SPF 50+ UV defense, and a flawless dewy finish.',
    price: 42.00,
    originalPrice: 50.00,
    category: 'cosmetics',
    rating: 4.7,
    reviewCount: 78,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isNew: false,
    tags: ['Foundation', 'SPF 50', 'Cosmetics', 'Dewy Finish'],
    specs: [
      { name: 'Coverage', value: 'Medium to Full (Buildable)' },
      { name: 'Sun Protection', value: 'Broad Spectrum SPF 50+ PA++++' },
      { name: 'Refill', value: 'Includes 1 Refill Pod + Antimicrobial Rubycell Puff' },
    ],
    createdAt: '2026-02-08T10:00:00.000Z',
  },

  // --- Jewelry & Fine Ornaments ---
  {
    id: 'prod-jew-1',
    title: 'Celestial Diamond Solitaire 18K Gold Plated Pendant Necklace',
    description: 'Handcrafted 18-karat gold vermeil pendant featuring a conflict-free brilliant-cut CZ solitaire stone surrounded by a delicate celestial starburst halo on an adjustable Italian cable chain.',
    price: 129.00,
    originalPrice: 165.00,
    category: 'jewelry',
    rating: 4.9,
    reviewCount: 215,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611591475155-42e9fcf5d7c5?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isNew: true,
    tags: ['Jewelry', 'Gold Necklace', 'Solitaire', '18K Vermeil', 'Luxury'],
    specs: [
      { name: 'Metal', value: '18K Yellow Gold Vermeil over 925 Sterling Silver' },
      { name: 'Stone', value: '1.5 Carat AAA Lab Brilliant Solitaire' },
      { name: 'Chain Length', value: '16" + 2" Extender (40cm + 5cm)' },
      { name: 'Clasp', value: 'Secure Lobster Claw with Hallmark Stamp' },
    ],
    createdAt: '2026-02-12T16:00:00.000Z',
  },
  {
    id: 'prod-jew-2',
    title: 'Evergreen Emerald Cut & Pavé Diamond Cocktail Ring',
    description: 'Vintage-inspired statement cocktail ring featuring a deep Colombian-green emerald-cut crystal bordered by micro-pavé crystals set in platinum-plated sterling silver.',
    price: 159.00,
    originalPrice: 195.00,
    category: 'jewelry',
    rating: 4.9,
    reviewCount: 110,
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isNew: false,
    tags: ['Jewelry', 'Ring', 'Emerald', 'Cocktail Ring', 'Sterling Silver'],
    specs: [
      { name: 'Main Stone', value: '8x10mm Emerald-Cut Created Hydrothermal Gemstone' },
      { name: 'Band', value: '925 Solid Sterling Silver with Rhodium Anti-Tarnish Finish' },
      { name: 'Ring Sizes', value: '5, 6, 7, 8, 9 (Comfort Fit Band)' },
    ],
    createdAt: '2026-01-30T15:40:00.000Z',
  },
  {
    id: 'prod-jew-3',
    title: 'Shimmering 925 Sterling Silver Cubic Zirconia Tennis Bracelet',
    description: 'Timeless 3mm 4-prong set tennis bracelet featuring 48 hand-selected brilliant cubic zirconia stones with a double-safety hidden box clasp.',
    price: 115.00,
    originalPrice: 145.00,
    category: 'jewelry',
    rating: 4.8,
    reviewCount: 134,
    stock: 26,
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isNew: false,
    tags: ['Jewelry', 'Bracelet', 'Tennis Bracelet', 'Silver', 'Classic'],
    specs: [
      { name: 'Material', value: 'Hypoallergenic Solid 925 Sterling Silver' },
      { name: 'Length', value: '7.0 inches (17.8 cm)' },
      { name: 'Clasp', value: 'Double Safety Latch Box Mechanism' },
    ],
    createdAt: '2026-02-04T12:00:00.000Z',
  },
  {
    id: 'prod-jew-4',
    title: 'Natural Baroque Freshwater Pearl Gold Drop Earrings',
    description: 'Unique organic baroque freshwater pearls suspended from geometric 14K gold-filled huggie hoops. Each pearl features a one-of-a-kind iridescent luster.',
    price: 89.00,
    originalPrice: 110.00,
    category: 'jewelry',
    rating: 4.8,
    reviewCount: 92,
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isNew: true,
    tags: ['Jewelry', 'Earrings', 'Pearls', 'Freshwater Pearls', 'Gold Hoops'],
    specs: [
      { name: 'Pearl Type', value: '100% Genuine Cultured Baroque Pearls (10-12mm)' },
      { name: 'Metal', value: '14K Gold Filled (Nickel-free, Sensitive Ears Safe)' },
      { name: 'Drop Length', value: '3.2 cm' },
    ],
    createdAt: '2026-02-11T13:15:00.000Z',
  },

  // --- Costumes & Dresses ---
  {
    id: 'prod-drs-1',
    title: 'Emerald Silk Satin Backless Evening Gala Gown',
    description: 'Floor-length fluid silk charmeuse gown featuring an open cowl back, graceful thigh-high side slit, and figure-skimming bias cut for galas and red-carpet occasions.',
    price: 189.00,
    originalPrice: 240.00,
    category: 'costumes-dresses',
    rating: 4.9,
    reviewCount: 167,
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isNew: true,
    tags: ['Dresses', 'Evening Gown', 'Silk', 'Satin', 'Gala', 'Costume'],
    specs: [
      { name: 'Fabric', value: '100% Mulberry Silk-Satin Blend' },
      { name: 'Silhouette', value: 'Bias Cut Floor-Length with Train' },
      { name: 'Sizes', value: 'XS, S, M, L, XL' },
      { name: 'Care', value: 'Dry Clean Only' },
    ],
    createdAt: '2026-02-13T17:30:00.000Z',
  },
  {
    id: 'prod-drs-2',
    title: 'Bohemian Wildflower Embroidered Linen-Cotton Summer Dress',
    description: 'Breathable French linen-blend midi dress detailed with hand-guided floral embroidery, scallop-edged flutter sleeves, sweetheart neckline, and side pockets.',
    price: 95.00,
    originalPrice: 120.00,
    category: 'costumes-dresses',
    rating: 4.8,
    reviewCount: 145,
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isNew: true,
    tags: ['Dresses', 'Boho', 'Summer Dress', 'Floral', 'Linen', 'Embroidery'],
    specs: [
      { name: 'Material', value: '55% French Linen, 45% Organic Cotton' },
      { name: 'Features', value: 'Hidden Side Pockets, Smocked Elastic Back' },
      { name: 'Length', value: 'Midi (44 inches from shoulder)' },
    ],
    createdAt: '2026-02-09T10:45:00.000Z',
  },
  {
    id: 'prod-drs-3',
    title: 'Royal Heritage Zari Embroidered Velvet Festive Costume Anarkali Dress',
    description: 'Luxurious micro-velvet regal costume dress lavishly adorned with metallic gold Zari tilla embroidery, sequined border flair, and matching silk organza dupatta drape.',
    price: 210.00,
    originalPrice: 260.00,
    category: 'costumes-dresses',
    rating: 5.0,
    reviewCount: 84,
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    featured: true,
    isNew: true,
    tags: ['Costume', 'Festive Dress', 'Velvet', 'Zari Embroidery', 'Ethnic', 'Royal'],
    specs: [
      { name: 'Fabric', value: 'Pure Micro Velvet & Sheer Organza' },
      { name: 'Work', value: 'Handcrafted Metallic Zari Thread & Sequin Work' },
      { name: 'Flare', value: '4.5 Meter Full Flared Kalis' },
      { name: 'Set Includes', value: 'Flared Dress Gown + Embellished Dupatta + Belt' },
    ],
    createdAt: '2026-02-14T19:00:00.000Z',
  },
  {
    id: 'prod-drs-4',
    title: 'Parisian Midnight Pleated A-Line Cocktail Party Dress',
    description: 'Modern chic knee-length cocktail dress featuring sharp accordion sunburst pleats, high halter neckline, and tailored tie waist sash.',
    price: 135.00,
    originalPrice: 165.00,
    category: 'costumes-dresses',
    rating: 4.8,
    reviewCount: 112,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=800&q=80',
    ],
    featured: false,
    isNew: false,
    tags: ['Dresses', 'Cocktail Dress', 'Pleated', 'Party Dress', 'Parisian'],
    specs: [
      { name: 'Material', value: 'High-Density Chiffon Pleat with Satin Lining' },
      { name: 'Closure', value: 'Concealed Back Zipper + Dual Neckline Buttons' },
      { name: 'Silhouette', value: 'Fit & Flare A-Line' },
    ],
    createdAt: '2026-01-27T16:20:00.000Z',
  },
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'user-cust-1',
    userName: 'Alex Mercer',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'The soundstage and spatial separation on these headphones are truly breathtaking. ANC handles loud subway commutes with absolute ease.',
    createdAt: '2026-02-04T18:20:00.000Z',
    verifiedPurchase: true,
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userId: 'user-cust-2',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Build quality is top notch. Plush memory foam ear cushions make long 8-hour coding sessions super comfortable without ear fatigue.',
    createdAt: '2026-02-08T09:40:00.000Z',
    verifiedPurchase: true,
  },
  {
    id: 'rev-3',
    productId: 'prod-4',
    userId: 'user-cust-1',
    userName: 'Alex Mercer',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'The acoustic gasket mount gives such a deep, satisfying thock. Keycaps feel premium and switch smoothness out of the box is perfection.',
    createdAt: '2026-01-29T14:10:00.000Z',
    verifiedPurchase: true,
  },
  {
    id: 'rev-4',
    productId: 'prod-cos-1',
    userId: 'user-cust-2',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'The lipstick formula is pure perfection! It glides on like velvet without drying out my lips, and the Warm Mocha shade is now my daily staple.',
    createdAt: '2026-02-15T15:20:00.000Z',
    verifiedPurchase: true,
  },
  {
    id: 'rev-5',
    productId: 'prod-cos-2',
    userId: 'user-cust-1',
    userName: 'Alex Mercer',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Within a week of using this glow elixir my complexion looks noticeably more even and radiant. Non-greasy and absorbs rapidly.',
    createdAt: '2026-02-16T11:00:00.000Z',
    verifiedPurchase: true,
  },
  {
    id: 'rev-6',
    productId: 'prod-jew-1',
    userId: 'user-cust-2',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'The 18K gold pendant catches the light brilliantly. The sparkle of the solitaire is breathtaking and the chain quality feels solid and luxurious.',
    createdAt: '2026-02-14T18:40:00.000Z',
    verifiedPurchase: true,
  },
  {
    id: 'rev-7',
    productId: 'prod-drs-1',
    userId: 'user-cust-2',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment: 'Wore this emerald silk dress to an annual charity gala and received countless compliments! The drape and fabric quality are worth every penny.',
    createdAt: '2026-02-16T20:15:00.000Z',
    verifiedPurchase: true,
  },
];

export const initialCoupons: Coupon[] = [
  {
    code: 'SAVE20',
    discountPercentage: 20,
    minSpend: 100,
    description: 'Get 20% off on orders over $100',
  },
  {
    code: 'WELCOME10',
    discountPercentage: 10,
    minSpend: 50,
    description: '10% discount for first-time shoppers',
  },
  {
    code: 'VIP30',
    discountPercentage: 30,
    minSpend: 250,
    description: 'Exclusive 30% discount on premier orders',
  },
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'SN-94821',
    userId: 'user-cust-1',
    customerName: 'Alex Mercer',
    customerEmail: 'alex.mercer@gmail.com',
    shippingAddress: {
      fullName: 'Alex Mercer',
      email: 'alex.mercer@gmail.com',
      phone: '+1 (555) 876-5432',
      street: '742 Evergreen Terrace',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'United States',
    },
    items: [
      {
        productId: 'prod-1',
        title: 'NovaSound Spatial ANC Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
      },
      {
        productId: 'prod-8',
        title: 'ApexCharge 140W GaN Fast Charger Multi-Port',
        price: 64.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 364.98,
    discount: 72.99,
    couponCode: 'SAVE20',
    shippingFee: 0,
    tax: 23.36,
    total: 315.35,
    paymentMethod: 'Credit Card (Stripe ****4242)',
    paymentStatus: 'Paid',
    orderStatus: 'Out for Delivery',
    trackingNumber: 'TRK-NV-8849201',
    carrier: 'NovaExpress Priority Ground',
    estimatedDelivery: 'Today by 5:00 PM',
    createdAt: '2026-02-17T09:14:00.000Z',
    updatedAt: '2026-02-19T06:30:00.000Z',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: '2026-02-17T09:14:00.000Z',
        note: 'Order placed and payment successfully verified',
        location: 'Online Payment Gateway',
      },
      {
        status: 'Processing',
        timestamp: '2026-02-17T11:45:00.000Z',
        note: 'Items picked and packed with secure eco-cushioning',
        location: 'West Coast Logistics Center, Oakland CA',
      },
      {
        status: 'Shipped',
        timestamp: '2026-02-18T08:20:00.000Z',
        note: 'Departed sorting facility in transit to regional hub',
        location: 'Oakland Air Hub, CA',
      },
      {
        status: 'Out for Delivery',
        timestamp: '2026-02-19T06:30:00.000Z',
        note: 'Package is on delivery vehicle with courier Dan',
        location: 'Seattle Metro Delivery Depot, WA',
      },
    ],
  },
  {
    id: 'ord-1002',
    orderNumber: 'SN-94822',
    userId: 'user-cust-2',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.r@outlook.com',
    shippingAddress: {
      fullName: 'Elena Rostova',
      email: 'elena.r@outlook.com',
      phone: '+1 (555) 345-9876',
      street: '450 Oak Avenue, Apt 3B',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'United States',
    },
    items: [
      {
        productId: 'prod-4',
        title: 'Keyforge Mechanical 75% Custom Keyboard',
        price: 169.50,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 169.50,
    discount: 16.95,
    couponCode: 'WELCOME10',
    shippingFee: 0,
    tax: 12.20,
    total: 164.75,
    paymentMethod: 'Apple Pay',
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    trackingNumber: 'TRK-NV-8849150',
    carrier: 'NovaExpress Standard',
    estimatedDelivery: 'Delivered on Feb 15, 2026',
    createdAt: '2026-02-12T10:00:00.000Z',
    updatedAt: '2026-02-15T14:22:00.000Z',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: '2026-02-12T10:00:00.000Z',
        note: 'Order confirmed and authorized',
        location: 'Online Payment Gateway',
      },
      {
        status: 'Processing',
        timestamp: '2026-02-12T13:00:00.000Z',
        note: 'Custom firmware flashed and QC inspected',
        location: 'Central Fulfillment Depot, TX',
      },
      {
        status: 'Shipped',
        timestamp: '2026-02-13T09:00:00.000Z',
        note: 'In transit to Austin distribution center',
        location: 'Dallas Hub, TX',
      },
      {
        status: 'Out for Delivery',
        timestamp: '2026-02-15T08:15:00.000Z',
        note: 'Out for morning residential delivery',
        location: 'Austin Hub, TX',
      },
      {
        status: 'Delivered',
        timestamp: '2026-02-15T14:22:00.000Z',
        note: 'Delivered directly to front door / parcel locker',
        location: 'Austin, TX',
      },
    ],
  },
  {
    id: 'ord-1003',
    orderNumber: 'SN-94823',
    userId: 'user-cust-1',
    customerName: 'Alex Mercer',
    customerEmail: 'alex.mercer@gmail.com',
    shippingAddress: {
      fullName: 'Alex Mercer',
      email: 'alex.mercer@gmail.com',
      phone: '+1 (555) 876-5432',
      street: '742 Evergreen Terrace',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      country: 'United States',
    },
    items: [
      {
        productId: 'prod-5',
        title: 'Nomad Tech Commuter 24L Waterproof Backpack',
        price: 145.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80',
      },
    ],
    subtotal: 145.00,
    discount: 0,
    shippingFee: 0,
    tax: 11.60,
    total: 156.60,
    paymentMethod: 'Credit Card (Stripe ****4242)',
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    trackingNumber: 'TRK-NV-8849922',
    carrier: 'NovaExpress Priority Ground',
    estimatedDelivery: 'Feb 22, 2026',
    createdAt: '2026-02-18T16:20:00.000Z',
    updatedAt: '2026-02-18T17:40:00.000Z',
    statusHistory: [
      {
        status: 'Pending',
        timestamp: '2026-02-18T16:20:00.000Z',
        note: 'Order confirmed and queue assigned',
        location: 'Online Payment Gateway',
      },
      {
        status: 'Processing',
        timestamp: '2026-02-18T17:40:00.000Z',
        note: 'Order dispatched to packaging line',
        location: 'West Coast Logistics Center, Oakland CA',
      },
    ],
  },
];

// In-Memory Database with helper methods
class StoreDatabase {
  private state: DatabaseState;

  constructor() {
    this.state = {
      users: [...initialUsers],
      products: [...initialProducts],
      orders: [...initialOrders],
      reviews: [...initialReviews],
      coupons: [...initialCoupons],
      categories: [...initialCategories],
    };
  }

  // --- Products ---
  public getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    sortBy?: string;
  }): Product[] {
    let result = [...this.state.products];

    if (params?.category && params.category !== 'all') {
      result = result.filter(p => p.category === params.category);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    if (typeof params?.minPrice === 'number' && !isNaN(params.minPrice)) {
      result = result.filter(p => p.price >= params.minPrice!);
    }

    if (typeof params?.maxPrice === 'number' && !isNaN(params.maxPrice)) {
      result = result.filter(p => p.price <= params.maxPrice!);
    }

    if (params?.inStock) {
      result = result.filter(p => p.stock > 0);
    }

    if (params?.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          break;
        case 'featured':
        default:
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
      }
    }

    return result;
  }

  public getProductById(id: string): Product | undefined {
    return this.state.products.find(p => p.id === id);
  }

  public createProduct(data: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Product {
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    this.state.products.unshift(newProduct);
    this.updateCategoryCounts();
    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.state.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.state.products[index] = {
      ...this.state.products[index],
      ...updates,
    };
    this.updateCategoryCounts();
    return this.state.products[index];
  }

  public deleteProduct(id: string): boolean {
    const initialLen = this.state.products.length;
    this.state.products = this.state.products.filter(p => p.id !== id);
    this.updateCategoryCounts();
    return this.state.products.length < initialLen;
  }

  // --- Reviews ---
  public getReviewsForProduct(productId: string): Review[] {
    return this.state.reviews.filter(r => r.productId === productId);
  }

  public addReview(review: Omit<Review, 'id' | 'createdAt'>): Review {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.reviews.unshift(newRev);

    // Recalculate product rating
    const productReviews = this.getReviewsForProduct(review.productId);
    const avg = productReviews.reduce((acc, curr) => acc + curr.rating, 0) / productReviews.length;
    this.updateProduct(review.productId, {
      rating: Math.round(avg * 10) / 10,
      reviewCount: productReviews.length,
    });

    return newRev;
  }

  // --- Users & Auth ---
  public getUsers(): User[] {
    return this.state.users;
  }

  public getUserById(id: string): User | undefined {
    return this.state.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.state.users.push(newUser);
    return newUser;
  }

  // --- Orders ---
  public getOrders(userId?: string, role?: string): Order[] {
    if (role === 'admin') {
      return [...this.state.orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    if (userId) {
      return this.state.orders
        .filter(o => o.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return [...this.state.orders];
  }

  public getOrderById(id: string): Order | undefined {
    return this.state.orders.find(o => o.id === id || o.orderNumber === id);
  }

  public createOrder(orderData: {
    userId: string;
    customerName: string;
    customerEmail: string;
    shippingAddress: any;
    items: Array<{ productId: string; quantity: number }>;
    couponCode?: string;
    paymentMethod: string;
    shippingOption?: { name: string; price: number };
  }): Order {
    // calculate items breakdown
    const orderItems = [];
    let subtotal = 0;

    for (const it of orderData.items) {
      const prod = this.getProductById(it.productId);
      if (prod) {
        orderItems.push({
          productId: prod.id,
          title: prod.title,
          price: prod.price,
          quantity: it.quantity,
          image: prod.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80',
        });
        subtotal += prod.price * it.quantity;

        // Deduct inventory
        this.updateProduct(prod.id, {
          stock: Math.max(0, prod.stock - it.quantity),
        });
      }
    }

    // Coupon
    let discount = 0;
    if (orderData.couponCode) {
      const coupon = this.validateCoupon(orderData.couponCode, subtotal);
      if (coupon.valid && coupon.coupon) {
        discount = (subtotal * coupon.coupon.discountPercentage) / 100;
      }
    }

    const shippingFee = orderData.shippingOption ? orderData.shippingOption.price : (subtotal > 100 ? 0 : 9.99);
    const tax = Math.round((subtotal - discount) * 0.08 * 100) / 100;
    const total = Math.max(0, Math.round((subtotal - discount + shippingFee + tax) * 100) / 100);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const randomTrk = Math.floor(1000000 + Math.random() * 9000000);

    const now = new Date().toISOString();
    const estDeliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `SN-${randomNum}`,
      userId: orderData.userId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      shippingAddress: orderData.shippingAddress,
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      couponCode: orderData.couponCode,
      shippingFee,
      tax,
      total,
      paymentMethod: orderData.paymentMethod || 'Credit Card',
      paymentStatus: 'Paid',
      orderStatus: 'Pending',
      trackingNumber: `TRK-NV-${randomTrk}`,
      carrier: 'NovaExpress Priority Logistics',
      estimatedDelivery: estDeliveryDate,
      createdAt: now,
      updatedAt: now,
      statusHistory: [
        {
          status: 'Pending',
          timestamp: now,
          note: 'Order confirmed and awaiting fulfillment queue',
          location: 'ShopNova Central Gateway',
        },
      ],
    };

    this.state.orders.unshift(newOrder);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: OrderStatus, customNote?: string, location?: string): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    const now = new Date().toISOString();
    order.orderStatus = status;
    order.updatedAt = now;

    let defaultNote = `Order status updated to ${status}`;
    let defaultLocation = 'NovaExpress Regional Center';

    if (status === 'Processing') {
      defaultNote = 'Items packaged and barcode scanning completed';
      defaultLocation = 'Logistics Hub Oakland, CA';
    } else if (status === 'Shipped') {
      defaultNote = 'Package departed sorting facility in transit';
      defaultLocation = 'Central Carrier Depot';
    } else if (status === 'Out for Delivery') {
      defaultNote = 'Courier vehicle on delivery route';
      defaultLocation = 'Destination City Distribution Hub';
    } else if (status === 'Delivered') {
      defaultNote = 'Package safely delivered and signed for';
      defaultLocation = `${order.shippingAddress.city}, ${order.shippingAddress.state}`;
    } else if (status === 'Cancelled') {
      defaultNote = 'Order cancelled and refund process initiated';
      defaultLocation = 'ShopNova Support Desk';
    }

    order.statusHistory.push({
      status,
      timestamp: now,
      note: customNote || defaultNote,
      location: location || defaultLocation,
    });

    return order;
  }

  // --- Coupons ---
  public validateCoupon(code: string, subtotal: number): { valid: boolean; message: string; coupon?: Coupon } {
    const c = this.state.coupons.find(x => x.code.toUpperCase() === code.toUpperCase().trim());
    if (!c) {
      return { valid: false, message: 'Invalid promo code. Try SAVE20 or WELCOME10' };
    }
    if (subtotal < c.minSpend) {
      return {
        valid: false,
        message: `Coupon ${c.code} requires a minimum order subtotal of $${c.minSpend.toFixed(2)}`,
      };
    }
    return {
      valid: true,
      message: `${c.discountPercentage}% discount applied successfully!`,
      coupon: c,
    };
  }

  public getCategories(): Category[] {
    this.updateCategoryCounts();
    return this.state.categories;
  }

  private updateCategoryCounts() {
    this.state.categories.forEach(cat => {
      cat.productCount = this.state.products.filter(p => p.category === cat.slug).length;
    });
  }

  // --- Admin Analytics ---
  public getAdminStats() {
    const totalOrders = this.state.orders.length;
    const totalRevenue = this.state.orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = this.state.orders.filter(o => o.orderStatus === 'Pending' || o.orderStatus === 'Processing').length;
    const lowStockProducts = this.state.products.filter(p => p.stock <= 10).length;
    const totalCustomers = this.state.users.filter(u => u.role === 'customer').length;

    const recentOrders = this.state.orders.slice(0, 5);

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      pendingOrders,
      lowStockProducts,
      totalCustomers,
      totalProducts: this.state.products.length,
      recentOrders,
    };
  }
}

export const db = new StoreDatabase();
