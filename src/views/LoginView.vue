<template>
  <div class="min-h-screen flex flex-col justify-center bg-slate-900 text-white relative overflow-hidden">
    <!-- Ambient Background Gradients -->
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-md w-full mx-auto px-6 py-12 relative z-10">
      <!-- Logo & System Title -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white shadow-xl shadow-indigo-500/25 mb-4">
          <Layers class="h-8 w-8" />
        </div>
        <h1 class="text-2xl font-black tracking-tight text-white">Al-Harsh System</h1>
        <p class="text-xs font-semibold text-indigo-300 mt-1 uppercase tracking-wider">
          Multi-Brand Inventory & Quotation Suite
        </p>
      </div>

      <!-- Card Container -->
      <div class="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-8 shadow-2xl">
        <h2 class="text-lg font-bold text-white mb-2">Sign in to your account</h2>
        <p class="text-xs text-slate-400 mb-6">Enter your credentials to access your isolated workspace.</p>

        <!-- Error Alert -->
        <div 
          v-if="errorMessage" 
          class="mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs text-rose-300 flex items-center gap-2"
        >
          <AlertCircle class="h-4 w-4 shrink-0 text-rose-400" />
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input 
                v-model="email" 
                type="email" 
                required 
                placeholder="admin@alharsh.com"
                class="w-full rounded-xl bg-slate-900/80 border border-slate-700 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Password</label>
            <div class="relative">
              <Lock class="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input 
                v-model="password" 
                type="password" 
                required 
                placeholder="••••••••"
                class="w-full rounded-xl bg-slate-900/80 border border-slate-700 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            <Loader2 v-if="isLoading" class="h-4 w-4 animate-spin" />
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Quick 1-Click Master Admin Demo Login -->
        <div class="mt-6 pt-6 border-t border-slate-700/60">
          <p class="text-[11px] text-center text-slate-400 mb-2">Need quick access to existing catalog?</p>
          <button
            type="button"
            @click="demoAdminLogin"
            :disabled="isLoading"
            class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-700/50 hover:bg-slate-700 border border-slate-600 py-2.5 text-xs font-bold text-indigo-300 hover:text-white transition-all"
          >
            <Sparkles class="h-4 w-4 text-indigo-400" />
            <span>1-Click Master Admin (Existing Products)</span>
          </button>
        </div>

        <!-- Registration Link -->
        <div class="mt-6 text-center text-xs text-slate-400">
          New user?
          <router-link to="/register" class="font-bold text-indigo-400 hover:text-indigo-300 ml-1 underline">
            Register new shop account
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { Layers, Mail, Lock, AlertCircle, Loader2, Sparkles } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const inventoryStore = useInventoryStore();
const invoiceStore = useInvoiceStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;
  try {
    await authStore.login(email.value, password.value);
    // Reload tenant inventory and invoices
    await inventoryStore.fetchAll();
    await invoiceStore.fetchInvoices();
    router.push('/');
  } catch (err) {
    errorMessage.value = err.message || 'Login failed';
  } finally {
    isLoading.value = false;
  }
};

const demoAdminLogin = async () => {
  email.value = 'admin@alharsh.com';
  password.value = 'admin123';
  await handleLogin();
};
</script>
