import Dexie from 'dexie';

export const db = new Dexie('AlHarshInventoryDB');

// Use clean numeric keys without compound index constraints
db.version(2).stores({
  categories: '++id, name, slug',
  companies: '++id, name, code',
  products: '++id, commonCode, name, categoryId',
  companyPrices: '++id, commonCode, companyId',
  invoices: '++id, invoiceNumber, type, date, customerName, companyId, status, createdAt',
  customers: '++id, name, phone'
});

// Seed data function to populate standard PDF examples
export async function seedInitialData() {
  try {
    const categoryCount = await db.categories.count();
    const productCount = await db.products.count();
    if (categoryCount > 0 && productCount > 0) {
      return; // Already populated
    }

    // Clean any partial corrupt data before seeding
    await Promise.all([
      db.categories.clear().catch(() => {}),
      db.companies.clear().catch(() => {}),
      db.products.clear().catch(() => {}),
      db.companyPrices.clear().catch(() => {}),
      db.customers.clear().catch(() => {})
    ]);

    console.log('Seeding initial Al-Harsh database from PDF specs...');

    // 1. Categories (PDF Section 2) - Added individually for guaranteed integer keys
    const sanitaryId = await db.categories.add({
      name: 'Sanitary',
      slug: 'sanitary',
      icon: 'Droplets',
      description: 'Pipes, valves, bib cocks, floor traps, sanitary fittings'
    });

    const electricalId = await db.categories.add({
      name: 'Electrical',
      slug: 'electrical',
      icon: 'Zap',
      description: 'Switches, circuit breakers, cables, distribution boards'
    });

    const hardwareId = await db.categories.add({
      name: 'Hardware',
      slug: 'hardware',
      icon: 'Wrench',
      description: 'Locks, hinges, screws, drawer slides, building hardware'
    });

    // 2. Companies / Brands (PDF Section 2 & 6) - Added individually for guaranteed integer keys
    const duraId = await db.companies.add({
      name: 'Dura Flow',
      code: 'DURA',
      defaultDiscount: 10,
      color: '#0284c7', // Sky blue
      phone: '+92 (42) 3512-3456',
      email: 'sales@duraflow.com.pk',
      address: 'Industrial Estate, Lahore',
      isDefault: true
    });

    const popuId = await db.companies.add({
      name: 'Popular',
      code: 'POPU',
      defaultDiscount: 8,
      color: '#ea580c', // Orange
      phone: '+92 (21) 3241-8899',
      email: 'info@popularpipes.com',
      address: 'SITE Industrial Area, Karachi',
      isDefault: false
    });

    const mastId = await db.companies.add({
      name: 'Master',
      code: 'MAST',
      defaultDiscount: 12,
      color: '#4f46e5', // Indigo
      phone: '+92 (51) 4880-1122',
      email: 'orders@mastersanitary.pk',
      address: 'I-9 Sector, Islamabad',
      isDefault: false
    });

    const faisId = await db.companies.add({
      name: 'Faisal Sanitary',
      code: 'FAIS',
      defaultDiscount: 5,
      color: '#059669', // Emerald
      phone: '+92 (55) 4291-7788',
      email: 'contact@faisalsanitary.com',
      address: 'G.T. Road, Gujranwala',
      isDefault: false
    });

    // 3. Products with Common Codes (PDF Section 3 & 12)
    const sampleProducts = [
      // Sanitary (Directly from PDF Examples)
      {
        commonCode: 'SF-001',
        name: 'Stop Cock',
        categoryId: sanitaryId,
        description: 'Heavy duty brass core stop cock valve 1/2 inch',
        unit: 'pcs',
        stockQty: 180,
        prices: [
          { companyId: duraId, price: 2500 },
          { companyId: popuId, price: 2300 },
          { companyId: mastId, price: 2400 },
          { companyId: faisId, price: 2250 }
        ]
      },
      {
        commonCode: 'SF-002',
        name: 'Angle Valve',
        categoryId: sanitaryId,
        description: 'Chrome plated quarter turn angle valve for geyser & basin',
        unit: 'pcs',
        stockQty: 250,
        prices: [
          { companyId: duraId, price: 1800 },
          { companyId: popuId, price: 1650 },
          { companyId: mastId, price: 1750 },
          { companyId: faisId, price: 1600 }
        ]
      },
      {
        commonCode: 'SF-003',
        name: 'Bib Cock',
        categoryId: sanitaryId,
        description: 'Brass bib cock with long handle and aerator nozzle',
        unit: 'pcs',
        stockQty: 140,
        prices: [
          { companyId: duraId, price: 2200 },
          { companyId: popuId, price: 2050 },
          { companyId: mastId, price: 2150 },
          { companyId: faisId, price: 1980 }
        ]
      },
      {
        commonCode: 'SF-100',
        name: 'Floor Trap',
        categoryId: sanitaryId,
        description: 'UPVC anti-foul drainage floor trap with SS grating 4x4',
        unit: 'pcs',
        stockQty: 320,
        prices: [
          { companyId: duraId, price: 2000 },
          { companyId: popuId, price: 1850 },
          { companyId: mastId, price: 1950 },
          { companyId: faisId, price: 1800 }
        ]
      },
      {
        commonCode: 'SF-005',
        name: 'Basin Mixer Modern',
        categoryId: sanitaryId,
        description: 'Brass single lever hot & cold basin mixer tap',
        unit: 'pcs',
        stockQty: 65,
        prices: [
          { companyId: duraId, price: 7500 },
          { companyId: popuId, price: 6900 },
          { companyId: mastId, price: 7200 },
          { companyId: faisId, price: 6800 }
        ]
      },
      {
        commonCode: 'SF-EXCL-99',
        name: 'Concealed Master Shower Valve',
        categoryId: sanitaryId,
        description: 'High-end thermostatic concealed valve (Exclusive Dura Flow/Master)',
        unit: 'pcs',
        stockQty: 30,
        prices: [
          { companyId: duraId, price: 9200 },
          { companyId: mastId, price: 8900 }
        ]
      },

      // Electrical Products
      {
        commonCode: 'EL-001',
        name: 'Circuit Breaker 16A Single Pole',
        categoryId: electricalId,
        description: 'Miniature circuit breaker MCB 6kA thermal magnetic trip',
        unit: 'pcs',
        stockQty: 450,
        prices: [
          { companyId: duraId, price: 850 },
          { companyId: popuId, price: 780 },
          { companyId: mastId, price: 820 },
          { companyId: faisId, price: 750 }
        ]
      },
      {
        commonCode: 'EL-002',
        name: 'Main Switch 32A Double Pole',
        categoryId: electricalId,
        description: 'Double pole isolator main distribution switch',
        unit: 'pcs',
        stockQty: 110,
        prices: [
          { companyId: duraId, price: 2200 },
          { companyId: popuId, price: 1950 },
          { companyId: mastId, price: 2100 },
          { companyId: faisId, price: 1900 }
        ]
      },
      {
        commonCode: 'EL-003',
        name: '1-Way Light Switch (Piano Type)',
        categoryId: electricalId,
        description: 'Fire retardant polycarbonate light switch 10AX',
        unit: 'pcs',
        stockQty: 800,
        prices: [
          { companyId: duraId, price: 280 },
          { companyId: popuId, price: 240 },
          { companyId: mastId, price: 260 },
          { companyId: faisId, price: 230 }
        ]
      },
      {
        commonCode: 'EL-004',
        name: 'Copper Cable 3/29 (90m Coil)',
        categoryId: electricalId,
        description: 'Pure 99.9% annealed copper single core PVC conduit cable',
        unit: 'coil',
        stockQty: 75,
        prices: [
          { companyId: duraId, price: 12500 },
          { companyId: popuId, price: 11800 },
          { companyId: mastId, price: 12200 },
          { companyId: faisId, price: 11400 }
        ]
      },

      // Hardware Products
      {
        commonCode: 'HW-001',
        name: 'Stainless Steel Mortise Door Lock Set',
        categoryId: hardwareId,
        description: 'SS 304 security door lock with double cylinder and 3 keys',
        unit: 'set',
        stockQty: 90,
        prices: [
          { companyId: duraId, price: 3800 },
          { companyId: popuId, price: 3400 },
          { companyId: mastId, price: 3650 },
          { companyId: faisId, price: 3300 }
        ]
      },
      {
        commonCode: 'HW-002',
        name: 'Heavy Duty Brass Hinges 4-inch (Pair)',
        categoryId: hardwareId,
        description: 'Solid brass door hinges with ball bearings and mounting screws',
        unit: 'pair',
        stockQty: 300,
        prices: [
          { companyId: duraId, price: 1150 },
          { companyId: popuId, price: 980 },
          { companyId: mastId, price: 1050 },
          { companyId: faisId, price: 950 }
        ]
      },
      {
        commonCode: 'HW-003',
        name: 'Drywall Screws 1.5" (Box of 500)',
        categoryId: hardwareId,
        description: 'Black phosphate bugle head sharp point gypsum screws',
        unit: 'box',
        stockQty: 120,
        prices: [
          { companyId: duraId, price: 1400 },
          { companyId: popuId, price: 1250 },
          { companyId: mastId, price: 1320 },
          { companyId: faisId, price: 1200 }
        ]
      }
    ];

    for (const item of sampleProducts) {
      const { prices, ...productData } = item;
      await db.products.add(productData);

      if (Array.isArray(prices)) {
        for (const p of prices) {
          if (p.companyId && typeof p.companyId === 'number' && !isNaN(p.companyId)) {
            await db.companyPrices.add({
              commonCode: item.commonCode,
              companyId: p.companyId,
              price: Number(p.price),
              isAvailable: true
            });
          }
        }
      }
    }

    // 4. Sample Customers
    await db.customers.add({
      name: 'Al-Madina Contractors',
      phone: '+92 300 5544332',
      email: 'procurement@almadina.pk',
      address: 'Plot 45, Phase 5 DHA, Lahore',
      companyName: 'Al-Madina Builders Pvt Ltd',
      totalPurchases: 258000
    });

    await db.customers.add({
      name: 'Tariq Sanitary Store',
      phone: '+92 321 9988776',
      email: 'tariqsanitary@gmail.com',
      address: 'Shop # 12, Circular Road, Faisalabad',
      companyName: 'Tariq Trading Co',
      totalPurchases: 184500
    });

    await db.customers.add({
      name: 'Engr. Kamran Siddiqui',
      phone: '+92 333 4455667',
      email: 'kamran.architects@live.com',
      address: 'Suite 302, Blue Area, Islamabad',
      companyName: 'Studio Arch-Design',
      totalPurchases: 43050
    });

    // 5. Sample Initial Invoice matching PDF (Page 3 total = 43,050)
    await db.invoices.add({
      invoiceNumber: 'INV-2026-001',
      type: 'invoice',
      date: '2026-09-01',
      customerName: 'Engr. Kamran Siddiqui',
      customerContact: '+92 333 4455667',
      customerAddress: 'Suite 302, Blue Area, Islamabad',
      companyId: duraId,
      companyName: 'Dura Flow',
      items: [
        {
          commonCode: 'SF-001',
          productName: 'Stop Cock',
          quantity: 10,
          unitPrice: 2000,
          discountPercent: 10,
          grossAmount: 20000,
          discountAmount: 2000,
          netAmount: 18000,
          isAvailable: true
        },
        {
          commonCode: 'SF-002',
          productName: 'Angle Valve',
          quantity: 5,
          unitPrice: 3000,
          discountPercent: 5,
          grossAmount: 15000,
          discountAmount: 750,
          netAmount: 14250,
          isAvailable: true
        },
        {
          commonCode: 'SF-100',
          productName: 'Floor Trap',
          quantity: 8,
          unitPrice: 1500,
          discountPercent: 10,
          grossAmount: 12000,
          discountAmount: 1200,
          netAmount: 10800,
          isAvailable: true
        }
      ],
      subtotal: 47000,
      discountTotal: 3950,
      grandTotal: 43050,
      notes: 'Thank you for your business. Payment due within 15 days.',
      terms: '1. Goods once sold cannot be returned without original receipt.\n2. Warranty handled as per company policy.',
      status: 'paid',
      createdAt: new Date('2026-09-01T10:30:00Z').toISOString()
    });

    console.log('Database seeding complete!');
  } catch (err) {
    console.error('Error in seedInitialData:', err);
  }
}
