<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
      <div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Companies & Brands</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Configure manufacturer brands, contact details, and brand-level default discounts (PDF Section 2 & 6)
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-all"
        >
          <Plus class="h-4 w-4" />
          <span>Add Brand</span>
        </button>
      </div>
    </div>

    <!-- Companies Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="company in inventoryStore.companies"
        :key="company.id"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between relative overflow-hidden"
      >
        <div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div 
                class="flex h-12 w-12 items-center justify-center rounded-2xl text-white font-black text-lg shadow-sm"
                :style="{ backgroundColor: company.color || '#4f46e5' }"
              >
                {{ company.code || company.name.substring(0, 2).toUpperCase() }}
              </div>
              <div>
                <h3 class="font-black text-slate-900 dark:text-white text-base">{{ company.name }}</h3>
                <span class="text-xs font-mono text-slate-400">Code: {{ company.code }}</span>
              </div>
            </div>

            <span 
              v-if="company.isDefault"
              class="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-black uppercase text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
            >
              Default
            </span>
          </div>

          <!-- Default Discount Pill -->
          <div class="my-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span class="text-xs text-slate-500 font-medium">Default Discount Rate:</span>
            <span class="text-base font-black text-emerald-600">{{ company.defaultDiscount }}%</span>
          </div>

          <!-- Contact Details -->
          <div class="space-y-1.5 text-xs text-slate-500">
            <p v-if="company.phone"><strong>Phone:</strong> {{ company.phone }}</p>
            <p v-if="company.email"><strong>Email:</strong> {{ company.email }}</p>
            <p v-if="company.address"><strong>Factory:</strong> {{ company.address }}</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            @click="editCompany(company)"
            class="rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Edit Brand
          </button>
          <button
            v-if="!company.isDefault"
            @click="deleteCompany(company.id)"
            class="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800"
          >
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Company Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div class="flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ form.id ? 'Edit Brand' : 'Add New Brand' }}
          </h3>
          <button @click="isModalOpen = false" class="rounded p-1 text-slate-400 hover:bg-slate-100">
            <X class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="saveCompany" class="p-6 space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
            <input
              v-model="form.name"
              required
              placeholder="e.g. Popular, Dura Flow, Master"
              class="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Brand Code *</label>
              <input
                v-model="form.code"
                required
                placeholder="e.g. POPU, DURA"
                class="w-full font-mono uppercase rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Default Discount % *</label>
              <input
                v-model.number="form.defaultDiscount"
                type="number"
                min="0"
                max="100"
                required
                class="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-bold"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Brand Accent Color</label>
            <div class="flex items-center gap-2">
              <input
                v-model="form.color"
                type="color"
                class="h-9 w-12 rounded border border-slate-300 cursor-pointer"
              />
              <input
                v-model="form.color"
                type="text"
                class="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 font-mono dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
            <input
              v-model="form.phone"
              placeholder="+92 300 0000000"
              class="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="sales@company.com"
              class="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
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
              Save Brand
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useInventoryStore } from '@/stores/inventoryStore';
import { Plus, Trash2, X } from 'lucide-vue-next';

const inventoryStore = useInventoryStore();

const isModalOpen = ref(false);
const form = reactive({
  id: null,
  name: '',
  code: '',
  defaultDiscount: 10,
  color: '#4f46e5',
  phone: '',
  email: '',
  address: '',
  isDefault: false
});

const openAddModal = () => {
  form.id = null;
  form.name = '';
  form.code = '';
  form.defaultDiscount = 10;
  form.color = '#4f46e5';
  form.phone = '';
  form.email = '';
  form.address = '';
  form.isDefault = false;
  isModalOpen.value = true;
};

const editCompany = (company) => {
  form.id = company.id;
  form.name = company.name;
  form.code = company.code;
  form.defaultDiscount = company.defaultDiscount;
  form.color = company.color || '#4f46e5';
  form.phone = company.phone || '';
  form.email = company.email || '';
  form.address = company.address || '';
  form.isDefault = company.isDefault || false;
  isModalOpen.value = true;
};

const saveCompany = async () => {
  await inventoryStore.saveCompany({ ...form });
  isModalOpen.value = false;
};

const deleteCompany = async (id) => {
  if (confirm('Delete this company and associated prices?')) {
    await inventoryStore.deleteCompany(id);
  }
};
</script>
