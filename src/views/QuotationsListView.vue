<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
      <div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Customer Quotations</h2>
        <p class="text-xs text-slate-500 mt-0.5">Price estimates and quotation sheets with 15-day validity</p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="createQuotation"
          class="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-amber-500 transition-all"
        >
          <Plus class="h-4 w-4" />
          <span>New Quotation</span>
        </button>
      </div>
    </div>

    <!-- Quotations Table -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-slate-200 bg-amber-50/50 text-slate-600 font-bold dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-300 uppercase tracking-wider">
            <tr>
              <th class="py-3 px-4">Quote #</th>
              <th class="py-3 px-4">Customer</th>
              <th class="py-3 px-4">Brand</th>
              <th class="py-3 px-4">Date</th>
              <th class="py-3 px-4 text-center">Items</th>
              <th class="py-3 px-4 text-right">Total (Rs.)</th>
              <th class="py-3 px-4 text-center">Convert</th>
              <th class="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-if="quotations.length === 0">
              <td colspan="8" class="py-12 text-center text-slate-400">
                <FileText class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-2" />
                <p class="font-medium text-slate-600 dark:text-slate-400">No quotations generated yet.</p>
              </td>
            </tr>

            <tr
              v-for="quote in quotations"
              :key="quote.id || quote.invoiceNumber"
              class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="py-3.5 px-4 font-mono font-bold text-amber-700 dark:text-amber-400">
                {{ quote.invoiceNumber }}
              </td>
              <td class="py-3.5 px-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ quote.customerName }}</div>
                <div class="text-[11px] text-slate-400">{{ quote.customerContact || 'No contact' }}</div>
              </td>
              <td class="py-3.5 px-4">
                <span class="rounded-md bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {{ quote.companyName }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                {{ quote.date }}
              </td>
              <td class="py-3.5 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                {{ quote.items?.length || 0 }}
              </td>
              <td class="py-3.5 px-4 text-right font-mono font-black text-slate-900 dark:text-white text-sm">
                Rs. {{ Number(quote.grandTotal).toLocaleString() }}
              </td>
              <td class="py-3.5 px-4 text-center">
                <button
                  @click="convertToInvoice(quote)"
                  class="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300"
                >
                  Turn to Invoice →
                </button>
              </td>
              <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <button
                    @click="previewQuotation(quote)"
                    title="Print / View PDF"
                    class="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-slate-800"
                  >
                    <Printer class="h-4 w-4" />
                  </button>
                  <router-link
                    :to="`/invoices/edit/${quote.id}`"
                    title="Edit Quote"
                    class="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800"
                  >
                    <Edit3 class="h-4 w-4" />
                  </router-link>
                  <button
                    @click="deleteQuote(quote.id)"
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
      v-if="selectedQuoteForPrint"
      :is-open="isPrintModalOpen"
      :invoice="selectedQuoteForPrint"
      @close="isPrintModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useInvoiceStore } from '@/stores/invoiceStore';
import InvoicePrintModal from '@/components/invoice/InvoicePrintModal.vue';
import { Plus, Printer, Edit3, Trash2, FileText } from 'lucide-vue-next';

const router = useRouter();
const invoiceStore = useInvoiceStore();

const isPrintModalOpen = ref(false);
const selectedQuoteForPrint = ref(null);

const quotations = computed(() => invoiceStore.quotations);

const createQuotation = () => {
  invoiceStore.initNewInvoice('quotation');
  router.push('/invoices/create');
};

const convertToInvoice = async (quote) => {
  await invoiceStore.loadInvoice(quote.id);
  invoiceStore.activeInvoice.type = 'invoice';
  invoiceStore.activeInvoice.invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  invoiceStore.activeInvoice.id = null; // creates new invoice
  router.push('/invoices/create');
};

const previewQuotation = (quote) => {
  selectedQuoteForPrint.value = quote;
  isPrintModalOpen.value = true;
};

const deleteQuote = async (id) => {
  if (confirm('Delete this quotation?')) {
    await invoiceStore.deleteInvoice(id);
  }
};
</script>
