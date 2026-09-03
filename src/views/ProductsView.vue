<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
      <div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Product Master & Price Matrix</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Manage common codes, descriptions, and company-wise prices across Dura Flow, Popular, and Master
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2.5">
        <!-- Download Sample Template -->
        <button
          @click="downloadTemplate"
          class="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          title="Download Sample Excel Template"
        >
          <Download class="h-3.5 w-3.5 text-slate-500" />
          <span>Template</span>
        </button>

        <!-- Import Excel -->
        <label class="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 shadow-sm hover:bg-emerald-100 cursor-pointer dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-300 transition-colors">
          <Upload class="h-3.5 w-3.5" />
          <span>Import Excel</span>
          <input type="file" accept=".xlsx, .xls, .csv" @change="handleImportExcel" class="hidden" />
        </label>

        <!-- Export Excel -->
        <button
          @click="exportProductsExcel"
          class="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 transition-colors"
        >
          <FileSpreadsheet class="h-3.5 w-3.5 text-emerald-600" />
          <span>Export Excel</span>
        </button>

        <!-- Add New Product -->
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-all"
        >
          <Plus class="h-4 w-4" />
          <span>Add New Product</span>
        </button>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="relative w-full sm:w-80">
        <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="inventoryStore.searchQuery"
          type="text"
          placeholder="Search by code (SF-001) or name..."
          class="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <!-- Category Filter Pills -->
      <div class="flex flex-wrap items-center gap-2 self-start sm:self-center">
        <button
          @click="inventoryStore.selectedCategoryFilter = 'all'"
          :class="[
            'rounded-xl px-3 py-1.5 text-xs font-bold transition-all',
            inventoryStore.selectedCategoryFilter === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          ]"
        >
          All Categories
        </button>
        <button
          v-for="cat in inventoryStore.categories"
          :key="cat.id"
          @click="inventoryStore.selectedCategoryFilter = cat.id"
          :class="[
            'rounded-xl px-3 py-1.5 text-xs font-bold transition-all',
            inventoryStore.selectedCategoryFilter === cat.id
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          ]"
        >
          {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Multi-Company Price Matrix Table (PDF Page 2 & 7) -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300 uppercase tracking-wider">
            <tr>
              <th class="py-3 px-4 w-28">Common Code</th>
              <th class="py-3 px-4 min-w-[200px]">Product Name & Description</th>
              <th class="py-3 px-4">Category</th>
              <!-- Dynamically render each company's column -->
              <th
                v-for="company in inventoryStore.companies"
                :key="company.id"
                class="py-3 px-4 text-right"
              >
                {{ company.name }} (Rs.)
              </th>
              <th class="py-3 px-4 text-center">Stock</th>
              <th class="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-if="inventoryStore.filteredProducts.length === 0">
              <td :colspan="5 + inventoryStore.companies.length" class="py-12 text-center text-slate-400">
                <Package class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-2" />
                <p class="font-medium text-slate-600 dark:text-slate-400">No products found.</p>
              </td>
            </tr>

            <tr
              v-for="prod in inventoryStore.filteredProducts"
              :key="prod.id"
              class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
            >
              <!-- Common Code -->
              <td class="py-3.5 px-4 font-mono font-black text-indigo-600">
                {{ prod.commonCode }}
              </td>

              <!-- Name & Desc -->
              <td class="py-3.5 px-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ prod.name }}</div>
                <div class="text-[11px] text-slate-400 line-clamp-1">{{ prod.description }}</div>
              </td>

              <!-- Category -->
              <td class="py-3.5 px-4">
                <span class="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {{ inventoryStore.getCategoryById(prod.categoryId)?.name || 'General' }}
                </span>
              </td>

              <!-- Company Prices Matrix (PDF Section 3 & 12) -->
              <td
                v-for="company in inventoryStore.companies"
                :key="company._id || company.id"
                class="py-3.5 px-4 text-right font-mono font-bold"
              >
                <span 
                  v-if="inventoryStore.getPrice(prod.commonCode, company._id || company.id)"
                  class="text-slate-900 dark:text-white"
                >
                  {{ Number(inventoryStore.getPrice(prod.commonCode, company._id || company.id)).toLocaleString() }}
                </span>
                <span 
                  v-else 
                  class="text-rose-400 text-[11px] font-medium italic"
                  title="Product not available for this company"
                >
                  N/A
                </span>
              </td>

              <!-- Stock Quantity -->
              <td class="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                {{ prod.stockQty || 0 }} {{ prod.unit || 'pcs' }}
              </td>

              <!-- Actions -->
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    @click="editProduct(prod)"
                    title="Edit Prices"
                    class="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800"
                  >
                    <Edit3 class="h-4 w-4" />
                  </button>
                  <button
                    @click="deleteProduct(prod.id)"
                    title="Delete Product"
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Product Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div class="my-8 flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ editForm.id ? 'Edit Product & Multi-Brand Prices' : 'Add New Product' }}
          </h3>
          <button @click="isModalOpen = false" class="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="p-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Common Product Code (Unique) *
              </label>
              <input
                v-model="editForm.commonCode"
                required
                placeholder="e.g. SF-001, SF-100, EL-005"
                class="w-full font-mono font-bold uppercase rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <p class="text-[10px] text-slate-400 mt-1">This code links identical items across brands.</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                v-model="editForm.categoryId"
                required
                class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option v-for="cat in inventoryStore.categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Product Generic Name *
            </label>
            <input
              v-model="editForm.name"
              required
              placeholder="e.g. Stop Cock, Floor Trap, Angle Valve"
              class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description / Specifications
            </label>
            <input
              v-model="editForm.description"
              placeholder="e.g. Heavy duty brass core stop cock valve 1/2 inch"
              class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Unit
              </label>
              <input
                v-model="editForm.unit"
                placeholder="pcs, set, coil, box"
                class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Inventory Stock Qty
              </label>
              <input
                v-model.number="editForm.stockQty"
                type="number"
                min="0"
                class="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <!-- Multi-Company Price Inputs (PDF Section 3 & 11) -->
          <div class="rounded-xl border border-indigo-100 bg-indigo-50/40 p-4 dark:border-indigo-900/50 dark:bg-indigo-950/20">
            <h4 class="text-xs font-extrabold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider mb-2">
              Company-Wise Pricing Matrix (Rs.)
            </h4>
            <p class="text-[11px] text-slate-500 mb-3">Leave empty if a company doesn't offer this product.</p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                v-for="company in inventoryStore.companies" 
                :key="company._id || company.id"
                class="flex items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-slate-200 dark:bg-slate-800 dark:border-slate-700"
              >
                <span class="font-bold text-xs text-slate-800 dark:text-slate-200">{{ company.name }}:</span>
                <div class="flex items-center gap-1 w-32">
                  <span class="text-xs text-slate-400">Rs.</span>
                  <input
                    v-model.number="editPrices[company._id || company.id]"
                    type="number"
                    min="0"
                    placeholder="None"
                    class="w-full rounded border border-slate-300 py-1 px-2 text-xs text-right font-mono font-bold dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              @click="isModalOpen = false"
              class="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500"
            >
              Save Product & Prices
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { Plus, Search, Edit3, Trash2, Package, X, Download, Upload, FileSpreadsheet } from 'lucide-vue-next';

const inventoryStore = useInventoryStore();

const isModalOpen = ref(false);
const editForm = reactive({
  id: null,
  _id: null,
  commonCode: '',
  name: '',
  categoryId: '',
  description: '',
  unit: 'pcs',
  stockQty: 100
});

const editPrices = reactive({});

const openAddModal = () => {
  editForm.id = null;
  editForm._id = null;
  editForm.commonCode = '';
  editForm.name = '';
  editForm.categoryId = (inventoryStore.categories[0]?._id || inventoryStore.categories[0]?.id) || '';
  editForm.description = '';
  editForm.unit = 'pcs';
  editForm.stockQty = 100;

  inventoryStore.companies.forEach(c => {
    editPrices[c._id || c.id] = '';
  });
  isModalOpen.value = true;
};

const editProduct = (product) => {
  editForm.id = product.id;
  editForm._id = product._id;
  editForm.commonCode = product.commonCode;
  editForm.name = product.name;
  editForm.categoryId = product.categoryId;
  editForm.description = product.description;
  editForm.unit = product.unit || 'pcs';
  editForm.stockQty = product.stockQty || 0;

  inventoryStore.companies.forEach(c => {
    const p = inventoryStore.getPrice(product.commonCode, c._id || c.id);
    editPrices[c._id || c.id] = p !== null ? p : '';
  });
  isModalOpen.value = true;
};

const saveProduct = async () => {
  await inventoryStore.saveProduct({ ...editForm }, editPrices);
  isModalOpen.value = false;
};

const deleteProduct = async (id) => {
  if (confirm('Delete this product and its multi-brand price entries?')) {
    await inventoryStore.deleteProduct(id);
  }
};

// EXPORT TO EXCEL
const exportProductsExcel = async () => {
  try {
    const xlsxModule = await import('xlsx');
    const XLSX = xlsxModule.default?.utils ? xlsxModule.default : (xlsxModule.utils ? xlsxModule : (xlsxModule.default || xlsxModule));
    const rows = inventoryStore.products.map(p => {
      const row = {
        'Common Code': p.commonCode,
        'Product Name': p.name,
        'Category': inventoryStore.getCategoryById(p.categoryId)?.name || 'General',
        'Description': p.description || '',
        'Unit': p.unit || 'pcs',
        'Stock Qty': p.stockQty || 0
      };
      inventoryStore.companies.forEach(c => {
        const price = inventoryStore.getPrice(p.commonCode, c._id || c.id);
        row[`${c.name} Price`] = price !== null ? price : '';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');
    XLSX.writeFile(workbook, 'Al-Harsh-Products.xlsx');
  } catch (err) {
    alert('Failed to export products: ' + err.message);
  }
};

// DOWNLOAD TEMPLATE FOR IMPORT
const downloadTemplate = async () => {
  try {
    const xlsxModule = await import('xlsx');
    const XLSX = xlsxModule.default?.utils ? xlsxModule.default : (xlsxModule.utils ? xlsxModule : (xlsxModule.default || xlsxModule));
    const sampleRow = {
      'Common Code': 'SF-001',
      'Product Name': 'Stop Cock',
      'Category': 'Sanitary',
      'Description': 'Heavy duty brass core stop cock valve 1/2 inch',
      'Unit': 'pcs',
      'Stock Qty': 100
    };
    inventoryStore.companies.forEach(c => {
      sampleRow[`${c.name} Price`] = 2500;
    });
    const worksheet = XLSX.utils.json_to_sheet([sampleRow]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Import_Template');
    XLSX.writeFile(workbook, 'Product-Import-Template.xlsx');
  } catch (err) {
    alert('Failed to download template: ' + err.message);
  }
};

// IMPORT FROM EXCEL
const handleImportExcel = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const xlsxModule = await import('xlsx');
    const XLSX = xlsxModule.default?.utils ? xlsxModule.default : (xlsxModule.utils ? xlsxModule : (xlsxModule.default || xlsxModule));
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet);

        if (!rows || rows.length === 0) {
          alert('The uploaded file is empty.');
          return;
        }

        let importedCount = 0;
        for (const row of rows) {
          const commonCode = row['Common Code'] || row['Code'] || row['commonCode'];
          const name = row['Product Name'] || row['Name'] || row['name'];
          if (!commonCode || !name) continue;

          const catName = row['Category'] || row['category'];
          let category = inventoryStore.categories.find(c => c.name.toLowerCase() === (catName || '').toLowerCase());
          if (!category && catName) {
            await inventoryStore.saveCategory({ name: catName, slug: catName.toLowerCase().replace(/\s+/g, '-') });
            category = inventoryStore.categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
          }

          const prices = {};
          inventoryStore.companies.forEach(c => {
            const pVal = row[`${c.name} Price`] || row[c.name] || row[`${c.name} (PKR)`] || row[`${c.name} (Rs.)`];
            if (pVal !== undefined && pVal !== null && pVal !== '') {
              prices[c._id || c.id] = Number(pVal);
            }
          });

          await inventoryStore.saveProduct({
            commonCode: String(commonCode).trim(),
            name: String(name).trim(),
            categoryId: category?._id || category?.id || '',
            description: row['Description'] || '',
            unit: row['Unit'] || 'pcs',
            stockQty: Number(row['Stock Qty'] || row['Stock'] || 0)
          }, prices);
          importedCount++;
        }

        alert(`Successfully imported ${importedCount} product(s) into database!`);
        event.target.value = '';
      } catch (innerErr) {
        alert('Error parsing Excel: ' + innerErr.message);
      }
    };
    reader.readAsArrayBuffer(file);
  } catch (err) {
    alert('Import failed: ' + err.message);
  }
};
</script>
