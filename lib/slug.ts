/**
 * URL slug from any text: "Food Truck Permits & Licenses (2026)!" → "food-truck-permits-licenses-2026".
 * Shared by the blog editor (live preview) and the save actions.
 */
export function slugify(text: string, maxLength = 100): string {
    return (text || "")
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "") // strip accents
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, maxLength)
        .replace(/-+$/g, "");
}
