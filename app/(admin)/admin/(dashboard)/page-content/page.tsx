import { redirect } from "next/navigation";
import { getAssets, getLocations, getPosts, getProjects } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/adminAuth";
import { canWriteContent } from "@/lib/pageContent/write";
import { PAGES } from "@/lib/pageContent/registry";
import { getAdminPageContentState } from "@/lib/pageContent";
import { customSectionsKey } from "@/lib/pageContent/types";
import PageContentEditor, { type CatalogPage } from "@/components/admin/pageContent/PageContentEditor";
import type { CollectionId } from "@/components/admin/pageContent/ContentDashboard";
import type { LinkOption, MediaOption } from "@/components/admin/pageContent/fields";

export const dynamic = "force-dynamic";

/** Dashboard collection of each editable page. */
const COLLECTION_OF: Record<string, CollectionId> = {
    site: "global",
    services: "services",
    custom_food_trucks: "services",
    custom_food_trailers: "services",
    fleet_expansion: "services",
    design_and_consultation: "services",
    repairs_and_upgrades: "services",
    privacy: "legal",
    terms: "legal"
};

export default async function PageContentPage({ searchParams }: { searchParams: Promise<{ key?: string; page?: string }> }) {
    const admin = await getCurrentAdmin();
    if (!admin) redirect("/admin/login");

    const [{ key, page }, state, posts, projects, locations, assets] = await Promise.all([
        searchParams,
        getAdminPageContentState(),
        getPosts(),
        getProjects(),
        getLocations(),
        getAssets()
    ]);

    // Serializable catalogue: pages → sections (+ the page builder entry where enabled)
    const catalog: CatalogPage[] = PAGES.map(page => ({
        id: page.id,
        label: page.label,
        icon: page.icon,
        path: page.path,
        sections: [
            ...page.sections.map(s => ({ key: s.key, label: s.label, description: s.description, fields: s.fields })),
            ...(page.builder
                ? [{ key: customSectionsKey(page.id), label: "Custom Sections", description: "Modular blocks added below the page's fixed sections.", fields: null }]
                : [])
        ]
    })).filter(p => p.sections.length > 0);

    const links: LinkOption[] = [
        ...PAGES.filter(p => p.path).map(p => ({ href: p.path!, label: p.label, group: "Pages" })),
        { href: "/locations", label: "All Locations", group: "Pages" },
        ...posts.filter(p => p.status === "Published").map(p => ({ href: `/blog/${p.slug}`, label: p.title, group: "Blog Posts" })),
        ...projects.map(p => ({ href: `/portfolio/${p.slug}`, label: p.title, group: "Portfolio" })),
        ...locations.filter(l => l.published).map(l => ({ href: `/locations/${l.slug}`, label: `${l.city}, ${l.state}`, group: "Locations" }))
    ].filter((l, i, all) => all.findIndex(x => x.href === l.href) === i);

    const media: MediaOption[] = assets
        .filter(a => a.url)
        .map(a => ({ url: a.url, alt: a.alt, label: a.alt || `${a.page} · ${a.location}` }))
        .filter((m, i, all) => all.findIndex(x => x.url === m.url) === i);

    return (
        <PageContentEditor
            catalog={catalog}
            initialState={state}
            links={links}
            media={media}
            canEdit={canWriteContent(admin.role)}
            initialKey={key}
            initialPage={page}
            collections={Object.fromEntries(catalog.map(p => [p.id, COLLECTION_OF[p.id] ?? "main"]))}
            locations={locations
                .map(l => ({ slug: l.slug, city: l.city, state: l.state, published: l.published }))
                .sort((a, b) => a.city.localeCompare(b.city))}
        />
    );
}
