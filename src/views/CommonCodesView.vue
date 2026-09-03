<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <GitMerge class="h-6 w-6 text-indigo-600" />
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">Common Product Codes & Alternatives</h2>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          The core architecture linking equivalent products across different manufacturers (PDF Section 7 & 12)
        </p>
      </div>
    </div>

    <!-- Architectural Explanation Box (Directly explaining PDF Logic) -->
    <div class="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 to-white p-6 shadow-sm dark:border-indigo-950 dark:from-slate-900 dark:to-indigo-950/30">
      <div class="flex items-start gap-4">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
          <Sparkles class="h-5 w-5" />
        </div>
        <div class="space-y-1">
          <h3 class="font-extrabold text-slate-900 dark:text-white text-sm">
            How the Common Product Code Engine Works:
          </h3>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Every equivalent/similar product shares a single unique <strong>Common Product Code</strong> (e.g. <span class="font-mono font-bold text-indigo-600">SF-001</span> for Stop Cock, <span class="font-mono font-bold text-indigo-600">SF-100</span> for Floor Trap). 
            When creating an invoice, the system binds line items to this common code. When switching company brands (e.g. from <em>Dura Flow</em> to <em>Popular</em>), the invoice looks up the common code in the new brand's price list and auto-replaces the unit prices and discounts simultaneously.
          </p>
        </div>
      </div>
    </div>

    <!-- Common Code Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div
        v-for="prod in inventoryStore.products"
        :key="prod.id"
        class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 hover:border-indigo-200 transition-all"
      >
        <div class="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <span class="rounded-lg bg-indigo-600 px-2.5 py-1 font-mono text-xs font-black text-white">
              {{ prod.commonCode }}
            </span>
            <span class="font-bold text-slate-900 dark:text-white text-sm">{{ prod.name }}</span>
          </div>
          <span class="text-xs text-slate-400 font-medium">
            {{ inventoryStore.getCategoryById(prod.categoryId)?.name }}
          </span>
        </div>

        <p class="text-xs text-slate-500 my-3 line-clamp-1">
          {{ prod.description || 'Standard technical specifications' }}
        </p>

        <!-- Brand Equivalents Grid -->
        <div class="space-y-2">
          <div class="text-[11px] font-bold uppercase tracking-wider text-slate-400">Brand Equivalents & Prices:</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div
              v-for="comp in inventoryStore.companies"
              :key="comp.id"
              class="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
            >
              <div class="flex items-center gap-2">
                <span 
                  class="h-2 w-2 rounded-full" 
                  :style="{ backgroundColor: comp.color || '#4f46e5' }"
                ></span>
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ comp.name }}</span>
              </div>

              <div v-if="inventoryStore.getPrice(prod.commonCode, comp.id)">
                <span class="font-mono font-bold text-slate-900 dark:text-white">
                  Rs. {{ Number(inventoryStore.getPrice(prod.commonCode, comp.id)).toLocaleString() }}
                </span>
              </div>
              <div v-else class="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                <span>Not available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useInventoryStore } from '@/stores/inventoryStore';
import { GitMerge, Sparkles } from 'lucide-vue-next';

const inventoryStore = useInventoryStore();
</script>
