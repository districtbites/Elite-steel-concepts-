"use server";

import { revalidatePath } from "next/cache";

export async function updateSitemap() {
  try {
    revalidatePath("/sitemap.xml");
    return { success: true, message: "Sitemap successfully updated." };
  } catch (error) {
    return { success: false, message: "Failed to update sitemap." };
  }
}
