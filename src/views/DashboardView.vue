<template>
  <div class="space-y-8 max-w-7xl mx-auto">
    <!-- Top Greeting & Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          Inventory & Pricing Overview
        </h2>
        <p class="text-sm text-slate-500 mt-1">
          Al-Harsh multi-brand pricing engine & invoice management system
        </p>
      </div>
      <div class="flex items-center gap-3">
        <router-link
          to="/invoices/create"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-500 transition-all hover:shadow-indigo-500/25"
        >
          <Plus class="h-4 w-4" />
          <span>New Invoice</span>
        </router-link>
        <router-link
          to="/invoices/create"
          @click="invoiceStore.initNewInvoice('quotation')"
          class="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition-all dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <FileText class="h-4 w-4" />
          <span>New Quotation</span>
        </router-link>
      </div>
    </div>

    <!-- 1. KPI Metric Cards (PDF Page 5) -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <!-- Total Products -->
      <div class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Products</span>
          <div class="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Package class="h-4 w-4" />
          </div>
        </div>
        <div class="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {{ inventoryStore.products.length }}
        </div>
        <div class="mt-1 text-xs text-slate-500">Active catalog items</div>
      </div>

      <!-- Total Companies / Brands -->
      <div class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Brands</span>
          <div class="rounded-lg bg-sky-50 p-2 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
            <Building2 class="h-4 w-4" />
          </div>
        </div>
        <div class="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {{ inventoryStore.companies.length }}
        </div>
        <div class="mt-1 text-xs text-slate-500">Dura Flow, Popular, Master...</div>
      </div>

      <!-- Total Invoice Value -->
      <div class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 col-span-2 sm:col-span-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Invoiced</span>
          <div class="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Receipt class="h-4 w-4" />
          </div>
        </div>
        <div class="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Rs. {{ invoiceStore.totalInvoiceValue.toLocaleString() }}
        </div>
        <div class="mt-1 text-xs text-emerald-600 font-semibold">{{ invoiceStore.finalInvoices.length }} Invoices issued</div>
      </div>

      <!-- Quotations Count -->
      <div class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Quotations</span>
          <div class="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <FileText class="h-4 w-4" />
          </div>
        </div>
        <div class="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {{ invoiceStore.quotations.length }}
        </div>
        <div class="mt-1 text-xs text-slate-500">Pending customer quotes</div>
      </div>

      <!-- Common Codes Registered -->
      <div class="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 col-span-2 sm:col-span-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-slate-400">Common Codes</span>
          <div class="rounded-lg bg-violet-50 p-2 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400">
            <GitMerge class="h-4 w-4" />
          </div>
        </div>
        <div class="mt-3 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {{ inventoryStore.products.length }}
        </div>
        <div class="mt-1 text-xs text-slate-500">Linked product codes</div>
      </div>
    </div>

    <!-- 2. Category Distribution Breakdown (PDF Page 1, 2, 5) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <!-- Sanitary Category Card -->
      <div class="rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/70 to-white p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 shadow-sm relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-sky-500 p-3 text-white shadow-md shadow-sky-500/20">
              <Droplets class="h-6 w-6" />
            </div>
            <div>
              <h3 class="font-extrabold text-slate-900 dark:text-white text-lg">Sanitary</h3>
              <p class="text-xs text-slate-500">Pipes, Valves, Stop Cocks</p>
            </div>
          </div>
          <span class="text-3xl font-black text-sky-700 dark:text-sky-400">
            {{ inventoryStore.metrics.sanitaryCount }}
          </span>
        </div>
        <div class="mt-4 pt-3 border-t border-sky-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span class="text-slate-500">Featured Common Codes:</span>
          <span class="font-mono font-bold text-sky-700 dark:text-sky-400">SF-001, SF-002, SF-100</span>
        </div>
      </div>

      <!-- Electrical Category Card -->
      <div class="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/70 to-white p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 shadow-sm relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-amber-500 p-3 text-white shadow-md shadow-amber-500/20">
              <Zap class="h-6 w-6" />
            </div>
            <div>
              <h3 class="font-extrabold text-slate-900 dark:text-white text-lg">Electrical</h3>
              <p class="text-xs text-slate-500">Breakers, Switches, Cables</p>
            </div>
          </div>
          <span class="text-3xl font-black text-amber-700 dark:text-amber-400">
            {{ inventoryStore.metrics.electricalCount }}
          </span>
        </div>
        <div class="mt-4 pt-3 border-t border-amber-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span class="text-slate-500">Featured Common Codes:</span>
          <span class="font-mono font-bold text-amber-700 dark:text-amber-400">EL-001, EL-002, EL-003</span>
        </div>
      </div>

      <!-- Hardware Category Card -->
      <div class="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/70 to-white p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900/60 shadow-sm relative overflow-hidden">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="rounded-xl bg-emerald-500 p-3 text-white shadow-md shadow-emerald-500/20">
              <Wrench class="h-6 w-6" />
            </div>
            <div>
              <h3 class="font-extrabold text-slate-900 dark:text-white text-lg">Hardware</h3>
              <p class="text-xs text-slate-500">Locks, Hinges, Screws</p>
            </div>
          </div>
          <span class="text-3xl font-black text-emerald-700 dark:text-emerald-400">
            {{ inventoryStore.metrics.hardwareCount }}
          </span>
        </div>
        <div class="mt-4 pt-3 border-t border-emerald-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <span class="text-slate-500">Featured Common Codes:</span>
          <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400">HW-001, HW-002, HW-003</span>
        </div>
      </div>
    </div>

    <!-- 3. Company-Wise Pricing & Default Discounts (PDF Page 4 & 5) -->
    <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div>
          <h3 class="text-base font-extrabold text-slate-900 dark:text-white">
            Connected Companies & Default Discount Structure
          </h3>
          <p class="text-xs text-slate-500">Automatic discounts applied when switching brands during invoice creation</p>
        </div>
        <router-link to="/companies" class="text-xs font-bold text-indigo-600 hover:underline">
          Manage Companies →
        </router-link>
      </div>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="company in inventoryStore.companies"
          :key="company.id"
          class="rounded-xl border border-slate-200 p-4 dark:border-slate-800 hover:border-indigo-300 transition-colors"
        >
          <div class="flex items-center justify-between">
            <span class="font-bold text-slate-900 dark:text-white">{{ company.name }}</span>
            <span class="rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              {{ company.code }}
            </span>
          </div>
          <div class="mt-3 flex items-baseline justify-between">
            <span class="text-xs text-slate-500">Default Discount:</span>
            <span class="text-lg font-black text-emerald-600">{{ company.defaultDiscount }}%</span>
          </div>
          <div class="mt-2 text-xs text-slate-400">
            {{ company.phone || 'Standard Dealer Channel' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 4. Recent Invoices & Top Products Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Invoices Table (2 columns) -->
      <div class="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2">
            <Receipt class="h-5 w-5 text-indigo-600" />
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white">Recent Invoices & Quotations</h3>
          </div>
          <router-link to="/invoices" class="text-xs font-bold text-indigo-600 hover:underline">
            View All →
          </router-link>
        </div>

        <div class="mt-4 divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto">
          <div 
            v-if="invoiceStore.recentInvoices.length === 0" 
            class="py-10 text-center text-xs text-slate-400"
          >
            No invoices recorded yet. Click "New Invoice" above to create your first bill!
          </div>

          <div
            v-for="inv in invoiceStore.recentInvoices"
            :key="inv.invoiceNumber"
            class="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-lg transition-colors"
          >
            <div class="flex items-center gap-3">
              <div 
                :class="[
                  'flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold',
                  inv.type === 'quotation' 
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                    : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                ]"
              >
                {{ inv.type === 'quotation' ? 'QT' : 'INV' }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-mono font-bold text-xs text-slate-900 dark:text-white">{{ inv.invoiceNumber }}</span>
                  <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {{ inv.companyName }}
                  </span>
                </div>
                <p class="text-xs text-slate-500">{{ inv.customerName || 'Cash Sale' }} • {{ inv.date }}</p>
              </div>
            </div>

            <div class="text-right">
              <div class="text-sm font-black text-slate-900 dark:text-white">
                Rs. {{ Number(inv.grandTotal).toLocaleString() }}
              </div>
              <span 
                :class="[
                  'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mt-0.5',
                  inv.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                ]"
              >
                {{ inv.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Most Used Products & Quick Simulation (1 column) -->
      <div class="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
        <div>
          <div class="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
            <TrendingUp class="h-5 w-5 text-indigo-600" />
            <h3 class="text-base font-extrabold text-slate-900 dark:text-white">Most Used Products</h3>
          </div>

          <div class="mt-4 space-y-3">
            <div 
              v-for="(prod, i) in inventoryStore.products.slice(0, 5)"
              :key="prod.id"
              class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs"
            >
              <div class="flex items-center gap-2.5">
                <span class="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[10px]">
                  {{ i + 1 }}
                </span>
                <div>
                  <span class="font-bold text-slate-900 dark:text-white block">{{ prod.name }}</span>
                  <span class="font-mono text-[11px] text-indigo-600 font-semibold">{{ prod.commonCode }}</span>
                </div>
              </div>
              <span class="text-slate-500 font-medium">{{ prod.stockQty }} in stock</span>
            </div>
          </div>
        </div>

        <!-- Quick Switch Demo Callout (PDF Highlights) -->
        <div class="mt-6 rounded-xl bg-gradient-to-br from-indigo-900 to-slate-900 p-4 text-white shadow-md">
          <div class="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles class="h-4 w-4" />
            Brand Switch Engine
          </div>
          <p class="text-xs text-slate-300 mt-1">
            Seamlessly convert an entire invoice between Dura Flow, Popular, and Master with 1 click.
          </p>
          <router-link
            to="/invoices/create"
            class="mt-3 inline-block w-full text-center rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2 text-xs font-bold text-white transition-colors"
          >
            Launch Bill Generator →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useInventoryStore } from '@/stores/inventoryStore';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { 
  Package, 
  Building2, 
  Receipt, 
  FileText, 
  GitMerge, 
  Droplets, 
  Zap, 
  Wrench, 
  Plus, 
  TrendingUp, 
  Sparkles 
} from 'lucide-vue-next';

const inventoryStore = useInventoryStore();
const invoiceStore = useInvoiceStore();
</script>
