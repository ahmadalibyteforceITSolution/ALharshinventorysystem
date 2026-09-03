<template>
  <aside 
    :class="[
      'no-print fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:static lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
  >
    <!-- Brand / Header inside sidebar -->
    <div class="flex h-16 items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
      <div class="flex items-center gap-2.5">
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm">
          AH
        </div>
        <span class="font-extrabold tracking-tight text-slate-900 dark:text-white">Al-Harsh System</span>
      </div>
      <button 
        @click="$emit('close')" 
        class="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 lg:hidden"
      >
        <X class="h-5 w-5" />
      </button>
    </div>

    <!-- Navigation Links -->
    <div class="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      <!-- Section: Main -->
      <div>
        <p class="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Core Operations
        </p>
        <nav class="mt-2 space-y-1">
          <router-link
            to="/"
            @click="$emit('close')"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive('/') ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          >
            <LayoutDashboard class="h-4 w-4 shrink-0" />
            <span>Dashboard</span>
          </router-link>

          <router-link
            to="/invoices/create"
            @click="$emit('close')"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive('/invoices/create') ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          >
            <FilePlus2 class="h-4 w-4 shrink-0 text-indigo-500" />
            <span>Create Invoice</span>
            <span class="ml-auto rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">Fast</span>
          </router-link>

          <router-link
            to="/invoices"
            @click="$emit('close')"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive('/invoices') && !isActive('/invoices/create') ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          >
            <Receipt class="h-4 w-4 shrink-0" />
            <span>Invoices</span>
            <span v-if="invoiceCount" class="ml-auto text-xs font-semibold text-slate-400">{{ invoiceCount }}</span>
          </router-link>

          <router-link
            to="/quotations"
            @click="$emit('close')"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive('/quotations') ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          >
            <FileText class="h-4 w-4 shrink-0" />
            <span>Quotations</span>
            <span v-if="quotationCount" class="ml-auto text-xs font-semibold text-slate-400">{{ quotationCount }}</span>
          </router-link>
        </nav>
      </div>

      <!-- Section: Product Master (PDF Section 3 & 7) -->
      <div>
        <p class="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Product Master & Pricing
        </p>
        <nav class="mt-2 space-y-1">
          <router-link
            to="/products"
            @click="$emit('close')"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive('/products') ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          >
            <Package class="h-4 w-4 shrink-0" />
            <span>Products & Prices</span>
          </router-link>

          <router-link
            to="/common-codes"
            @click="$emit('close')"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive('/common-codes') ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          >
            <GitMerge class="h-4 w-4 shrink-0 text-emerald-500" />
            <span>Common Codes / Alt</span>
          </router-link>

          <router-link
            to="/companies"
            @click="$emit('close')"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive('/companies') ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          >
            <Building2 class="h-4 w-4 shrink-0" />
            <span>Companies / Brands</span>
          </router-link>

          <router-link
            to="/categories"
            @click="$emit('close')"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive('/categories') ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          >
            <FolderTree class="h-4 w-4 shrink-0" />
            <span>Categories</span>
          </router-link>
        </nav>
      </div>

      <!-- Section: CRM & Administration -->
      <div>
        <p class="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Management & Backup
        </p>
        <nav class="mt-2 space-y-1">
          <router-link
            to="/customers"
            @click="$emit('close')"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive('/customers') ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          >
            <Users class="h-4 w-4 shrink-0" />
            <span>Customers</span>
          </router-link>

          <router-link
            to="/settings"
            @click="$emit('close')"
            class="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
            :class="isActive('/settings') ? 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-950/50 dark:text-indigo-300' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'"
          >
            <Settings class="h-4 w-4 shrink-0" />
            <span>Settings & Backup</span>
          </router-link>
        </nav>
      </div>
    </div>

    <!-- Active Brands Mini-Pills Footer -->
    <div class="border-t border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
      <p class="text-[11px] font-medium text-slate-500 mb-2">Connected Brands:</p>
      <div class="flex flex-wrap gap-1.5">
        <span class="inline-flex items-center rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700 border border-sky-200">
          Dura Flow
        </span>
        <span class="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
          Popular
        </span>
        <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-200">
          Master
        </span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { 
  LayoutDashboard, 
  FilePlus2, 
  Receipt, 
  FileText, 
  Package, 
  GitMerge, 
  Building2, 
  FolderTree, 
  Users, 
  Settings, 
  X 
} from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close']);

const route = useRoute();
const invoiceStore = useInvoiceStore();

const isActive = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};

const invoiceCount = computed(() => invoiceStore.finalInvoices.length);
const quotationCount = computed(() => invoiceStore.quotations.length);
</script>
