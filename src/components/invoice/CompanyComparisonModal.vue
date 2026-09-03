<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
    <div class="flex max-h-[92vh] w-full max-w-5xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/20">
        <div>
          <div class="flex items-center gap-2">
            <span class="rounded-md bg-indigo-600 p-1.5 text-white">
              <ArrowLeftRight class="h-4 w-4" />
            </span>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">
              Multi-Company Invoice Price Comparison
            </h3>
          </div>
          <p class="text-xs text-slate-500 mt-1">
            Comparing the current invoice's {{ totalItems }} items across all available manufacturers/brands automatically.
          </p>
        </div>
        <button @click="$emit('close')" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- Comparison Cards Grid -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div
            v-for="matrix in comparisonList"
            :key="matrix.companyId"
            :class="[
              'flex flex-col rounded-2xl border p-5 transition-all relative overflow-hidden',
              matrix.isCurrent
                ? 'border-indigo-500 bg-indigo-50/20 shadow-md ring-2 ring-indigo-500/20 dark:bg-indigo-950/20 dark:border-indigo-500'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900'
            ]"
          >
            <!-- Badge for Active Brand -->
            <div v-if="matrix.isCurrent" class="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
              Current Invoice Brand
            </div>

            <!-- Brand Title -->
            <div class="flex items-center gap-3 mb-4">
              <div 
                class="flex h-10 w-10 items-center justify-center rounded-xl text-white font-black text-sm shadow-sm"
                :style="{ backgroundColor: matrix.companyColor }"
              >
                {{ matrix.companyName.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <h4 class="font-extrabold text-slate-900 dark:text-white text-base">
                  {{ matrix.companyName }}
                </h4>
                <p class="text-xs text-slate-500">
                  Default Discount: <strong class="text-emerald-600">{{ matrix.defaultDiscount }}%</strong>
                </p>
              </div>
            </div>

            <!-- Total Price Highlight -->
            <div class="my-3 rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
              <span class="text-xs text-slate-400 font-semibold uppercase tracking-wider block">Net Invoice Total</span>
              <div class="text-2xl font-black text-slate-900 dark:text-white mt-1">
                Rs. {{ matrix.netTotal.toLocaleString() }}
              </div>

              <!-- Difference vs Current Badge -->
              <div v-if="!matrix.isCurrent" class="mt-2 flex items-center justify-center gap-1.5 text-xs font-bold">
                <span 
                  v-if="matrix.diffVsCurrent < 0" 
                  class="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full dark:bg-emerald-950/40"
                >
                  <TrendingDown class="h-3 w-3" />
                  Save Rs. {{ Math.abs(matrix.diffVsCurrent).toLocaleString() }} ({{ Math.abs(matrix.pctDiff) }}%)
                </span>
                <span 
                  v-else-if="matrix.diffVsCurrent > 0" 
                  class="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full dark:bg-rose-950/40"
                >
                  <TrendingUp class="h-3 w-3" />
                  +Rs. {{ matrix.diffVsCurrent.toLocaleString() }} (+{{ matrix.pctDiff }}%)
                </span>
                <span v-else class="text-slate-500 font-medium">Equal price</span>
              </div>
              <div v-else class="mt-2 text-xs font-semibold text-indigo-600">
                Active baseline
              </div>
            </div>

            <!-- Availability Stat -->
            <div class="flex items-center justify-between text-xs py-2 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
              <span>Item Availability:</span>
              <span 
                :class="[
                  'font-bold px-2 py-0.5 rounded text-[11px]',
                  matrix.isAllAvailable 
                    ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400' 
                    : 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400'
                ]"
              >
                {{ matrix.availableItems }} of {{ matrix.totalItems }} Available
              </span>
            </div>

            <!-- Financial Breakdown Details -->
            <div class="space-y-1.5 py-3 text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800">
              <div class="flex justify-between">
                <span>Gross Amount:</span>
                <span class="font-semibold text-slate-800 dark:text-slate-200">Rs. {{ matrix.grossTotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between text-emerald-600">
                <span>Total Discount Applied:</span>
                <span class="font-semibold">-Rs. {{ matrix.discountTotal.toLocaleString() }}</span>
              </div>
            </div>

            <!-- Action: Switch Company to this one -->
            <div class="mt-4 pt-2">
              <button
                v-if="!matrix.isCurrent"
                @click="applyBrandSwitch(matrix.companyId)"
                class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 active:scale-[0.98] transition-all"
              >
                <Check class="h-4 w-4" />
                <span>Switch Invoice to {{ matrix.companyName }}</span>
              </button>
              <div v-else class="w-full py-2.5 text-center text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl">
                Currently Selected
              </div>
            </div>
          </div>
        </div>

        <!-- Line Item Breakdown Table Across Brands -->
        <div class="mt-8 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div class="bg-slate-50 px-4 py-3 dark:bg-slate-950 font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider">
            Item-by-Item Price Matrix Breakdown
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                <tr>
                  <th class="px-4 py-3">Code</th>
                  <th class="px-4 py-3">Product Name</th>
                  <th class="px-4 py-3 text-center">Qty</th>
                  <th 
                    v-for="matrix in comparisonList" 
                    :key="matrix.companyId"
                    class="px-4 py-3 text-right"
                  >
                    {{ matrix.companyName }} (Unit / Net)
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                <tr 
                  v-for="item in invoiceStore.activeInvoice.items" 
                  :key="item.commonCode"
                  class="hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                >
                  <td class="px-4 py-3 font-mono font-bold text-indigo-600">{{ item.commonCode }}</td>
                  <td class="px-4 py-3 font-semibold text-slate-900 dark:text-white">{{ item.productName }}</td>
                  <td class="px-4 py-3 text-center font-bold text-slate-700 dark:text-slate-300">{{ item.quantity }}</td>
                  <td 
                    v-for="matrix in comparisonList" 
                    :key="matrix.companyId"
                    class="px-4 py-3 text-right"
                  >
                    <template v-for="bItem in matrix.itemBreakdown" :key="bItem.commonCode">
                      <div v-if="bItem.commonCode === item.commonCode">
                        <span v-if="bItem.isAvailable">
                          <span class="text-slate-400">@{{ bItem.unitPrice }}</span>
                          <span class="font-bold text-slate-900 dark:text-white ml-2">Rs. {{ bItem.netAmount.toLocaleString() }}</span>
                        </span>
                        <span v-else class="text-rose-500 text-[11px] font-bold">
                          Unavailable
                        </span>
                      </div>
                    </template>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex items-center justify-end border-t border-slate-200 bg-slate-50 px-6 py-3 dark:border-slate-800 dark:bg-slate-950">
        <button 
          @click="$emit('close')" 
          class="rounded-xl bg-slate-200 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { ArrowLeftRight, X, Check, TrendingDown, TrendingUp } from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'switched']);
const invoiceStore = useInvoiceStore();

const totalItems = computed(() => invoiceStore.activeInvoice.items.length);
const comparisonList = computed(() => invoiceStore.getCompanyComparisonMatrix());

const applyBrandSwitch = (companyId) => {
  invoiceStore.switchCompany(companyId);
  emit('switched', companyId);
};
</script>
