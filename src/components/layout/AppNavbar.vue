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
            <h1 class="text-base font-bold tracking-tight text-slate-900 dark:text-white">Al-Harsh</h1>
            <span class="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
              v1.0 Pro
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Product Pricing, Quotation & Invoice System</p>
        </div>
      </div>
    </div>

    <!-- Right Header Actions -->
    <div class="flex items-center gap-3">
      <!-- Quick Action Buttons -->
      <router-link
        to="/invoices/create"
        class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
      >
        <PlusCircle class="h-4 w-4" />
        <span>Create Bill</span>
      </router-link>

      <!-- Live Vercel Badge -->
      <a
        href="https://a-lharshinventorysystem.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300"
        title="Open Live Vercel App"
      >
        <ExternalLink class="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        <span>Vercel Live</span>
      </a>

      <!-- Active Database Status Pill -->
      <div class="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300 md:flex">
        <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>MongoDB Connected</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Menu, Layers, PlusCircle, ExternalLink } from 'lucide-vue-next';

defineEmits(['toggle-sidebar']);
</script>
