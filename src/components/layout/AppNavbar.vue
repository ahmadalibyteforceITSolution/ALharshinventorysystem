<template>
  <header class="no-print sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 lg:px-8">
    <div class="flex items-center gap-3">
      <!-- Mobile sidebar toggle -->
      <button 
        @click="$emit('toggle-sidebar')" 
        class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu class="h-5 w-5" />
      </button>

      <!-- System Title & Badges -->
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-md shadow-indigo-500/20">
          <Layers class="h-5 w-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              {{ authStore.user?.businessName || 'Al-Harsh' }}
            </h1>
            <router-link
              to="/subscription"
              :class="[
                'rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wider border flex items-center gap-1 transition-all',
                authStore.currentPlan === 'enterprise' 
                  ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
                  : (authStore.currentPlan === 'pro'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800'
                    : (authStore.currentPlan === 'custom'
                      ? 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800'
                      : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'))
              ]"
              title="Click to manage subscription"
            >
              <Crown class="h-3 w-3 text-amber-500" />
              <span>{{ authStore.currentPlan }}</span>
            </router-link>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
            Logged in as {{ authStore.user?.name || 'Administrator' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Right Header Actions -->
    <div class="flex items-center gap-2.5">
      <!-- Create Bill Quick Action -->
      <router-link
        to="/invoices/create"
        class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors"
      >
        <PlusCircle class="h-4 w-4" />
        <span class="hidden sm:inline">Create Bill</span>
      </router-link>

      <!-- Subscription Page Link -->
      <router-link
        to="/subscription"
        class="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/70 px-2.5 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition-colors dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
      >
        <Sparkles class="h-3.5 w-3.5 text-amber-500" />
        <span>Plans</span>
      </router-link>

      <!-- Logout Button -->
      <button
        @click="handleLogout"
        class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-rose-400 transition-colors"
        title="Sign Out"
      >
        <LogOut class="h-3.5 w-3.5" />
        <span class="hidden md:inline">Sign Out</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { 
  Menu, 
  Layers, 
  PlusCircle, 
  Crown, 
  Sparkles, 
  LogOut 
} from 'lucide-vue-next';

defineEmits(['toggle-sidebar']);

const router = useRouter();
const authStore = useAuthStore();
const inventoryStore = useInventoryStore();
const invoiceStore = useInvoiceStore();

const handleLogout = () => {
  authStore.logout();
  inventoryStore.products = [];
  inventoryStore.companies = [];
  inventoryStore.categories = [];
  inventoryStore.customers = [];
  invoiceStore.invoices = [];
  router.push('/login');
};
</script>
