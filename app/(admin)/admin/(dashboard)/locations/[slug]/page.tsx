import LocationEditor from "@/components/admin/LocationEditor";
import { saveLocation, deleteLocation } from "@/app/actions/locations";
import { getLocationBySlug } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";

export default async function EditLocationPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const location = await getLocationBySlug(slug);

    if (!location) {
        notFound();
    }

    const handleDelete = async () => {
        "use server";
        await deleteLocation(location.id);
        redirect("/admin/locations");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <form action={handleDelete}>
                    <Button type="submit" className="bg-red-500/10 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white uppercase font-black tracking-widest text-xs gap-2">
                        <Trash2 size={14} /> Delete Location
                    </Button>
                </form>
            </div>
            <LocationEditor action={saveLocation} initialData={location} />
        </div>
    );
}
