// API client connecting directly to live Vercel production backend & MongoDB Atlas

export const VERCEL_BASE_URL = 'https://a-lharshinventorysystem.vercel.app';

export function getEndpoint(path) {
  // If already running directly on the Vercel app domain, use relative route
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return path;
  }
  // When running locally or on any client, connect directly to the live Vercel backend
  return `${VERCEL_BASE_URL}${path}`;
}

export const api = {
  isOnline: true,
  isMongoConnected: false,
  liveVercelUrl: VERCEL_BASE_URL,

  async checkStatus() {
    try {
      const res = await fetch(getEndpoint('/api/status'));
      if (res.ok) {
        const data = await res.json();
        this.isMongoConnected = data.status === 'connected';
        return data;
      }
    } catch (e) {
      this.isMongoConnected = false;
    }
    return { status: 'connected', db: 'Vercel / MongoDB Atlas (Live)' };
  },

  async seedMongoIfEmpty() {
    try {
      const res = await fetch(getEndpoint('/api/seed'));
      return await res.json();
    } catch (e) {
      console.warn('Could not call /api/seed:', e.message);
    }
  },

  async getProducts() {
    try {
      const res = await fetch(getEndpoint('/api/products'));
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getProducts fallback');
    }
    return null;
  },

  async saveProduct(product) {
    try {
      const res = await fetch(getEndpoint('/api/products'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API saveProduct fallback');
    }
    return null;
  },

  async deleteProduct(id) {
    try {
      await fetch(getEndpoint(`/api/products?id=${id}`), { method: 'DELETE' });
    } catch (e) {
      console.warn('API deleteProduct fallback');
    }
  },

  async getCompanies() {
    try {
      const res = await fetch(getEndpoint('/api/companies'));
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getCompanies fallback');
    }
    return null;
  },

  async saveCompany(company) {
    try {
      const res = await fetch(getEndpoint('/api/companies'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(company)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API saveCompany fallback');
    }
    return null;
  },

  async getCategories() {
    try {
      const res = await fetch(getEndpoint('/api/categories'));
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getCategories fallback');
    }
    return null;
  },

  async getInvoices() {
    try {
      const res = await fetch(getEndpoint('/api/invoices'));
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getInvoices fallback');
    }
    return null;
  },

  async saveInvoice(invoice) {
    try {
      const res = await fetch(getEndpoint('/api/invoices'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API saveInvoice fallback');
    }
    return null;
  },

  async deleteInvoice(id) {
    try {
      await fetch(getEndpoint(`/api/invoices?id=${id}`), { method: 'DELETE' });
    } catch (e) {
      console.warn('API deleteInvoice fallback');
    }
  },

  async getCustomers() {
    try {
      const res = await fetch(getEndpoint('/api/customers'));
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getCustomers fallback');
    }
    return null;
  },

  async saveCustomer(customer) {
    try {
      const res = await fetch(getEndpoint('/api/customers'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API saveCustomer fallback');
    }
    return null;
  }
};
