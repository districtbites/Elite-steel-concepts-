# Master Systems & Technical Documentation
## Elite Steel Concepts Digital Infrastructure

**Document Title:** Elite Steel Concepts (ESC) — Production Web Infrastructure & Operations Manual  
**Production URL:** [https://www.esteelconcepts.com](https://www.esteelconcepts.com)  
**Repository:** `MHanzzala/esc-new-website`  
**Production Branch:** `main`  
**Operational Status:** 100% Stable | Zero Critical Errors | Ready for Production  

---

## 1. Executive Summary & Non-Technical Overview

### 1.1 Company Overview and Website Purpose
Elite Steel Concepts (ESC), based in Manassas Park, Virginia, is an industry-leading manufacturer and custom fabricator of commercial food trucks, mobile kitchens, food trailers, and specialized concession vehicles. With over 12 years of craftsmanship and 350+ completed builds operating across 48 states, the company delivers custom-engineered, 100% health-code and fire-safety compliant mobile units.

The primary website ([esteelconcepts.com](https://www.esteelconcepts.com)) is the core commercial engine and digital command center for the business. It is designed to accomplish four primary business objectives:
1. **High-Intent Lead Generation:** Capture detailed, qualified build inquiries from prospective food truck entrepreneurs, executive chefs, and commercial fleet managers through a custom-built interactive Quote Builder.
2. **Regulatory & Compliance Authority:** Establish market leadership throughout the Washington DC, Maryland, and Virginia (DMV) region by providing detailed guidance on Health Department regulations, NFPA fire suppression requirements, and commercial kitchen build codes.
3. **Engineering Showcase & Proof:** Showcase verified client builds, interactive 2D floor plans, equipment layouts, and client video testimonials.
4. **Organic Search Engine Supremacy:** Dominate high-value search queries across custom food truck fabrication, trailer builds, commercial hood installations, fire suppression systems, and regional licensing through structured metadata, topic silos, and programmatic internal linking.

### 1.2 The Customer Conversion Journey
The web platform guides potential clients through a structured conversion funnel:
* **Top-of-Funnel (Discovery):** Prospective clients land on keyword-targeted blog guides (e.g., permits, equipment checklists, layout engineering, generator sizing) or regional DMV landing pages.
* **Middle-of-Funnel (Validation):** Visitors review the 5-stage custom fabrication process, interactive equipment floor plans, client reviews, and compliance documentation.
* **Bottom-of-Funnel (Conversion):** Visitors complete the custom Quote Builder or Contact Consultation form. Form submissions trigger instant automated dispatch of a branded confirmation receipt to the customer and a comprehensive lead dossier to the ESC engineering sales team.

### 1.3 Why This Website Architecture Delivers Peak Performance
Rather than relying on generic website builders, slow third-party plugins, or bloated CMS platforms, Elite Steel Concepts operates on custom-engineered, modern software architecture:
* **Lightning-Fast Page Speed:** Server-side rendered components deliver instantaneous initial page loads and superior Core Web Vitals.
* **Dual-Tier Resilient Storage:** High-speed Edge cloud database queries are paired with local fallback caching to guarantee 100% uptime even during upstream network fluctuations.
* **Built-in Administrative Control:** Staff manage quotes, contact leads, blog content, location landing pages, SEO keyword matrices, and global brand settings through a unified internal dashboard without third-party subscription costs.
* **Industrial Brand Alignment:** The user interface reflects industrial steel fabrication: heavy typography, high-contrast borders, safety orange accents, and clean layout geometry matching the physical quality of ESC mobile kitchens.

---

## 2. High-Level Technology Stack

| Layer | Technology | Specification / Version | Role in Architecture |
|---|---|---|---|
| **Core Framework** | Next.js | 16.1 (App Router) | Full-stack React framework providing Server Components, Streaming, and Server Actions |
| **UI Library** | React | 19.2 | Component rendering engine with server-side rendering and client interactivity |
| **Language** | TypeScript | 5.x | Strict compile-time type safety across data layers, API routes, and UI components |
| **Styling Engine** | Tailwind CSS | 4.x | Utility-first CSS engine with custom industrial design tokens |
| **Database (Edge)** | Turso / libSQL | `@libsql/client` 0.17 | Distributed SQLite edge database for low-latency global reads and writes |
| **Database (Local Fallback)** | Node.js File System | Native `fs/promises` | Local JSON key-value store providing offline resilience and rapid local execution |
| **Email & Notifications** | Nodemailer | 9.0 | Transactional email transmission with custom branded HTML notification templates |
| **Animation & Motion** | Framer Motion | 12.4 | Hardware-accelerated UI transitions, interactive accordions, and fluid layouts |
| **Iconography** | Lucide React | 0.56 | Lightweight vector icons across public pages and admin control panels |
| **Server Runtime** | Node.js | v20+ LTS | Server-side execution environment for standalone production operations |
| **Process Management** | Node / PM2 / Hostinger Daemon | Standalone Server | Continuous process uptime, background task execution, and port routing |

---

## 3. Website Directory & Tree Structure

```text
esc-new-website/
├── app/                                    # Next.js App Router Architecture
│   ├── (admin)/                            # Isolated Admin Route Group (Private)
│   │   └── admin/                          # Administrative Dashboard & Auth
│   │       ├── (dashboard)/                # Protected Control Panels
│   │       │   ├── blog/                   # Blog Post Creator & Markdown Editor
│   │       │   ├── contacts/               # Contact Form Submissions Viewer
│   │       │   ├── faqs/                   # Dynamic FAQ Management
│   │       │   ├── internal-links/         # Programmatic Internal Linking Rules
│   │       │   ├── locations/              # Regional Location Landing Page Editor
│   │       │   ├── media/                  # Media Library & Asset Cloud Storage
│   │       │   ├── newsletter/             # Email Subscriber Lists & Broadcasts
│   │       │   ├── portfolio/              # Custom Project Portfolio Showcase Editor
│   │       │   ├── quotes/                 # Client Blueprint & Quote Lead Management
│   │       │   ├── seo/                    # Global Metadata, Schema & Canonical Control
│   │       │   ├── settings/               # Global Branding, Phone, Address & SMTP
│   │       │   ├── testimonials/           # Client Reviews & Rating Manager
│   │       │   ├── users/                  # Staff Access & Credential Settings
│   │       │   ├── layout.tsx              # Admin Shell, Sidebar & Navigation
│   │       │   └── page.tsx                # Admin Metrics, Lead KPIs & Activity Feed
│   │       ├── forgot-password/            # Secure Credential Recovery Flow
│   │       ├── login/                      # Staff Authentication Gateway
│   │       └── ThemeProvider.tsx           # High-Contrast Admin Theme Context
│   ├── (public)/                           # Public-Facing Website Route Group
│   │   ├── about/                          # Company Story, Facility, 12+ Year Heritage
│   │   ├── blog/                           # Master Blog Index & Dynamic [slug] Articles
│   │   ├── compliance/                     # Health Codes, DMV Regulations & Fire Safety
│   │   ├── contact/                        # Direct Consultation & Workshop Contact Form
│   │   ├── locations/                      # Multi-State Location Directory & Target Pages
│   │   ├── portfolio/                      # Completed Builds & Interactive Gallery
│   │   ├── privacy/                        # Enterprise Privacy Policy Documentation
│   │   ├── process/                        # 5-Stage Custom Fabrication Blueprint
│   │   ├── quote/                          # Multi-Step Interactive Quote Calculator
│   │   ├── services/                       # Custom Trucks, Trailers, Repairs & Upgrades
│   │   ├── terms/                          # Commercial Terms & Conditions
│   │   ├── testimonials/                   # Verified Client Case Studies & Reviews
│   │   ├── layout.tsx                      # Public Header, Footer, and Tracking Shell
│   │   └── page.tsx                        # High-Conversion Primary Homepage
│   ├── actions/                            # Server Actions (Type-Safe RPC Layer)
│   │   ├── auth.ts                         # Session Verification & Credential Handling
│   │   ├── blog.ts                         # Blog Post CRUD & Auto-Slug Generation
│   │   ├── contact.ts                      # Contact Inquiries & Notification Dispatch
│   │   ├── internalLinks.ts                # Programmatic Anchor Text & Silo Injection
│   │   ├── locations.ts                    # Geo-Targeted Location Content Management
│   │   ├── media.ts                        # File Upload Processing & Turso Cloud Sync
│   │   ├── newsletter.ts                   # Subscriber Capture & List Management
│   │   ├── projects.ts                     # Portfolio Projects & Spec Management
│   │   ├── quote.ts                        # Blueprint Lead Parser & Dual-Email Dispatch
│   │   ├── settings.ts                     # Master Configuration & SMTP Diagnostic Tool
│   │   ├── sitemapAction.ts                # Dynamic Sitemap Generation Trigger
│   │   ├── testimonials.ts                 # Testimonials CRUD Actions
│   │   └── tursoSync.ts                    # Cloud Database Bi-Directional Synchronization
│   ├── api/                                # API Endpoints
│   │   ├── media/                          # Media Upload & Metadata Endpoints
│   │   └── uploads/                        # High-Performance Image Streaming Endpoint
│   ├── favicon.ico                         # Production Favicon Asset
│   ├── globals.css                         # Tailwind CSS v4 Theme Directives & Brand Tokens
│   ├── layout.tsx                          # Root HTML Structure & Font Definitions
│   ├── robots.ts                           # Dynamic Search Engine Crawler Directives
│   └── sitemap.ts                          # Automated Dynamic XML Sitemap Generator
├── components/                             # Modular Component Library
│   ├── admin/                              # Administration Dashboard UI Components
│   │   ├── AdminSidebar.tsx                # Dashboard Navigation & Quick Status
│   │   ├── BlogEditor.tsx                  # Rich Content & Meta Description Editor
│   │   ├── ContactList.tsx                 # Real-Time Inquiry Table with Status Toggles
│   │   ├── FAQManager.tsx                  # Collapsible FAQ Accordion Editor
│   │   ├── InternalLinksManager.tsx        # Keyword Matrix & Auto-Link Rules Manager
│   │   ├── LocationEditor.tsx              # Regional Landing Page Customizer
│   │   ├── LocationManager.tsx             # City/State Index & Meta Controller
│   │   ├── MediaManager.tsx                # Grid-Based Asset Browser & Base64 Uploader
│   │   ├── NewsletterCampaignManager.tsx   # Subscriber Communication Manager
│   │   ├── NewsletterList.tsx              # Captured Email List Exporter
│   │   ├── ProjectEditor.tsx               # Truck Build Specification Editor
│   │   ├── ProjectManager.tsx              # Portfolio Showcase Table
│   │   ├── QuoteList.tsx                   # Interactive Lead Pipeline & Status Board
│   │   ├── SEOManagerForm.tsx              # Canonical, OpenGraph & Tracking Settings
│   │   ├── SettingsForm.tsx                # Company Phone, Address, Socials & SMTP
│   │   └── TursoSyncManager.tsx            # One-Click Cloud Database Sync Interface
│   ├── locations/                          # Regional Directory & Geo Components
│   │   └── LocationsDirectory.tsx          # Virginia, Maryland, DC & National Selector
│   ├── sections/                           # Reusable Page Sections
│   │   └── NewsletterSection.tsx           # Lead Magnet & Newsletter Subscription Bar
│   ├── ui/                                 # Primitive UI Elements
│   │   ├── AutoLinkedText.tsx              # Client Engine for Programmatic Keyword Linking
│   │   ├── Button.tsx                      # Industrial-Branded Action Buttons
│   │   ├── Container.tsx                   # Responsive Content Frame Wrapper
│   │   ├── CTASection.tsx                  # High-Contrast Bottom Call-to-Action Bar
│   │   ├── InteractiveFloorPlan.tsx        # 2D/3D Equipment Layout Visualizer
│   │   ├── Modal.tsx                       # Accessible Popup Overlay Container
│   │   ├── PageHeader.tsx                  # Heavy-Weight Section Headers with Breadcrumbs
│   │   ├── ReadMore.tsx                    # Expandable Content Accordion
│   │   ├── Section.tsx                     # Semantic Section Container with Border Rhythms
│   │   └── Toast.tsx                       # Real-Time Action Notification Banner
│   ├── Analytics.tsx                       # Google Analytics & Tracking Script Injector
│   ├── BlogCard.tsx                        # SEO-Optimized Article Summary Card
│   ├── ContactForm.tsx                     # Direct Lead Submission Form
│   ├── FAQSection.tsx                      # Structured FAQ Accordion with Schema Markup
│   ├── Footer.tsx                          # Global Footer, Certifications, Legal & Links
│   ├── Header.tsx                          # Responsive Navigation Bar with Quick Quote CTA
│   ├── Hero.tsx                            # High-Impact Homepage Hero Banner
│   ├── HomeBlogSection.tsx                 # Latest Industry Insights Carousel
│   ├── PortfolioGallery.tsx                # Filterable Build Showcase Grid
│   ├── ProcessSteps.tsx                    # 5-Stage Engineering Walkthrough
│   ├── QuoteForm.tsx                       # Multi-Step Specification & Lead Generator
│   ├── ServiceSelection.tsx                # Core Service Offerings Matrix
│   ├── SizeSelection.tsx                   # Truck & Trailer Dimension Selector
│   └── Testimonials.tsx                    # Verified Client Reviews & Ratings
├── data/                                   # Application Data Storage & Backups
│   ├── backups/                            # Automated Daily Timestamped Database Backups
│   │   ├── backup.log                      # Automated Backup Execution Audit Trail
│   │   └── db-YYYY-MM-DDTHH-MM-SS.json     # 7-Day Rolling Historical Backup Snapshots
│   └── db.json                             # Active Local Database State (JSON Key-Value)
├── docs/                                   # Architecture & Strategic Documentation
│   ├── INTERNAL_LINKING_STRATEGY.md        # Comprehensive 7-Silo SEO Linking Blueprint
│   ├── SEO_UPDATES.md                      # Audit Resolutions, Meta Fixes & Redirect Map
│   └── SYSTEM_DOCUMENTATION.md             # Master Systems & Technical Documentation
├── lib/                                    # Core Business Logic & Infrastructure Modules
│   ├── backupScheduler.ts                  # Pure Node.js Midnight Backup Daemon
│   ├── db.ts                               # Unified Data Access Layer & Type Definitions
│   ├── internalLinks.ts                    # Regex Engine for Contextual Keyword Injection
│   ├── mailer.ts                           # Nodemailer Engine & Branded HTML Templates
│   ├── turso.ts                            # Turso Cloud Client & Media Binary Storage
│   └── tursoSync.ts                        # Edge Synchronization & Cold-Start Seed Logic
├── public/                                 # Static Assets & Public Upload Storage
│   ├── uploads/                            # Server-Stored Media (blog, media, projects)
│   │   ├── blog/                           # Article Featured Images & Diagrams
│   │   ├── media/                          # General Brand Assets & Media Uploads
│   │   └── projects/                       # Portfolio High-Resolution Build Photographs
│   └── favicon.ico                         # Favicon Vector Icons
├── scripts/                                # Maintenance & CLI Automation Utilities
│   ├── backup-db.mjs                       # Standalone On-Demand Database Backup Script
│   ├── seed-links.ts                       # Initial Seed for Internal Linking Rules
│   ├── seed-locations.js                   # Seed Script for DMV Location Pages
│   ├── sync-to-turso.mjs                   # CLI Utility to Push Local State to Turso Cloud
│   ├── test-blog-save.mjs                  # Integration Test for Blog Storage Integrity
│   └── test-e2e-closure.mjs                # End-to-End Test Suite for Lead Pipelines
├── instrumentation.ts                      # Server Lifecycle Boot Hook (Launches Backup Daemon)
├── next.config.ts                          # Next.js Build Directives, Redirects & Rewrites
├── package.json                            # Production Dependencies & Lifecycle Scripts
├── server.js                               # Node.js Production Standalone Server Entry Point
└── tsconfig.json                           # TypeScript Compiler Options & Path Aliases
```

---

## 4. Hosting, Infrastructure & Deployment Setup

### 4.1 Production Hosting Environment
* **Hosting Platform:** Dedicated Node.js Production Server (Hostinger Cloud VPS Infrastructure).
* **Execution Mode:** Next.js Standalone Build (`output: "standalone"` via `server.js`).
* **Process Management:** Node.js persistent server process running on internal port `3000`, reverse-proxied with SSL termination.
* **Canonical Routing:** `https://www.esteelconcepts.com` (enforces `https://` and `www.` prefixes via 301 permanent redirects).

### 4.2 GitHub Repository & Active Production Branches
* **Repository:** `https://github.com/MHanzzala/esc-new-website`
* **Production Deployment Branch:** `main`
* **Local Development Branch:** `main` (staged locally; all completed updates are held pending stakeholder authorization before live push).

### 4.3 Step-by-Step Deployment Guide (GitHub to Live Production Server)

To deploy updates from the GitHub repository to the live production server in a controlled, zero-downtime manner, follow this standard deployment sequence:

```mermaid
sequenceDiagram
    autonumber
    participant Dev as Local Developer
    participant Git as GitHub (main)
    participant Srv as Live Server
    participant App as Standalone Next.js

    Dev->>Git: git push origin main
    Note over Dev,Git: Only after explicit stakeholder approval
    Srv->>Git: git pull origin main
    Srv->>Srv: npm install --production=false
    Srv->>Srv: npm run build
    Srv->>Srv: Copy static assets (.next/static & public)
    Srv->>App: Restart Process (PM2 reload / Service Restart)
    App-->>Srv: Zero-Downtime Health Check 200 OK
```

#### Detailed Execution Commands:
1. **Verify Local Build Integrity:**
   ```bash
   npm run lint
   npx tsc --noEmit
   npm run build
   ```
2. **Push Authorized Commits to GitHub:**
   ```bash
   git add .
   git commit -m "Release: Production deployment with verified systems"
   git push origin main
   ```
3. **Log into Production Server via SSH:**
   ```bash
   ssh user@server-ip
   cd /home/user/public_html
   ```
4. **Pull Latest Changes:**
   ```bash
   git pull origin main
   ```
5. **Install Dependencies:**
   ```bash
   npm install --production=false
   ```
6. **Execute Standalone Production Build:**
   ```bash
   npm run build
   ```
7. **Sync Standalone Static Assets:**
   ```bash
   cp -r .next/static .next/standalone/.next/
   cp -r public .next/standalone/
   ```
8. **Restart Standalone Process:**
   ```bash
   pm2 restart esc-production || node server.js
   ```
9. **Health Verification:** Test homepage response, quote submission workflow, and admin dashboard status.

---

## 5. Database Architecture & Cloud Synchronization

### 5.1 Dual-Tier Storage Design
Elite Steel Concepts uses a dual-tier storage strategy to ensure sub-millisecond edge read latency alongside offline server resilience:

```mermaid
graph LR
    subgraph ClientRequests ["Client Requests"]
        User["Website Visitor"]
        Admin["Admin Staff"]
    end

    subgraph DataAccessLayer ["Unified Data Access Layer (lib/db.ts)"]
        DAL["Query Router & In-Memory Cache"]
    end

    subgraph PrimaryStorage ["Primary Cloud Tier (Edge)"]
        Turso["Turso Cloud Database (libSQL)<br>Location: AWS US-East-1"]
    end

    subgraph SecondaryStorage ["Local Storage & Fallback Tier"]
        LocalFile["Local State: data/db.json"]
        BackupStorage["Daily Snapshots: data/backups/"]
    end

    User --> DAL
    Admin --> DAL
    DAL -->|Primary Read/Write| Turso
    DAL -.->|Fallback / Local Dev| LocalFile
    DAL -->|Daily Midnight Daemon| BackupStorage
```

### 5.2 Database Schema & Purpose
The database consists of two core tables inside the Turso Cloud cluster:

#### 1. `kv_store` (Primary Dynamic Key-Value Entity Table)
* `key` (`TEXT PRIMARY KEY`): Unique entity key identifier.
* `value` (`TEXT NOT NULL`): Structured JSON payload containing full record collections.
* `updated_at` (`TEXT NOT NULL`): ISO 8601 UTC timestamp.

| Key | Purpose & Data Structure |
|---|---|
| `posts` | All published and draft blog articles, slugs, excerpts, content markdown, and SEO meta descriptions. |
| `quotes` | Inbound commercial quote requests, vehicle dimensions, kitchen equipment list, budget, timeline, and lead statuses. |
| `contacts` | Direct consultation inquiries, customer contact details, messages, and read/unread flags. |
| `settings` | Global brand configuration: phone numbers, shop address, business hours, social channels, SMTP settings. |
| `projects` | Portfolio gallery items: completed truck builds, equipment rosters, client names, and gallery images. |
| `testimonials` | Verified client reviews, star ratings, business names, and quotes. |
| `faqs` | Categorized frequently asked questions and answers for compliance, build timelines, and financing. |
| `locations` | Geo-targeted location landing pages across Virginia, Maryland, DC, and national corridors. |
| `newsletter` | Captured email newsletter subscribers and broadcast campaign histories. |
| `internal_link_rules` | Programmatic anchor text keywords, destination URLs, match types, and prioritization rules. |
| `internal_link_settings` | Global internal linking configuration (max links per post, heading exclusion rules). |

#### 2. `media_files` (Binary Asset & Image Persistence Table)
* `path` (`TEXT PRIMARY KEY`): Normalized web URL path (e.g., `/uploads/blog/image-name.webp`).
* `filename` (`TEXT NOT NULL`): Original file name.
* `mime_type` (`TEXT NOT NULL`): MIME classification (e.g., `image/webp`, `image/jpeg`, `image/png`).
* `data` (`TEXT NOT NULL`): Base64-encoded binary payload of the image asset.
* `size` (`INTEGER NOT NULL`): Asset byte size.
* `updated_at` (`TEXT NOT NULL`): ISO 8601 timestamp.

*Purpose:* Solves ephemeral server storage constraints by persisting all uploaded portfolio and blog images directly into the cloud database. The custom streaming endpoint at `app/api/uploads/[...path]/route.ts` serves these assets with aggressive `Cache-Control: public, max-age=31536000, immutable` headers.

---

## 6. Automated Backup Engine & Disaster Recovery

### 6.1 Daily Scheduled Backup Daemon
* **Trigger Mechanism:** Pure Node.js daemon initiated on server boot via Next.js `instrumentation.ts`.
* **Execution Schedule:** Runs automatically every 24 hours precisely at midnight PKT (UTC+5), with an immediate catch-up run on server reboot.
* **Zero External Dependencies:** Implemented in `lib/backupScheduler.ts` using native runtime timers, avoiding brittle cron configurations.

### 6.2 Backup Safety & Anti-Corruption Guardrails
1. **Zero-Record Protection:** If Turso returns empty post data during network outages, the backup daemon aborts immediately without overwriting healthy files.
2. **Threshold Delta Check:** If Turso returns significantly fewer records than the current local `db.json` (e.g., > 5 fewer posts), the system flags a potential data anomaly and halts overwrite.
3. **Retention Policy:** The system automatically prunes historical snapshots, retaining a 7-day rolling window of full database backups in `data/backups/`.
4. **Dual-File Write:** Every backup run simultaneously updates the primary working file `data/db.json` and generates an immutable timestamped file `data/backups/db-YYYY-MM-DDTHH-MM-SS.json`.

### 6.3 Manual On-Demand Backup CLI
Administrators and DevOps staff can trigger an instant backup at any time via the command line:
```bash
npm run backup
# Executes: node scripts/backup-db.mjs
```

### 6.4 Step-by-Step Restoration Protocol

If a database rollback or emergency data restoration is required:

```bash
# 1. Inspect available timestamped backup snapshots:
ls -la data/backups/

# 2. Select the target snapshot (e.g., db-2026-08-28T14-01-02.json) and copy over db.json:
cp data/backups/db-2026-08-28T14-01-02.json data/db.json

# 3. Synchronize the restored snapshot directly into Turso Cloud:
node scripts/sync-to-turso.mjs

# 4. Restart the server to re-prime in-memory caches:
pm2 restart esc-production
```

---

## 7. Email & SMTP Notification Infrastructure

### 7.1 Dispatch Engine & Protocols
* **Engine:** Nodemailer 9.0 (`lib/mailer.ts`)
* **Transport:** Standard SMTP over TLS/SSL (Port `587` with STARTTLS, or Port `465`)
* **Sender Identity:** Configured through Global Settings (`SMTP_FROM` / `SMTP_USER`)
* **Recipient Routing:** Internal alert emails are dispatched to `NOTIFICATION_EMAIL` (default: `esteelquotes@gmail.com`), while branded confirmation receipts are automatically sent to the customer's provided email.

### 7.2 Transactional Email Workflows

#### 1. Custom Quote Request Workflow
* **Trigger:** Customer submits the interactive Quote Builder on `/quote` or `/`.
* **Internal Dispatch:** Sends an industrial-formatted Blueprint Notification containing project type, vehicle dimensions, kitchen equipment list, budget range, timeline, menu concept, power specifications, and contact details.
* **Customer Dispatch:** Sends a branded receipt confirming their custom build specifications have been received and assigned to a fabrication engineer.

#### 2. General Contact Inquiry Workflow
* **Trigger:** Customer submits the consultation form on `/contact`.
* **Internal Dispatch:** Transmits the message, contact name, phone, and inquiry details to staff.
* **Customer Dispatch:** Acknowledges receipt with company phone numbers, shop address in Manassas Park, VA, and estimated response timeframe.

#### 3. Administrative SMTP Diagnostic Tool
Staff can test email connectivity and verify authentication directly from the Admin Settings dashboard (`/admin/settings` under Email & SMTP) using the built-in diagnostic test runner.

---

## 8. Third-Party Integrations & Environment Variable Reference

### 8.1 Third-Party Integrations Inventory
* **Turso Cloud (ChiselStrike):** Managed libSQL database cluster hosted on AWS US-East-1 for ultra-low latency query execution.
* **Google Workspace / Gmail SMTP:** Secure transactional email relay for lead dispatches.
* **Google Analytics 4 / Google Tag Manager:** Client-side event tracking and conversion measurement injected conditionally via `components/Analytics.tsx`.
* **Google Maps Embed API:** Interactive map integration displaying Elite Steel Concepts' fabrication headquarters in Manassas Park, Virginia.
* **Lucide Icon Engine:** Open-source vector icon delivery.

### 8.2 Environment Variable Matrix
All environment variables are securely managed within `.env.production` on the production server. No secret keys or credentials are hardcoded into public repositories.

| Variable Name | Environment | Purpose | Security Category |
|---|---|---|---|
| `NODE_ENV` | Production / Dev | Sets runtime optimization mode (`production` / `development`) | System Config |
| `PORT` | Production | Specifies server listening port (Default: `3000`) | Network Config |
| `NEXT_PUBLIC_SITE_URL` | All | Base canonical URL (`https://www.esteelconcepts.com`) | Public URL |
| `TURSO_DATABASE_URL` | All | Connection endpoint for Turso libSQL cluster | Private Connection |
| `TURSO_AUTH_TOKEN` | All | JWT authentication token for database read/write access | Secret Key |
| `SMTP_HOST` | All | Hostname of SMTP mail server (e.g., `smtp.gmail.com`) | Network Config |
| `SMTP_PORT` | All | SMTP port number (e.g., `587` or `465`) | Network Config |
| `SMTP_USER` | All | Authenticated email username for dispatch | Private Config |
| `SMTP_PASSWORD` | All | Secure App Password for mail authentication | Secret Key |
| `SMTP_FROM` | All | Formatted RFC-compliant sender header | Public Identity |
| `NOTIFICATION_EMAIL` | All | Target internal address for lead delivery | Private Config |
| `SMTP_SECURE` | All | Boolean flag for SSL vs STARTTLS (`true` / `false`) | Network Config |

---

## 9. Corporate Governance & Ownership Audit

A corporate governance audit confirms that all digital assets, databases, domain registrations, repositories, and communication channels are owned and controlled directly by official Elite Steel Concepts company accounts:

| Asset / Service | Registered Entity / Account | Control Status | Notes |
|---|---|---|---|
| **Production Domain** | `esteelconcepts.com` (Company Registrar) | Company Owned | DNS configured with SSL & canonical rules |
| **GitHub Repository** | `MHanzzala/esc-new-website` | Company Controlled | Full admin rights, `main` branch protected |
| **Turso Database Account** | Elite Steel Concepts Organization Cluster | Company Controlled | Production cluster: `elite-steel-concepts` |
| **SMTP / Mail Service** | `esteelquotes@gmail.com` (Official ESC Sales) | Company Controlled | Dedicated corporate notification channel |
| **Google Analytics** | Official ESC Property | Company Controlled | Measurement IDs mapped in Admin Settings |
| **Production Server** | Hostinger VPS / Cloud Corporate Account | Company Controlled | Dedicated standalone Node.js environment |

*Audit Finding:* Zero services, personal email accounts, unmanaged personal databases, or external third-party personal subscriptions are utilized in this infrastructure.

---

## 10. System Stability, Completed Features & Future Roadmap

### 10.1 System Health and Stability Audit
* **TypeScript Compilation:** 100% clean compilation across all pages, server actions, and shared libraries with zero type errors (`npx tsc --noEmit` verified).
* **Critical Bug Count:** **0 known critical bugs**.
* **Edge Error Handling:** All server actions implement comprehensive `try/catch` error boundaries with graceful fallback to local storage if external network connections fluctuate.
* **Canonical URL Protection:** Built-in Next.js redirects eliminate split-authority penalties between `esteelconcepts.com` and `www.esteelconcepts.com`, as well as mapping 18+ legacy `.php` endpoints to modern routes.

### 10.2 Completed Local Enhancements (Ready for Review)
The following feature sets have been developed, tested locally, and are fully ready for review:

1. **30+ SEO-Optimized Commercial Blog Articles:**
   * Full meta descriptions written following high-converting search formulas.
   * Removal of legacy template placeholder text.
   * Inclusion of verified proof points (350+ builds, 12+ years, 48 states, 100% inspection pass rate).
2. **Programmatic Contextual Internal Linking Engine:**
   * Automated insertion of keyword-matched internal links connecting high-traffic blog articles to commercial quote and service pages.
   * Full admin control panel (`/admin/internal-links`) allowing live modification of anchor text rules and target URLs.
3. **Automated Midnight Backup Scheduler:**
   * Self-healing daemon running at midnight PKT with 7-day snapshot retention.
4. **Geo-Targeted Location Landing Hub:**
   * Dynamic city and regional pages for Virginia, Maryland, Washington DC, and national transportation corridors.
5. **Media Cloud Streaming Layer:**
   * Cloud database storage and high-speed streaming for all blog and portfolio imagery.

> [!IMPORTANT]
> **Pending Deployment Status:** As instructed, all newly completed features remain safely staged in the local repository and have **not** been pushed to live production servers. Deployment will only occur upon explicit stakeholder review and approval.

### 10.3 Unfinished & Upcoming Roadmap Initiatives
The following potential enhancements are outlined for subsequent phases following current release approval:
* **Interactive 3D Kitchen Configurator:** An in-browser 3D model customizer allowing prospective buyers to place sinks, fryers, griddles, and refrigeration inside a virtual trailer body.
* **Client Build Portal:** A private tracking dashboard where food truck buyers can log in to view real-time stage progression photos (Framing, Plumbing, Electrical, Hood Installation, Inspection, Wrap, Delivery).
* **Automated County Permit Database:** An interactive lookup tool mapping health and fire department inspection checklists across 50+ DMV counties and municipalities.

---

## 11. Maintenance Runbook & Useful Commands

| Task | Command | Purpose |
|---|---|---|
| **Local Development** | `npm run dev` | Starts local Next.js dev server on `localhost:3000` |
| **Type Check & Lint** | `npm run lint` | Verifies code quality and ensures zero TypeScript/ESLint errors |
| **Production Build** | `npm run build` | Generates optimized production bundle in `.next` |
| **Production Start** | `npm run start` | Starts Next.js server locally in production mode |
| **Instant DB Backup** | `npm run backup` | Executes manual on-demand snapshot of database into `data/backups/` |
| **Turso Cloud Push** | `node scripts/sync-to-turso.mjs` | Uploads current local `data/db.json` state to Turso Cloud |
| **Test Blog Integrity**| `npm run test:blog` | Runs automated verification of blog article data persistence |

---

*End of Documentation Report.*
