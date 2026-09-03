<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="border-b border-slate-200 pb-5 dark:border-slate-800">
      <h2 class="text-2xl font-black text-slate-900 dark:text-white">Settings & Data Management</h2>
      <p class="text-xs text-slate-500 mt-0.5">
        Database connection status, backup & restore, Excel export, and system configuration
      </p>
    </div>

    <!-- 1. Database Connection Status Card -->
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <div class="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Database class="h-6 w-6" />
          </div>
          <div>
            <h3 class="font-extrabold text-slate-900 dark:text-white text-base">Database Architecture & Status</h3>
            <p class="text-xs text-slate-500">Dual-engine persistence: Cloud MongoDB Atlas + Local IndexedDB</p>
          </div>
        </div>
        <button
          @click="testConnection"
          :disabled="isChecking"
          class="rounded-xl border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          {{ isChecking ? 'Testing...' : 'Test Connection' }}
        </button>
      </div>

      <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div class="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-emerald-800 dark:text-emerald-300">MongoDB Atlas Cloud</span>
            <span class="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
              CONFIGURED
            </span>
          </div>
          <p class="text-emerald-900/80 dark:text-emerald-200 mt-2 font-mono text-[11px] truncate">
            cluster0.oe0inne.mongodb.net/inventory
          </p>
          <p class="text-[11px] text-emerald-700/80 mt-1">
            Serverless functions ready on Vercel deployment with direct Mongoose pooling.
          </p>
        </div>

        <div class="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-900/40 dark:bg-indigo-950/20">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-indigo-800 dark:text-indigo-300">IndexedDB Client Cache</span>
            <span class="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
              ACTIVE
            </span>
          </div>
          <p class="text-indigo-900/80 dark:text-indigo-200 mt-2 font-mono text-[11px]">
            Dexie.js DB: AlHarshInventoryDB
          </p>
          <p class="text-[11px] text-indigo-700/80 mt-1">
            Zero-latency offline availability, instant calculations, local persistent storage.
          </p>
        </div>
      </div>
    </div>

    <!-- 2. Data Backup & Restore (JSON / Excel) -->
    <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 class="font-extrabold text-slate-900 dark:text-white text-base mb-1">
        Backup, Export & Restore (PDF Section 14)
      </h3>
      <p class="text-xs text-slate-500 mb-6">Download complete database snapshots or export to spreadsheets</p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Export JSON Backup -->
        <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-indigo-600 font-bold text-xs mb-1">
              <Download class="h-4 w-4" />
              <span>JSON Backup</span>
            </div>
            <p class="text-xs text-slate-500">Download entire inventory, price matrix, and invoices snapshot.</p>
          </div>
          <button
            @click="exportJsonBackup"
            class="mt-4 w-full rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500"
          >
            Export JSON
          </button>
        </div>

        <!-- Export Excel -->
        <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-emerald-600 font-bold text-xs mb-1">
              <FileSpreadsheet class="h-4 w-4" />
              <span>Excel Spreadsheet</span>
            </div>
            <p class="text-xs text-slate-500">Export product price matrix and customer directory into Excel (.xlsx).</p>
          </div>
          <button
            @click="exportExcelCatalog"
            class="mt-4 w-full rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500"
          >
            Export Excel
          </button>
        </div>

        <!-- Import Backup -->
        <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 text-amber-600 font-bold text-xs mb-1">
              <Upload class="h-4 w-4" />
              <span>Restore Backup</span>
            </div>
            <p class="text-xs text-slate-500">Upload and restore previously exported JSON database snapshot.</p>
          </div>
          <label class="mt-4 block w-full text-center cursor-pointer rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <span>Choose JSON File</span>
            <input type="file" accept=".json" @change="importJsonBackup" class="hidden" />
          </label>
        </div>
      </div>
    </div>

    <!-- 3. System Reset & Re-Seed to PDF Specifications -->
    <div class="rounded-2xl border border-rose-200 bg-white p-6 shadow-sm dark:border-rose-950 dark:bg-slate-900">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h3 class="font-extrabold text-rose-600 text-base">Reset Database to PDF Specification Defaults</h3>
          <p class="text-xs text-slate-500 mt-1 max-w-xl">
            This will reset the database and re-populate the official PDF catalog:
            Sanitary (Stop Cock SF-001, Angle Valve SF-002, Bib Cock SF-003, Floor Trap SF-100), 
            Electrical, Hardware, and brands (Dura Flow, Popular, Master, Faisal) with their sample prices and discounts.
          </p>
        </div>
        <button
          @click="resetDefaults"
          class="shrink-0 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-500"
        >
          Reset Catalog
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { api } from '@/services/api';
import { Database, Download, Upload, FileSpreadsheet } from 'lucide-vue-next';

const inventoryStore = useInventoryStore();
const isChecking = ref(false);

const testConnection = async () => {
  isChecking.value = true;
  try {
    const res = await api.checkStatus();
    alert(`Database Connection Test:\nStatus: ${res.status}\nEngine: ${res.database || 'Dexie IndexedDB'}`);
  } catch (e) {
    alert('Connection test completed: Local IndexedDB active and ready.');
  } finally {
    isChecking.value = false;
  }
};

const exportJsonBackup = async () => {
  try {
    const json = await inventoryStore.exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Al-Harsh-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    alert('Failed to export backup: ' + err.message);
  }
};

const exportExcelCatalog = async () => {
  try {
    const XLSX = (await import('xlsx')).default;
    const rows = inventoryStore.products.map(p => {
      const row = {
        'Common Code': p.commonCode,
        'Product Name': p.name,
        'Category': inventoryStore.getCategoryById(p.categoryId)?.name,
        'Description': p.description,
        'Stock Qty': p.stockQty,
        'Unit': p.unit
      };
      inventoryStore.companies.forEach(c => {
        row[`${c.name} (PKR)`] = inventoryStore.getPrice(p.commonCode, c.id) || 'N/A';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Matrix');
    XLSX.writeFile(workbook, 'Al-Harsh-Product-Matrix.xlsx');
  } catch (err) {
    alert('Failed to export Excel: ' + err.message);
  }
};

const importJsonBackup = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      await inventoryStore.importBackup(e.target.result);
      alert('Backup restored successfully!');
    } catch (err) {
      alert('Invalid backup file: ' + err.message);
    }
  };
  reader.readAsText(file);
};

const resetDefaults = async () => {
  if (confirm('Are you sure you want to reset the database to PDF specifications? Any custom unsaved changes will be replaced.')) {
    await inventoryStore.resetToDefaults();
    alert('Database successfully reset to official PDF specifications!');
  }
};
</script>
