// Clean database client using local storage sync
// NO hardcoded data: all data is entered manually or saved/retrieved from MongoDB database.

class TableStore {
  constructor(name) {
    this.name = name;
    this.storageKey = `alharsh_db_${name}`;
  }

  _getItems() {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(this.storageKey) : null;
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  _setItems(items) {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(items));
      }
    } catch (e) {
      console.warn(`Error writing to ${this.storageKey}:`, e);
    }
  }

  async toArray() {
    return this._getItems();
  }

  async count() {
    return this._getItems().length;
  }

  async get(id) {
    const items = this._getItems();
    const targetId = Number(id);
    return items.find(i => Number(i.id) === targetId || i.id === id || i._id === id) || null;
  }

  async add(item) {
    const items = this._getItems();
    let maxId = 0;
    for (const i of items) {
      const numericId = Number(i.id);
      if (!isNaN(numericId) && numericId > maxId) {
        maxId = numericId;
      }
    }
    const id = item.id ? Number(item.id) : (maxId + 1);
    const newItem = { ...item, id };
    items.push(newItem);
    this._setItems(items);
    return id;
  }

  async bulkAdd(newItems) {
    const items = this._getItems();
    let maxId = 0;
    for (const i of items) {
      const numericId = Number(i.id);
      if (!isNaN(numericId) && numericId > maxId) {
        maxId = numericId;
      }
    }

    const addedIds = [];
    for (const item of newItems) {
      maxId++;
      const id = item.id ? Number(item.id) : maxId;
      items.push({ ...item, id });
      addedIds.push(id);
    }
    this._setItems(items);
    return addedIds;
  }

  async update(id, changes) {
    const items = this._getItems();
    const targetId = Number(id);
    const idx = items.findIndex(i => Number(i.id) === targetId || i.id === id || i._id === id);
    if (idx >= 0) {
      items[idx] = { ...items[idx], ...changes };
      this._setItems(items);
      return 1;
    }
    return 0;
  }

  async delete(id) {
    let items = this._getItems();
    const targetId = Number(id);
    items = items.filter(i => Number(i.id) !== targetId && i.id !== id && i._id !== id);
    this._setItems(items);
    return 1;
  }

  async clear() {
    this._setItems([]);
    return 1;
  }

  where(criteria) {
    const items = this._getItems();
    const matches = items.filter(item => {
      for (const [key, val] of Object.entries(criteria)) {
        if (typeof val === 'number') {
          if (Number(item[key]) !== val) return false;
        } else if (item[key] !== val) {
          return false;
        }
      }
      return true;
    });

    return {
      first: async () => matches[0] || null,
      toArray: async () => matches,
      delete: async () => {
        const remaining = items.filter(item => !matches.includes(item));
        this._setItems(remaining);
        return matches.length;
      }
    };
  }
}

export const db = {
  categories: new TableStore('categories'),
  companies: new TableStore('companies'),
  products: new TableStore('products'),
  companyPrices: new TableStore('companyPrices'),
  invoices: new TableStore('invoices'),
  customers: new TableStore('customers'),

  async delete() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('alharsh_db_categories');
      localStorage.removeItem('alharsh_db_companies');
      localStorage.removeItem('alharsh_db_products');
      localStorage.removeItem('alharsh_db_companyPrices');
      localStorage.removeItem('alharsh_db_invoices');
      localStorage.removeItem('alharsh_db_customers');
      // Also clear old keys if any existed
      localStorage.removeItem('alharsh_v2_categories');
      localStorage.removeItem('alharsh_v2_companies');
      localStorage.removeItem('alharsh_v2_products');
      localStorage.removeItem('alharsh_v2_companyPrices');
      localStorage.removeItem('alharsh_v2_invoices');
      localStorage.removeItem('alharsh_v2_customers');
    }
  }
};

// No hardcoded seed data: Clean empty initialization
export async function seedInitialData() {
  console.log('Database initialized cleanly without hardcoded records.');
}
