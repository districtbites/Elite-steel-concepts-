"use client";

import React, { useMemo, useState } from "react";
import { Code2, Copy, CheckCircle2, ExternalLink, AlertCircle, Loader2, Wand2, Database, Trash2 } from "lucide-react";
import { generatePageSchemaJson } from "@/app/actions/settings";
import { SITE_URL } from "@/lib/schema";
import { checkSchemaJson, schemaLabel } from "@/lib/schemaValidation";

interface SchemaEditorProps {
  pageId: string;
  path: string;
  /** Editor contents (unsaved edits included). */
  value: string;
  /** What is currently stored in the database for this page. */
  savedValue: string;
  onChange: (value: string) => void;
}

/**
 * Schema tab of the SEO manager. The page's JSON-LD lives in the database; this
 * editor generates it from the page content, checks it live against Google's
 * required fields, and flags duplicates (which are also stripped on save).
 */
export default function SchemaEditor({ pageId, path, value, savedValue, onChange }: SchemaEditorProps) {
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const check = useMemo(() => (value.trim() ? checkSchemaJson(value) : null), [value]);
  const isSaved = savedValue.trim().length > 0;
  const hasUnsaved = value.trim() !== savedValue.trim();
  const pageUrl = `${SITE_URL}${path}`;

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await generatePageSchemaJson(pageId);
      onChange(res.json);
    } finally {
      setGenerating(false);
    }
  };

  // Paste into the Code tab of the Rich Results Test to check before saving
  const copyCode = () => {
    const code = (check?.schemas || [])
      .map((s) => `<script type="application/ld+json">\n${JSON.stringify(s, null, 2)}\n</script>`)
      .join("\n");
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="bg-admin-surface p-6 md:p-8 text-admin-text shadow-xl">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-admin-surface/10">
            <Code2 size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-base font-black uppercase tracking-tight">Page Schema (JSON-LD)</h3>
            <p className="text-[10px] text-admin-muted font-medium uppercase tracking-wider mt-0.5">
              Structured data Google reads on <span className="font-mono normal-case text-admin-text">{path}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={generate}
            disabled={generating}
            className="flex items-center gap-2 border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
          >
            {generating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
            Generate from page
          </button>
          <button
            type="button"
            onClick={copyCode}
            disabled={!check || check.schemas.length === 0}
            className="flex items-center gap-2 border border-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
          >
            {copied ? <CheckCircle2 size={12} className="text-green-400" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy code"}
          </button>
          <a
            href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-primary px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-black hover:bg-orange-500 transition-colors"
          >
            <ExternalLink size={12} />
            Test on Google
          </a>
        </div>
      </div>

      {/* Database status */}
      <div
        className={`mb-4 flex items-start gap-2 border px-4 py-3 text-xs ${
          isSaved ? "border-green-500/30 bg-green-500/5 text-green-400" : "border-yellow-500/30 bg-yellow-500/5 text-yellow-400"
        }`}
      >
        <Database size={14} className="shrink-0 mt-0.5" />
        <span className="font-bold">
          {isSaved
            ? "Saved in database — this is the schema the live page outputs."
            : "Not saved yet — the page currently outputs auto-generated schema. Click “Generate from page”, review, then save."}
          {hasUnsaved && " You have unsaved changes."}
        </span>
      </div>

      <textarea
        rows={18}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        placeholder={`Click "Generate from page" to create this page's schema.`}
        className="w-full bg-admin-bg/30 border border-white/10 p-5 outline-none focus:border-primary font-mono text-xs text-primary placeholder:text-gray-600 resize-y transition-all leading-relaxed"
      />

      {/* Live check */}
      {check && (
        <div className="mt-4 space-y-3">
          {check.schemas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {check.schemas.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 border border-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                >
                  <CheckCircle2 size={11} className="text-green-400" />
                  {schemaLabel(s)}
                </span>
              ))}
            </div>
          )}
          {check.removed.length > 0 && (
            <div className="flex items-start gap-2 text-yellow-400 text-xs">
              <Trash2 size={14} className="shrink-0 mt-0.5" />
              <span className="font-bold">
                Duplicate removed on save: {check.removed.join(", ")}. Each type can appear only once per page.
              </span>
            </div>
          )}
          {check.errors.length > 0 ? (
            <div className="space-y-1.5">
              {check.errors.map((err) => (
                <div key={err} className="flex items-start gap-2 text-red-400 text-xs">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <span className="font-bold">{err}</span>
                </div>
              ))}
              <p className="text-[10px] text-admin-muted uppercase tracking-wider">Fix these before saving — invalid schema is not saved.</p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-green-400 text-xs font-bold">
              <CheckCircle2 size={14} /> All required Google fields present.
            </div>
          )}
        </div>
      )}

      <p className="mt-5 text-[10px] text-admin-muted font-medium uppercase tracking-wider leading-relaxed">
        Leave empty to use auto-generated schema. After changing this page&apos;s FAQs or services, click &ldquo;Generate from page&rdquo; and save so the schema matches what visitors see.
        &ldquo;Test on Google&rdquo; checks the deployed page; to check before saving, paste &ldquo;Copy code&rdquo; into the Rich Results Test Code tab.
      </p>
    </div>
  );
}
