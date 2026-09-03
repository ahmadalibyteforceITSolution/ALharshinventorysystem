<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
      <div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Companies & Brands</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Configure manufacturer brands, upload logos, contact details, and brand-level default discounts (PDF Section 2 & 6)
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

    <!-- Empty State -->
    <div v-if="inventoryStore.companies.length === 0" class="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 mb-4">
        <Building2 class="h-8 w-8" />
      </div>
      <h3 class="text-base font-bold text-slate-900 dark:text-white">No Brands Added Yet</h3>
      <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
        Add your first manufacturer brand (e.g. Dura Flow, Popular, Master) with its logo and default discount rate.
      </p>
      <button
        @click="openAddModal"
        class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-500"
      >
        <Plus class="h-4 w-4" />
        <span>Add First Brand</span>
      </button>
    </div>

    <!-- Companies Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="company in inventoryStore.companies"
        :key="company._id || company.id"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between relative overflow-hidden"
      >
        <div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <!-- Uploaded Brand Logo OR Initial Avatar -->
              <div class="flex-shrink-0">
                <img
                  v-if="company.logo"
                  :src="company.logo"
                  class="h-12 w-12 rounded-2xl object-contain bg-white border border-slate-200 dark:border-slate-700 p-1 shadow-sm"
                  alt="Brand Logo"
                />
                <div
                  v-else
                  class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-sm"
                >
                  {{ company.code || company.name.substring(0, 2).toUpperCase() }}
                </div>
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
            @click="deleteCompany(company._id || company.id)"
            class="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800"
            title="Delete Brand"
          >
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Company Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div class="flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ (form.id || form._id) ? 'Edit Brand' : 'Add New Brand' }}
          </h3>
          <button @click="isModalOpen = false" class="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="saveCompany" class="p-6 space-y-4 text-xs">
          <!-- Brand Logo Upload Section -->
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Brand Logo / Image</label>
            <div class="flex items-center gap-4">
              <!-- Thumbnail Preview -->
              <div class="relative h-16 w-16 flex-shrink-0 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-800">
                <img v-if="form.logo" :src="form.logo" class="h-full w-full object-contain p-1" alt="Logo preview" />
                <ImageIcon v-else class="h-6 w-6 text-slate-400" />
              </div>

              <!-- Upload Buttons -->
              <div class="flex-1 space-y-1.5">
                <div class="flex items-center gap-2">
                  <label class="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 cursor-pointer transition-colors">
                    <Upload class="h-3.5 w-3.5" />
                    <span>{{ form.logo ? 'Change Image' : 'Upload Logo' }}</span>
                    <input type="file" accept="image/*" @change="handleLogoUpload" class="hidden" />
                  </label>
                  <button
                    v-if="form.logo"
                    type="button"
                    @click="form.logo = ''"
                    class="rounded-xl px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    Remove
                  </button>
                </div>
                <p class="text-[11px] text-slate-400">PNG, JPG, WEBP, or SVG (Transparent logo recommended)</p>
              </div>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Brand Name *</label>
            <input
              v-model="form.name"
              required
              placeholder="e.g. Popular, Dura Flow, Master, Faisal"
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
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
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

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Factory / Office Address</label>
            <input
              v-model="form.address"
              placeholder="e.g. Industrial Area, Lahore"
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
import { Plus, Trash2, X, Upload, Image as ImageIcon, Building2 } from 'lucide-vue-next';

const inventoryStore = useInventoryStore();

const isModalOpen = ref(false);
const form = reactive({
  id: null,
  _id: null,
  name: '',
  code: '',
  defaultDiscount: 10,
  logo: '',
  phone: '',
  email: '',
  address: '',
  isDefault: false
});

const handleLogoUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file (PNG, JPG, WEBP, SVG).');
    return;
  }

  // Max 2MB check
  if (file.size > 2 * 1024 * 1024) {
    alert('Image file size should be less than 2MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    form.logo = e.target.result;
  };
  reader.readAsDataURL(file);
};

const openAddModal = () => {
  form.id = null;
  form._id = null;
  form.name = '';
  form.code = '';
  form.defaultDiscount = 10;
  form.logo = '';
  form.phone = '';
  form.email = '';
  form.address = '';
  form.isDefault = false;
  isModalOpen.value = true;
};

const editCompany = (company) => {
  form.id = company.id;
  form._id = company._id;
  form.name = company.name;
  form.code = company.code;
  form.defaultDiscount = company.defaultDiscount;
  form.logo = company.logo || '';
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
