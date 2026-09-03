<template>
  <div
    v-if="toast.show"
    class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-bold text-white shadow-2xl dark:bg-white dark:text-slate-900 border border-slate-700 dark:border-slate-200 animate-slideUp transition-all"
  >
    <CheckCircle v-if="toast.type === 'success'" class="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
    <AlertCircle v-else-if="toast.type === 'error'" class="h-4 w-4 text-rose-400 dark:text-rose-600" />
    <Info v-else class="h-4 w-4 text-indigo-400 dark:text-indigo-600" />
    <span>{{ toast.message }}</span>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { CheckCircle, AlertCircle, Info } from 'lucide-vue-next';

const toast = reactive({
  show: false,
  message: '',
  type: 'success'
});

let timeoutId = null;

const showToast = (message, type = 'success', duration = 3000) => {
  toast.message = message;
  toast.type = type;
  toast.show = true;
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    toast.show = false;
  }, duration);
};

defineExpose({
  showToast
});
</script>
