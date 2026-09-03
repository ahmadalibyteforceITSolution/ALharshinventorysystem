import { defineStore } from 'pinia';
import { api } from '@/services/api';
import { useInventoryStore } from './inventoryStore';

export const useInvoiceStore = defineStore('invoice', {
  state: () => ({
    invoices: [],
    isLoading: false,

    // Active draft invoice state
    activeInvoice: {
      id: null,
      invoiceNumber: '',
      type: 'invoice', // 'invoice' | 'quotation'
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      customerName: '',
      customerContact: '',
      customerAddress: '',
      companyId: null,
      companyName: '',
      applyCompanyDefaultDiscount: true,
      items: [],
      taxPercent: 0,
      notes: 'Thank you for your business. Please contact us for any technical inquiries.',
      terms: '1. Prices are valid for 15 days.\n2. Goods once sold cannot be returned without original receipt.\n3. Brand warranties are subject to manufacturer terms.',
      status: 'pending' // 'pending', 'paid', 'sent', 'draft'
    },

    // UI helper states
    lastSwitchedFrom: null,
    lastSwitchedTo: null,
    switchNotice: null,
    isComparisonModalOpen: false,
    isPrintModalOpen: false
  }),

  getters: {
    // Calculated totals for active invoice
    grossTotal: (state) => {
      return state.activeInvoice.items
        .filter(item => item.isAvailable !== false)
        .reduce((sum, item) => sum + (Number(item.grossAmount) || 0), 0);
    },

    discountTotal: (state) => {
      return state.activeInvoice.items
        .filter(item => item.isAvailable !== false)
        .reduce((sum, item) => sum + (Number(item.discountAmount) || 0), 0);
    },

    netSubtotal: (state) => {
      return state.activeInvoice.items
        .filter(item => item.isAvailable !== false)
        .reduce((sum, item) => sum + (Number(item.netAmount) || 0), 0);
    },

    taxAmount: (state) => {
      const net = state.activeInvoice.items
        .filter(item => item.isAvailable !== false)
        .reduce((sum, item) => sum + (Number(item.netAmount) || 0), 0);
      return Math.round(net * ((state.activeInvoice.taxPercent || 0) / 100));
    },

    grandTotal: (state) => {
      const net = state.activeInvoice.items
        .filter(item => item.isAvailable !== false)
        .reduce((sum, item) => sum + (Number(item.netAmount) || 0), 0);
      const tax = Math.round(net * ((state.activeInvoice.taxPercent || 0) / 100));
      return net + tax;
    },

    // Total count of unavailable items
    unavailableCount: (state) => {
      return state.activeInvoice.items.filter(item => item.isAvailable === false).length;
    },

    // Recent invoices list
    recentInvoices: (state) => {
      return [...state.invoices]
        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
        .slice(0, 10);
    },

    // Filter only quotations
    quotations: (state) => {
      return state.invoices.filter(inv => inv.type === 'quotation');
    },

    // Filter only final invoices
    finalInvoices: (state) => {
      return state.invoices.filter(inv => inv.type === 'invoice');
    },

    // Total invoice revenue
    totalInvoiceValue: (state) => {
      return state.invoices
        .filter(i => i.type === 'invoice')
        .reduce((sum, i) => sum + (Number(i.grandTotal) || 0), 0);
    }
  },

  actions: {
    async fetchInvoices() {
      this.isLoading = true;
      try {
        const remote = await api.getInvoices();
        if (remote) {
          this.invoices = remote;
        }
      } catch (err) {
        console.error('Failed to load invoices:', err);
      } finally {
        this.isLoading = false;
      }
    },

    // Initialize a new blank invoice or quotation
    initNewInvoice(type = 'invoice', defaultCompanyId = null) {
      const inventoryStore = useInventoryStore();
      const defaultCompany = defaultCompanyId 
        ? inventoryStore.getCompanyById(defaultCompanyId)
        : (inventoryStore.companies.find(c => c.isDefault) || inventoryStore.companies[0]);

      const now = new Date();
      const prefix = type === 'quotation' ? 'QT' : 'INV';
      const randomSeq = String(Math.floor(1000 + Math.random() * 9000));
      const invoiceNumber = `${prefix}-${now.getFullYear()}-${randomSeq}`;

      const due = new Date();
      due.setDate(now.getDate() + 15);

      this.activeInvoice = {
        id: null,
        invoiceNumber,
        type,
        date: now.toISOString().split('T')[0],
        dueDate: due.toISOString().split('T')[0],
        customerName: '',
        customerContact: '',
        customerAddress: '',
        companyId: defaultCompany?._id || defaultCompany?.id || null,
        companyName: defaultCompany?.name || 'Default Brand',
        applyCompanyDefaultDiscount: true,
        items: [],
        taxPercent: 0,
        notes: 'Thank you for your business. Quotations are subject to stock availability.',
        terms: '1. Prices include all standard warranties.\n2. Payment terms: 100% against delivery.\n3. Quotations remain valid for 15 calendar days.',
        status: type === 'quotation' ? 'draft' : 'pending',
        createdAt: new Date().toISOString()
      };

      this.switchNotice = null;
    },

    // Add product item to active invoice
    addItem(product, quantity = 1, customDiscount = null) {
      const inventoryStore = useInventoryStore();
      const company = inventoryStore.getCompanyById(this.activeInvoice.companyId);

      // Lookup price for current company
      const currentPrice = inventoryStore.getPrice(product.commonCode, this.activeInvoice.companyId);
      const isAvailable = currentPrice !== null && currentPrice > 0;
      const unitPrice = isAvailable ? Number(currentPrice) : 0;

      // Determine discount: custom discount > company default discount > 0
      const discountPercent = customDiscount !== null 
        ? Number(customDiscount) 
        : (company?.defaultDiscount ? Number(company.defaultDiscount) : 0);

      const qty = Math.max(1, Number(quantity));
      const grossAmount = unitPrice * qty;
      const discountAmount = Math.round(grossAmount * (discountPercent / 100));
      const netAmount = grossAmount - discountAmount;

      // Check if product already exists on invoice
      const existingIdx = this.activeInvoice.items.findIndex(
        i => i.commonCode === product.commonCode
      );

      if (existingIdx >= 0) {
        // Increment quantity
        const existing = this.activeInvoice.items[existingIdx];
        const newQty = existing.quantity + qty;
        this.updateItem(existingIdx, { quantity: newQty });
      } else {
        this.activeInvoice.items.push({
          commonCode: product.commonCode,
          productName: product.name,
          categoryName: product.categoryName || '',
          unit: product.unit || 'pcs',
          quantity: qty,
          unitPrice,
          discountPercent,
          grossAmount,
          discountAmount,
          netAmount,
          isAvailable,
          unavailableReason: isAvailable ? '' : `Not available in ${this.activeInvoice.companyName}`,
          isDiscountCustom: customDiscount !== null
        });
      }
    },

    // Update single item line
    updateItem(index, changes = {}) {
      if (!this.activeInvoice.items[index]) return;
      const item = { ...this.activeInvoice.items[index], ...changes };

      const qty = Math.max(1, Number(item.quantity) || 1);
      const unitPrice = Number(item.unitPrice) || 0;
      const discountPercent = Math.min(100, Math.max(0, Number(item.discountPercent) || 0));

      const grossAmount = unitPrice * qty;
      const discountAmount = Math.round(grossAmount * (discountPercent / 100));
      const netAmount = grossAmount - discountAmount;

      item.quantity = qty;
      item.unitPrice = unitPrice;
      item.discountPercent = discountPercent;
      item.grossAmount = grossAmount;
      item.discountAmount = discountAmount;
      item.netAmount = netAmount;

      if (changes.discountPercent !== undefined) {
        item.isDiscountCustom = true;
      }

      this.activeInvoice.items[index] = item;
    },

    // Remove single item
    removeItem(index) {
      this.activeInvoice.items.splice(index, 1);
    },

    // Core Feature: Switch Company/Brand (PDF Page 1, 3, 4, 5, 7, 8)
    switchCompany(newCompanyId) {
      const inventoryStore = useInventoryStore();
      const oldCompany = inventoryStore.getCompanyById(this.activeInvoice.companyId);
      const targetCompany = inventoryStore.getCompanyById(newCompanyId);

      if (!targetCompany) return;

      const oldName = oldCompany?.name || 'Previous Company';
      const targetName = targetCompany.name;
      const targetDefaultDiscount = Number(targetCompany.defaultDiscount || 0);
      const targetId = targetCompany._id || targetCompany.id;

      this.activeInvoice.companyId = targetId;
      this.activeInvoice.companyName = targetName;

      let updatedCount = 0;
      let unavailableCount = 0;

      // Update every line item based on the common product code
      this.activeInvoice.items = this.activeInvoice.items.map(item => {
        const newPrice = inventoryStore.getPrice(item.commonCode, targetId);
        const isAvailable = newPrice !== null && newPrice > 0;

        // Apply new company default discount unless user had manually customized it
        let discountPercent = item.discountPercent;
        if (!item.isDiscountCustom) {
          discountPercent = targetDefaultDiscount;
        }

        if (isAvailable) {
          updatedCount++;
          const unitPrice = Number(newPrice);
          const grossAmount = unitPrice * item.quantity;
          const discountAmount = Math.round(grossAmount * (discountPercent / 100));
          const netAmount = grossAmount - discountAmount;

          return {
            ...item,
            unitPrice,
            discountPercent,
            grossAmount,
            discountAmount,
            netAmount,
            isAvailable: true,
            unavailableReason: ''
          };
        } else {
          unavailableCount++;
          return {
            ...item,
            unitPrice: 0,
            grossAmount: 0,
            discountAmount: 0,
            netAmount: 0,
            isAvailable: false,
            unavailableReason: `Product not available for ${targetName}`
          };
        }
      });

      this.lastSwitchedFrom = oldName;
      this.lastSwitchedTo = targetName;
      this.switchNotice = {
        from: oldName,
        to: targetName,
        updatedCount,
        unavailableCount,
        timestamp: new Date()
      };
    },

    // Side-by-side Company Price Comparison (PDF Section 5 & 14)
    getCompanyComparisonMatrix() {
      const inventoryStore = useInventoryStore();
      if (!this.activeInvoice.items.length) return [];

      const currentTotal = this.grandTotal;

      return inventoryStore.companies.map(company => {
        let grossTotal = 0;
        let discountTotal = 0;
        let netTotal = 0;
        let availableItems = 0;
        let missingItems = 0;
        const defaultDiscount = Number(company.defaultDiscount || 0);

        const itemBreakdown = this.activeInvoice.items.map(item => {
          const price = inventoryStore.getPrice(item.commonCode, company.id);
          const isAvail = price !== null && price > 0;

          if (isAvail) {
            availableItems++;
            const discountPct = item.isDiscountCustom ? item.discountPercent : defaultDiscount;
            const gross = Number(price) * item.quantity;
            const disc = Math.round(gross * (discountPct / 100));
            const net = gross - disc;

            grossTotal += gross;
            discountTotal += disc;
            netTotal += net;

            return {
              commonCode: item.commonCode,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: Number(price),
              discountPercent: discountPct,
              netAmount: net,
              isAvailable: true
            };
          } else {
            missingItems++;
            return {
              commonCode: item.commonCode,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: 0,
              discountPercent: 0,
              netAmount: 0,
              isAvailable: false
            };
          }
        });

        const diffVsCurrent = netTotal - currentTotal;
        const pctDiff = currentTotal > 0 ? ((diffVsCurrent / currentTotal) * 100).toFixed(1) : 0;

        return {
          companyId: company.id,
          companyName: company.name,
          companyColor: company.color || '#4f46e5',
          defaultDiscount,
          grossTotal,
          discountTotal,
          netTotal,
          diffVsCurrent,
          pctDiff,
          availableItems,
          missingItems,
          totalItems: this.activeInvoice.items.length,
          isAllAvailable: missingItems === 0,
          isCurrent: company.id === this.activeInvoice.companyId,
          itemBreakdown
        };
      });
    },

    // Save active invoice directly to MongoDB Atlas + Pinia state
    async saveActiveInvoice() {
      const invoiceData = {
        invoiceNumber: this.activeInvoice.invoiceNumber,
        type: this.activeInvoice.type,
        date: this.activeInvoice.date,
        dueDate: this.activeInvoice.dueDate,
        customerName: this.activeInvoice.customerName || 'Walk-in Customer',
        customerContact: this.activeInvoice.customerContact || '',
        customerAddress: this.activeInvoice.customerAddress || '',
        companyId: this.activeInvoice.companyId,
        companyName: this.activeInvoice.companyName,
        items: JSON.parse(JSON.stringify(this.activeInvoice.items)),
        subtotal: this.grossTotal,
        discountTotal: this.discountTotal,
        taxPercent: this.activeInvoice.taxPercent,
        taxAmount: this.taxAmount,
        grandTotal: this.grandTotal,
        notes: this.activeInvoice.notes,
        terms: this.activeInvoice.terms,
        status: this.activeInvoice.status || 'pending',
        createdAt: this.activeInvoice.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const existingIdx = this.invoices.findIndex(
        i => (this.activeInvoice._id && i._id === this.activeInvoice._id) || (this.activeInvoice.id && i.id === this.activeInvoice.id) || i.invoiceNumber === invoiceData.invoiceNumber
      );

      if (existingIdx >= 0) {
        this.invoices[existingIdx] = { ...this.invoices[existingIdx], ...invoiceData };
      } else {
        const tempId = Date.now().toString();
        this.invoices.unshift({ ...invoiceData, _id: tempId, id: tempId });
        this.activeInvoice.id = tempId;
      }

      try {
        const saved = await api.saveInvoice({
          ...invoiceData,
          _id: this.activeInvoice._id
        });
        if (saved && saved._id) {
          const idx = this.invoices.findIndex(i => i.invoiceNumber === invoiceData.invoiceNumber);
          if (idx >= 0) this.invoices[idx] = saved;
          this.activeInvoice._id = saved._id;
        }
      } catch (err) {
        console.warn('MongoDB invoice sync error:', err.message);
      }

      return this.activeInvoice.id || this.activeInvoice._id;
    },

    // Load existing invoice into active draft
    async loadInvoice(id) {
      let inv = this.invoices.find(i => i._id === id || i.id === id || Number(i.id) === Number(id));
      if (!inv) {
        await this.fetchInvoices();
        inv = this.invoices.find(i => i._id === id || i.id === id || Number(i.id) === Number(id));
      }
      if (inv) {
        this.activeInvoice = JSON.parse(JSON.stringify(inv));
      }
    },

    // Delete invoice
    async deleteInvoice(id) {
      const inv = this.invoices.find(i => i._id === id || i.id === id);
      this.invoices = this.invoices.filter(i => i._id !== id && i.id !== id);

      const dbId = inv?._id || id;
      try {
        await api.deleteInvoice(dbId);
      } catch (err) {
        console.warn('MongoDB invoice delete error:', err.message);
      }
    }
  }
});
