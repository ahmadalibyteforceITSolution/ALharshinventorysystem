<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header Section -->
    <div class="text-center max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-3">
        <Crown class="h-4 w-4 text-amber-500" />
        <span>Inventory & Brand Capacity Plans</span>
      </div>
      <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight sm:text-4xl">
        Scale Your Multi-Brand Inventory
      </h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Choose a plan that fits your manufacturer network. Unlock more brand price matrices and high-velocity invoicing.
      </p>

      <!-- Monthly / Yearly Billing Toggle -->
      <div class="mt-6 inline-flex items-center rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <button
          @click="billingCycle = 'monthly'"
          :class="[
            'rounded-xl px-5 py-2 text-xs font-bold transition-all',
            billingCycle === 'monthly'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          ]"
        >
          Monthly Billing
        </button>
        <button
          @click="billingCycle = 'yearly'"
          :class="[
            'rounded-xl px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5',
            billingCycle === 'yearly'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          ]"
        >
          <span>Yearly Billing</span>
          <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            Save 20%
          </span>
        </button>
      </div>
    </div>

    <!-- Active Subscription Status Banner -->
    <div class="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur">
          <Sparkles class="h-6 w-6 text-amber-300" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base font-bold capitalize">Current Plan: {{ authStore.currentPlan }}</h3>
            <span class="rounded bg-indigo-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border border-indigo-400/30">
              Active
            </span>
          </div>
          <p class="text-xs text-indigo-200 mt-0.5">
            Brand Capacity: 
            <span class="font-bold text-white">
              {{ inventoryStore.companies.length }} / {{ authStore.isUnlimited ? 'Unlimited' : authStore.brandLimit }} brands used
            </span>
          </p>
        </div>
      </div>
      <div class="text-right">
        <div class="text-xs text-indigo-200">Shop / Account:</div>
        <div class="font-bold text-sm">{{ authStore.user?.businessName || 'Al-Harsh Store' }}</div>
      </div>
    </div>

    <!-- Pricing Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 1. Starter Plan -->
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between relative">
        <div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Starter</h3>
              <p class="text-xs text-slate-500">For single-brand hardware stores</p>
            </div>
            <span class="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-400">
              Free
            </span>
          </div>

          <div class="mb-6">
            <span class="text-3xl font-black text-slate-900 dark:text-white">PKR 0</span>
            <span class="text-xs text-slate-400"> / forever</span>
          </div>

          <ul class="space-y-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-5">
            <li class="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
              <Check class="h-4 w-4 shrink-0" />
              <span>Up to 1 Brand / Manufacturer</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Up to 50 Products</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Standard Invoices & Thermal Print</span>
            </li>
            <li class="flex items-center gap-2 text-slate-400">
              <X class="h-4 w-4 text-slate-300 shrink-0" />
              <span>Excel Import / Export</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            v-if="authStore.currentPlan === 'starter'"
            disabled
            class="w-full rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-500 cursor-default"
          >
            Current Plan
          </button>
          <button
            v-else
            @click="openCheckout('starter')"
            class="w-full rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all"
          >
            Downgrade to Starter
          </button>
        </div>
      </div>

      <!-- 2. Pro Plan (Most Popular) -->
      <div class="rounded-3xl border-2 border-indigo-600 bg-white p-6 shadow-xl dark:bg-slate-900 flex flex-col justify-between relative ring-4 ring-indigo-500/10">
        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3.5 py-0.5 text-[10px] font-black text-white uppercase tracking-wider shadow">
          Most Popular
        </div>

        <div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pro Store</h3>
              <p class="text-xs text-slate-500">For multi-brand sanitary & pipes</p>
            </div>
            <span class="rounded-xl bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              5 Brands
            </span>
          </div>

          <div class="mb-6">
            <span class="text-3xl font-black text-slate-900 dark:text-white">
              PKR {{ billingCycle === 'yearly' ? '24,000' : '2,500' }}
            </span>
            <span class="text-xs text-slate-400"> / {{ billingCycle === 'yearly' ? 'year' : 'month' }}</span>
          </div>

          <ul class="space-y-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-5">
            <li class="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
              <Check class="h-4 w-4 shrink-0" />
              <span>Up to 5 Brands (Dura Flow, Popular, etc.)</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Unlimited Products & Catalog Items</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>1-Click Brand Price Switcher on Bills</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Excel Import & Export (Bulk Prices)</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Custom Brand Logos on A4 PDFs</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            v-if="authStore.currentPlan === 'pro'"
            disabled
            class="w-full rounded-xl bg-indigo-50 dark:bg-indigo-950/60 py-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-default"
          >
            Current Plan
          </button>
          <button
            v-else
            @click="openCheckout('pro')"
            class="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      <!-- 3. Enterprise Plan (Unlimited) -->
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between relative">
        <div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Enterprise</h3>
              <p class="text-xs text-slate-500">For large wholesale suppliers</p>
            </div>
            <span class="rounded-xl bg-purple-50 dark:bg-purple-950 px-3 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">
              Unlimited Brands
            </span>
          </div>

          <div class="mb-6">
            <span class="text-3xl font-black text-slate-900 dark:text-white">
              PKR {{ billingCycle === 'yearly' ? '48,000' : '5,000' }}
            </span>
            <span class="text-xs text-slate-400"> / {{ billingCycle === 'yearly' ? 'year' : 'month' }}</span>
          </div>

          <ul class="space-y-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-5">
            <li class="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400">
              <Check class="h-4 w-4 shrink-0" />
              <span>Unlimited Brands / Companies</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Unlimited Products & Invoices</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Multi-Brand Comparison Matrix</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Priority WhatsApp & Phone Support</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Multi-device & Team Access</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            v-if="authStore.currentPlan === 'enterprise'"
            disabled
            class="w-full rounded-xl bg-purple-50 dark:bg-purple-950/60 py-2.5 text-xs font-bold text-purple-600 dark:text-purple-400 cursor-default"
          >
            Current Plan
          </button>
          <button
            v-else
            @click="openCheckout('enterprise')"
            class="w-full rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 py-2.5 text-xs font-bold transition-all shadow-md"
          >
            Upgrade to Enterprise
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Plan Builder Section -->
    <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <Sliders class="h-4 w-4" />
            <span>Tailored Solution</span>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">Custom Brand Capacity Plan</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
            Need a specific number of brands? Customize your capacity to fit your exact warehouse and brand agreements.
          </p>
        </div>

        <div class="w-full md:w-80 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs text-slate-500">Brands Needed:</span>
            <span class="text-lg font-black text-indigo-600 dark:text-indigo-400">{{ customBrandCount }} Brands</span>
          </div>
          <input
            type="range"
            min="2"
            max="30"
            v-model.number="customBrandCount"
            class="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div class="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>2 Brands</span>
            <span>30 Brands</span>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <div class="text-[10px] text-slate-400">Price:</div>
              <div class="text-sm font-black text-slate-900 dark:text-white">
                PKR {{ (customBrandCount * 500).toLocaleString() }}/mo
              </div>
            </div>
            <button
              @click="openCheckout('custom')"
              class="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-bold shadow transition-all"
            >
              Select Custom
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkout Modal -->
    <div 
      v-if="isCheckoutOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h3 class="text-base font-black text-slate-900 dark:text-white">Complete Subscription</h3>
            <p class="text-xs text-slate-500 capitalize">Upgrading to {{ selectedPlan }} Plan</p>
          </div>
          <button @click="isCheckoutOpen = false" class="text-slate-400 hover:text-slate-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="space-y-4">
          <!-- Summary Box -->
          <div class="rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 p-4 border border-indigo-100 dark:border-indigo-900 text-xs">
            <div class="flex justify-between py-1 text-slate-600 dark:text-slate-400">
              <span>Selected Plan:</span>
              <span class="font-bold text-slate-900 dark:text-white capitalize">{{ selectedPlan }}</span>
            </div>
            <div class="flex justify-between py-1 text-slate-600 dark:text-slate-400">
              <span>Brand Limit:</span>
              <span class="font-bold text-indigo-600 dark:text-indigo-400">
                {{ selectedPlan === 'enterprise' ? 'Unlimited' : (selectedPlan === 'custom' ? customBrandCount : (selectedPlan === 'pro' ? 5 : 1)) }} Brands
              </span>
            </div>
            <div class="flex justify-between py-1 text-slate-600 dark:text-slate-400">
              <span>Billing Cycle:</span>
              <span class="font-bold text-slate-900 dark:text-white capitalize">{{ billingCycle }}</span>
            </div>
            <div class="flex justify-between py-2 border-t border-indigo-200 dark:border-indigo-800/60 text-sm font-black text-slate-900 dark:text-white mt-1">
              <span>Total Payable:</span>
              <span class="font-mono text-indigo-600 dark:text-indigo-400">PKR {{ getPlanPrice(selectedPlan) }}</span>
            </div>
          </div>

          <!-- Payment Method Selection -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Select Payment Method</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="paymentMethod = 'bank'"
                :class="[
                  'rounded-xl border p-3 text-left transition-all text-xs font-bold',
                  paymentMethod === 'bank'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/70 dark:text-white'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                ]"
              >
                <Landmark class="h-4 w-4 mb-1 text-indigo-600" />
                <div>Bank Transfer</div>
              </button>
              <button
                type="button"
                @click="paymentMethod = 'jazzcash'"
                :class="[
                  'rounded-xl border p-3 text-left transition-all text-xs font-bold',
                  paymentMethod === 'jazzcash'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/70 dark:text-white'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                ]"
              >
                <Smartphone class="h-4 w-4 mb-1 text-rose-500" />
                <div>JazzCash / EasyPaisa</div>
              </button>
            </div>
          </div>

          <button
            @click="confirmUpgrade"
            :disabled="isUpgrading"
            class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 mt-2"
          >
            <Loader2 v-if="isUpgrading" class="h-4 w-4 animate-spin" />
            <span v-else>Activate Subscription Instantly</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <AppToast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import AppToast from '@/components/common/AppToast.vue';
import { 
  Crown, 
  Sparkles, 
  Check, 
  X, 
  Sliders, 
  Landmark, 
  Smartphone, 
  Loader2 
} from 'lucide-vue-next';

const authStore = useAuthStore();
const inventoryStore = useInventoryStore();
const toastRef = ref(null);

const billingCycle = ref('monthly');
const customBrandCount = ref(8);
const isCheckoutOpen = ref(false);
const selectedPlan = ref('pro');
const paymentMethod = ref('bank');
const isUpgrading = ref(false);

const getPlanPrice = (plan) => {
  if (plan === 'starter') return '0';
  if (plan === 'pro') return billingCycle.value === 'yearly' ? '24,000' : '2,500';
  if (plan === 'enterprise') return billingCycle.value === 'yearly' ? '48,000' : '5,000';
  if (plan === 'custom') return (customBrandCount.value * 500).toLocaleString();
  return '0';
};

const openCheckout = (plan) => {
  selectedPlan.value = plan;
  isCheckoutOpen.value = true;
};

const confirmUpgrade = async () => {
  isUpgrading.value = true;
  try {
    await authStore.upgradePlan(
      selectedPlan.value,
      billingCycle.value,
      selectedPlan.value === 'custom' ? customBrandCount.value : null
    );
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (_) {}

    isCheckoutOpen.value = false;
    toastRef.value?.showToast(`Upgraded to ${selectedPlan.value.toUpperCase()} successfully!`, 'success');
  } catch (err) {
    toastRef.value?.showToast(`Upgrade failed: ${err.message}`, 'error');
  } finally {
    isUpgrading.value = false;
  }
};
</script>
