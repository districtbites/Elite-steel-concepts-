import { MetadataRoute } from 'next'
import { getSEO } from '@/lib/db'

export default async function robots(): Promise<MetadataRoute.Robots> {
    const seo = await getSEO()
    const baseUrl = seo.canonicalUrl || 'https://elitesteelconcepts.com'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
