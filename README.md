# Al-Harsh System | Product Pricing & Invoice Management System

A web-based Product Pricing, Quotation & Invoice Management System built with **Vue 3**, **Vite**, **Tailwind CSS**, **Pinia**, **Dexie.js (IndexedDB)**, and **MongoDB Atlas** with serverless endpoints for **Vercel** and **GitHub**.

---

## 🌟 Key Features (Exact PDF Specifications)

1. **Common Product Code Architecture**:
   - Every equivalent/similar product shares a unique common code (e.g. `SF-001 Stop Cock`, `SF-002 Angle Valve`, `SF-003 Bib Cock`, `SF-100 Floor Trap`).
   - Links equivalent products across different manufacturers/brands.

2. **1-Click Company / Brand Switcher (PDF Section 5 & 12)**:
   - Create an invoice under **Dura Flow**, then switch to **Popular** or **Master** with one click.
   - Automatically re-prices all line items using the target company's price list and company default discounts.
   - Identifies and flags any unavailable items (*"Product not available for this company"*).
   - Recalculates gross, discounts, net, and grand totals instantly without rebuilding the bill.

3. **Multi-Brand Price Comparison**:
   - Built-in side-by-side comparison modal answering: *"What would the same invoice cost if purchased from Popular or Master instead?"*
   - Calculates exact savings / difference and item availability.

4. **Flexible Discounts (PDF Section 6)**:
   - **Company-Level Default Discounts**: Dura Flow (10%), Popular (8%), Master (12%), Faisal (5%).
   - **Line-Item Custom Overrides**: Editable for every individual product on the invoice.

5. **Invoice & Quotation Generator (PDF Section 4 & 9)**:
   - Printable layouts and downloadable **PDF format** with company header, client information, itemized table, notes, terms, and signature lines.
   - **WhatsApp Invoice Sharing** button (`https://wa.me/?text=...`) for instant customer dispatch.

6. **Full Catalog & Price Matrix Backend (PDF Section 3 & 11)**:
   - 3 Main Categories: **Sanitary**, **Electrical**, **Hardware**.
   - Multi-brand price matrix editor to view and edit prices for all brands side-by-side.
   - Stock and inventory management.

7. **Dual-Engine Database & Deployment**:
   - **MongoDB Atlas Cloud Database**: Serverless API routes under `/api/*` ready for Vercel deployment.
   - **Dexie.js (IndexedDB) Persistent Cache**: Local-first offline capability, zero-latency calculations, backup/restore via JSON and Excel (.xlsx).

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies (already completed)
npm install

# 2. Start the Vite development server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## ☁️ Deployment on Vercel

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Complete Al-Harsh System"
   git branch -M main
   git remote add origin https://github.com/ahmadalibyteforceITSolution/ALharshinventorysystem.git
   git push -u origin main
   ```
2. Log into [vercel.com](https://vercel.com).
3. Click **"Add New Project"** and select `ALharshinventorysystem`.
4. In the **Environment Variables** section on Vercel, add:
   - `MONGODB_URI`: `mongodb+srv://ahmedalihafeez25_db_user:%40Sublime12345@cluster0.oe0inne.mongodb.net/inventory?retryWrites=true&w=majority`
5. Click **Deploy**. Vercel will automatically build the Vue 3 app and wire up the serverless `/api/*` functions!
