// API client connecting directly to live Vercel production backend & MongoDB Atlas

export const VERCEL_BASE_URL = 'https://a-lharshinventorysystem.vercel.app';

export function getEndpoint(path) {
  if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
    return path;
  }
  return `${VERCEL_BASE_URL}${path}`;
}

export function getAuthHeaders() {
  let userId = 'admin_alharsh';
  try {
    const userJson = localStorage.getItem('alharsh_user');
    if (userJson) {
      const u = JSON.parse(userJson);
      if (u.userId) userId = u.userId;
      else if (u._id) userId = u._id;
    }
  } catch (_) {}

  return {
    'Content-Type': 'application/json',
    'x-user-id': userId
  };
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

  // 0. AUTH & SUBSCRIPTIONS
  async login(email, password) {
    const res = await fetch(getEndpoint('/api/auth?action=login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to log in');
    return data;
  },

  async register(formData) {
    const res = await fetch(getEndpoint('/api/auth?action=register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create account');
    return data;
  },

  async updateSubscription(subscriptionData) {
    const res = await fetch(getEndpoint('/api/auth?action=subscription'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(subscriptionData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update subscription');
    return data;
  },

  async getCurrentUser() {
    try {
      const res = await fetch(getEndpoint('/api/auth?action=me'), {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (_) {}
    return null;
  },

  // 1. PRODUCTS
  async getProducts() {
    try {
      const res = await fetch(getEndpoint('/api/products'), {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getProducts fallback');
    }
    return [];
  },

  async saveProduct(product) {
    try {
      const res = await fetch(getEndpoint('/api/products'), {
        method: 'POST',
        headers: getAuthHeaders(),
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
      await fetch(getEndpoint(`/api/products?id=${id}`), { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {
      console.warn('API deleteProduct fallback');
    }
  },

  // 2. COMPANIES / BRANDS
  async getCompanies() {
    try {
      const res = await fetch(getEndpoint('/api/companies'), {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getCompanies fallback');
    }
    return [];
  },

  async saveCompany(company) {
    const res = await fetch(getEndpoint('/api/companies'), {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(company)
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to save brand');
    }
    return data;
  },

  async deleteCompany(id) {
    try {
      await fetch(getEndpoint(`/api/companies?id=${id}`), { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {
      console.warn('API deleteCompany fallback');
    }
  },

  // 3. CATEGORIES
  async getCategories() {
    try {
      const res = await fetch(getEndpoint('/api/categories'), {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getCategories fallback');
    }
    return [];
  },

  async saveCategory(category) {
    try {
      const res = await fetch(getEndpoint('/api/categories'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(category)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API saveCategory fallback');
    }
    return null;
  },

  async deleteCategory(id) {
    try {
      await fetch(getEndpoint(`/api/categories?id=${id}`), { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {
      console.warn('API deleteCategory fallback');
    }
  },

  // 4. INVOICES
  async getInvoices() {
    try {
      const res = await fetch(getEndpoint('/api/invoices'), {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getInvoices fallback');
    }
    return [];
  },

  async saveInvoice(invoice) {
    try {
      const res = await fetch(getEndpoint('/api/invoices'), {
        method: 'POST',
        headers: getAuthHeaders(),
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
      await fetch(getEndpoint(`/api/invoices?id=${id}`), { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {
      console.warn('API deleteInvoice fallback');
    }
  },

  // 5. CUSTOMERS
  async getCustomers() {
    try {
      const res = await fetch(getEndpoint('/api/customers'), {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API getCustomers fallback');
    }
    return [];
  },

  async saveCustomer(customer) {
    try {
      const res = await fetch(getEndpoint('/api/customers'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(customer)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API saveCustomer fallback');
    }
    return null;
  },

  async deleteCustomer(id) {
    try {
      await fetch(getEndpoint(`/api/customers?id=${id}`), { 
        method: 'DELETE',
        headers: getAuthHeaders()
      });
    } catch (e) {
      console.warn('API deleteCustomer fallback');
    }
  }
};
