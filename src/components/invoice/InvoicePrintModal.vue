<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm overflow-y-auto">
    <div class="my-8 flex w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
      <!-- Toolbar (Hidden on Print) -->
      <div class="no-print flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-950 gap-3">
        <div class="flex items-center gap-2">
          <Printer class="h-5 w-5 text-indigo-600" />
          <span class="font-bold text-slate-800 dark:text-slate-200 text-sm">
            {{ isQuotation ? 'Quotation' : 'Invoice' }} Preview & Print
          </span>
        </div>

        <div class="flex items-center gap-2">
          <!-- WhatsApp Sharing Button (PDF Page 8) -->
          <button
            @click="shareWhatsApp"
            class="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-500 transition-colors"
          >
            <Share2 class="h-3.5 w-3.5" />
            <span>Share WhatsApp</span>
          </button>

          <!-- Native Print -->
          <button
            @click="printDocument"
            class="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-700 transition-colors dark:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Printer class="h-3.5 w-3.5" />
            <span>Print Sheet</span>
          </button>

          <!-- Download PDF -->
          <button
            @click="downloadPdf"
            :disabled="isGeneratingPdf"
            class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            <Download class="h-3.5 w-3.5" />
            <span>{{ isGeneratingPdf ? 'Exporting...' : 'Download PDF' }}</span>
          </button>

          <button
            @click="$emit('close')"
            class="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <X class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Printable Invoice Document Container -->
      <div id="invoice-printable-area" class="print-container bg-white p-8 md:p-12 text-slate-900 overflow-y-auto max-h-[75vh]">
        <!-- Invoice Header -->
        <div class="flex flex-col md:flex-row md:items-start justify-between border-b-2 border-indigo-600 pb-8 gap-6">
          <div>
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-xl">
                AH
              </div>
              <div>
                <h1 class="text-2xl font-black tracking-tight text-slate-900">Al-Harsh System</h1>
                <p class="text-xs font-medium text-slate-500">Sanitary, Electrical & Hardware Solutions</p>
              </div>
            </div>
            <div class="mt-4 text-xs text-slate-600 space-y-0.5">
              <p class="font-medium">Main Market, Wholesale Building Sector</p>
              <p>Email: billing@alharshsystem.com | Tel: +92 300 0000000</p>
              <p>NTN: 8943210-9 | GST Registered</p>
              <p class="font-bold text-slate-800">Bank Alfalah: <span class="font-mono text-indigo-700">05521010566693</span> (Al-Harsh System)</p>
            </div>
          </div>

          <div class="text-left md:text-right">
            <span 
              :class="[
                'inline-block px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest mb-2',
                isQuotation ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
              ]"
            >
              {{ isQuotation ? 'Official Quotation' : 'Tax Invoice' }}
            </span>
            <div class="text-xl font-mono font-black text-slate-900">{{ invoice.invoiceNumber }}</div>
            <div class="mt-2 text-xs text-slate-600 space-y-0.5">
              <p><span class="font-bold">Issue Date:</span> {{ invoice.date }}</p>
              <p v-if="invoice.dueDate"><span class="font-bold">Due Date:</span> {{ invoice.dueDate }}</p>
              <p class="flex items-center md:justify-end gap-1.5 mt-1">
                <span class="font-bold">Brand:</span> 
                <img v-if="companyLogo" :src="companyLogo" class="h-5 w-auto max-w-[70px] object-contain rounded inline-block bg-white" alt="logo" />
                <span class="font-extrabold text-indigo-600">{{ invoice.companyName }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Bill To & Brand Info -->
        <div class="my-6 grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl bg-slate-50 p-4 border border-slate-200/80 text-xs">
          <div>
            <span class="font-bold uppercase tracking-wider text-slate-400 block mb-1">Customer / Bill To:</span>
            <p class="text-sm font-extrabold text-slate-900">{{ invoice.customerName || 'Walk-in Cash Customer' }}</p>
            <p v-if="invoice.customerContact" class="text-slate-600 mt-0.5">Contact: {{ invoice.customerContact }}</p>
            <p v-if="invoice.customerAddress" class="text-slate-600 mt-0.5">{{ invoice.customerAddress }}</p>
          </div>
          <div>
            <span class="font-bold uppercase tracking-wider text-slate-400 block mb-1">Brand & Pricing Specification:</span>
            <p class="text-sm font-bold text-slate-900">{{ invoice.companyName }} Products Line</p>
            <p class="text-slate-600 mt-0.5">Common Code cross-referenced catalog pricing</p>
            <p class="text-slate-600 mt-0.5">Payment Terms: 100% On Delivery / Stated Terms</p>
          </div>
        </div>

        <!-- Line Items Table (PDF Section 4 & 9) -->
        <div class="mt-6 overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b-2 border-slate-300 bg-slate-100 text-slate-700 font-bold">
                <th class="py-2.5 px-3">#</th>
                <th class="py-2.5 px-3">Product Code</th>
                <th class="py-2.5 px-3">Description</th>
                <th class="py-2.5 px-3 text-right">Unit Price</th>
                <th class="py-2.5 px-3 text-center">Qty</th>
                <th class="py-2.5 px-3 text-right">Gross (Rs.)</th>
                <th class="py-2.5 px-3 text-right">Discount</th>
                <th class="py-2.5 px-3 text-right">Net (Rs.)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr 
                v-for="(item, idx) in invoice.items" 
                :key="item.commonCode"
                :class="item.isAvailable === false ? 'bg-rose-50/50 text-slate-400' : ''"
              >
                <td class="py-3 px-3 font-semibold text-slate-400">{{ idx + 1 }}</td>
                <td class="py-3 px-3 font-mono font-bold text-indigo-700">{{ item.commonCode }}</td>
                <td class="py-3 px-3">
                  <div class="font-bold text-slate-900">{{ item.productName }}</div>
                  <div v-if="item.isAvailable === false" class="text-[11px] text-rose-600 font-semibold">
                    Product not available for {{ invoice.companyName }}
                  </div>
                </td>
                <td class="py-3 px-3 text-right font-mono">
                  {{ Number(item.unitPrice).toLocaleString() }}
                </td>
                <td class="py-3 px-3 text-center font-bold">
                  {{ item.quantity }}
                </td>
                <td class="py-3 px-3 text-right font-mono font-medium">
                  {{ Number(item.grossAmount).toLocaleString() }}
                </td>
                <td class="py-3 px-3 text-right text-emerald-700 font-medium">
                  <span v-if="item.discountPercent > 0">{{ item.discountPercent }}% (-{{ Number(item.discountAmount).toLocaleString() }})</span>
                  <span v-else class="text-slate-400">0%</span>
                </td>
                <td class="py-3 px-3 text-right font-mono font-bold text-slate-900">
                  {{ Number(item.netAmount).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Summary Totals Block -->
        <div class="mt-6 flex flex-col md:flex-row justify-between items-start gap-6 border-t-2 border-slate-200 pt-6">
          <div class="w-full md:w-1/2 space-y-3 text-xs text-slate-600">
            <div>
              <span class="font-bold text-slate-800 block mb-1">Notes:</span>
              <p class="whitespace-pre-line rounded bg-slate-50 p-2.5 border border-slate-200">{{ invoice.notes || 'None' }}</p>
            </div>
            <div>
              <span class="font-bold text-slate-800 block mb-1">Terms & Conditions:</span>
              <p class="whitespace-pre-line text-slate-500">{{ invoice.terms }}</p>
            </div>
            <div class="rounded-xl bg-indigo-50/70 p-3 border border-indigo-100 text-[11px] text-indigo-950">
              <span class="font-bold block mb-0.5">Bank Payment Account:</span>
              <span>Bank: <strong>Bank Alfalah</strong> | A/C: <strong class="font-mono text-indigo-700">05521010566693</strong> | Title: <strong>Al-Harsh System</strong></span>
            </div>
          </div>

          <div class="w-full md:w-5/12 space-y-2 text-xs">
            <div class="flex justify-between py-1 text-slate-600">
              <span>Gross Total:</span>
              <span class="font-mono font-semibold">Rs. {{ Number(invoice.subtotal).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between py-1 text-emerald-700 font-medium">
              <span>Total Discounts:</span>
              <span class="font-mono">-Rs. {{ Number(invoice.discountTotal).toLocaleString() }}</span>
            </div>
            <div v-if="invoice.taxPercent > 0" class="flex justify-between py-1 text-slate-600">
              <span>Sales Tax / GST ({{ invoice.taxPercent }}%):</span>
              <span class="font-mono">Rs. {{ Number(invoice.taxAmount).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between py-3 border-t-2 border-slate-800 text-base font-black text-slate-900">
              <span>Grand Total:</span>
              <span class="font-mono text-indigo-700">Rs. {{ Number(invoice.grandTotal).toLocaleString() }}</span>
            </div>
            <div class="text-[11px] text-slate-400 text-right italic">
              All prices stated in Pakistani Rupees (PKR)
            </div>
          </div>
        </div>

        <!-- Authorized Signatures -->
        <div class="mt-12 pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-600">
          <div class="text-center">
            <div class="w-44 border-b border-slate-400 mb-1"></div>
            <span>Customer Signature</span>
          </div>
          <div class="text-center">
            <div class="w-44 border-b border-slate-400 mb-1"></div>
            <span class="font-bold text-slate-800">For Al-Harsh System (Authorized)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { Printer, Download, Share2, X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  invoice: {
    type: Object,
    required: true
  }
});

defineEmits(['close']);

const inventoryStore = useInventoryStore();
const isGeneratingPdf = ref(false);

const companyLogo = computed(() => {
  const comp = inventoryStore.companies.find(
    c => (c._id && c._id === props.invoice.companyId) || (c.id && c.id === props.invoice.companyId) || c.name === props.invoice.companyName
  );
  return comp?.logo || '';
});

const isQuotation = computed(() => props.invoice?.type === 'quotation');

const printDocument = () => {
  window.print();
};

const downloadPdf = async () => {
  isGeneratingPdf.value = true;
  try {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = document.getElementById('invoice-printable-area');
    const opt = {
      margin: 10,
      filename: `${props.invoice.invoiceNumber || 'Invoice'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    await html2pdf().from(element).set(opt).save();
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    // Fallback to browser print if html2pdf has issues in client
    window.print();
  } finally {
    isGeneratingPdf.value = false;
  }
};

const shareWhatsApp = () => {
  const inv = props.invoice;
  const itemsText = inv.items
    .map(i => `• ${i.commonCode} ${i.productName} (Qty: ${i.quantity}) - Rs. ${i.netAmount.toLocaleString()}`)
    .join('%0A');

  const text = `*Al-Harsh System ${isQuotation.value ? 'Quotation' : 'Invoice'}*%0A` +
    `*Bill No:* ${inv.invoiceNumber}%0A` +
    `*Date:* ${inv.date}%0A` +
    `*Customer:* ${inv.customerName}%0A` +
    `*Brand:* ${inv.companyName}%0A` +
    `--------------------------%0A` +
    itemsText + `%0A` +
    `--------------------------%0A` +
    `*Grand Total: Rs. ${Number(inv.grandTotal).toLocaleString()}*%0A` +
    `*Bank Alfalah A/C:* 05521010566693 (Al-Harsh System)%0A` +
    `Thank you for choosing Al-Harsh!`;

  window.open(`https://wa.me/?text=${text}`, '_blank');
};
</script>
