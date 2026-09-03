import mongoose from 'mongoose';

// 1. User Schema for Authentication & Subscription Management
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  businessName: { type: String, default: 'My Sanitary & Hardware Store' },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  subscription: {
    plan: { type: String, enum: ['starter', 'pro', 'enterprise', 'custom'], default: 'starter' },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    brandLimit: { type: Number, default: 1 }, // Starter: 1, Pro: 5, Enterprise: 999
    status: { type: String, default: 'active' },
    startDate: { type: Date, default: Date.now },
    expiresAt: { 
      type: Date, 
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) 
    }
  }
}, { timestamps: true });

// 2. Category Schema
const CategorySchema = new mongoose.Schema({
  userId: { type: String, default: 'admin_alharsh', index: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  icon: { type: String, default: 'Package' },
  description: { type: String, default: '' }
}, { timestamps: true });

// 3. Company / Brand Schema (PDF Page 1, 2, 4, 6)
const CompanySchema = new mongoose.Schema({
  userId: { type: String, default: 'admin_alharsh', index: true },
  name: { type: String, required: true },
  code: { type: String, required: true },
  defaultDiscount: { type: Number, default: 0 },
  logo: { type: String, default: '' },
  color: { type: String, default: '#4f46e5' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

// 4. Product Schema with Common Product Code (PDF Section 3, 7, 12)
const ProductSchema = new mongoose.Schema({
  userId: { type: String, default: 'admin_alharsh', index: true },
  commonCode: { type: String, required: true, index: true },
  name: { type: String, required: true },
  categoryId: { type: String, default: '' },
  categoryName: { type: String, default: 'General' },
  description: { type: String, default: '' },
  unit: { type: String, default: 'pcs' },
  stockQty: { type: Number, default: 100 },
  prices: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// 5. Invoice / Quotation Schema (PDF Section 4, 9)
const InvoiceSchema = new mongoose.Schema({
  userId: { type: String, default: 'admin_alharsh', index: true },
  invoiceNumber: { type: String, required: true, index: true },
  type: { type: String, enum: ['invoice', 'quotation'], default: 'invoice' },
  date: { type: String, required: true },
  dueDate: { type: String, default: '' },
  customerName: { type: String, default: 'Walk-in Customer' },
  customerContact: { type: String, default: '' },
  customerAddress: { type: String, default: '' },
  companyId: { type: String, required: true },
  companyName: { type: String, required: true },
  items: [
    {
      commonCode: String,
      productName: String,
      categoryName: String,
      unit: String,
      quantity: Number,
      unitPrice: Number,
      discountPercent: Number,
      grossAmount: Number,
      discountAmount: Number,
      netAmount: Number,
      isAvailable: Boolean,
      unavailableReason: String,
      isDiscountCustom: Boolean
    }
  ],
  subtotal: { type: Number, default: 0 },
  discountTotal: { type: Number, default: 0 },
  taxPercent: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  notes: { type: String, default: '' },
  terms: { type: String, default: '' },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

// 6. Customer Schema
const CustomerSchema = new mongoose.Schema({
  userId: { type: String, default: 'admin_alharsh', index: true },
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  companyName: { type: String, default: '' },
  totalPurchases: { type: Number, default: 0 }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
export const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
