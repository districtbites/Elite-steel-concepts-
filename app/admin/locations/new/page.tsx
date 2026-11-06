import LocationEditor from "@/components/admin/LocationEditor";
import { saveLocation } from "@/app/actions/locations";
import { getPosts } from "@/lib/db";

export default async function NewLocationPage() {
    const posts = await getPosts();
    return <LocationEditor action={saveLocation} posts={posts.map(({ id, title, slug, status }) => ({ id, title, slug, status }))} />;
}
