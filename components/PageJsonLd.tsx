import React from "react";
import JsonLd from "@/components/JsonLd";
import { getPageSchemas } from "@/lib/pageSchemas";

/** Page-level JSON-LD (auto-generated + admin custom), keyed by SEO page id. */
export default async function PageJsonLd({ pageId }: { pageId: string }) {
  const schemas = await getPageSchemas(pageId);
  return (
    <>
      {schemas.map((s, i) => (
        <JsonLd key={i} data={s} />
      ))}
    </>
  );
}
