<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
    <div class="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
      <!-- Modal Header -->
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Search class="h-5 w-5 text-indigo-600" />
            Fast Product Search & Selection
          </h3>
          <p class="text-xs text-slate-500">
            Active Brand: <strong class="text-indigo-600 dark:text-indigo-400">{{ activeCompanyName }}</strong>. Search by product name, common code (e.g. SF-001), or category.
          </p>
        </div>
        <button @click="$emit('close')" class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800">
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- Search Filters & Input -->
      <div class="border-b border-slate-100 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-3">
        <div class="relative">
          <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            ref="searchInputRef"
            v-model="searchTerm"
            type="text"
            placeholder="Search by 'Stop Cock', 'SF-001', 'Angle Valve', 'Breaker'..."
            class="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <!-- Category Tabs -->
        <div class="flex flex-wrap items-center gap-2">
          <button
            @click="selectedCategory = 'all'"
            :class="[
              'rounded-lg px-3 py-1 text-xs font-semibold transition-all',
              selectedCategory === 'all' 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-white text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            ]"
          >
            All Categories ({{ totalCatalogCount }})
          </button>
          <button
            v-for="cat in inventoryStore.categories"
            :key="cat.id"
            @click="selectedCategory = cat.id"
            :class="[
              'rounded-lg px-3 py-1 text-xs font-semibold transition-all',
              selectedCategory === cat.id 
                ? 'bg-indigo-600 text-white shadow-sm' 
                : 'bg-white text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
            ]"
          >
            {{ cat.name }}
          </button>
        </div>
      </div>

      <!-- Product Results List -->
      <div class="flex-1 overflow-y-auto p-6 divide-y divide-slate-100 dark:divide-slate-800">
        <div v-if="filteredList.length === 0" class="py-12 text-center">
          <PackageOpen class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
          <p class="text-sm font-medium text-slate-600 dark:text-slate-400">No products found matching "{{ searchTerm }}"</p>
          <p class="text-xs text-slate-400 mt-1">Try searching for Stop Cock, Bib Cock, SF-001, SF-100, or switch categories.</p>
        </div>

        <div
          v-for="product in paginatedList"
          :key="product.id || product._id || product.commonCode"
          class="group py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/30 px-3 rounded-xl"
        >
          <!-- Product Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {{ product.commonCode }}
              </span>
              <span class="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                {{ product.categoryName }}
              </span>
              <span v-if="!product.isAvailableInSelectedCompany" class="rounded bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                Unavailable in {{ activeCompanyName }}
              </span>
            </div>
            <h4 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
              {{ product.name }}
            </h4>
            <p class="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {{ product.description || 'Standard specification hardware/sanitary item' }}
            </p>

            <!-- Multi-brand Price Matrix Snapshot (PDF Section 7 & 10) -->
            <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span class="text-slate-400 font-medium text-[11px]">Brand Prices:</span>
              <div 
                v-for="company in inventoryStore.companies" 
                :key="company._id || company.id"
                :class="[
                  'rounded px-2 py-0.5 text-[11px] font-medium border flex items-center gap-1',
                  (company._id || company.id) === activeCompanyId 
                    ? 'border-indigo-500 bg-indigo-50/80 font-bold text-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-200' 
                    : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                ]"
              >
                <span>{{ company.name }}:</span>
                <span v-if="product.prices[company._id || company.id]" class="font-bold">
                  Rs. {{ Number(product.prices[company._id || company.id]).toLocaleString() }}
                </span>
                <span v-else class="italic text-rose-400">N/A</span>
              </div>
            </div>
          </div>

          <!-- Price for Active Selected Company & Add Action -->
          <div class="flex items-center gap-4 shrink-0">
            <div class="text-right">
              <div class="text-xs text-slate-400 font-medium">{{ activeCompanyName }} Price:</div>
              <div 
                v-if="product.isAvailableInSelectedCompany"
                class="text-lg font-black text-slate-900 dark:text-white font-mono"
              >
                Rs. {{ Number(product.currentCompanyPrice).toLocaleString() }}
              </div>
              <div v-else class="text-xs font-bold text-rose-500">
                Not Sold By Brand
              </div>
            </div>

            <button
              @click="selectProduct(product)"
              :disabled="!product.isAvailableInSelectedCompany"
              :class="[
                'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow transition-all',
                product.isAvailableInSelectedCompany 
                  ? 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 active:scale-95' 
                  : 'bg-slate-300 cursor-not-allowed text-slate-500 dark:bg-slate-800'
              ]"
            >
              <Plus class="h-4 w-4" />
              <span>Add to Bill</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination Footer -->
      <div class="border-t border-slate-200 bg-slate-50 px-6 py-2 dark:border-slate-800 dark:bg-slate-950">
        <AppPagination
          v-model="currentPage"
          v-model:pageSize="pageSize"
          :totalItems="filteredList.length"
          :pageSize="pageSize"
          :pageSizeOptions="[6, 8, 16, 32]"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import AppPagination from '@/components/common/AppPagination.vue';
import { Search, X, Plus, PackageOpen } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  activeCompanyId: {
    type: [Number, String],
    default: null
  },
  activeCompanyName: {
    type: String,
    default: 'Selected Company'
  }
});

const emit = defineEmits(['close', 'add-item']);

const inventoryStore = useInventoryStore();
const searchTerm = ref('');
const selectedCategory = ref('all');
const searchInputRef = ref(null);

// Pagination State
const currentPage = ref(1);
const pageSize = ref(8);

watch(() => props.isOpen, (open) => {
  if (open) {
    currentPage.value = 1;
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
});

const totalCatalogCount = computed(() => inventoryStore.products.length);

const filteredList = computed(() => {
  return inventoryStore.searchProducts(
    searchTerm.value, 
    selectedCategory.value, 
    props.activeCompanyId
  );
});

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredList.value.slice(start, start + pageSize.value);
});

watch(() => [searchTerm.value, selectedCategory.value], () => {
  currentPage.value = 1;
});

const selectProduct = (product) => {
  emit('add-item', product);
};
</script>
