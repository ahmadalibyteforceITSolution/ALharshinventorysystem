<template>
  <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 font-sans">
    <!-- Sidebar -->
    <AppSidebar 
      :is-open="isSidebarOpen" 
      @close="isSidebarOpen = false" 
    />

    <!-- Backdrop for mobile sidebar -->
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false"
      class="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
    ></div>

    <!-- Main Content Area -->
    <div class="flex flex-1 flex-col overflow-hidden">
      <!-- Navbar -->
      <AppNavbar 
        @toggle-sidebar="isSidebarOpen = !isSidebarOpen" 
      />

      <!-- Router View Container -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import AppNavbar from '@/components/layout/AppNavbar.vue';
import AppSidebar from '@/components/layout/AppSidebar.vue';

const isSidebarOpen = ref(false);
</script>
