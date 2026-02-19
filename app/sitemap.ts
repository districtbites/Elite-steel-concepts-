import { MetadataRoute } from 'next'
import { getPosts, getProjects, getSEO } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const seo = await getSEO()
    const baseUrl = seo.canonicalUrl || 'https://elitesteelconcepts.com'

    // Clean up baseUrl - remove trailing slash if present
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl

    const posts = await getPosts()
    const projects = await getProjects()

    const blogUrls = posts
        .filter(post => post.status === "Published")
        .map((post) => ({
            url: `${base}/blog/${post.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        }))

    const projectUrls = projects.map((project) => ({
        url: `${base}/portfolio/${project.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    const staticRoutes = [
        { url: '', priority: 1.0, changeFrequency: 'yearly' as const },
        { url: '/services', priority: 0.9, changeFrequency: 'monthly' as const },
        { url: '/portfolio', priority: 0.8, changeFrequency: 'monthly' as const },
        { url: '/process', priority: 0.7, changeFrequency: 'monthly' as const },
        { url: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
        { url: '/blog', priority: 0.7, changeFrequency: 'weekly' as const },
        { url: '/contact', priority: 0.6, changeFrequency: 'yearly' as const },
        { url: '/quote', priority: 0.9, changeFrequency: 'yearly' as const },
        { url: '/testimonials', priority: 0.6, changeFrequency: 'monthly' as const },
        { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
        { url: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
        { url: '/services/custom-food-trailers', priority: 0.8, changeFrequency: 'monthly' as const },
        { url: '/services/custom-food-trucks', priority: 0.8, changeFrequency: 'monthly' as const },
        { url: '/services/design-and-consultation', priority: 0.8, changeFrequency: 'monthly' as const },
        { url: '/services/fleet-expansion', priority: 0.8, changeFrequency: 'monthly' as const },
        { url: '/services/repairs-and-upgrades', priority: 0.8, changeFrequency: 'monthly' as const },
    ]

    const staticUrls = staticRoutes.map((route) => ({
        url: `${base}${route.url}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }))

    return [...staticUrls, ...blogUrls, ...projectUrls]
}
