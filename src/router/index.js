import { createRouter, createWebHistory } from 'vue-router';

import DashboardView from '@/views/DashboardView.vue';
import InvoiceCreateView from '@/views/InvoiceCreateView.vue';
import InvoicesListView from '@/views/InvoicesListView.vue';
import QuotationsListView from '@/views/QuotationsListView.vue';
import ProductsView from '@/views/ProductsView.vue';
import CommonCodesView from '@/views/CommonCodesView.vue';
import CompaniesView from '@/views/CompaniesView.vue';
import CategoriesView from '@/views/CategoriesView.vue';
import CustomersView from '@/views/CustomersView.vue';
import SettingsView from '@/views/SettingsView.vue';

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/invoices/create',
    name: 'invoice-create',
    component: InvoiceCreateView,
    meta: { title: 'Create Invoice / Quotation' }
  },
  {
    path: '/invoices/edit/:id',
    name: 'invoice-edit',
    component: InvoiceCreateView,
    meta: { title: 'Edit Invoice' }
  },
  {
    path: '/invoices',
    name: 'invoices-list',
    component: InvoicesListView,
    meta: { title: 'All Invoices' }
  },
  {
    path: '/quotations',
    name: 'quotations-list',
    component: QuotationsListView,
    meta: { title: 'Quotations' }
  },
  {
    path: '/products',
    name: 'products',
    component: ProductsView,
    meta: { title: 'Product Catalog & Pricing' }
  },
  {
    path: '/common-codes',
    name: 'common-codes',
    component: CommonCodesView,
    meta: { title: 'Common Codes & Equivalents' }
  },
  {
    path: '/companies',
    name: 'companies',
    component: CompaniesView,
    meta: { title: 'Companies & Brands' }
  },
  {
    path: '/categories',
    name: 'categories',
    component: CategoriesView,
    meta: { title: 'Categories' }
  },
  {
    path: '/customers',
    name: 'customers',
    component: CustomersView,
    meta: { title: 'Customer Management' }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { title: 'Settings & Data Backup' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title || 'Inventory'} | Al-Harsh System`;
  next();
});

export default router;
