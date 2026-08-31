import LocationEditor from "@/components/admin/LocationEditor";
import { saveLocation } from "@/app/actions/locations";

export default function NewLocationPage() {
    return <LocationEditor action={saveLocation} />;
}
