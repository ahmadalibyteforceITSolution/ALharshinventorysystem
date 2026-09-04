<template>
  <div class="space-y-8 max-w-7xl mx-auto pb-12">
    <!-- Header Section -->
    <div class="text-center max-w-3xl mx-auto">
      <div class="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 mb-3">
        <Crown class="h-4 w-4 text-amber-500" />
        <span>Inventory & Brand Capacity Plans</span>
      </div>
      <h1 class="text-3xl font-black text-slate-900 dark:text-white tracking-tight sm:text-4xl">
        Scale Your Multi-Brand Inventory
      </h1>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Choose a plan that fits your manufacturer network. Unlock more brand price matrices and high-velocity invoicing.
      </p>

      <!-- Monthly / Yearly Billing Toggle -->
      <div class="mt-6 inline-flex items-center rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        <button
          @click="billingCycle = 'monthly'"
          :class="[
            'rounded-xl px-5 py-2 text-xs font-bold transition-all',
            billingCycle === 'monthly'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          ]"
        >
          Monthly Billing
        </button>
        <button
          @click="billingCycle = 'yearly'"
          :class="[
            'rounded-xl px-5 py-2 text-xs font-bold transition-all flex items-center gap-1.5',
            billingCycle === 'yearly'
              ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
          ]"
        >
          <span>Yearly Billing</span>
          <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            Save 20%
          </span>
        </button>
      </div>
    </div>

    <!-- Active Subscription Status Banner -->
    <div class="rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur">
          <Sparkles class="h-6 w-6 text-amber-300" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="text-base font-bold capitalize">Current Plan: {{ authStore.currentPlan }}</h3>
            <span class="rounded bg-indigo-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border border-indigo-400/30">
              Active
            </span>
          </div>
          <p class="text-xs text-indigo-200 mt-0.5">
            Brand Capacity: 
            <span class="font-bold text-white">
              {{ inventoryStore.companies.length }} / {{ authStore.isUnlimited ? 'Unlimited' : authStore.brandLimit }} brands used
            </span>
          </p>
        </div>
      </div>
      <div class="text-right">
        <div class="text-xs text-indigo-200">Shop / Account:</div>
        <div class="font-bold text-sm">{{ authStore.user?.businessName || 'Al-Harsh Store' }}</div>
      </div>
    </div>

    <!-- Pricing Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- 1. Starter Plan -->
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between relative">
        <div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Starter</h3>
              <p class="text-xs text-slate-500">For single-brand hardware stores</p>
            </div>
            <span class="rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-400">
              Free
            </span>
          </div>

          <div class="mb-6">
            <span class="text-3xl font-black text-slate-900 dark:text-white">PKR 0</span>
            <span class="text-xs text-slate-400"> / forever</span>
          </div>

          <ul class="space-y-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-5">
            <li class="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
              <Check class="h-4 w-4 shrink-0" />
              <span>Up to 1 Brand / Manufacturer</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Up to 50 Products</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Standard Invoices & Thermal Print</span>
            </li>
            <li class="flex items-center gap-2 text-slate-400">
              <X class="h-4 w-4 text-slate-300 shrink-0" />
              <span>Excel Import / Export</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            v-if="authStore.currentPlan === 'starter'"
            disabled
            class="w-full rounded-xl bg-slate-100 dark:bg-slate-800 py-2.5 text-xs font-bold text-slate-500 cursor-default"
          >
            Current Plan
          </button>
          <button
            v-else
            @click="openCheckout('starter')"
            class="w-full rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all"
          >
            Downgrade to Starter
          </button>
        </div>
      </div>

      <!-- 2. Pro Plan (Most Popular) -->
      <div class="rounded-3xl border-2 border-indigo-600 bg-white p-6 shadow-xl dark:bg-slate-900 flex flex-col justify-between relative ring-4 ring-indigo-500/10">
        <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3.5 py-0.5 text-[10px] font-black text-white uppercase tracking-wider shadow">
          Most Popular
        </div>

        <div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Pro Store</h3>
              <p class="text-xs text-slate-500">For multi-brand sanitary & pipes</p>
            </div>
            <span class="rounded-xl bg-indigo-50 dark:bg-indigo-950 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              5 Brands
            </span>
          </div>

          <div class="mb-6">
            <span class="text-3xl font-black text-slate-900 dark:text-white">
              PKR {{ billingCycle === 'yearly' ? '24,000' : '2,500' }}
            </span>
            <span class="text-xs text-slate-400"> / {{ billingCycle === 'yearly' ? 'year' : 'month' }}</span>
          </div>

          <ul class="space-y-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-5">
            <li class="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
              <Check class="h-4 w-4 shrink-0" />
              <span>Up to 5 Brands (Dura Flow, Popular, etc.)</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Unlimited Products & Catalog Items</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>1-Click Brand Price Switcher on Bills</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Excel Import & Export (Bulk Prices)</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Custom Brand Logos on A4 PDFs</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            v-if="authStore.currentPlan === 'pro'"
            disabled
            class="w-full rounded-xl bg-indigo-50 dark:bg-indigo-950/60 py-2.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 cursor-default"
          >
            Current Plan
          </button>
          <button
            v-else
            @click="openCheckout('pro')"
            class="w-full rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>

      <!-- 3. Enterprise Plan (Unlimited) -->
      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between relative">
        <div>
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">Enterprise</h3>
              <p class="text-xs text-slate-500">For large wholesale suppliers</p>
            </div>
            <span class="rounded-xl bg-purple-50 dark:bg-purple-950 px-3 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">
              Unlimited Brands
            </span>
          </div>

          <div class="mb-6">
            <span class="text-3xl font-black text-slate-900 dark:text-white">
              PKR {{ billingCycle === 'yearly' ? '48,000' : '5,000' }}
            </span>
            <span class="text-xs text-slate-400"> / {{ billingCycle === 'yearly' ? 'year' : 'month' }}</span>
          </div>

          <ul class="space-y-3 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-5">
            <li class="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400">
              <Check class="h-4 w-4 shrink-0" />
              <span>Unlimited Brands / Companies</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Unlimited Products & Invoices</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Multi-Brand Comparison Matrix</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Priority WhatsApp & Phone Support</span>
            </li>
            <li class="flex items-center gap-2">
              <Check class="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Multi-device & Team Access</span>
            </li>
          </ul>
        </div>

        <div class="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            v-if="authStore.currentPlan === 'enterprise'"
            disabled
            class="w-full rounded-xl bg-purple-50 dark:bg-purple-950/60 py-2.5 text-xs font-bold text-purple-600 dark:text-purple-400 cursor-default"
          >
            Current Plan
          </button>
          <button
            v-else
            @click="openCheckout('enterprise')"
            class="w-full rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 py-2.5 text-xs font-bold transition-all shadow-md"
          >
            Upgrade to Enterprise
          </button>
        </div>
      </div>
    </div>

    <!-- Custom Plan Builder Section -->
    <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <Sliders class="h-4 w-4" />
            <span>Tailored Solution</span>
          </div>
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">Custom Brand Capacity Plan</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-lg">
            Need a specific number of brands? Customize your capacity to fit your exact warehouse and brand agreements.
            Flat rate of PKR 500 per brand (Save 20% on yearly billing).
          </p>
        </div>

        <div class="w-full md:w-88 bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-bold text-slate-600 dark:text-slate-300">Brands Needed:</span>
            <div class="flex items-center gap-2">
              <button 
                type="button" 
                @click="customBrandCount = Math.max(2, customBrandCount - 1)" 
                :disabled="customBrandCount <= 2"
                class="h-6 w-6 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center text-xs font-bold disabled:opacity-30 transition-colors"
                title="Decrease brand capacity"
              >
                <Minus class="h-3 w-3" />
              </button>
              <span class="text-lg font-black text-indigo-600 dark:text-indigo-400 min-w-[70px] text-center">
                {{ customBrandCount }} Brands
              </span>
              <button 
                type="button" 
                @click="customBrandCount = Math.min(10, customBrandCount + 1)" 
                :disabled="customBrandCount >= 10"
                class="h-6 w-6 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex items-center justify-center text-xs font-bold disabled:opacity-30 transition-colors"
                title="Increase brand capacity"
              >
                <Plus class="h-3 w-3" />
              </button>
            </div>
          </div>
          <input
            type="range"
            min="2"
            max="10"
            v-model.number="customBrandCount"
            class="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <div class="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
            <span>2 Brands (Min)</span>
            <span>10 Brands (Enterprise Equiv.)</span>
          </div>

          <div v-if="customBrandCount === 10" class="mt-2 text-[10px] text-purple-600 dark:text-purple-400 font-bold bg-purple-50 dark:bg-purple-950/50 px-2.5 py-1 rounded-lg">
            Tip: 10 brands equals Enterprise price, which includes Unlimited Brands!
          </div>

          <div class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <div class="text-[10px] text-slate-400">Price:</div>
              <div class="text-sm font-black text-slate-900 dark:text-white">
                PKR {{ customPriceFormatted }}
              </div>
              <div v-if="billingCycle === 'yearly'" class="text-[10px] text-emerald-600 font-bold">
                Save 20% • PKR {{ (getCustomMonthlyPrice * 0.8).toLocaleString() }}/mo effective
              </div>
            </div>
            <button
              @click="openCheckout('custom')"
              class="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-xs font-bold shadow transition-all"
            >
              Select Custom
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkout Modal -->
    <div 
      v-if="isCheckoutOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div class="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
          <div>
            <h3 class="text-base font-black text-slate-900 dark:text-white">Complete Subscription</h3>
            <p class="text-xs text-slate-500 capitalize">Upgrading to {{ selectedPlan }} Plan</p>
          </div>
          <button @click="isCheckoutOpen = false" class="text-slate-400 hover:text-slate-600">
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="space-y-4">
          <!-- Summary Box -->
          <div class="rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 p-4 border border-indigo-100 dark:border-indigo-900 text-xs">
            <div class="flex justify-between py-1 text-slate-600 dark:text-slate-400">
              <span>Selected Plan:</span>
              <span class="font-bold text-slate-900 dark:text-white capitalize">{{ selectedPlan }}</span>
            </div>
            <div class="flex justify-between py-1 text-slate-600 dark:text-slate-400">
              <span>Brand Limit:</span>
              <span class="font-bold text-indigo-600 dark:text-indigo-400">
                {{ selectedPlan === 'enterprise' ? 'Unlimited' : (selectedPlan === 'custom' ? customBrandCount : (selectedPlan === 'pro' ? 5 : 1)) }} Brands
              </span>
            </div>
            <div class="flex justify-between py-1 text-slate-600 dark:text-slate-400">
              <span>Billing Cycle:</span>
              <span class="font-bold text-slate-900 dark:text-white capitalize">
                {{ billingCycle }} {{ billingCycle === 'yearly' ? '(Save 20%)' : '' }}
              </span>
            </div>
            <div class="flex justify-between py-2 border-t border-indigo-200 dark:border-indigo-800/60 text-sm font-black text-slate-900 dark:text-white mt-1">
              <span>Total Payable:</span>
              <span class="font-mono text-indigo-600 dark:text-indigo-400">PKR {{ getPlanPrice(selectedPlan) }}</span>
            </div>
          </div>

          <!-- Payment Method Selection -->
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Select Payment Method</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="paymentMethod = 'bank'"
                :class="[
                  'rounded-xl border p-3 text-left transition-all text-xs font-bold',
                  paymentMethod === 'bank'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/70 dark:text-white ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                ]"
              >
                <Landmark class="h-4 w-4 mb-1 text-indigo-600" />
                <div>Bank Transfer</div>
              </button>
              <button
                type="button"
                @click="paymentMethod = 'jazzcash'"
                :class="[
                  'rounded-xl border p-3 text-left transition-all text-xs font-bold',
                  paymentMethod === 'jazzcash'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:bg-indigo-950/70 dark:text-white ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                ]"
              >
                <Smartphone class="h-4 w-4 mb-1 text-rose-500" />
                <div>JazzCash / EasyPaisa</div>
              </button>
            </div>
          </div>

          <!-- Bank Alfalah Payment Details Card -->
          <div 
            v-if="paymentMethod === 'bank'" 
            class="rounded-2xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-50/90 to-sky-50/90 dark:from-indigo-950/50 dark:to-slate-900 p-4 space-y-3"
          >
            <div class="flex items-center justify-between border-b border-indigo-200/60 dark:border-indigo-900/60 pb-2.5">
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-lg bg-red-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                  BA
                </div>
                <div>
                  <div class="font-extrabold text-slate-900 dark:text-white text-xs">Bank Alfalah</div>
                  <div class="text-[10px] text-slate-500">Official Deposit Account</div>
                </div>
              </div>
              <span class="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                1Link / Raast Active
              </span>
            </div>

            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between bg-white dark:bg-slate-800/80 p-2.5 rounded-xl border border-indigo-100 dark:border-indigo-900">
                <div>
                  <div class="text-[10px] text-slate-400 font-semibold uppercase">Account Number</div>
                  <div class="font-mono font-black text-base text-indigo-700 dark:text-indigo-300 tracking-wider">
                    05521010566693
                  </div>
                </div>
                <button
                  type="button"
                  @click="copyToClipboard('05521010566693', 'Account number 05521010566693 copied!')"
                  class="inline-flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/60 dark:hover:bg-indigo-900 px-2.5 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-300 transition-colors"
                >
                  <Copy class="h-3.5 w-3.5" />
                  <span>{{ copiedText === '05521010566693' ? 'Copied!' : 'Copy' }}</span>
                </button>
              </div>

              <div class="flex justify-between py-1 text-slate-600 dark:text-slate-300 text-[11px]">
                <span class="text-slate-400">Account Title:</span>
                <span class="font-bold text-slate-900 dark:text-white">Al-Harsh System</span>
              </div>
              <div class="flex justify-between py-1 text-slate-600 dark:text-slate-300 text-[11px]">
                <span class="text-slate-400">Transfer Methods:</span>
                <span class="font-medium text-slate-700 dark:text-slate-300">Alfa App, ATM, Any Bank App (IBFT / Raast)</span>
              </div>
            </div>

            <p class="text-[10px] text-indigo-950 dark:text-indigo-200 bg-white/80 dark:bg-slate-800/80 p-2 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
              💡 Transfer <strong>PKR {{ getPlanPrice(selectedPlan) }}</strong> to Bank Alfalah account <strong>05521010566693</strong>. Once completed, click below to activate instantly.
            </p>
          </div>

          <!-- JazzCash / EasyPaisa Details Card -->
          <div 
            v-else 
            class="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 space-y-2 text-xs"
          >
            <div class="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
              <div class="font-bold text-slate-900 dark:text-white">JazzCash / EasyPaisa via Raast</div>
              <span class="text-[10px] text-rose-500 font-bold">Mobile Wallet</span>
            </div>
            <div class="flex items-center justify-between bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <div class="text-[10px] text-slate-400">Send to Bank Alfalah via Raast / IBFT</div>
                <div class="font-mono font-bold text-sm text-slate-900 dark:text-white">05521010566693</div>
              </div>
              <button
                type="button"
                @click="copyToClipboard('05521010566693', 'Account 05521010566693 copied!')"
                class="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                <Copy class="h-3.5 w-3.5" />
                <span>{{ copiedText === '05521010566693' ? 'Copied!' : 'Copy' }}</span>
              </button>
            </div>
            <div class="text-[10px] text-slate-500">
              Select <strong>Bank Alfalah</strong> in your JazzCash or EasyPaisa app and transfer <strong>PKR {{ getPlanPrice(selectedPlan) }}</strong> to account <strong>05521010566693</strong>.
            </div>
          </div>

          <button
            @click="confirmUpgrade"
            :disabled="isUpgrading"
            class="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 mt-2"
          >
            <Loader2 v-if="isUpgrading" class="h-4 w-4 animate-spin" />
            <span v-else>Activate Subscription Instantly</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <AppToast ref="toastRef" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import AppToast from '@/components/common/AppToast.vue';
import { 
  Crown, 
  Sparkles, 
  Check, 
  X, 
  Sliders, 
  Landmark, 
  Smartphone, 
  Loader2,
  Copy,
  Plus,
  Minus
} from 'lucide-vue-next';

const authStore = useAuthStore();
const inventoryStore = useInventoryStore();
const toastRef = ref(null);

const billingCycle = ref('monthly');
const customBrandCount = ref(8);
const isCheckoutOpen = ref(false);
const selectedPlan = ref('pro');
const paymentMethod = ref('bank');
const isUpgrading = ref(false);
const copiedText = ref('');

// Custom pricing calculations
const getCustomMonthlyPrice = computed(() => {
  const count = Math.min(Math.max(customBrandCount.value, 2), 10);
  return count * 500;
});

const getCustomYearlyPrice = computed(() => {
  // 20% discount on 12 months = 12 * 0.8 = 9.6 months
  return getCustomMonthlyPrice.value * 12 * 0.8;
});

const customPriceFormatted = computed(() => {
  if (billingCycle.value === 'yearly') {
    return `${getCustomYearlyPrice.value.toLocaleString()} / year`;
  }
  return `${getCustomMonthlyPrice.value.toLocaleString()} / month`;
});

const getPlanPrice = (plan) => {
  if (plan === 'starter') return '0';
  if (plan === 'pro') return billingCycle.value === 'yearly' ? '24,000' : '2,500';
  if (plan === 'enterprise') return billingCycle.value === 'yearly' ? '48,000' : '5,000';
  if (plan === 'custom') {
    return billingCycle.value === 'yearly' 
      ? getCustomYearlyPrice.value.toLocaleString() 
      : getCustomMonthlyPrice.value.toLocaleString();
  }
  return '0';
};

const copyToClipboard = async (text, msg = 'Copied to clipboard!') => {
  try {
    await navigator.clipboard.writeText(text);
    copiedText.value = text;
    toastRef.value?.showToast(msg, 'success');
    setTimeout(() => {
      if (copiedText.value === text) copiedText.value = '';
    }, 2500);
  } catch (_) {
    toastRef.value?.showToast(`Account: ${text}`, 'info');
  }
};

const openCheckout = (plan) => {
  selectedPlan.value = plan;
  isCheckoutOpen.value = true;
};

const confirmUpgrade = async () => {
  isUpgrading.value = true;
  try {
    await authStore.upgradePlan(
      selectedPlan.value,
      billingCycle.value,
      selectedPlan.value === 'custom' ? customBrandCount.value : null
    );
    try {
      const confetti = (await import('canvas-confetti')).default;
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (_) {}

    isCheckoutOpen.value = false;
    toastRef.value?.showToast(`Upgraded to ${selectedPlan.value.toUpperCase()} successfully!`, 'success');
  } catch (err) {
    toastRef.value?.showToast(`Upgrade failed: ${err.message}`, 'error');
  } finally {
    isUpgrading.value = false;
  }
};
</script>
