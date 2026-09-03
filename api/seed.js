import { connectToDatabase } from './db.js';
import { Category, Company, Product, Invoice, Customer } from './models.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();

    const categoryCount = await Category.countDocuments();
    if (categoryCount > 0 && req.query.force !== 'true') {
      return res.status(200).json({
        message: 'Database already has data. Use ?force=true to reseed.',
        categoryCount
      });
    }

    // Clear existing if force
    if (req.query.force === 'true') {
      await Promise.all([
        Category.deleteMany({}),
        Company.deleteMany({}),
        Product.deleteMany({}),
        Invoice.deleteMany({}),
        Customer.deleteMany({})
      ]);
    }

    // 1. Categories
    const categories = await Category.insertMany([
      { name: 'Sanitary', slug: 'sanitary', icon: 'Droplets', description: 'Pipes, valves, bib cocks, floor traps' },
      { name: 'Electrical', slug: 'electrical', icon: 'Zap', description: 'Switches, circuit breakers, cables, distribution' },
      { name: 'Hardware', slug: 'hardware', icon: 'Wrench', description: 'Locks, hinges, screws, drawer slides' }
    ]);

    const sanitaryId = categories[0]._id.toString();
    const electricalId = categories[1]._id.toString();
    const hardwareId = categories[2]._id.toString();

    // 2. Companies / Brands
    const companies = await Company.insertMany([
      {
        name: 'Dura Flow',
        code: 'DURA',
        defaultDiscount: 10,
        color: '#0284c7',
        phone: '+92 (42) 3512-3456',
        email: 'sales@duraflow.com.pk',
        address: 'Industrial Estate, Lahore',
        isDefault: true
      },
      {
        name: 'Popular',
        code: 'POPU',
        defaultDiscount: 8,
        color: '#ea580c',
        phone: '+92 (21) 3241-8899',
        email: 'info@popularpipes.com',
        address: 'SITE Industrial Area, Karachi',
        isDefault: false
      },
      {
        name: 'Master',
        code: 'MAST',
        defaultDiscount: 12,
        color: '#4f46e5',
        phone: '+92 (51) 4880-1122',
        email: 'orders@mastersanitary.pk',
        address: 'I-9 Sector, Islamabad',
        isDefault: false
      },
      {
        name: 'Faisal Sanitary',
        code: 'FAIS',
        defaultDiscount: 5,
        color: '#059669',
        phone: '+92 (55) 4291-7788',
        email: 'contact@faisalsanitary.com',
        address: 'G.T. Road, Gujranwala',
        isDefault: false
      }
    ]);

    const duraId = companies[0]._id.toString();
    const popuId = companies[1]._id.toString();
    const mastId = companies[2]._id.toString();
    const faisId = companies[3]._id.toString();

    // 3. Products
    const productsData = [
      {
        commonCode: 'SF-001',
        name: 'Stop Cock',
        categoryId: sanitaryId,
        categoryName: 'Sanitary',
        description: 'Heavy duty brass core stop cock valve 1/2 inch',
        unit: 'pcs',
        stockQty: 180,
        prices: {
          [duraId]: 2500,
          [popuId]: 2300,
          [mastId]: 2400,
          [faisId]: 2250
        }
      },
      {
        commonCode: 'SF-002',
        name: 'Angle Valve',
        categoryId: sanitaryId,
        categoryName: 'Sanitary',
        description: 'Chrome plated quarter turn angle valve for geyser & basin',
        unit: 'pcs',
        stockQty: 250,
        prices: {
          [duraId]: 1800,
          [popuId]: 1650,
          [mastId]: 1750,
          [faisId]: 1600
        }
      },
      {
        commonCode: 'SF-003',
        name: 'Bib Cock',
        categoryId: sanitaryId,
        categoryName: 'Sanitary',
        description: 'Brass bib cock with long handle and aerator nozzle',
        unit: 'pcs',
        stockQty: 140,
        prices: {
          [duraId]: 2200,
          [popuId]: 2050,
          [mastId]: 2150,
          [faisId]: 1980
        }
      },
      {
        commonCode: 'SF-100',
        name: 'Floor Trap',
        categoryId: sanitaryId,
        categoryName: 'Sanitary',
        description: 'UPVC anti-foul drainage floor trap with SS grating 4x4',
        unit: 'pcs',
        stockQty: 320,
        prices: {
          [duraId]: 2000,
          [popuId]: 1850,
          [mastId]: 1950,
          [faisId]: 1800
        }
      },
      {
        commonCode: 'SF-EXCL-99',
        name: 'Concealed Shower Valve',
        categoryId: sanitaryId,
        categoryName: 'Sanitary',
        description: 'Thermostatic concealed valve (Exclusive Dura Flow/Master)',
        unit: 'pcs',
        stockQty: 30,
        prices: {
          [duraId]: 9200,
          [mastId]: 8900
        }
      },
      {
        commonCode: 'EL-001',
        name: 'Circuit Breaker 16A Single Pole',
        categoryId: electricalId,
        categoryName: 'Electrical',
        description: 'Miniature circuit breaker MCB 6kA thermal magnetic trip',
        unit: 'pcs',
        stockQty: 450,
        prices: {
          [duraId]: 850,
          [popuId]: 780,
          [mastId]: 820,
          [faisId]: 750
        }
      },
      {
        commonCode: 'HW-001',
        name: 'Stainless Steel Mortise Door Lock',
        categoryId: hardwareId,
        categoryName: 'Hardware',
        description: 'SS 304 security door lock with double cylinder',
        unit: 'set',
        stockQty: 90,
        prices: {
          [duraId]: 3800,
          [popuId]: 3400,
          [mastId]: 3650,
          [faisId]: 3300
        }
      }
    ];

    await Product.insertMany(productsData);

    // 4. Sample Customers
    await Customer.insertMany([
      {
        name: 'Al-Madina Contractors',
        phone: '+92 300 5544332',
        email: 'procurement@almadina.pk',
        address: 'Plot 45, Phase 5 DHA, Lahore',
        companyName: 'Al-Madina Builders Pvt Ltd',
        totalPurchases: 258000
      },
      {
        name: 'Engr. Kamran Siddiqui',
        phone: '+92 333 4455667',
        email: 'kamran.architects@live.com',
        address: 'Suite 302, Blue Area, Islamabad',
        companyName: 'Studio Arch-Design',
        totalPurchases: 43050
      }
    ]);

    // 5. Initial sample invoice (PDF Page 3)
    await Invoice.create({
      invoiceNumber: 'INV-2026-001',
      type: 'invoice',
      date: '2026-09-01',
      dueDate: '2026-09-16',
      customerName: 'Engr. Kamran Siddiqui',
      customerContact: '+92 333 4455667',
      customerAddress: 'Suite 302, Blue Area, Islamabad',
      companyId: duraId,
      companyName: 'Dura Flow',
      items: [
        {
          commonCode: 'SF-001',
          productName: 'Stop Cock',
          categoryName: 'Sanitary',
          unit: 'pcs',
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
          categoryName: 'Sanitary',
          unit: 'pcs',
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
          categoryName: 'Sanitary',
          unit: 'pcs',
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
      taxPercent: 0,
      taxAmount: 0,
      grandTotal: 43050,
      notes: 'Thank you for your business. Payment due within 15 days.',
      terms: '1. Goods once sold cannot be returned without original receipt.',
      status: 'paid'
    });

    res.status(200).json({
      success: true,
      message: 'MongoDB Atlas successfully seeded with PDF specification catalog!'
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
