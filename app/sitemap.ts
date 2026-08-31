import { MetadataRoute } from 'next'
import { getPosts, getProjects, getSEO, getLocations } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const seo = await getSEO()
    const baseUrl = seo.canonicalUrl || 'https://www.esteelconcepts.com'

    // Clean up baseUrl - remove trailing slash if present
    const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl

    const posts = await getPosts()
    const projects = await getProjects()

    const seenBlogSlugs = new Set<string>()
    const blogUrls = posts
        .filter(post => post.status === "Published")
        .filter(post => {
            if (seenBlogSlugs.has(post.slug)) return false
            seenBlogSlugs.add(post.slug)
            return true
        })
        .map((post) => {
            const dateObj = post.date ? new Date(post.date) : new Date();
            return {
                url: `${base}/blog/${post.slug}`,
                lastModified: isNaN(dateObj.getTime()) ? new Date() : dateObj,
                changeFrequency: 'monthly' as const,
                priority: 0.6,
            };
        })

    const projectUrls = projects.map((project) => {
        const dateObj = project.completionDate ? new Date(project.completionDate) : new Date();
        return {
            url: `${base}/portfolio/${project.slug}`,
            lastModified: isNaN(dateObj.getTime()) ? new Date() : dateObj,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        };
    })

    const locations = await getLocations()
    const locationUrls = [
        { url: '/locations', priority: 0.9, changeFrequency: 'monthly' as const },
        ...locations.filter(loc => loc.published).map((loc) => ({
            url: `/locations/${loc.slug}`,
            priority: 0.9,
            changeFrequency: 'monthly' as const,
        })),
    ]

    const staticRoutes = [
        { url: '', priority: 1.0, changeFrequency: 'monthly' as const },
        { url: '/services', priority: 0.9, changeFrequency: 'monthly' as const },
        { url: '/portfolio', priority: 0.9, changeFrequency: 'monthly' as const },
        { url: '/process', priority: 0.8, changeFrequency: 'monthly' as const },
        { url: '/about', priority: 0.7, changeFrequency: 'monthly' as const },
        { url: '/blog', priority: 0.8, changeFrequency: 'weekly' as const },
        { url: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
        { url: '/quote', priority: 1.0, changeFrequency: 'monthly' as const },
        { url: '/compliance', priority: 0.9, changeFrequency: 'monthly' as const },
        { url: '/testimonials', priority: 0.8, changeFrequency: 'monthly' as const },
        { url: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
        { url: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
        { url: '/services/custom-food-trailers', priority: 0.9, changeFrequency: 'monthly' as const },
        { url: '/services/custom-food-trucks', priority: 0.9, changeFrequency: 'monthly' as const },
        { url: '/services/design-and-consultation', priority: 0.8, changeFrequency: 'monthly' as const },
        { url: '/services/fleet-expansion', priority: 0.7, changeFrequency: 'monthly' as const },
        { url: '/services/repairs-and-upgrades', priority: 0.8, changeFrequency: 'monthly' as const },
    ]

    const staticUrls = [...staticRoutes, ...locationUrls].map((route) => ({
        url: `${base}${route.url}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }))

    return [...staticUrls, ...blogUrls, ...projectUrls]
}
