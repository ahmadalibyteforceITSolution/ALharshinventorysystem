import { defineStore } from 'pinia';
import { api } from '@/services/api';

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
      return state.categories.find(c => c.id === Number(id) || c._id === id || c.id === id);
    },
    getCompanyById: (state) => (id) => {
      return state.companies.find(c => c.id === Number(id) || c._id === id || c.id === id);
    },
    getPrice: (state) => (commonCode, companyId) => {
      const match = state.companyPrices.find(
        p => p.commonCode === commonCode && (Number(p.companyId) === Number(companyId) || p.companyId === companyId)
      );
      if (match) return match.price;

      const prod = state.products.find(p => p.commonCode === commonCode);
      if (prod && prod.prices && prod.prices[companyId]) {
        return prod.prices[companyId];
      }
      return null;
    },
    getPricesForCode: (state) => (commonCode) => {
      const priceMap = {};
      const prod = state.products.find(p => p.commonCode === commonCode);

      state.companies.forEach(company => {
        const item = state.companyPrices.find(
          p => p.commonCode === commonCode && (Number(p.companyId) === Number(company.id) || p.companyId === company._id)
        );
        if (item) {
          priceMap[company.id || company._id] = item.price;
        } else if (prod && prod.prices && (prod.prices[company.id] || prod.prices[company._id])) {
          priceMap[company.id || company._id] = prod.prices[company.id] || prod.prices[company._id];
        } else {
          priceMap[company.id || company._id] = null;
        }
      });
      return priceMap;
    },
    filteredProducts: (state) => {
      return state.products.filter(p => {
        const matchesCategory = state.selectedCategoryFilter === 'all' || 
          Number(p.categoryId) === Number(state.selectedCategoryFilter) ||
          p.categoryId === state.selectedCategoryFilter;

        const q = state.searchQuery.toLowerCase().trim();
        const matchesQuery = !q || 
          p.name.toLowerCase().includes(q) || 
          p.commonCode.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q));

        return matchesCategory && matchesQuery;
      });
    },
    metrics: (state) => {
      const sanitaryCount = state.products.filter(p => {
        const cat = state.categories.find(c => c.id === p.categoryId || c._id === p.categoryId);
        return cat?.name?.toLowerCase() === 'sanitary';
      }).length;

      const electricalCount = state.products.filter(p => {
        const cat = state.categories.find(c => c.id === p.categoryId || c._id === p.categoryId);
        return cat?.name?.toLowerCase() === 'electrical';
      }).length;

      const hardwareCount = state.products.filter(p => {
        const cat = state.categories.find(c => c.id === p.categoryId || c._id === p.categoryId);
        return cat?.name?.toLowerCase() === 'hardware';
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
        await this.fetchAll();
      } catch (err) {
        console.error('Failed to initialize store:', err);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchAll() {
      // Fetch exclusively from MongoDB Atlas database API
      const [remoteCats, remoteComps, remoteProds, remoteCusts] = await Promise.all([
        api.getCategories(),
        api.getCompanies(),
        api.getProducts(),
        api.getCustomers()
      ]);

      if (remoteCats) this.categories = remoteCats;
      if (remoteComps) this.companies = remoteComps;
      if (remoteCusts) this.customers = remoteCusts;

      if (remoteProds) {
        this.products = remoteProds;
        const prices = [];
        remoteProds.forEach(prod => {
          if (prod.prices) {
            Object.entries(prod.prices).forEach(([cId, priceVal]) => {
              prices.push({
                commonCode: prod.commonCode,
                companyId: cId,
                price: Number(priceVal),
                isAvailable: true
              });
            });
          }
        });
        this.companyPrices = prices;
      }
    },

    searchProducts(query, categoryId = null, companyId = null) {
      const q = (query || '').toLowerCase().trim();
      return this.products.filter(prod => {
        if (categoryId && categoryId !== 'all') {
          if (Number(prod.categoryId) !== Number(categoryId) && prod.categoryId !== categoryId) {
            return false;
          }
        }

        const matchesText = !q || 
          prod.name.toLowerCase().includes(q) || 
          prod.commonCode.toLowerCase().includes(q) ||
          (prod.description && prod.description.toLowerCase().includes(q));

        if (!matchesText) return false;
        return true;
      }).map(prod => {
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

    // 1. PRODUCTS: ADD / EDIT / DELETE (Pinia state + MongoDB Atlas)
    async saveProduct(productData, pricesByCompany = {}) {
      const payload = {
        ...productData,
        prices: pricesByCompany
      };

      // Optimistic update in Pinia store
      const existingIdx = this.products.findIndex(
        p => (productData._id && p._id === productData._id) || (productData.id && p.id === productData.id) || p.commonCode === productData.commonCode
      );

      if (existingIdx >= 0) {
        this.products[existingIdx] = { ...this.products[existingIdx], ...payload };
      } else {
        const tempId = Date.now().toString();
        this.products.push({ ...payload, _id: tempId, id: tempId });
      }

      // Update companyPrices in Pinia
      this.companyPrices = this.companyPrices.filter(cp => cp.commonCode !== productData.commonCode);
      for (const [cId, priceVal] of Object.entries(pricesByCompany)) {
        if (priceVal !== null && priceVal !== undefined && priceVal !== '') {
          this.companyPrices.push({
            commonCode: productData.commonCode,
            companyId: cId,
            price: Number(priceVal),
            isAvailable: true
          });
        }
      }

      // Save directly to MongoDB Atlas
      try {
        const saved = await api.saveProduct(payload);
        if (saved && saved._id) {
          const idx = this.products.findIndex(p => p.commonCode === payload.commonCode);
          if (idx >= 0) this.products[idx] = saved;
        }
      } catch (err) {
        console.warn('MongoDB sync error:', err.message);
      }
    },

    async deleteProduct(id) {
      const prod = this.products.find(p => p._id === id || p.id === id);
      if (prod) {
        this.companyPrices = this.companyPrices.filter(cp => cp.commonCode !== prod.commonCode);
      }
      this.products = this.products.filter(p => p._id !== id && p.id !== id);

      const dbId = prod?._id || id;
      try {
        await api.deleteProduct(dbId);
      } catch (err) {
        console.warn('MongoDB delete error:', err.message);
      }
    },

    // 2. COMPANIES: ADD / EDIT / DELETE (Pinia state + MongoDB Atlas)
    async saveCompany(companyData) {
      const existingIdx = this.companies.findIndex(
        c => (companyData._id && c._id === companyData._id) || (companyData.id && c.id === companyData.id)
      );

      if (existingIdx >= 0) {
        this.companies[existingIdx] = { ...this.companies[existingIdx], ...companyData };
      } else {
        const tempId = Date.now().toString();
        this.companies.push({ ...companyData, _id: tempId, id: tempId });
      }

      try {
        const saved = await api.saveCompany(companyData);
        if (saved && saved._id) {
          const idx = this.companies.findIndex(c => c.name === companyData.name);
          if (idx >= 0) this.companies[idx] = saved;
        }
      } catch (err) {
        console.warn('MongoDB sync error:', err.message);
      }
    },

    async deleteCompany(id) {
      const comp = this.companies.find(c => c._id === id || c.id === id);
      this.companies = this.companies.filter(c => c._id !== id && c.id !== id);
      this.companyPrices = this.companyPrices.filter(cp => cp.companyId !== id);

      const dbId = comp?._id || id;
      try {
        await api.deleteCompany(dbId);
      } catch (err) {
        console.warn('MongoDB delete error:', err.message);
      }
    },

    // 3. CATEGORIES: ADD / EDIT / DELETE (Pinia state + MongoDB Atlas)
    async saveCategory(categoryData) {
      const existingIdx = this.categories.findIndex(
        c => (categoryData._id && c._id === categoryData._id) || (categoryData.id && c.id === categoryData.id)
      );

      if (existingIdx >= 0) {
        this.categories[existingIdx] = { ...this.categories[existingIdx], ...categoryData };
      } else {
        const tempId = Date.now().toString();
        this.categories.push({ ...categoryData, _id: tempId, id: tempId });
      }

      try {
        const saved = await api.saveCategory(categoryData);
        if (saved && saved._id) {
          const idx = this.categories.findIndex(c => c.name === categoryData.name);
          if (idx >= 0) this.categories[idx] = saved;
        }
      } catch (err) {
        console.warn('MongoDB sync error:', err.message);
      }
    },

    async deleteCategory(id) {
      const cat = this.categories.find(c => c._id === id || c.id === id);
      this.categories = this.categories.filter(c => c._id !== id && c.id !== id);

      const dbId = cat?._id || id;
      try {
        await api.deleteCategory(dbId);
      } catch (err) {
        console.warn('MongoDB delete error:', err.message);
      }
    },

    // 4. CUSTOMERS: ADD / EDIT / DELETE (Pinia state + MongoDB Atlas)
    async saveCustomer(customerData) {
      const existingIdx = this.customers.findIndex(
        c => (customerData._id && c._id === customerData._id) || (customerData.id && c.id === customerData.id)
      );

      if (existingIdx >= 0) {
        this.customers[existingIdx] = { ...this.customers[existingIdx], ...customerData };
      } else {
        const tempId = Date.now().toString();
        this.customers.push({ ...customerData, _id: tempId, id: tempId });
      }

      try {
        const saved = await api.saveCustomer(customerData);
        if (saved && saved._id) {
          const idx = this.customers.findIndex(c => c.name === customerData.name);
          if (idx >= 0) this.customers[idx] = saved;
        }
      } catch (err) {
        console.warn('MongoDB sync error:', err.message);
      }
    },

    async deleteCustomer(id) {
      const cust = this.customers.find(c => c._id === id || c.id === id);
      this.customers = this.customers.filter(c => c._id !== id && c.id !== id);

      const dbId = cust?._id || id;
      try {
        await api.deleteCustomer(dbId);
      } catch (err) {
        console.warn('MongoDB delete error:', err.message);
      }
    },

    // Export Pinia database snapshot to JSON
    async exportBackup() {
      const data = {
        categories: this.categories,
        companies: this.companies,
        products: this.products,
        companyPrices: this.companyPrices,
        customers: this.customers,
        exportedAt: new Date().toISOString(),
        version: '3.0'
      };
      return JSON.stringify(data, null, 2);
    }
  }
});
