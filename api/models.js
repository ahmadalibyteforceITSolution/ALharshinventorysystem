import mongoose from 'mongoose';

// 1. Category Schema
const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true },
  icon: { type: String, default: 'Package' },
  description: { type: String, default: '' }
}, { timestamps: true });

// 2. Company / Brand Schema (PDF Page 1, 2, 4, 6)
const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true },
  defaultDiscount: { type: Number, default: 0 },
  color: { type: String, default: '#4f46e5' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

// 3. Product Schema with Common Product Code (PDF Section 3, 7, 12)
const ProductSchema = new mongoose.Schema({
  commonCode: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  categoryId: { type: String, required: true },
  categoryName: { type: String, default: 'General' },
  description: { type: String, default: '' },
  unit: { type: String, default: 'pcs' },
  stockQty: { type: Number, default: 100 },
  // Map of companyId/companyCode -> price
  prices: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

// 4. Invoice / Quotation Schema (PDF Section 4, 9)
const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, index: true },
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

// 5. Customer Schema
const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  companyName: { type: String, default: '' },
  totalPurchases: { type: Number, default: 0 }
}, { timestamps: true });

export const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
export const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', InvoiceSchema);
export const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
