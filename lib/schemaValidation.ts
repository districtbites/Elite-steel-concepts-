/**
 * Parsing, de-duplication and validation for page JSON-LD. Pure functions, so the
 * admin editor (live feedback) and the server (save + render) apply the same rules.
 * The checks cover the properties Google requires for each rich-result type.
 */

export type Schema = Record<string, unknown>;

/** Types a page should only ever describe once. */
const SINGLETON_TYPES = ["LocalBusiness", "Organization", "WebSite", "BreadcrumbList", "FAQPage", "Article", "Service"];

const typesOf = (node: Schema): string[] => {
  const t = node["@type"];
  return Array.isArray(t) ? t.map(String) : t ? [String(t)] : [];
};

/** Every top-level entity in a block (a block may wrap several in @graph). */
const nodesOf = (block: Schema): Schema[] =>
  Array.isArray(block["@graph"]) ? (block["@graph"] as Schema[]) : [block];

export const schemaLabel = (block: Schema) =>
  nodesOf(block)
    .map((n) => typesOf(n).join(" + ") || "Untyped")
    .join(" + ");

export function parseSchemaJson(raw: string | undefined): { schemas: Schema[]; error?: string } {
  if (!raw || !raw.trim()) return { schemas: [] };
  try {
    const parsed = JSON.parse(raw);
    const list = Array.isArray(parsed) ? parsed : [parsed];
    if (!list.every((s) => s && typeof s === "object" && !Array.isArray(s))) {
      return { schemas: [], error: "Schema must be a JSON object or an array of objects." };
    }
    return { schemas: list };
  } catch (e) {
    return { schemas: [], error: e instanceof Error ? e.message : "Invalid JSON" };
  }
}

/**
 * Drops exact duplicates and any later block repeating a type the page already
 * describes (e.g. a second LocalBusiness). Returns what was removed for display.
 */
export function dedupeSchemas(schemas: Schema[]): { schemas: Schema[]; removed: string[] } {
  const seenJson = new Set<string>();
  const seenTypes = new Set<string>();
  const kept: Schema[] = [];
  const removed: string[] = [];

  for (const block of schemas) {
    const json = JSON.stringify(block);
    const types = nodesOf(block).flatMap(typesOf).filter((t) => SINGLETON_TYPES.includes(t));
    if (seenJson.has(json) || types.some((t) => seenTypes.has(t))) {
      removed.push(schemaLabel(block));
      continue;
    }
    seenJson.add(json);
    types.forEach((t) => seenTypes.add(t));
    kept.push(block);
  }
  return { schemas: kept, removed };
}

const isAbsoluteUrl = (v: unknown) => typeof v === "string" && /^https?:\/\//.test(v);
const isIsoDate = (v: unknown) => typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v);
const nonEmpty = (v: unknown) => typeof v === "string" && v.trim().length > 0;

/** Google's required properties per type. Returns human-readable problems (empty = valid). */
export function validateSchemas(schemas: Schema[]): string[] {
  const errors: string[] = [];

  schemas.forEach((block, i) => {
    const where = `Block ${i + 1} (${schemaLabel(block)})`;
    if (block["@context"] !== "https://schema.org" && block["@context"] !== "http://schema.org") {
      errors.push(`${where}: "@context" must be "https://schema.org".`);
    }

    for (const node of nodesOf(block)) {
      const types = typesOf(node);
      if (types.length === 0) errors.push(`${where}: missing "@type".`);

      if (types.includes("FAQPage")) {
        const qs = node.mainEntity as Schema[] | undefined;
        if (!Array.isArray(qs) || qs.length === 0) errors.push(`${where}: FAQPage needs at least one question.`);
        else
          qs.forEach((q, j) => {
            const answer = q.acceptedAnswer as Schema | undefined;
            if (!nonEmpty(q.name)) errors.push(`${where}: question ${j + 1} has no "name".`);
            if (!answer || !nonEmpty(answer.text)) errors.push(`${where}: question ${j + 1} has no answer text.`);
          });
      }

      if (types.includes("BreadcrumbList")) {
        const items = node.itemListElement as Schema[] | undefined;
        if (!Array.isArray(items) || items.length === 0) errors.push(`${where}: BreadcrumbList has no items.`);
        else
          items.forEach((it, j) => {
            if (it.position !== j + 1) errors.push(`${where}: item ${j + 1} should have position ${j + 1}.`);
            if (!nonEmpty(it.name)) errors.push(`${where}: item ${j + 1} has no "name".`);
            if (j < items.length - 1 && !isAbsoluteUrl(it.item)) errors.push(`${where}: item ${j + 1} needs a full URL in "item".`);
          });
      }

      if (types.includes("Article") || types.includes("BlogPosting")) {
        if (!nonEmpty(node.headline)) errors.push(`${where}: Article needs a "headline".`);
        else if ((node.headline as string).length > 110) errors.push(`${where}: headline is longer than 110 characters.`);
        if (!isAbsoluteUrl(node.image)) errors.push(`${where}: Article "image" must be a full URL.`);
        if (node.datePublished !== undefined && !isIsoDate(node.datePublished))
          errors.push(`${where}: "datePublished" must be a date like 2026-03-03.`);
      }

      if (types.includes("LocalBusiness")) {
        // A short reference ({ @id, name }) points at the business; only the full entity needs an address
        const isReference = Object.keys(node).every((k) => ["@type", "@id", "name", "url"].includes(k));
        if (!nonEmpty(node.name)) errors.push(`${where}: LocalBusiness needs a "name".`);
        if (!isReference && !node.address) errors.push(`${where}: LocalBusiness needs an "address".`);
      }

      if (types.includes("Service") && !nonEmpty(node.name)) errors.push(`${where}: Service needs a "name".`);
    }
  });

  return errors;
}

/** Parse → dedupe → validate in one step. */
export function checkSchemaJson(raw: string) {
  const parsed = parseSchemaJson(raw);
  if (parsed.error) return { schemas: [], removed: [], errors: [`Invalid JSON: ${parsed.error}`] };
  const { schemas, removed } = dedupeSchemas(parsed.schemas);
  return { schemas, removed, errors: validateSchemas(schemas) };
}
