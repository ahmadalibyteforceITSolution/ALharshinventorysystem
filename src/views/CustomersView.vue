<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
      <div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white">Customer Directory</h2>
        <p class="text-xs text-slate-500 mt-0.5">
          Maintain client records, contractor contacts, and purchase history (PDF Section 14)
        </p>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="openAddModal"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-all"
        >
          <Plus class="h-4 w-4" />
          <span>Add Customer</span>
        </button>
      </div>
    </div>

    <!-- Customers Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div
        v-for="customer in inventoryStore.customers"
        :key="customer.id"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-extrabold text-sm">
              {{ customer.name.substring(0, 2).toUpperCase() }}
            </div>
            <div>
              <h3 class="font-extrabold text-slate-900 dark:text-white text-sm">{{ customer.name }}</h3>
              <span class="text-xs text-slate-400">{{ customer.companyName || 'Individual Contractor' }}</span>
            </div>
          </div>

          <div class="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p v-if="customer.phone" class="flex items-center gap-2">
              <Phone class="h-3.5 w-3.5 text-slate-400" />
              <span>{{ customer.phone }}</span>
            </p>
            <p v-if="customer.email" class="flex items-center gap-2">
              <Mail class="h-3.5 w-3.5 text-slate-400" />
              <span>{{ customer.email }}</span>
            </p>
            <p v-if="customer.address" class="flex items-center gap-2">
              <MapPin class="h-3.5 w-3.5 text-slate-400" />
              <span class="line-clamp-1">{{ customer.address }}</span>
            </p>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            @click="createBillForCustomer(customer)"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500"
          >
            <span>Create Bill</span>
            <ArrowRight class="h-3.5 w-3.5" />
          </button>
          <div class="flex items-center gap-2">
            <button
              @click="editCustomer(customer)"
              class="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Edit
            </button>
            <button
              @click="deleteCustomer(customer.id || customer._id)"
              class="text-xs font-semibold text-rose-500 hover:text-rose-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div class="flex w-full max-w-md flex-col rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800">
          <h3 class="text-base font-bold text-slate-900 dark:text-white">
            {{ form.id ? 'Edit Customer' : 'Add New Customer' }}
          </h3>
          <button @click="isModalOpen = false" class="rounded p-1 text-slate-400 hover:bg-slate-100">
            <X class="h-5 w-5" />
          </button>
        </div>

        <form @submit.prevent="saveCustomer" class="p-6 space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Customer / Contact Person *</label>
            <input
              v-model="form.name"
              required
              placeholder="e.g. Tariq Mehmood"
              class="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Business / Firm Name</label>
            <input
              v-model="form.companyName"
              placeholder="e.g. Tariq Sanitary Store"
              class="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Phone / Mobile</label>
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
              placeholder="contact@business.com"
              class="w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1">Address / Delivery Site</label>
            <input
              v-model="form.address"
              placeholder="e.g. Shop # 12, Circular Road, Faisalabad"
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
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { Plus, Phone, Mail, MapPin, ArrowRight, X } from 'lucide-vue-next';

const router = useRouter();
const inventoryStore = useInventoryStore();
const invoiceStore = useInvoiceStore();

const isModalOpen = ref(false);
const form = reactive({
  id: null,
  name: '',
  companyName: '',
  phone: '',
  email: '',
  address: ''
});

const openAddModal = () => {
  form.id = null;
  form.name = '';
  form.companyName = '';
  form.phone = '';
  form.email = '';
  form.address = '';
  isModalOpen.value = true;
};

const editCustomer = (c) => {
  form.id = c.id;
  form.name = c.name;
  form.companyName = c.companyName || '';
  form.phone = c.phone || '';
  form.email = c.email || '';
  form.address = c.address || '';
  isModalOpen.value = true;
};

const saveCustomer = async () => {
  await inventoryStore.saveCustomer({ ...form });
  isModalOpen.value = false;
};

const createBillForCustomer = (customer) => {
  invoiceStore.initNewInvoice('invoice');
  invoiceStore.activeInvoice.customerName = customer.name;
  invoiceStore.activeInvoice.customerContact = customer.phone || '';
  invoiceStore.activeInvoice.customerAddress = customer.address || '';
  router.push('/invoices/create');
};

const deleteCustomer = async (id) => {
  if (confirm('Are you sure you want to delete this customer?')) {
    await inventoryStore.deleteCustomer(id);
  }
};
</script>
