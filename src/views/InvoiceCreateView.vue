<template>
  <div class="space-y-6 max-w-7xl mx-auto">
    <!-- Top Actions & Type Selector -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
      <div>
        <div class="flex items-center gap-3">
          <span 
            :class="[
              'rounded-lg px-2.5 py-1 text-xs font-black uppercase tracking-wider',
              invoiceStore.activeInvoice.type === 'quotation' 
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
            ]"
          >
            {{ invoiceStore.activeInvoice.type }}
          </span>
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">
            {{ isEditing ? 'Edit' : 'Create' }} {{ invoiceStore.activeInvoice.type === 'quotation' ? 'Quotation' : 'Invoice' }}
          </h2>
        </div>
        <p class="text-xs text-slate-500 mt-1">
          Draft No: <strong class="font-mono text-slate-700 dark:text-slate-300">{{ invoiceStore.activeInvoice.invoiceNumber }}</strong> • Common code linked pricing engine
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Switch Type Toggle -->
        <button
          @click="toggleType"
          class="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          Switch to {{ invoiceStore.activeInvoice.type === 'quotation' ? 'Tax Invoice' : 'Quotation' }}
        </button>

        <!-- Compare All Brands Button (PDF Section 5 & 14) -->
        <button
          @click="isComparisonModalOpen = true"
          :disabled="invoiceStore.activeInvoice.items.length === 0"
          class="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 shadow-sm hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300 transition-all"
        >
          <ArrowLeftRight class="h-4 w-4" />
          <span>Compare All Brands</span>
        </button>

        <!-- Print / PDF Preview -->
        <button
          @click="isPrintModalOpen = true"
          :disabled="invoiceStore.activeInvoice.items.length === 0"
          class="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <Printer class="h-4 w-4" />
          <span>Print / PDF</span>
        </button>

        <!-- Save Bill -->
        <button
          @click="saveInvoice"
          :disabled="isSaving || invoiceStore.activeInvoice.items.length === 0"
          class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-all"
        >
          <Save class="h-4 w-4" />
          <span>{{ isSaving ? 'Saving...' : 'Save & Finalize' }}</span>
        </button>
      </div>
    </div>

    <!-- Company Switch Notice Banner (PDF Page 3 & 4) -->
    <div 
      v-if="invoiceStore.switchNotice" 
      class="rounded-xl border border-indigo-200 bg-indigo-50/90 p-4 text-xs dark:border-indigo-900 dark:bg-indigo-950/60 transition-all animate-fadeIn flex items-start justify-between gap-3"
    >
      <div class="flex items-start gap-3">
        <div class="rounded-lg bg-indigo-600 p-1.5 text-white shrink-0 mt-0.5">
          <Sparkles class="h-4 w-4" />
        </div>
        <div>
          <p class="font-bold text-indigo-900 dark:text-indigo-200 text-sm">
            Company switched to {{ invoiceStore.switchNotice.to }}!
          </p>
          <p class="text-indigo-700 dark:text-indigo-300 mt-0.5">
            Updated {{ invoiceStore.switchNotice.updatedCount }} items using 
            <strong>{{ invoiceStore.switchNotice.to }}</strong>'s price list & default discount.
            <span v-if="invoiceStore.switchNotice.unavailableCount > 0" class="text-rose-600 font-bold ml-1">
              ({{ invoiceStore.switchNotice.unavailableCount }} item(s) not available in this company).
            </span>
          </p>
        </div>
      </div>
      <button @click="invoiceStore.switchNotice = null" class="text-indigo-400 hover:text-indigo-600">
        <X class="h-4 w-4" />
      </button>
    </div>

    <!-- Top Metadata Card: Customer, Date, and BRAND SWITCHER -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 1. Customer & Bill Info -->
      <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
          Invoice & Customer Details
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Customer Name</label>
            <input
              v-model="invoiceStore.activeInvoice.customerName"
              type="text"
              placeholder="e.g. Al-Madina Builders"
              class="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone / WhatsApp</label>
            <input
              v-model="invoiceStore.activeInvoice.customerContact"
              type="text"
              placeholder="+92 300 1234567"
              class="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Issue Date</label>
            <input
              v-model="invoiceStore.activeInvoice.date"
              type="date"
              class="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div class="mt-4">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Delivery / Project Address</label>
          <input
            v-model="invoiceStore.activeInvoice.customerAddress"
            type="text"
            placeholder="e.g. Site # 12, Phase 6 DHA, Lahore"
            class="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      <!-- 2. BRAND / COMPANY SWITCHER (The Core Feature - PDF Section 1, 4, 5, 7) -->
      <div class="rounded-2xl border-2 border-indigo-500/80 bg-gradient-to-br from-indigo-50/50 to-white p-6 shadow-sm dark:border-indigo-500/50 dark:from-slate-900 dark:to-indigo-950/20 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-black uppercase tracking-wider text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles class="h-3.5 w-3.5" />
              Active Pricing Brand
            </span>
            <span class="rounded bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
              1-Click Switch
            </span>
          </div>

          <!-- Brand Switcher Dropdown & Quick Badges -->
          <label class="block text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">
            Select Company / Brand to price all items:
          </label>
          <select
            :value="invoiceStore.activeInvoice.companyId"
            @change="handleCompanyChange($event.target.value)"
            class="w-full rounded-xl border-2 border-indigo-500 bg-white px-3.5 py-2.5 text-sm font-black text-slate-900 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 dark:bg-slate-800 dark:text-white"
          >
            <option 
              v-for="comp in inventoryStore.companies" 
              :key="comp._id || comp.id" 
              :value="comp._id || comp.id"
            >
              {{ comp.name }} (Default Discount: {{ comp.defaultDiscount }}%)
            </option>
          </select>

          <!-- Quick Brand Buttons with Logos -->
          <div class="mt-3 flex flex-wrap gap-2">
            <button
              v-for="comp in inventoryStore.companies"
              :key="comp._id || comp.id"
              type="button"
              @click="handleCompanyChange(comp._id || comp.id)"
              :class="[
                'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border',
                (comp._id || comp.id) === invoiceStore.activeInvoice.companyId
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
              ]"
            >
              <img v-if="comp.logo" :src="comp.logo" class="h-4 w-4 rounded object-contain bg-white" alt="logo" />
              <span>{{ comp.name }}</span>
            </button>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-indigo-100 dark:border-slate-800 text-xs text-slate-500">
          Switching company will update all {{ invoiceStore.activeInvoice.items.length }} line items instantly without re-typing.
        </div>
      </div>
    </div>

    <!-- Product Table Section (PDF Section 4 & 6) -->
    <div class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
      <!-- Section Header with "Add Product" button -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-800 gap-3 bg-slate-50/50 dark:bg-slate-950/40">
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Invoice Line Items ({{ invoiceStore.activeInvoice.items.length }})
          </h3>
          <p class="text-xs text-slate-500">Each item is linked via its unique Common Product Code</p>
        </div>

        <div class="flex items-center gap-2">
          <!-- Fast Product Search Button (PDF Section 10 & 13) -->
          <button
            @click="isSelectorModalOpen = true"
            class="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-500 transition-all"
          >
            <Plus class="h-4 w-4" />
            <span>Search & Add Product</span>
          </button>
        </div>
      </div>

      <!-- Line Items Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-slate-200 bg-slate-100/70 text-slate-600 font-bold dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 uppercase tracking-wider">
            <tr>
              <th class="py-3 px-4 w-12 text-center">#</th>
              <th class="py-3 px-4 w-28">Common Code</th>
              <th class="py-3 px-4 min-w-[180px]">Product Name</th>
              <th class="py-3 px-4 w-28 text-right">Unit Price</th>
              <th class="py-3 px-4 w-24 text-center">Quantity</th>
              <th class="py-3 px-4 w-28 text-right">Gross (Rs.)</th>
              <th class="py-3 px-4 w-32 text-center">Discount %</th>
              <th class="py-3 px-4 w-32 text-right">Net Total (Rs.)</th>
              <th class="py-3 px-4 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <!-- Empty state -->
            <tr v-if="invoiceStore.activeInvoice.items.length === 0">
              <td colspan="9" class="py-12 text-center">
                <PackageSearch class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-2" />
                <p class="text-sm font-semibold text-slate-700 dark:text-slate-300">No products added to this invoice yet.</p>
                <p class="text-xs text-slate-400 mt-1">Click "Search & Add Product" to pick items from Sanitary, Electrical, or Hardware.</p>
                <button
                  @click="isSelectorModalOpen = true"
                  class="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-500"
                >
                  <Search class="h-4 w-4" />
                  Search Catalog
                </button>
              </td>
            </tr>

            <!-- Item Rows -->
            <tr 
              v-for="(item, idx) in invoiceStore.activeInvoice.items" 
              :key="item.commonCode"
              :class="[
                'group hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors',
                item.isAvailable === false ? 'bg-rose-50/60 dark:bg-rose-950/20' : ''
              ]"
            >
              <!-- Index -->
              <td class="py-3.5 px-4 text-center font-bold text-slate-400">{{ idx + 1 }}</td>

              <!-- Common Code (PDF Section 3 & 12) -->
              <td class="py-3.5 px-4">
                <span class="font-mono font-extrabold text-xs text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-1 rounded border border-indigo-200 dark:border-indigo-800">
                  {{ item.commonCode }}
                </span>
              </td>

              <!-- Product Name & Availability Warning (PDF Page 5) -->
              <td class="py-3.5 px-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ item.productName }}</div>
                <div v-if="item.isAvailable === false" class="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                  <AlertCircle class="h-3 w-3" />
                  Product not available for this company
                </div>
              </td>

              <!-- Unit Price -->
              <td class="py-3.5 px-4 text-right">
                <span v-if="item.isAvailable !== false" class="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {{ Number(item.unitPrice).toLocaleString() }}
                </span>
                <span v-else class="text-rose-500 font-bold text-xs">--</span>
              </td>

              <!-- Quantity Input -->
              <td class="py-3.5 px-4 text-center">
                <input
                  type="number"
                  min="1"
                  :value="item.quantity"
                  @input="invoiceStore.updateItem(idx, { quantity: $event.target.value })"
                  class="w-16 rounded-lg border border-slate-300 py-1 text-center font-bold text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </td>

              <!-- Gross Amount -->
              <td class="py-3.5 px-4 text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                <span v-if="item.isAvailable !== false">
                  {{ Number(item.grossAmount).toLocaleString() }}
                </span>
                <span v-else class="text-slate-400">0</span>
              </td>

              <!-- Discount % Input (Flexible: PDF Section 6) -->
              <td class="py-3.5 px-4">
                <div class="flex items-center justify-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    :value="item.discountPercent"
                    @input="invoiceStore.updateItem(idx, { discountPercent: $event.target.value })"
                    class="w-16 rounded-lg border border-slate-300 py-1 text-center font-bold text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <span class="text-slate-400 font-bold">%</span>
                </div>
                <div class="text-center mt-1">
                  <span 
                    v-if="item.isDiscountCustom" 
                    class="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded"
                  >
                    Custom
                  </span>
                  <span v-else class="text-[9px] text-slate-400">Brand Default</span>
                </div>
              </td>

              <!-- Net Total -->
              <td class="py-3.5 px-4 text-right font-mono font-black text-sm text-slate-900 dark:text-white">
                <span v-if="item.isAvailable !== false">
                  Rs. {{ Number(item.netAmount).toLocaleString() }}
                </span>
                <span v-else class="text-rose-500 font-bold text-xs">0</span>
              </td>

              <!-- Remove -->
              <td class="py-3.5 px-4 text-center">
                <button
                  @click="invoiceStore.removeItem(idx)"
                  class="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-slate-800"
                  title="Remove Item"
                >
                  <Trash2 class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Quick Add Row (PDF Page 8: Select Company -> Search Product -> Select -> Enter Qty -> Add) -->
      <div class="border-t border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-2">
          <button
            @click="isSelectorModalOpen = true"
            class="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <Plus class="h-3.5 w-3.5 text-indigo-600" />
            <span>Add More Products</span>
          </button>
          <span class="text-xs text-slate-400">or press Tab to navigate fields</span>
        </div>

        <!-- Unavailable products warning badge -->
        <div v-if="invoiceStore.unavailableCount > 0" class="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-3 py-1.5 text-xs font-bold text-rose-700 dark:bg-rose-950/50 dark:border-rose-900">
          <AlertTriangle class="h-4 w-4 shrink-0" />
          <span>{{ invoiceStore.unavailableCount }} item(s) currently unavailable for {{ invoiceStore.activeInvoice.companyName }}.</span>
        </div>
      </div>
    </div>

    <!-- Bottom Totals & Notes Section (PDF Section 4 & 9) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Notes & Terms -->
      <div class="lg:col-span-2 space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <label class="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
            Invoice Notes
          </label>
          <textarea
            v-model="invoiceStore.activeInvoice.notes"
            rows="2"
            placeholder="Special instructions, delivery timeline, or notes for client..."
            class="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          ></textarea>

          <label class="block text-xs font-black uppercase tracking-wider text-slate-400 mt-4 mb-2">
            Terms & Conditions
          </label>
          <textarea
            v-model="invoiceStore.activeInvoice.terms"
            rows="3"
            class="w-full rounded-xl border border-slate-300 p-3 text-xs text-slate-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white font-mono"
          ></textarea>
        </div>
      </div>

      <!-- Financial Calculations Card -->
      <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between">
        <div>
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
            Financial Summary
          </h3>

          <div class="space-y-3 text-xs">
            <!-- Gross Total -->
            <div class="flex justify-between py-1 text-slate-600 dark:text-slate-400">
              <span class="font-medium">Gross Subtotal:</span>
              <span class="font-mono font-bold text-slate-900 dark:text-white">
                Rs. {{ invoiceStore.grossTotal.toLocaleString() }}
              </span>
            </div>

            <!-- Discount Total -->
            <div class="flex justify-between py-1 text-emerald-600 dark:text-emerald-400">
              <span class="font-medium">Total Discount Applied:</span>
              <span class="font-mono font-bold">
                -Rs. {{ invoiceStore.discountTotal.toLocaleString() }}
              </span>
            </div>

            <!-- Net Subtotal -->
            <div class="flex justify-between py-1 text-slate-800 dark:text-slate-200 font-semibold border-t border-slate-100 dark:border-slate-800 pt-2">
              <span>Net Subtotal:</span>
              <span class="font-mono">
                Rs. {{ invoiceStore.netSubtotal.toLocaleString() }}
              </span>
            </div>

            <!-- Optional Tax / GST Toggle (PDF Page 8) -->
            <div class="flex items-center justify-between py-2 border-t border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2">
                <span class="font-medium text-slate-600 dark:text-slate-400">Sales Tax / GST:</span>
                <select
                  v-model.number="invoiceStore.activeInvoice.taxPercent"
                  class="rounded-lg border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-bold dark:border-slate-700 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option :value="0">0% (None)</option>
                  <option :value="18">18% Standard GST</option>
                  <option :value="15">15% Services</option>
                </select>
              </div>
              <span class="font-mono font-bold text-slate-900 dark:text-white">
                Rs. {{ invoiceStore.taxAmount.toLocaleString() }}
              </span>
            </div>

            <!-- Grand Total -->
            <div class="mt-4 rounded-xl bg-slate-900 p-4 text-white dark:bg-indigo-950/60 dark:border dark:border-indigo-800">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-wider text-slate-300">Grand Total</span>
                <span class="rounded bg-indigo-500 px-2 py-0.5 text-[10px] font-bold text-white uppercase">PKR</span>
              </div>
              <div class="text-2xl sm:text-3xl font-black mt-2 font-mono">
                Rs. {{ invoiceStore.grandTotal.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>

        <!-- Primary Save/Share Actions -->
        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            @click="saveInvoice"
            :disabled="isSaving || invoiceStore.activeInvoice.items.length === 0"
            class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition-all"
          >
            <Check class="h-4 w-4" />
            <span>Save & Complete Invoice</span>
          </button>

          <button
            @click="isPrintModalOpen = true"
            :disabled="invoiceStore.activeInvoice.items.length === 0"
            class="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <Printer class="h-4 w-4" />
            <span>Print or Download PDF</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <!-- 1. Fast Product Search Modal -->
    <ProductSelectorModal
      :is-open="isSelectorModalOpen"
      :active-company-id="invoiceStore.activeInvoice.companyId"
      :active-company-name="invoiceStore.activeInvoice.companyName"
      @close="isSelectorModalOpen = false"
      @add-item="handleAddProduct"
    />

    <!-- 2. Side-by-Side Brand Comparison Modal (PDF Section 5 & 14) -->
    <CompanyComparisonModal
      :is-open="isComparisonModalOpen"
      @close="isComparisonModalOpen = false"
      @switched="isComparisonModalOpen = false"
    />

    <!-- 3. Print & PDF Preview Modal -->
    <InvoicePrintModal
      :is-open="isPrintModalOpen"
      :invoice="invoiceStore.activeInvoice"
      @close="isPrintModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInventoryStore } from '@/stores/inventoryStore';
import { useInvoiceStore } from '@/stores/invoiceStore';
import ProductSelectorModal from '@/components/invoice/ProductSelectorModal.vue';
import CompanyComparisonModal from '@/components/invoice/CompanyComparisonModal.vue';
import InvoicePrintModal from '@/components/invoice/InvoicePrintModal.vue';
import { 
  Sparkles, 
  ArrowLeftRight, 
  Printer, 
  Save, 
  Plus, 
  Search, 
  Trash2, 
  Check, 
  X, 
  AlertCircle, 
  AlertTriangle, 
  PackageSearch 
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const inventoryStore = useInventoryStore();
const invoiceStore = useInvoiceStore();

const isSelectorModalOpen = ref(false);
const isComparisonModalOpen = ref(false);
const isPrintModalOpen = ref(false);
const isSaving = ref(false);

const isEditing = computed(() => !!route.params.id);

watch(() => inventoryStore.companies, (comps) => {
  if (comps && comps.length > 0 && !invoiceStore.activeInvoice.companyId && !route.params.id) {
    const def = comps.find(c => c.isDefault) || comps[0];
    invoiceStore.activeInvoice.companyId = def._id || def.id;
    invoiceStore.activeInvoice.companyName = def.name;
  }
}, { immediate: true });

onMounted(async () => {
  if (route.params.id) {
    await invoiceStore.loadInvoice(route.params.id);
  } else {
    if (!invoiceStore.activeInvoice.companyId) {
      invoiceStore.initNewInvoice('invoice');
    }
  }
});

const toggleType = () => {
  invoiceStore.activeInvoice.type = 
    invoiceStore.activeInvoice.type === 'invoice' ? 'quotation' : 'invoice';
};

const handleCompanyChange = (newCompanyId) => {
  invoiceStore.switchCompany(newCompanyId);
};

const handleAddProduct = (product) => {
  invoiceStore.addItem(product, 1);
  isSelectorModalOpen.value = false;
};

const saveInvoice = async () => {
  if (invoiceStore.activeInvoice.items.length === 0) return;
  isSaving.value = true;
  try {
    await invoiceStore.saveActiveInvoice();
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {
      // Confetti is decorative
    }
    router.push('/invoices');
  } catch (err) {
    console.error('Error saving invoice:', err);
  } finally {
    isSaving.value = false;
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
