<template>
  <div class="min-h-screen flex flex-col justify-center bg-slate-900 text-white relative overflow-hidden py-12">
    <!-- Ambient Background Gradients -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-md w-full mx-auto px-6 relative z-10">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 text-white shadow-xl shadow-emerald-500/20 mb-3">
          <Store class="h-7 w-7" />
        </div>
        <h1 class="text-2xl font-black tracking-tight text-white">Create Shop Account</h1>
        <p class="text-xs font-semibold text-slate-400 mt-1">
          Start your clean multi-brand inventory & billing workspace
        </p>
      </div>

      <!-- Card Container -->
      <div class="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl">
        <div 
          v-if="errorMessage" 
          class="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-center gap-2"
        >
          <AlertCircle class="h-4 w-4 shrink-0 text-rose-400" />
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
            <div class="relative">
              <User class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input 
                v-model="form.name" 
                type="text" 
                required 
                placeholder="Ahmed Ali"
                class="w-full rounded-xl bg-slate-900/80 border border-slate-700 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Shop / Business Name *</label>
            <div class="relative">
              <Store class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input 
                v-model="form.businessName" 
                type="text" 
                required 
                placeholder="Al-Madina Sanitary & Pipe Center"
                class="w-full rounded-xl bg-slate-900/80 border border-slate-700 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input 
                v-model="form.email" 
                type="email" 
                required 
                placeholder="ahmed@example.com"
                class="w-full rounded-xl bg-slate-900/80 border border-slate-700 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Password *</label>
            <div class="relative">
              <Lock class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input 
                v-model="form.password" 
                type="password" 
                required 
                placeholder="At least 6 characters"
                class="w-full rounded-xl bg-slate-900/80 border border-slate-700 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <!-- Plan Notice -->
          <div class="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-start gap-2">
            <ShieldCheck class="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span class="font-bold">Starter Plan Included:</span> 
              Includes 1 Brand & 50 Products. You can upgrade anytime to Pro or Enterprise for more brands.
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 mt-2"
          >
            <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
            <span v-else>Register & Launch Workspace</span>
          </button>
        </form>

        <div class="mt-6 text-center text-xs text-slate-400">
          Already have an account?
          <router-link to="/login" class="font-bold text-indigo-400 hover:text-indigo-300 ml-1 underline">
            Sign In here
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { Store, User, Mail, Lock, AlertCircle, Loader2, ShieldCheck } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const inventoryStore = useInventoryStore();
const invoiceStore = useInvoiceStore();

const form = reactive({
  name: '',
  businessName: '',
  email: '',
  password: '',
  plan: 'starter'
});

const errorMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await authStore.register(form);
    // Reload freshly isolated store
    await inventoryStore.fetchAll();
    await invoiceStore.fetchInvoices();
    router.push('/');
  } catch (err) {
    errorMessage.value = err.message || 'Registration failed';
  } finally {
    isLoading.value = false;
  }
};
</script>
