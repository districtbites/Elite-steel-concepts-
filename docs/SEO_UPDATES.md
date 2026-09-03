# Elite Steel Concepts — Website SEO & Content Update Log

**Date:** April 2026  
**Scope:** Full SEO audit implementation, location pages, URL redirects, canonical fixes  
**Source documents:** ESC_Blog_SEO_Audit.docx · ESC_Location_Pages_Strategy.docx · ESC_GSC_SEO_Report.docx

---

## Table of Contents

1. [Blog Post Fixes](#1-blog-post-fixes)
2. [Homepage SEO](#2-homepage-seo)
3. [Blog Post Page Template](#3-blog-post-page-template)
4. [Location Pages (New)](#4-location-pages-new)
5. [Navigation](#5-navigation)
6. [Sitemap](#6-sitemap)
7. [URL Redirects](#7-url-redirects)
8. [Canonical URL Fixes](#8-canonical-url-fixes)
9. [Files Changed Summary](#9-files-changed-summary)

---

## 1. Blog Post Fixes

**File:** `data/db.json`

### 1.1 Meta Descriptions Added

All 30 published blog posts were missing `metaDescription`. Every post now has a custom meta description following the audit formula:
- Specific benefit the reader gets
- One ESC proof point (350+ builds, 14+ years, 48 states, 100% pass rate)
- Call-to-action with phone number (571) 651-0337
- 150–175 characters

| Post | Meta Description |
|---|---|
| Food Truck Permits 2026 | "Food truck permits 2026: every license you need before opening in any state. ESC builds 100% code-compliant trucks. 14+ years, 350+ builds. Free guide: (571) 651-0337." |
| 50 Food Truck Ideas | "50 proven food truck ideas ranked by profit potential in 2026. Real revenue data. Elite Steel Concepts has built 350+ trucks. Get inspired and get a free custom build quote." |
| Food Truck Menu Ideas | "30 most profitable food truck menu ideas in 2026. Real profit margins, concept breakdowns. Elite Steel Concepts — 350+ custom builds. Free design consultation: (571) 651-0337." |
| Food Truck Layout | "Design the perfect food truck layout — the builder's 5-zone guide for 2026. ESC: 14+ years, 350+ builds. Free custom design consultation: (571) 651-0337." |
| Fire Suppression | "Food truck fire suppression systems — what every owner must know before inspection. ESC installs & certifies Ansul systems in DMV. Don't fail inspection. (571) 651-0337." |
| Custom Builders Virginia | "How to choose a custom food truck builder in Virginia in 2026. ESC: 14+ years, 350+ builds, Manassas VA. Serving all of Virginia & DMV. Free quote: (571) 651-0337." |
| *(all 30 posts covered)* | *(see db.json for complete list)* |

### 1.2 Placeholder Text Fixed

The following literal placeholder text was visible to users and Google across multiple posts. All have been corrected:

| Post | Problem | Fix |
|---|---|---|
| Permits | `- Second item` | Replaced with `- Fire Safety Certificate` |
| Permits | `- Third itemParking and Vending Permits` | Split into `- Parking and Vending Permits` |
| Permits | `- PSole Proprietorship` | Fixed to `- Sole Proprietorship` |
| Permits | `### bInspectors review:` | Fixed to `### Inspectors Review:` |
| Permits | `- PCommercial hood ventilation system` | Fixed to `- Commercial hood ventilation system` |
| Permits | `- PFire suppression system` | Fixed to `- Fire suppression system` |
| Permits | `- Check city-approved vendor lists- Point two` | Fixed to `- Check city-approved vendor lists` |
| Permits | `### YQ4: If I buy...` | Fixed to `### Q4: If I buy...` |
| Permits | `### Business License...OneYour Sub-heading Here` | Removed embedded placeholder |
| Equipment Checklist | `- Refrigeration- Point three` | Fixed to `- Refrigeration` |
| Equipment Checklist | `### Your Sub-heading Here` + `CTA:` | Removed placeholder section |
| Food Truck vs Trailer | `- Point three` | Removed |
| Food Van Business | `- Point two` | Removed |
| Book Events | `- Point two`, `- Point three` (×2) | Removed all instances |
| Concession Trailer (post 1) | `### Your Sub-heading Here` | Replaced with `### Interior Space & Customization Options` |
| Concession Trailer (post 2) | `- Point one`, `- Point two`, `- Point three` | Removed all instances |
| Wedding Catering | `- Point two`, `- Point three` | Removed |
| Ultimate Repairs Guide | `- Point one`, `- Point two`, `- Point three` | Replaced with real ESC service links |
| Cost Breakdown | `- Point three` | Removed |
| Food Truck Repairs Guide | `- Point two` | Removed |
| Fire Suppression | `- Schedule annual certification- Point three` | Fixed to `- Schedule annual certification` |
| Hood Installation | `- Grills- Point three` | Fixed to `- Grills` |
| Custom Builders Virginia | `- Point two` | Removed |
| Business Plan (funded) | `- Point two` | Removed |

### 1.3 Read Time Corrected

| Post | Before | After |
|---|---|---|
| Food Truck Permits and Licenses | `2 Min Read` | `12 Min Read` |

The post is clearly a 10–12 minute read. The inaccurate label reduced perceived content value and increased bounce rate.

### 1.4 CTA Text Fixed (ESC Does Not Sell Used Trucks)

Multiple posts contained CTAs saying "Browse our selection of new and used food trucks" — ESC only builds **custom trucks**, not used ones. All instances replaced:

- `"Browse our selection of new and used food trucks and trailers"` → `"Contact Elite Steel Concepts — our expert builders will design a custom mobile kitchen tailored to your exact business needs. Call (571) 651-0337 or request a free quote at esteelconcepts.com/quote"`

### 1.5 Broken Tags Fixed

The Layout post tags field contained `#Cu` (hashtag cut off mid-word) and `#BestTruckForAFoodTruckstomFoodTrucks` (words run together):

- `#Cu` → `#CustomFoodTruckDesign`
- `#BestTruckForAFoodTruckstomFoodTrucks` → `#BestTruckForAFoodTruck #CustomFoodTrucks`

---

## 2. Homepage SEO

**File:** `data/db.json` → `seo` and `seo.pages.home`

### 2.1 Site Title Updated

| | Value |
|---|---|
| **Before** | `Elite Steel Concepts \| Custom Food Trucks & Mobile Kitchen Fabrication` |
| **After** | `Custom Food Truck Builder \| 350+ Builds \| Elite Steel Concepts \| Manassas VA` |

### 2.2 Site Description Updated

| | Value |
|---|---|
| **Before** | *(empty)* |
| **After** | `14+ years, 350+ builds, 48 states. Expert food truck builders in Manassas, VA. 100% health code compliant. Custom trucks, trailers & repairs. Free quote: (571) 651-0337.` |

### 2.3 Homepage Meta Title Updated

| | Value |
|---|---|
| **Before** | `Custom Food Truck Builders VA \| Elite Steel Concepts` |
| **After** | `Custom Food Truck Builder \| 350+ Builds \| Elite Steel Concepts \| Manassas VA` |

### 2.4 LocalBusiness JSON-LD Schema Added

A full `LocalBusiness` structured data block was added to the homepage. This feeds Google Maps rankings and the Local Pack. Fields populated:

- `@type`: `LocalBusiness`
- `name`: Elite Steel Concepts
- `telephone`: +15716510337
- `address`: 11200 Bertalice Ct, Manassas, VA 20110
- `openingHoursSpecification`: Mon–Sat 9AM–5PM
- `hasOfferCatalog`: Custom Food Truck Fabrication, Concession Trailer Building, Repairs, Fire Suppression, Hood Installation, Generator Installation
- `areaServed`: Virginia, Maryland, Washington DC

---

## 3. Blog Post Page Template

**File:** `app/(public)/blog/[slug]/page.tsx`

The entire blog post template was updated to implement the audit recommendations. Changes:

### 3.1 Quick Answer Box Added

A bordered callout box appears immediately below the hero on every post, using the post's `metaDescription` as content. This is the primary technique for targeting Google's **Position 0 / Featured Snippet** result. None of the 28 original posts had this.

### 3.2 Article JSON-LD Schema Added

Every blog post now outputs `Article` structured data with:
- `headline`, `description`, `image`, `datePublished`
- `author` and `publisher` both set to Elite Steel Concepts

### 3.3 FAQPage JSON-LD Schema Added

A `FAQPage` structured data extractor was built into the page template. It automatically scans each post's content for FAQ headings matching `### Q:`, `### Q1:`, `### FAQ:` patterns and outputs a `FAQPage` schema block. Google renders these as expandable accordion dropdowns directly in search results, significantly increasing CTR and screen real estate.

### 3.4 Inline CTA Added (Mid-Article)

A prominent CTA box was added at the 55% mark of every post — between the first and second half of content. It includes:
- ESC name and proof points (14+ years, 350+ builds, 100% health code compliant)
- Clickable phone number `(571) 651-0337`
- Link to `/quote`

Previously every post had only a single generic CTA at the very bottom, losing 70%+ of readers who never scroll that far.

### 3.5 Phone Number Added to All CTAs

All CTAs (inline, bottom, and sidebar) now include a clickable `(571) 651-0337` link. The audit specifically flagged the absence of a phone number in all existing CTAs.

### 3.6 Sidebar CTA Added

The sidebar now contains a persistent CTA card (visible the whole time the reader scrolls) with phone number and quote link. Previously the sidebar had a generic "Share" / "Elite Distribution" widget with no conversion value.

### 3.7 Index Keywords (Hashtag Tags) Section Removed

The "Index Keywords" section displaying hashtag-formatted tags was removed from the public page. The audit flagged these as:
- Looking like amateur spam to readers
- Not functioning as SEO keywords
- Damaging perceived authority and professionalism

The `#` double-prefix rendering bug (stored tags already contained `#`, template added another) is resolved by removal.

### 3.8 `metaDescription` Field Used in Metadata

`generateMetadata` was updated to use `post.metaDescription` as the primary description source (falls back to `subtitle` then `excerpt`). The `metaDescription` field was also added to the `BlogPost` interface in `lib/db.ts`.

---

## 4. Location Pages (New)

**Files created:**
- `app/(public)/locations/data.ts`
- `app/(public)/locations/page.tsx`
- `app/(public)/locations/[city]/page.tsx`

### 4.1 Strategy

Per the Location Pages Strategy document, a 4-tier system of 29 location pages was planned. **Tier 1 (8 pages)** was fully built as the first phase. Tier 2–4 can be added to `data.ts` and will automatically be included in routing, sitemap, and navigation.

### 4.2 Tier 1 Pages Built

All live at `/locations/[slug]`:

| City | Slug | Distance from Shop |
|---|---|---|
| Washington DC | `washington-dc` | 30 miles |
| Arlington, VA | `arlington-va` | 20 miles |
| Alexandria, VA | `alexandria-va` | 25 miles |
| Fairfax, VA | `fairfax-va` | 15 miles |
| Manassas, VA | `manassas-va` | Home market |
| Rockville, MD | `rockville-md` | 35 miles |
| Bethesda, MD | `bethesda-md` | 30 miles |
| Silver Spring, MD | `silver-spring-md` | 35 miles |

### 4.3 Each Location Page Contains

- **Unique title tag and meta description** (copied exactly from strategy document)
- **Unique H1** per location
- **Unique intro paragraph** describing that city's food truck market
- **Quick Answer box** for Featured Snippet targeting
- **3 content sections**: Why choose ESC / Services / Local compliance specifics
- **Local details list**: specific streets, employers, event venues, permit requirements unique to that city
- **5-question FAQ** with city-specific questions, rendered with native `<details>` accordion
- **LocalBusiness + FAQPage JSON-LD schema** on every page
- **Internal links** to all other location pages (link equity distribution)
- **Prominent CTA** with phone number and quote link, using exact CTA copy from strategy document
- **Self-referencing canonical tag**

### 4.4 Locations Index Page

`/locations` serves as the hub page listing all Tier 1 cities with a nationwide delivery section and stat grid (14+ years, 350+ builds, 48 states, 100% code compliant).

---

## 5. Navigation

**File:** `components/Header.tsx`

Added **"Locations"** link to both desktop and mobile navigation menus, pointing to `/locations`. Replaces the less commercially valuable "Process" position in the nav order.

| Before | After |
|---|---|
| Home · About Us · Services · Process · Portfolio · Blog · Contact | Home · About Us · Services · **Locations** · Portfolio · Blog · Contact |

---

## 6. Sitemap

**File:** `app/sitemap.ts`

### 6.1 Location Pages Added

All location pages are now included via `getAllLocationSlugs()` from `data.ts`. Adding new Tier 2–4 cities to `data.ts` will automatically include them in the sitemap — no manual updates needed.

### 6.2 Duplicate Blog Slug Deduplicated

The slug `food-truck-vs-concession-trailer-i-broke-down-every-difference-so-you-dont-have-to` appeared twice in the database, creating a duplicate URL in the sitemap. A `Set`-based deduplication filter was added to the blog URL generation.

### 6.3 Final Sitemap Count

**54 total URLs:**

| Group | Count |
|---|---|
| Core static pages | 11 |
| Service pages | 6 |
| Location pages | 9 (index + 8 cities) |
| Blog posts | 29 (30 minus 1 duplicate) |
| Portfolio projects | 6 |

Admin pages (`/admin/*`) are correctly excluded via `robots.ts`.

---

## 7. URL Redirects

### 7.1 Legacy PHP Redirects

**File:** `next.config.ts`

19 permanent 301 redirects added for legacy URLs from the old PHP-based website that Google had indexed:

| Old URL | Redirects To |
|---|---|
| `/index.php` | `/` |
| `/index` | `/` |
| `/index.html` | `/` |
| `/blog.php` | `/blog` |
| `/about.php` | `/about` |
| `/contact.php` | `/contact` |
| `/services.php` | `/services` |
| `/portfolio.php` | `/portfolio` |
| `/gallery.php` | `/portfolio` |
| `/gallery` | `/portfolio` |
| `/process.php` | `/process` |
| `/quote.php` | `/quote` |
| `/get-quote.php` | `/quote` |
| `/get-a-quote` | `/quote` |
| `/get-a-quote.php` | `/quote` |
| `/testimonials.php` | `/testimonials` |
| `/privacy.php` | `/privacy` |
| `/privacy-policy.php` | `/privacy` |
| `/terms.php` | `/terms` |
| `/terms-and-conditions.php` | `/terms` |
| `/terms-and-conditions` | `/terms` |

### 7.2 Non-www → www Canonical Redirect

**Files:** `next.config.ts` + `middleware.ts`

Two-layer enforcement:

1. **`next.config.ts`** — redirect rule using `has: [{ type: 'host', value: 'esteelconcepts.com' }]` redirects all non-www traffic to `www.esteelconcepts.com`
2. **`middleware.ts`** — edge-level www enforcement runs before the router, catching any requests that bypass the config-level redirect

This fixes the split-authority issue identified in the GSC report where both `esteelconcepts.com` and `www.esteelconcepts.com` were appearing as separate sites, dividing ranking authority.

The `middleware.ts` matcher was also updated to cover all public routes (previously only `/admin/*`).

---

## 8. Canonical URL Fixes

**Issue:** `app/layout.tsx` was setting `alternates: { canonical: 'https://www.esteelconcepts.com' }` globally — every page on the site was claiming the **homepage** as its canonical URL. Google flagged `/blog`, `/about`, `/contact`, `/portfolio`, `/testimonials` as **"Duplicate without user-selected canonical"**.

### 8.1 Root Layout Fixed

`app/layout.tsx` changed from:
```
alternates: { canonical: seo.canonicalUrl }   // wrong — homepage URL on ALL pages
```
To:
```
alternates: { canonical: '/' }                // correct — homepage canonical only
```

`metadataBase` remains set to `https://www.esteelconcepts.com`, so all relative canonical paths (e.g. `'/blog'`) are resolved to full absolute URLs automatically.

### 8.2 Self-Referencing Canonicals Added to All Pages

Every public page now has an explicit self-referencing canonical tag:

| Page | Canonical |
|---|---|
| `/` | `https://www.esteelconcepts.com/` |
| `/about` | `https://www.esteelconcepts.com/about` |
| `/blog` | `https://www.esteelconcepts.com/blog` |
| `/contact` | `https://www.esteelconcepts.com/contact` |
| `/portfolio` | `https://www.esteelconcepts.com/portfolio` |
| `/testimonials` | `https://www.esteelconcepts.com/testimonials` |
| `/process` | `https://www.esteelconcepts.com/process` |
| `/quote` | `https://www.esteelconcepts.com/quote` |
| `/privacy` | `https://www.esteelconcepts.com/privacy` |
| `/terms` | `https://www.esteelconcepts.com/terms` |
| `/services` | `https://www.esteelconcepts.com/services` |
| `/services/custom-food-trucks` | `https://www.esteelconcepts.com/services/custom-food-trucks` |
| `/services/custom-food-trailers` | `https://www.esteelconcepts.com/services/custom-food-trailers` |
| `/services/design-and-consultation` | `https://www.esteelconcepts.com/services/design-and-consultation` |
| `/services/fleet-expansion` | `https://www.esteelconcepts.com/services/fleet-expansion` |
| `/services/repairs-and-upgrades` | `https://www.esteelconcepts.com/services/repairs-and-upgrades` |
| `/blog/[slug]` | `https://www.esteelconcepts.com/blog/{slug}` |
| `/portfolio/[slug]` | `https://www.esteelconcepts.com/portfolio/{slug}` |
| `/locations` | `https://www.esteelconcepts.com/locations` |
| `/locations/[city]` | `https://www.esteelconcepts.com/locations/{city}` |

The `/portfolio/[slug]` page also had `generateMetadata` added from scratch — it previously had no metadata generation at all.

---

## 9. Files Changed Summary

### Modified Files

| File | Changes |
|---|---|
| `data/db.json` | Meta descriptions (×30), placeholder text fixes, readTime fix, CTA fixes, tag fixes, homepage SEO title/description, LocalBusiness schema |
| `lib/db.ts` | Added `metaDescription?: string` to `BlogPost` interface |
| `app/layout.tsx` | Fixed global canonical from homepage URL to `'/'` |
| `app/(public)/page.tsx` | Added `canonical: '/'` |
| `app/(public)/about/page.tsx` | Added `canonical: '/about'` |
| `app/(public)/blog/page.tsx` | Added `canonical: '/blog'` |
| `app/(public)/blog/[slug]/page.tsx` | Full rewrite: Quick Answer box, Article schema, FAQ schema, inline CTA, phone numbers, sidebar CTA, removed hashtag tags, added `canonical: '/blog/${slug}'` |
| `app/(public)/contact/page.tsx` | Added `canonical: '/contact'` |
| `app/(public)/portfolio/page.tsx` | Added `canonical: '/portfolio'` |
| `app/(public)/portfolio/[slug]/page.tsx` | Added `generateMetadata` + `canonical: '/portfolio/${slug}'` |
| `app/(public)/testimonials/page.tsx` | Added `canonical: '/testimonials'` |
| `app/(public)/process/page.tsx` | Added `canonical: '/process'` |
| `app/(public)/quote/page.tsx` | Added `canonical: '/quote'` |
| `app/(public)/privacy/page.tsx` | Added `canonical: '/privacy'` |
| `app/(public)/terms/page.tsx` | Added `canonical: '/terms'` |
| `app/(public)/services/page.tsx` | Added `canonical: '/services'` |
| `app/(public)/services/custom-food-trucks/page.tsx` | Added `canonical: '/services/custom-food-trucks'` |
| `app/(public)/services/custom-food-trailers/page.tsx` | Added `canonical: '/services/custom-food-trailers'` |
| `app/(public)/services/design-and-consultation/page.tsx` | Added `canonical: '/services/design-and-consultation'` |
| `app/(public)/services/fleet-expansion/page.tsx` | Added `canonical: '/services/fleet-expansion'` |
| `app/(public)/services/repairs-and-upgrades/page.tsx` | Added `canonical: '/services/repairs-and-upgrades'` |
| `app/sitemap.ts` | Added location pages, deduplicated blog slugs |
| `next.config.ts` | Added 19 PHP legacy redirects + non-www → www redirect |
| `middleware.ts` | Added www enforcement at edge, updated matcher to all public routes |
| `components/Header.tsx` | Added "Locations" nav link |

### New Files Created

| File | Purpose |
|---|---|
| `app/(public)/locations/data.ts` | Location page data store — all 8 Tier 1 cities with exact copy from strategy doc |
| `app/(public)/locations/page.tsx` | Locations hub/index page |
| `app/(public)/locations/[city]/page.tsx` | Dynamic location page template with schema, FAQ, CTAs |
| `docs/SEO_UPDATES.md` | This document |

---

## Next Steps (Not Yet Implemented)

The following items from the audit documents are recommended for the next phase:

### High Priority
- **Post consolidation**: Merge 5 duplicate post clusters into single authoritative pages (Food Truck vs Concession Trailer ×3, Repairs ×3, Wedding Catering ×2, Business Plan ×2, Food Van Business ×2)
- **Tier 2 location pages**: Richmond, Virginia Beach, Norfolk, Fredericksburg, Herndon, Reston, Leesburg, Ashburn

### Medium Priority  
- **Service pages for commercial-intent keywords**: Dedicated pages for `Custom Food Truck Builder Virginia`, `Food Truck Fabricator Manassas VA`, `Concession Trailer Builder Northern Virginia`
- **Portfolio SEO**: Add keyword-rich descriptions to each portfolio project — currently minimal SEO value
- **Google Business Profile**: Update service area to match all Tier 1 + Tier 2 cities, add build photos, enable weekly posts

### Ongoing
- **Tier 3 + Tier 4 location pages**: Maryland suburbs, DC neighborhoods, national delivery markets
- **Internal linking audit**: Ensure blog posts link to relevant service pages (not unrelated pages)
- **Core Web Vitals**: Check Google PageSpeed Insights — desktop CTR of 0.28% suggests slow load times may be a factor

---

*Document prepared April 2026 | Based on ESC_Blog_SEO_Audit.docx, ESC_Location_Pages_Strategy.docx, ESC_GSC_SEO_Report.docx*
