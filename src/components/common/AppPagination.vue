<template>
  <div v-if="totalItems > 0" class="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 text-xs text-slate-600 dark:text-slate-400">
    <!-- Items Counter & Page Size Selector -->
    <div class="flex items-center gap-3">
      <span>
        Showing <strong class="font-bold text-slate-900 dark:text-white">{{ fromItem }}</strong> to 
        <strong class="font-bold text-slate-900 dark:text-white">{{ toItem }}</strong> of 
        <strong class="font-bold text-slate-900 dark:text-white">{{ totalItems }}</strong> entries
      </span>

      <div v-if="showPageSizeSelector && pageSizeOptions.length > 1" class="flex items-center gap-1.5 ml-2 border-l border-slate-200 dark:border-slate-800 pl-3">
        <span class="text-slate-500">Per page:</span>
        <select
          :value="pageSize"
          @change="onPageSizeChange(Number($event.target.value))"
          class="rounded-lg border border-slate-300 bg-white py-1 px-2 text-xs font-semibold text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div v-if="totalPages > 1" class="flex items-center gap-1">
      <!-- First Page -->
      <button
        @click="goToPage(1)"
        :disabled="currentPage === 1"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors"
        title="First Page"
      >
        <ChevronsLeft class="h-4 w-4" />
      </button>

      <!-- Previous Page -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors"
        title="Previous Page"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>

      <!-- Page Numbers -->
      <template v-for="(page, idx) in visiblePages" :key="idx">
        <span v-if="page === '...'" class="px-2 py-1 text-slate-400 font-bold select-none">
          ...
        </span>
        <button
          v-else
          @click="goToPage(page)"
          :class="[
            'inline-flex h-8 min-w-[32px] px-2 items-center justify-center rounded-lg text-xs font-bold transition-all',
            currentPage === page
              ? 'bg-indigo-600 text-white shadow-sm border border-indigo-600'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
          ]"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next Page -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors"
        title="Next Page"
      >
        <ChevronRight class="h-4 w-4" />
      </button>

      <!-- Last Page -->
      <button
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
        class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 transition-colors"
        title="Last Page"
      >
        <ChevronsRight class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  totalItems: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 25, 50, 100]
  },
  showPageSizeSelector: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['update:modelValue', 'update:pageSize', 'page-change']);

const currentPage = computed(() => props.modelValue);

const totalPages = computed(() => {
  return Math.ceil(props.totalItems / props.pageSize) || 1;
});

const fromItem = computed(() => {
  if (props.totalItems === 0) return 0;
  return (currentPage.value - 1) * props.pageSize + 1;
});

const toItem = computed(() => {
  return Math.min(currentPage.value * props.pageSize, props.totalItems);
});

const visiblePages = computed(() => {
  const pages = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) pages.push('...');
    pages.push(total);
  }

  return pages;
});

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return;
  emit('update:modelValue', page);
  emit('page-change', page);
};

const onPageSizeChange = (newSize) => {
  emit('update:pageSize', newSize);
  emit('update:modelValue', 1);
  emit('page-change', 1);
};
</script>
