import { defineStore } from 'pinia';
import { db, seedInitialData } from '@/db/database';

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    categories: [],
    companies: [],
    products: [],
    companyPrices: [],
    customers: [],
    isLoading: false,
    searchQuery: '',
    selectedCategoryFilter: 'all',
    selectedCompanyFilter: 'all'
  }),

  getters: {
    getCategoryById: (state) => (id) => {
      return state.categories.find(c => c.id === Number(id));
    },
    getCompanyById: (state) => (id) => {
      return state.companies.find(c => c.id === Number(id));
    },
    // Returns price object for a common code and company
    getPrice: (state) => (commonCode, companyId) => {
      const match = state.companyPrices.find(
        p => p.commonCode === commonCode && Number(p.companyId) === Number(companyId)
      );
      return match ? match.price : null;
    },
    // Get all prices for a given common code across all companies
    getPricesForCode: (state) => (commonCode) => {
      const priceMap = {};
      state.companies.forEach(company => {
        const item = state.companyPrices.find(
          p => p.commonCode === commonCode && Number(p.companyId) === Number(company.id)
        );
        priceMap[company.id] = item ? item.price : null;
      });
      return priceMap;
    },
    // Filtered products list for product catalog view
    filteredProducts: (state) => {
      return state.products.filter(p => {
        const matchesCategory = state.selectedCategoryFilter === 'all' || 
          Number(p.categoryId) === Number(state.selectedCategoryFilter);

        const q = state.searchQuery.toLowerCase().trim();
        const matchesQuery = !q || 
          p.name.toLowerCase().includes(q) || 
          p.commonCode.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q));

        return matchesCategory && matchesQuery;
      });
    },
    // Total catalog metrics
    metrics: (state) => {
      const sanitaryCount = state.products.filter(p => {
        const cat = state.categories.find(c => c.id === p.categoryId);
        return cat?.name.toLowerCase() === 'sanitary';
      }).length;

      const electricalCount = state.products.filter(p => {
        const cat = state.categories.find(c => c.id === p.categoryId);
        return cat?.name.toLowerCase() === 'electrical';
      }).length;

      const hardwareCount = state.products.filter(p => {
        const cat = state.categories.find(c => c.id === p.categoryId);
        return cat?.name.toLowerCase() === 'hardware';
      }).length;

      return {
        totalProducts: state.products.length,
        totalCompanies: state.companies.length,
        totalCategories: state.categories.length,
        sanitaryCount,
        electricalCount,
        hardwareCount
      };
    }
  },

  actions: {
    async init() {
      this.isLoading = true;
      try {
        await seedInitialData();
        await this.fetchAll();
      } catch (err) {
        console.error('Failed to initialize database:', err);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAll() {
      const [categories, companies, products, companyPrices, customers] = await Promise.all([
        db.categories.toArray(),
        db.companies.toArray(),
        db.products.toArray(),
        db.companyPrices.toArray(),
        db.customers.toArray()
      ]);

      this.categories = categories;
      this.companies = companies;
      this.products = products;
      this.companyPrices = companyPrices;
      this.customers = customers;
    },

    // Fast multi-criteria search (PDF Section 10)
    searchProducts(query, categoryId = null, companyId = null) {
      const q = (query || '').toLowerCase().trim();
      return this.products.filter(prod => {
        if (categoryId && categoryId !== 'all' && Number(prod.categoryId) !== Number(categoryId)) {
          return false;
        }

        const matchesText = !q || 
          prod.name.toLowerCase().includes(q) || 
          prod.commonCode.toLowerCase().includes(q) ||
          (prod.description && prod.description.toLowerCase().includes(q));

        if (!matchesText) return false;

        // If specific company selected, product must have price defined or we still display with indicator
        return true;
      }).map(prod => {
        // Attach company prices for rich selection preview
        const prices = this.getPricesForCode(prod.commonCode);
        const category = this.getCategoryById(prod.categoryId);
        const currentCompanyPrice = companyId ? prices[companyId] : null;

        return {
          ...prod,
          categoryName: category?.name || 'General',
          prices,
          currentCompanyPrice,
          isAvailableInSelectedCompany: currentCompanyPrice !== null && currentCompanyPrice > 0
        };
      });
    },

    // Add or edit product
    async saveProduct(productData, pricesByCompany = {}) {
      let productId = productData.id;
      if (productId) {
        await db.products.update(productId, productData);
      } else {
        productId = await db.products.add(productData);
      }

      // Update company prices
      for (const [compIdStr, priceVal] of Object.entries(pricesByCompany)) {
        const companyId = Number(compIdStr);
        const existing = await db.companyPrices
          .where({ commonCode: productData.commonCode, companyId })
          .first();

        if (priceVal !== null && priceVal !== undefined && priceVal !== '') {
          if (existing) {
            await db.companyPrices.update(existing.id, {
              price: Number(priceVal),
              isAvailable: true
            });
          } else {
            await db.companyPrices.add({
              commonCode: productData.commonCode,
              companyId,
              price: Number(priceVal),
              isAvailable: true
            });
          }
        } else if (existing) {
          await db.companyPrices.delete(existing.id);
        }
      }

      await this.fetchAll();
      return productId;
    },

    async deleteProduct(id) {
      const product = await db.products.get(id);
      if (product) {
        await db.companyPrices.where({ commonCode: product.commonCode }).delete();
        await db.products.delete(id);
        await this.fetchAll();
      }
    },

    // Companies management
    async saveCompany(companyData) {
      if (companyData.id) {
        await db.companies.update(companyData.id, companyData);
      } else {
        await db.companies.add(companyData);
      }
      await this.fetchAll();
    },

    async deleteCompany(id) {
      await db.companyPrices.where({ companyId: id }).delete();
      await db.companies.delete(id);
      await this.fetchAll();
    },

    // Categories management
    async saveCategory(categoryData) {
      if (categoryData.id) {
        await db.categories.update(categoryData.id, categoryData);
      } else {
        await db.categories.add(categoryData);
      }
      await this.fetchAll();
    },

    // Customers management
    async saveCustomer(customerData) {
      if (customerData.id) {
        await db.customers.update(customerData.id, customerData);
      } else {
        await db.customers.add(customerData);
      }
      await this.fetchAll();
    },

    // Reset database to initial PDF defaults
    async resetToDefaults() {
      await db.delete();
      await db.open();
      await seedInitialData();
      await this.fetchAll();
    },

    // Export database snapshot to JSON
    async exportBackup() {
      const data = {
        categories: await db.categories.toArray(),
        companies: await db.companies.toArray(),
        products: await db.products.toArray(),
        companyPrices: await db.companyPrices.toArray(),
        invoices: await db.invoices.toArray(),
        customers: await db.customers.toArray(),
        exportedAt: new Date().toISOString(),
        version: '1.0'
      };
      return JSON.stringify(data, null, 2);
    },

    // Import database from JSON
    async importBackup(jsonString) {
      const data = JSON.parse(jsonString);
      await db.transaction('rw', [db.categories, db.companies, db.products, db.companyPrices, db.invoices, db.customers], async () => {
        if (data.categories) {
          await db.categories.clear();
          await db.categories.bulkAdd(data.categories);
        }
        if (data.companies) {
          await db.companies.clear();
          await db.companies.bulkAdd(data.companies);
        }
        if (data.products) {
          await db.products.clear();
          await db.products.bulkAdd(data.products);
        }
        if (data.companyPrices) {
          await db.companyPrices.clear();
          await db.companyPrices.bulkAdd(data.companyPrices);
        }
        if (data.invoices) {
          await db.invoices.clear();
          await db.invoices.bulkAdd(data.invoices);
        }
        if (data.customers) {
          await db.customers.clear();
          await db.customers.bulkAdd(data.customers);
        }
      });
      await this.fetchAll();
    }
  }
});
