import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data/db.json');

export interface BlogPost {
    id: string;
    title: string;
    subtitle?: string;
    excerpt: string;
    category: string;
    tags?: string[];
    date: string;
    readTime: string;
    image: string;
    imageAlt?: string;
    slug: string;
    status: "Published" | "Draft";
    content?: string;
}

export interface Quote {
    id: string;
    name: string;
    email: string;
    phone: string;
    company?: string;
    projectType: string;
    sourcing: string;
    budget: string;
    timeline: string;
    menuType?: string;
    message: string;

    // New Detailed Fields
    dimensions?: string;
    equipment?: string;
    brandingNeeds?: string;
    powerRequirements?: string;
    services?: string[]; // e.g., ["Design", "Permits", "Fabrication"]

    date: string;
    status: "New" | "Contacted" | "Closed";
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    date: string;
    status: "New" | "Read";
}

export interface GlobalSettings {
    // Core Identity
    email: string;
    phone: string;
    address: string;
    businessHours?: string;
    logoUrl?: string;

    // Communication & Sales
    salesEmail?: string;
    supportEmail?: string;
    whatsappPhone?: string;

    // Social Networks
    instagram: string;
    facebook: string;
    twitter: string;
    linkedin?: string;
    youtube?: string;

    // Identity & Compliance
    taxId?: string;
    certifications?: string; // e.g. "NSF, METRO DC HEALTH, NFPA"

    // Branding & Design Tokens
    primaryColor?: string; // Hex e.g. #FFC107
    secondaryColor?: string; // Hex
    accentColor?: string;

    // Location & Analytics
    googleMapsLink?: string;
    mapEmbedUrl?: string;
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    tiktokPixelId?: string;

    // Operational Metrics (Overrides)
    trucksBuiltCount?: number;
    experienceYears?: number;

    // System Status
    maintenanceMode?: boolean;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
    category: string;
    order: number;
}

export interface PageSection {
    title?: string;
    subtitle?: string;
    content?: string;
    ctaText?: string;
}

export interface PageSEO {
    title: string;
    description: string;
    keywords: string;
    imageAlts?: { [key: string]: string };
    sections?: { [key: string]: PageSection };
    structuredData?: string; // JSON-LD
}

export interface SEOSettings {
    siteTitle: string;
    description: string;
    keywords: string;
    ogImage: string;
    twitterHandle: string;
    robotsTxt: string;
    canonicalUrl: string;
    pages: {
        [key: string]: PageSEO;
    };
}

export interface Testimonial {
    id: string;
    clientName: string;
    role?: string;
    company?: string;
    content: string;
    rating: number; // 1-5
    date: string;
    image?: string;
}

export interface Newsletter {
    id: string;
    email: string;
    date: string;
}

export interface Project {
    id: string;
    title: string;
    slug: string;
    category: string;
    image: string; // Featured image
    gallery?: string[]; // Multiple images
    description: string;
    tagline?: string; // Short hook
    client?: string;
    completionDate?: string;
    location?: string;
    specifications?: {
        dimensions?: string;
        chassis?: string;
        power?: string;
        equipment?: string[];
    };
    featured?: boolean;
}

export interface MediaAsset {
    id: string;
    url: string;
    alt: string;
    page: string; // "home", "about", "services", "global", etc.
    location: string; // "hero", "sidebar", "gallery", etc.
    dimensions: string; // Guidance for user, e.g. "1920x1080"
    createdAt: string;
}

interface DatabaseSchema {
    posts: BlogPost[];
    quotes: Quote[];
    contacts: Contact[];
    settings: GlobalSettings;
    seo: SEOSettings;
    testimonials: Testimonial[];
    projects: Project[];
    faqs?: FAQ[];
    newsletters?: Newsletter[];
    assets?: MediaAsset[];
}

const DEFAULT_SETTINGS: GlobalSettings = {
    email: "esteelconcepts@gmail.com",
    phone: "(571) 651-0337",
    address: "8303 Rugby Rd, Manassas VA",
    instagram: "https://www.instagram.com/elitesteelconcepts/",
    facebook: "https://www.facebook.com/EliteSteelConcepts",
    twitter: "https://twitter.com",
    linkedin: "",
    youtube: "",
    businessHours: "Mon-Fri: 9AM - 6PM | Sat: 10AM - 2PM | Sun: Closed",
    logoUrl: "/logo.png",
    googleMapsLink: "",
    mapEmbedUrl: ""
};

const PAGE_STRUCTURE: { [key: string]: { [key: string]: PageSection } } = {
    "home": {
        "hero": { title: "Custom Food Trucks, Trailers & Mobile Kitchens Built to Perform", content: "Design. Fabrication. Ready to Serve. We turn your culinary vision into a high-performance mobile business.", ctaText: "Request a Quote" },
        "intro": { title: "Building Custom Food Trucks & Concession Trailers For Entrepreneurs Since 2012", content: "If you're looking to get started on launching your very own mobile food truck, contact Elite Steel Concepts today! Though we're located in the Metro DC area, our services are nationwide. We provide opportunity for entrepreneurs to visualize and design their ideal mobile kitchen and make their dream a reality. We're skilled in the fabrication, assembly and creation of beautiful mobile kitchens, food trucks and concession trailers. Our ultimate goal is to roll out a beautiful mobile food business in record time to allow you to spread happiness with your menu! All our trucks and trailers are built specifically to your needs and goals." },
        "cta": { title: "Ready to Start Your Build?", subtitle: "Tell us about your vision and let's create the perfect mobile kitchen for your business.", ctaText: "Get a Free Quote" }
    },
    "about": {
        "header": { title: "Our Story", subtitle: "Crafting the heart of mobile commerce since 2012. We are more than fabricators; we are your partners in entrepreneurship." },
        "story": { title: "Empowering the Next Generation of Food Pioneers", subtitle: "Since 2012", content: "At Elite Steel Concepts, we believe that every great chef deserves a kitchen that works as hard as they do. Founded on the principles of integrity and master craftsmanship, we have helped hundreds of entrepreneurs transition from dreamers to business owners." },
        "cta": { title: "Ready to Start Your Journey?", subtitle: "Let's build a business that moves with you. Get your custom quote started today.", ctaText: "Get Free Quote" }
    },
    "services": {
        "header": { title: "Expert Fabrication", subtitle: "Master craftsmanship applied to the art of mobile kitchens." },
        "intro": { title: "Industry Leading Mobile Kitchen Solutions", subtitle: "Precision Builds", content: "At Elite Steel Concepts, we don't just build boxes with kitchens. We engineer high-performance commercial environments designed to maximize flow, sanitation, and safety while projecting a premium brand image." },
        "cta": { title: "Build Your Business On A Foundation Of Steel", ctaText: "Get Custom Quote" }
    },
    "portfolio": { "header": { title: "Elite Showcase", subtitle: "Browse our recent custom builds." } },
    "process": { "header": { title: "The Build Journey", subtitle: "From concept to keys." } },
    "blog": { "header": { title: "News & Insights", subtitle: "Latest from the workshop." } },
    "contact": { "header": { title: "Get In Touch", subtitle: "Start your consultation today." } },
    "quote": { "header": { title: "Custom Quote", subtitle: "Detailed pricing for your vision." } },
    "testimonials": { "header": { title: "Client Success Stories", subtitle: "Hear from the entrepreneurs we've helped launch." } },
    "privacy": {
        "header": { title: "Privacy Policy", subtitle: "Your data security is our priority." },
        "content": { title: "Information Governance", content: "At Elite Steel Concepts, we adhere to strict data protection standards. We collect information only necessary to provide our fabrication services and improve your user experience." }
    },
    "terms": {
        "header": { title: "Terms of Service", subtitle: "The foundation of our partnership." },
        "content": { title: "Legal Framework", content: "By utilizing our services, you agree to the following terms and conditions regarding custom fabrication, payment schedules, and project timelines." }
    }
};

const DEFAULT_SEO: SEOSettings = {
    siteTitle: "Elite Steel Concepts",
    description: "Custom Food Truck Builder",
    keywords: "food truck, trailer",
    ogImage: "",
    twitterHandle: "",
    robotsTxt: "User-agent: *\nAllow: /",
    canonicalUrl: "https://www.esteelconcepts.com",
    pages: {}
};

// Helper to read DB
async function readDb(): Promise<DatabaseSchema> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        const parsed = JSON.parse(data);
        return {
            posts: parsed.posts || [],
            quotes: parsed.quotes || [],
            contacts: parsed.contacts || [],
            settings: parsed.settings || DEFAULT_SETTINGS,
            seo: parsed.seo || DEFAULT_SEO,
            testimonials: parsed.testimonials || [],
            projects: parsed.projects || [],
            faqs: parsed.faqs || [],
            newsletters: parsed.newsletters || [],
            assets: parsed.assets || []
        };
    } catch (error) {
        return {
            posts: [],
            quotes: [],
            contacts: [],
            settings: DEFAULT_SETTINGS,
            seo: DEFAULT_SEO,
            testimonials: [],
            projects: [],
            faqs: [],
            newsletters: [],
            assets: []
        };
    }
}

// Helper to write DB
async function writeDb(data: DatabaseSchema): Promise<void> {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// --- BLOG POSTS ---
export async function getPosts(): Promise<BlogPost[]> {
    const db = await readDb();
    return db.posts;
}

export async function getPostById(id: string): Promise<BlogPost | undefined> {
    const db = await readDb();
    return db.posts.find((p) => p.id === id);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const db = await readDb();
    return db.posts.find((p) => p.slug === slug);
}

export async function createPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const db = await readDb();
    const newPost = { ...post, id: Date.now().toString() };
    db.posts.push(newPost);
    await writeDb(db);
    return newPost;
}

export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    const db = await readDb();
    const index = db.posts.findIndex((p) => p.id === id);
    if (index === -1) return null;

    db.posts[index] = { ...db.posts[index], ...updates };
    await writeDb(db);
    return db.posts[index];
}

export async function deletePost(id: string): Promise<void> {
    const db = await readDb();
    db.posts = db.posts.filter((p) => p.id !== id);
    await writeDb(db);
}

// --- QUOTES ---
export async function createQuote(quote: Omit<Quote, 'id' | 'date' | 'status'>): Promise<Quote> {
    const db = await readDb();
    const newQuote: Quote = {
        ...quote,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "New"
    };
    if (!db.quotes) db.quotes = [];
    db.quotes.unshift(newQuote);
    await writeDb(db);
    return newQuote;
}

export async function getQuotes(): Promise<Quote[]> {
    const db = await readDb();
    return db.quotes || [];
}

export async function updateQuote(id: string, updates: Partial<Quote>): Promise<Quote | null> {
    const db = await readDb();
    const index = db.quotes?.findIndex((q) => q.id === id) ?? -1;
    if (index === -1) return null;

    db.quotes![index] = { ...db.quotes![index], ...updates };
    await writeDb(db);
    return db.quotes![index];
}

export async function deleteQuote(id: string): Promise<void> {
    const db = await readDb();
    db.quotes = db.quotes?.filter((q) => q.id !== id) || [];
    await writeDb(db);
}

// --- CONTACTS ---
export async function createContact(contact: Omit<Contact, 'id' | 'date' | 'status'>): Promise<Contact> {
    const db = await readDb();
    const newContact: Contact = {
        ...contact,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "New"
    };
    if (!db.contacts) db.contacts = [];
    db.contacts.unshift(newContact);
    await writeDb(db);
    return newContact;
}

export async function getContacts(): Promise<Contact[]> {
    const db = await readDb();
    return db.contacts || [];
}

export async function updateContact(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    const db = await readDb();
    const index = db.contacts?.findIndex((c) => c.id === id) ?? -1;
    if (index === -1) return null;

    db.contacts![index] = { ...db.contacts![index], ...updates };
    await writeDb(db);
    return db.contacts![index];
}

export async function deleteContact(id: string): Promise<void> {
    const db = await readDb();
    db.contacts = db.contacts?.filter((c) => c.id !== id) || [];
    await writeDb(db);
}

// --- SETTINGS ---
export async function getSettings(): Promise<GlobalSettings> {
    const db = await readDb();
    return db.settings || DEFAULT_SETTINGS;
}

export async function updateSettings(updates: Partial<GlobalSettings>): Promise<GlobalSettings> {
    const db = await readDb();
    db.settings = { ...db.settings, ...updates };
    await writeDb(db);
    return db.settings;
}

// --- SEO ---
export async function getSEO(): Promise<SEOSettings> {
    const db = await readDb();
    return db.seo || DEFAULT_SEO;
}

export async function getPageSEO(pageId: string): Promise<PageSEO> {
    const seo = await getSEO();
    const dbPage = seo?.pages?.[pageId] || { title: "", description: "", keywords: "", imageAlts: {}, sections: {}, structuredData: "" };
    const structure = PAGE_STRUCTURE[pageId] || {};

    // Deep merge sections: DB overrides structure defaults
    const mergedSections = { ...structure };
    if (dbPage.sections) {
        Object.keys(dbPage.sections).forEach(key => {
            mergedSections[key] = {
                ...structure[key],
                ...dbPage.sections![key]
            };
        });
    }

    return {
        ...dbPage,
        sections: mergedSections
    };
}

export async function updateSEO(updates: Partial<SEOSettings>): Promise<SEOSettings> {
    const db = await readDb();
    db.seo = { ...db.seo, ...updates };
    await writeDb(db);
    return db.seo;
}

// --- TESTIMONIALS ---
export async function getTestimonials(): Promise<Testimonial[]> {
    const db = await readDb();
    return db.testimonials || [];
}

export async function createTestimonial(testimonial: Omit<Testimonial, 'id' | 'date'>): Promise<Testimonial> {
    const db = await readDb();
    const newTestimonial: Testimonial = {
        ...testimonial,
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };
    if (!db.testimonials) db.testimonials = []; // Safety check
    db.testimonials.unshift(newTestimonial);
    await writeDb(db);
    return newTestimonial;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
    const db = await readDb();
    const index = db.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return null;

    db.testimonials[index] = { ...db.testimonials[index], ...updates };
    await writeDb(db);
    return db.testimonials[index];
}

export async function deleteTestimonial(id: string): Promise<void> {
    const db = await readDb();
    db.testimonials = db.testimonials.filter((t) => t.id !== id);
    await writeDb(db);
}

// --- PROJECTS ---
export async function getProjects(): Promise<Project[]> {
    const db = await readDb();
    return db.projects || [];
}

export async function getProjectById(id: string): Promise<Project | undefined> {
    const db = await readDb();
    return db.projects?.find((p) => p.id === id);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
    const db = await readDb();
    return db.projects?.find((p) => p.slug === slug);
}

export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const db = await readDb();
    const newProject: Project = {
        ...project,
        id: Date.now().toString(),
    };
    if (!db.projects) db.projects = [];
    db.projects.unshift(newProject);
    await writeDb(db);
    return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const db = await readDb();
    const index = db.projects?.findIndex((p) => p.id === id) ?? -1;
    if (index === -1) return null;

    db.projects[index] = { ...db.projects[index], ...updates };
    await writeDb(db);
    return db.projects[index];
}

export async function deleteProject(id: string): Promise<void> {
    const db = await readDb();
    db.projects = db.projects?.filter((p) => p.id !== id) || [];
    await writeDb(db);
}

// --- FAQs ---
export async function getFAQs(): Promise<FAQ[]> {
    const db = await readDb();
    return db.faqs || [];
}

export async function createFAQ(faq: Omit<FAQ, 'id'>): Promise<FAQ> {
    const db = await readDb();
    const newFAQ: FAQ = {
        ...faq,
        id: Date.now().toString(),
    };
    if (!db.faqs) db.faqs = [];
    db.faqs.push(newFAQ);
    await writeDb(db);
    return newFAQ;
}

export async function updateFAQ(id: string, updates: Partial<FAQ>): Promise<FAQ | null> {
    const db = await readDb();
    const index = db.faqs?.findIndex((f) => f.id === id) ?? -1;
    if (index === -1) return null;

    db.faqs![index] = { ...db.faqs![index], ...updates };
    await writeDb(db);
    return db.faqs![index];
}

export async function deleteFAQ(id: string): Promise<void> {
    const db = await readDb();
    db.faqs = db.faqs?.filter((f) => f.id !== id) || [];
    await writeDb(db);
}

// --- NEWSLETTER ---
export async function createNewsletter(email: string): Promise<Newsletter> {
    const db = await readDb();
    const newEntry: Newsletter = {
        id: Date.now().toString(),
        email,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    if (!db.newsletters) db.newsletters = [];

    // Check if email already exists
    const exists = db.newsletters.find(n => n.email.toLowerCase() === email.toLowerCase());
    if (exists) return exists;

    db.newsletters.unshift(newEntry);
    await writeDb(db);
    return newEntry;
}

export async function getNewsletters(): Promise<Newsletter[]> {
    const db = await readDb();
    return db.newsletters || [];
}

export async function deleteNewsletter(id: string): Promise<void> {
    const db = await readDb();
    db.newsletters = db.newsletters?.filter((n) => n.id !== id) || [];
    await writeDb(db);
}

// --- ASSETS ---
export async function getAssets(): Promise<MediaAsset[]> {
    const db = await readDb();
    return db.assets || [];
}

export async function getMediaAsset(page: string, location: string, fallback: string): Promise<{ url: string, alt: string }> {
    const assets = await getAssets();
    const asset = assets.find(a => a.page === page && a.location === location);
    return asset ? { url: asset.url, alt: asset.alt } : { url: fallback, alt: "Elite Steel Concepts" };
}

export async function createAsset(asset: Omit<MediaAsset, 'id' | 'createdAt'>): Promise<MediaAsset> {
    const db = await readDb();
    const newAsset: MediaAsset = {
        ...asset,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    if (!db.assets) db.assets = [];
    db.assets.unshift(newAsset);
    await writeDb(db);
    return newAsset;
}

export async function updateAsset(id: string, updates: Partial<MediaAsset>): Promise<MediaAsset | null> {
    const db = await readDb();
    const index = db.assets?.findIndex((a) => a.id === id) ?? -1;
    if (index === -1) return null;

    db.assets![index] = { ...db.assets![index], ...updates };
    await writeDb(db);
    return db.assets![index];
}

export async function deleteAsset(id: string): Promise<void> {
    const db = await readDb();
    db.assets = db.assets?.filter((a) => a.id !== id) || [];
    await writeDb(db);
}


