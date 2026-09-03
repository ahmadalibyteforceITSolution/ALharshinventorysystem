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
      if (!id) return null;
      return state.categories.find(c => 
        c._id === id || 
        String(c._id) === String(id) || 
        c.id === id || 
        String(c.id) === String(id) ||
        (c.name && c.name.toLowerCase() === String(id).toLowerCase()) ||
        c.slug === id
      );
    },
    getCompanyById: (state) => (id) => {
      if (!id) return null;
      return state.companies.find(c => 
        c._id === id || 
        String(c._id) === String(id) || 
        c.id === id || 
        String(c.id) === String(id) ||
        (c.name && c.name.toLowerCase() === String(id).toLowerCase()) ||
        (c.code && c.code.toLowerCase() === String(id).toLowerCase())
      );
    },
    getPrice: (state) => (commonCode, companyId) => {
      if (!companyId) return null;
      const comp = state.companies.find(c => 
        c._id === companyId || 
        String(c._id) === String(companyId) || 
        c.id === companyId || 
        String(c.id) === String(companyId) ||
        (c.name && c.name.toLowerCase() === String(companyId).toLowerCase())
      );
      const cId = comp?._id || comp?.id || companyId;
      const cAltId = comp?.id;
      const cName = comp?.name;

      const match = state.companyPrices.find(
        p => p.commonCode === commonCode && (
          p.companyId === cId || 
          String(p.companyId) === String(cId) ||
          (cAltId && (p.companyId === cAltId || String(p.companyId) === String(cAltId))) ||
          (cName && p.companyId === cName)
        )
      );
      if (match && match.price !== undefined && match.price !== null) return match.price;

      const prod = state.products.find(p => p.commonCode === commonCode);
      if (prod && prod.prices) {
        if (prod.prices[cId] !== undefined && prod.prices[cId] !== null) return prod.prices[cId];
        if (cAltId && prod.prices[cAltId] !== undefined && prod.prices[cAltId] !== null) return prod.prices[cAltId];
        if (cName && prod.prices[cName] !== undefined && prod.prices[cName] !== null) return prod.prices[cName];
      }
      return null;
    },
    getPricesForCode: (state) => (commonCode) => {
      const priceMap = {};
      const prod = state.products.find(p => p.commonCode === commonCode);

      state.companies.forEach(company => {
        const cKey = company._id || company.id;
        const cAltKey = company.id;
        const cName = company.name;

        const item = state.companyPrices.find(
          p => p.commonCode === commonCode && (
            p.companyId === cKey || 
            String(p.companyId) === String(cKey) ||
            (cAltKey && (p.companyId === cAltKey || String(p.companyId) === String(cAltKey))) ||
            (cName && p.companyId === cName)
          )
        );

        let price = null;
        if (item && item.price !== undefined && item.price !== null) {
          price = item.price;
        } else if (prod && prod.prices) {
          if (prod.prices[cKey] !== undefined && prod.prices[cKey] !== null) price = prod.prices[cKey];
          else if (cAltKey && prod.prices[cAltKey] !== undefined && prod.prices[cAltKey] !== null) price = prod.prices[cAltKey];
          else if (cName && prod.prices[cName] !== undefined && prod.prices[cName] !== null) price = prod.prices[cName];
        }

        if (cKey) priceMap[cKey] = price;
        if (cAltKey) priceMap[cAltKey] = price;
        if (cName) priceMap[cName] = price;
      });
      return priceMap;
    },
    filteredProducts: (state) => {
      return state.products.filter(p => {
        const matchesCategory = state.selectedCategoryFilter === 'all' || 
          p.categoryId === state.selectedCategoryFilter ||
          String(p.categoryId) === String(state.selectedCategoryFilter) ||
          (p.categoryName && p.categoryName.toLowerCase() === String(state.selectedCategoryFilter).toLowerCase());

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
          const cat = this.getCategoryById(categoryId);
          const catMatch = prod.categoryId === categoryId || 
            String(prod.categoryId) === String(categoryId) ||
            (cat && (prod.categoryId === cat._id || prod.categoryId === cat.id)) ||
            (cat && prod.categoryName && prod.categoryName.toLowerCase() === cat.name.toLowerCase());
          if (!catMatch) return false;
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
        const currentCompanyPrice = companyId 
          ? (prices[companyId] !== undefined && prices[companyId] !== null 
              ? prices[companyId] 
              : this.getPrice(prod.commonCode, companyId))
          : null;

        return {
          ...prod,
          categoryName: category?.name || prod.categoryName || 'General',
          prices,
          currentCompanyPrice,
          isAvailableInSelectedCompany: currentCompanyPrice !== null && Number(currentCompanyPrice) > 0
        };
      });
    },

    // 1. PRODUCTS: ADD / EDIT / DELETE (Pinia state + MongoDB Atlas)
    async saveProduct(productData, pricesByCompany = {}) {
      const cat = this.getCategoryById(productData.categoryId);
      const payload = {
        ...productData,
        categoryName: cat?.name || productData.categoryName || 'General',
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
      const codeToDelete = prod ? prod.commonCode : null;
      const dbId = prod?._id || codeToDelete || id;

      // Remove strictly this specific product from state
      this.products = this.products.filter(p => p._id !== id && p.id !== id && (!codeToDelete || p.commonCode !== codeToDelete));

      // Remove strictly this specific product's prices
      if (codeToDelete) {
        this.companyPrices = this.companyPrices.filter(cp => cp.commonCode !== codeToDelete);
      }

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
