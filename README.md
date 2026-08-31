# Elite Steel Concepts & District Bites Web Infrastructure

**Production URL:** [https://www.esteelconcepts.com](https://www.esteelconcepts.com)  
**Repository:** `MHanzzala/esc-new-website`  
**Production Branch:** `main`  
**Framework:** Next.js 16 (App Router) | React 19 | TypeScript 5 | Tailwind CSS 4 | Turso libSQL  

---

## Overview

This repository powers the official web platform for **Elite Steel Concepts** (ESC), operating in coordination with the **District Bites** mobile hospitality group. The platform is a custom-engineered, full-stack web application designed for commercial lead generation, interactive custom food truck and trailer quote calculations, dynamic content management, and regional SEO dominance across the DMV (DC, Maryland, Virginia) and national markets.

---

## Documentation Index

Comprehensive technical, operational, and architectural documentation is available in the repository:

* **[Master Systems & Technical Documentation](SYSTEM_DOCUMENTATION.md):** Complete technical report covering hosting architecture, Turso cloud database schemas, automated midnight backup schedulers, transactional email and SMTP pipelines, zero-bug health verification, and deployment runbooks.
* **[Internal Linking Strategy & Taxonomy](docs/INTERNAL_LINKING_STRATEGY.md):** 7-silo thematic internal linking blueprint and automated keyword injection matrix.
* **[SEO Updates & Redirect Matrix](docs/SEO_UPDATES.md):** Technical SEO audit resolution, meta descriptions, location landing pages, and 301 redirect mappings.
* **[Product Specifications](PRODUCT.md):** Brand tone, user personas, and strategic principles.
* **[Design System](DESIGN.md):** Industrial color tokens, typography scales, spacing rhythms, and UI states.

---

## Quick Start & Local Development

### Prerequisites
* Node.js v20+ LTS
* npm v10+

### Installation & Execution

```bash
# 1. Clone repository
git clone https://github.com/MHanzzala/esc-new-website.git
cd esc-new-website

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

---

## Key Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts local Next.js development server with hot reload |
| `npm run build` | Compiles production standalone bundle in `.next` |
| `npm run start` | Starts standalone Node.js server in production mode |
| `npm run lint` | Runs ESLint and TypeScript type checking |
| `npm run backup` | Executes manual on-demand database backup to `data/backups/` |
| `npm run test:blog` | Runs automated verification test on blog post persistence |

---

## Deployment & Corporate Control

* **Corporate Account Governance:** All domain registrations, database clusters, SMTP communication channels, cloud storage, and server configurations are strictly owned and managed under company-controlled accounts.
* **Deployment Policy:** No changes or pending feature updates are deployed to live production servers without explicit administrative approval.
