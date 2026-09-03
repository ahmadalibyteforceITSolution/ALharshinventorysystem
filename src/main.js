import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';
import { useInventoryStore } from './stores/inventoryStore';
import { useInvoiceStore } from './stores/invoiceStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize database & stores
const inventoryStore = useInventoryStore();
const invoiceStore = useInvoiceStore();

inventoryStore.init().then(() => {
  invoiceStore.fetchInvoices();
  app.mount('#app');
});
