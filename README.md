# Elite Steel Concepts — Web Infrastructure

**Production URL:** [https://www.esteelconcepts.com](https://www.esteelconcepts.com)  
**Production Branch:** `main`  
**Framework:** Next.js 16 (App Router) | React 19 | TypeScript 5 | Tailwind CSS 4 | Turso libSQL  

---

## Overview

This repository houses the official digital platform for **Elite Steel Concepts** (ESC), an industry-leading manufacturer and custom fabricator of commercial food trucks, mobile kitchens, food trailers, and specialized concession vehicles based in Manassas Park, Virginia.

The platform is a custom-engineered, full-stack web application designed for commercial lead generation, interactive custom food truck and trailer quote calculations, comprehensive content management, and regional/national SEO dominance across the DMV (DC, Maryland, Virginia) and nationwide markets.

---

## Core Capabilities & Features

* **Interactive Quote & Build Configurator:** Multi-step vehicle and trailer specification tool capturing dimensions, kitchen equipment, power requirements, and compliance needs.
* **Custom Admin Dashboard:** Comprehensive content management suite for blog posts, location landing pages, portfolio showcases, customer inquiries, FAQs, and testimonials.
* **Turso Edge Database & Dual Storage:** Cloud-synced SQLite edge database with seamless local JSON fallback for robust offline development and reliable persistence.
* **Automated SEO & Internal Linking Engine:** Keyword injection and structured silo linking system maximizing organic search authority across commercial fabrication queries.
* **Responsive Industrial Design System:** High-performance UI built with Tailwind CSS v4, crafted for accessibility, speed, and cross-device responsiveness.
* **Automated Data Backup Pipeline:** Scheduled backup routine ensuring continuous data protection and recovery readiness.

---

## Documentation Index

Comprehensive technical, operational, and architectural documentation is available in the repository:

* **[Master Systems & Technical Documentation](SYSTEM_DOCUMENTATION.md):** Complete technical report covering hosting architecture, Turso cloud database schemas, automated backup schedulers, transactional email and SMTP pipelines, and deployment runbooks.
* **[Internal Linking Strategy & Taxonomy](docs/INTERNAL_LINKING_STRATEGY.md):** 7-silo thematic internal linking blueprint and automated keyword injection matrix.
* **[SEO Updates & Redirect Matrix](docs/SEO_UPDATES.md):** Technical SEO audit resolution, meta descriptions, location landing pages, and 301 redirect mappings.
* **[Product Specifications](PRODUCT.md):** Brand tone, user personas, and strategic principles.
* **[Design System](DESIGN.md):** Industrial color tokens, typography scales, spacing rhythms, and UI states.

---

## Quick Start & Local Development

### Prerequisites
* **Node.js:** v20+ LTS
* **npm:** v10+

### Setup & Local Run

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local

# 3. Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Available Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Starts local Next.js development server with hot reload |
| `npm run build` | Compiles production standalone bundle in `.next` |
| `npm run start` | Starts standalone Node.js server in production mode |
| `npm run lint` | Runs ESLint and TypeScript validation |
| `npm run backup` | Executes manual on-demand database backup |
| `npm run test:blog` | Runs automated verification test on blog post persistence |

---

## Deployment & Security Governance

* **Zero Hardcoded Secrets:** All environment credentials, database tokens, and SMTP credentials are strictly loaded via `.env` configuration on the host server.
* **Production Deployment:** Production deployments are managed through standard Git-triggered workflows or PM2 standalone processes following build verification.
* **Data Privacy:** Customer inquiries and quotes are securely processed and protected in compliance with enterprise data privacy standards.
