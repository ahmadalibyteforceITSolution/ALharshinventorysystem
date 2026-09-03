<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
      <div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Tax Invoices</h2>
        <p class="text-xs text-slate-500 mt-0.5">Manage, print, and track all customer sales bills</p>
      </div>
      <div class="flex items-center gap-3">
        <button 
          @click="exportToExcel"
          class="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <FileSpreadsheet class="h-4 w-4 text-emerald-600" />
          <span>Export Excel</span>
        </button>
        <router-link
          to="/invoices/create"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-all"
        >
          <Plus class="h-4 w-4" />
          <span>Create New Invoice</span>
        </router-link>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="relative w-full sm:w-80">
        <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by invoice # or customer..."
          class="w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-4 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        />
      </div>

      <div class="flex items-center gap-2 self-end sm:self-center">
        <span class="text-xs text-slate-500 font-medium">Status:</span>
        <select
          v-model="statusFilter"
          class="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        >
          <option value="all">All Invoices</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>
      </div>
    </div>

    <!-- Invoices Table -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300 uppercase tracking-wider">
            <tr>
              <th class="py-3 px-4">Invoice #</th>
              <th class="py-3 px-4">Customer</th>
              <th class="py-3 px-4">Brand</th>
              <th class="py-3 px-4">Date</th>
              <th class="py-3 px-4 text-center">Items</th>
              <th class="py-3 px-4 text-right">Total (Rs.)</th>
              <th class="py-3 px-4 text-center">Status</th>
              <th class="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-if="filteredInvoices.length === 0">
              <td colspan="8" class="py-12 text-center text-slate-400">
                <Receipt class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-2" />
                <p class="font-medium text-slate-600 dark:text-slate-400">No invoices found matching criteria.</p>
              </td>
            </tr>

            <tr
              v-for="inv in filteredInvoices"
              :key="inv.id || inv.invoiceNumber"
              class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="py-3.5 px-4 font-mono font-bold text-indigo-600">
                {{ inv.invoiceNumber }}
              </td>
              <td class="py-3.5 px-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ inv.customerName }}</div>
                <div class="text-[11px] text-slate-400">{{ inv.customerContact || 'No contact' }}</div>
              </td>
              <td class="py-3.5 px-4">
                <span class="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {{ inv.companyName }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                {{ inv.date }}
              </td>
              <td class="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                {{ inv.items?.length || 0 }}
              </td>
              <td class="py-3.5 px-4 text-right font-mono font-black text-slate-900 dark:text-white text-sm">
                Rs. {{ Number(inv.grandTotal).toLocaleString() }}
              </td>
              <td class="py-3.5 px-4 text-center">
                <span
                  :class="[
                    'rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider',
                    inv.status === 'paid' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  ]"
                >
                  {{ inv.status }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    @click="previewInvoice(inv)"
                    title="Print / View PDF"
                    class="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800"
                  >
                    <Printer class="h-4 w-4" />
                  </button>
                  <router-link
                    :to="`/invoices/edit/${inv.id}`"
                    title="Edit Bill"
                    class="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800"
                  >
                    <Edit3 class="h-4 w-4" />
                  </router-link>
                  <button
                    @click="deleteInvoice(inv.id)"
                    title="Delete"
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

    <!-- Print Modal -->
    <InvoicePrintModal
      v-if="selectedInvoiceForPrint"
      :is-open="isPrintModalOpen"
      :invoice="selectedInvoiceForPrint"
      @close="isPrintModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useInvoiceStore } from '@/stores/invoiceStore';
import InvoicePrintModal from '@/components/invoice/InvoicePrintModal.vue';
import { Plus, Search, Printer, Edit3, Trash2, Receipt, FileSpreadsheet } from 'lucide-vue-next';

const invoiceStore = useInvoiceStore();
const searchQuery = ref('');
const statusFilter = ref('all');

const isPrintModalOpen = ref(false);
const selectedInvoiceForPrint = ref(null);

const filteredInvoices = computed(() => {
  return invoiceStore.finalInvoices.filter(inv => {
    const matchesStatus = statusFilter.value === 'all' || inv.status === statusFilter.value;
    const q = searchQuery.value.toLowerCase().trim();
    const matchesQuery = !q || 
      inv.invoiceNumber.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.companyName.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });
});

const previewInvoice = (inv) => {
  selectedInvoiceForPrint.value = inv;
  isPrintModalOpen.value = true;
};

const deleteInvoice = async (id) => {
  if (confirm('Are you sure you want to delete this invoice?')) {
    await invoiceStore.deleteInvoice(id);
  }
};

const exportToExcel = async () => {
  try {
    const XLSX = (await import('xlsx')).default;
    const rows = filteredInvoices.value.map(inv => ({
      'Invoice #': inv.invoiceNumber,
      'Date': inv.date,
      'Customer': inv.customerName,
      'Phone': inv.customerContact,
      'Brand': inv.companyName,
      'Subtotal (PKR)': inv.subtotal,
      'Discount (PKR)': inv.discountTotal,
      'Grand Total (PKR)': inv.grandTotal,
      'Status': inv.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');
    XLSX.writeFile(workbook, 'Al-Harsh-Invoices.xlsx');
  } catch (err) {
    console.error('Failed to export Excel:', err);
  }
};
</script>
