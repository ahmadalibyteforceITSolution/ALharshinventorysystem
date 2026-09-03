<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn"
  >
    <div
      class="flex w-full max-w-md flex-col rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all scale-100"
    >
      <!-- Icon & Title -->
      <div class="flex items-start gap-4">
        <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
          <AlertTriangle class="h-6 w-6" />
        </div>
        <div class="flex-1">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ title || 'Confirm Deletion' }}
          </h3>
          <p class="text-xs text-slate-500 mt-1 leading-relaxed">
            {{ message || 'Are you sure you want to delete this item? This action will permanently remove it from the database and cannot be undone.' }}
          </p>

          <div v-if="itemName" class="mt-3 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
            <span class="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
              {{ itemName }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          @click="$emit('cancel')"
          class="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="$emit('confirm')"
          :disabled="isDeleting"
          class="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-500 disabled:opacity-50 transition-all"
        >
          <Trash2 class="h-3.5 w-3.5" />
          <span>{{ isDeleting ? 'Deleting...' : (confirmText || 'Delete Item') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle, Trash2 } from 'lucide-vue-next';

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Delete Item'
  },
  message: {
    type: String,
    default: ''
  },
  itemName: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Delete'
  },
  isDeleting: {
    type: Boolean,
    default: false
  }
});

defineEmits(['confirm', 'cancel']);
</script>
