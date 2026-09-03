<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in"
  >
    <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
      <!-- Icon -->
      <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5">
        <Crown class="h-7 w-7 text-amber-500" />
      </div>

      <!-- Title & Message -->
      <h3 class="text-lg font-black text-slate-900 dark:text-white">
        Brand Limit Reached
      </h3>
      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Your current <span class="font-bold text-indigo-600 dark:text-indigo-400 uppercase">{{ authStore.currentPlan }}</span> plan allows up to 
        <span class="font-bold text-slate-900 dark:text-white">{{ authStore.brandLimit }} Brand(s)</span>. 
        You currently have <span class="font-bold text-slate-900 dark:text-white">{{ currentCount }} Brand(s)</span> configured.
      </p>

      <!-- Comparison Perks -->
      <div class="mt-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-4 text-left border border-slate-200 dark:border-slate-700 text-xs space-y-2">
        <div class="font-bold text-slate-800 dark:text-slate-200 mb-1">Upgrade to Pro to unlock:</div>
        <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Check class="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Add up to <strong>5 Brands</strong> (Dura Flow, Popular, Turkplast, etc.)</span>
        </div>
        <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Check class="h-4 w-4 text-emerald-500 shrink-0" />
          <span>1-Click Brand Price Switcher on Invoices</span>
        </div>
        <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <Check class="h-4 w-4 text-emerald-500 shrink-0" />
          <span>Excel Multi-Brand Pricing Import/Export</span>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-6 flex flex-col gap-2">
        <button
          @click="goToSubscription"
          class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all"
        >
          <Sparkles class="h-4 w-4 text-amber-300" />
          <span>View Subscription Plans & Upgrade</span>
        </button>
        <button
          @click="$emit('close')"
          class="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          Maybe Later
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { Crown, Check, Sparkles } from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  currentCount: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['close']);
const router = useRouter();
const authStore = useAuthStore();

const goToSubscription = () => {
  emit('close');
  router.push('/subscription');
};
</script>
