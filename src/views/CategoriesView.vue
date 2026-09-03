<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
      <div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Product Categories</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          3 primary inventory categories as specified in PDF Section 2
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-all"
        >
          <Plus class="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>
    </div>

    <!-- Category Cards -->
    <div v-if="inventoryStore.categories.length === 0" class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
      <h3 class="text-base font-bold text-slate-900 dark:text-white">No Categories Added Yet</h3>
      <p class="text-xs text-slate-500 mt-1 mb-4">Add categories like Sanitary, Electrical, or Hardware.</p>
      <button @click="openAddModal" class="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500">
        Add First Category
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        v-for="category in paginatedCategories"
        :key="category.id || category._id"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                <FolderTree class="h-6 w-6" />
              </div>
              <h3 class="font-black text-slate-900 dark:text-white text-lg">{{ category.name }}</h3>
            </div>
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              {{ getItemCount(category.id) }} Products
            </span>
          </div>

          <p class="text-xs text-slate-500 mt-4 leading-relaxed">
            {{ category.description || 'General category for Al-Harsh inventory products.' }}
          </p>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <router-link
            to="/products"
            @click="inventoryStore.selectedCategoryFilter = category.id || category._id"
            class="text-xs font-bold text-indigo-600 hover:underline"
          >
            Browse Products →
          </router-link>
          <div class="flex items-center gap-2">
            <button
              @click="editCategory(category)"
              class="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            >
              Edit
            </button>
            <button
              @click="deleteCategory(category.id || category._id)"
              class="text-xs font-semibold text-rose-500 hover:text-rose-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 px-4 mt-6">
      <AppPagination
        v-model="currentPage"
        v-model:pageSize="pageSize"
        :totalItems="inventoryStore.categories.length"
        :pageSize="pageSize"
        :pageSizeOptions="[6, 9, 18, 36]"
      />
    </div>

    <!-- Add/Edit Category Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div class="flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ form.id ? 'Edit Category' : 'Add New Category' }}
          </h3>
          <button @click="isModalOpen = false" class="rounded p-1 text-slate-400 hover:bg-slate-100">
            <X class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="saveCategory" class="p-6 space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Category Name *</label>
            <input
              v-model="form.name"
              required
              placeholder="e.g. Sanitary, Electrical, Hardware"
              class="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              placeholder="e.g. Pipes, valves, bathroom fittings..."
              class="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            ></textarea>
          </div>

          <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              @click="isModalOpen = false"
              class="rounded-xl bg-slate-100 px-4 py-2 font-bold text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-xl bg-indigo-600 px-5 py-2 font-bold text-white shadow-sm hover:bg-indigo-500"
            >
              Save Category
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import AppPagination from '@/components/common/AppPagination.vue';
import { FolderTree, Plus, X } from 'lucide-vue-next';

const inventoryStore = useInventoryStore();

// Pagination State
const currentPage = ref(1);
const pageSize = ref(9);

const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return inventoryStore.categories.slice(start, start + pageSize.value);
});

const isModalOpen = ref(false);
const form = reactive({
  id: null,
  name: '',
  description: '',
  slug: ''
});

const getItemCount = (catId) => {
  return inventoryStore.products.filter(p => p.categoryId === catId).length;
};

const openAddModal = () => {
  form.id = null;
  form.name = '';
  form.description = '';
  form.slug = '';
  isModalOpen.value = true;
};

const editCategory = (cat) => {
  form.id = cat.id;
  form.name = cat.name;
  form.description = cat.description || '';
  form.slug = cat.slug || '';
  isModalOpen.value = true;
};

const saveCategory = async () => {
  form.slug = form.name.toLowerCase().replace(/\s+/g, '-');
  await inventoryStore.saveCategory({ ...form });
  isModalOpen.value = false;
};

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    await inventoryStore.deleteCategory(id);
  }
};
</script>
