"use client";

import React, { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";

const DEBOUNCE_MS = 300;

/** Live search for the blog manager: keeps `?q=` in the URL, along with the active status/category tabs. */
export default function BlogSearch({ query }: { query: string }) {
 const router = useRouter();
 const [pending, startTransition] = useTransition();
 const inputRef = useRef<HTMLInputElement>(null);
 const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
 const lastPushed = useRef(query);

 // Uncontrolled so a slow response can't overwrite what is being typed; only outside changes
 // (e.g. the "View all articles" link clearing the search) are copied into the input
 useEffect(() => {
 if (query !== lastPushed.current && inputRef.current) {
 inputRef.current.value = query;
 lastPushed.current = query;
 }
 }, [query]);

 useEffect(() => () => clearTimeout(timer.current), []);

 const push = (value: string) => {
 const next = value.trim();
 if (next === lastPushed.current) return;
 lastPushed.current = next;
 const params = new URLSearchParams(window.location.search);
 params.delete("page"); // results change, so start from the first page
 if (next) params.set("q", next);
 else params.delete("q");
 const qs = params.toString();
 startTransition(() => router.replace(qs ? `/admin/blog?${qs}` : "/admin/blog", { scroll: false }));
 };

 const schedule = (value: string) => {
 clearTimeout(timer.current);
 timer.current = setTimeout(() => push(value), DEBOUNCE_MS);
 };

 const clear = () => {
 clearTimeout(timer.current);
 if (inputRef.current) {
 inputRef.current.value = "";
 inputRef.current.focus();
 }
 push("");
 };

 return (
 <div className="relative">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-muted pointer-events-none" size={15} />
 <input
 ref={inputRef}
 type="text"
 defaultValue={query}
 onChange={(e) => schedule(e.target.value)}
 onKeyDown={(e) => {
 if (e.key === "Enter") {
 clearTimeout(timer.current);
 push(e.currentTarget.value);
 } else if (e.key === "Escape") {
 clear();
 }
 }}
 placeholder="Search articles..."
 aria-label="Search articles"
 className="peer w-full bg-admin-surface border border-admin-border pl-9 pr-9 py-2.5 text-sm text-admin-text outline-none focus:border-primary transition-colors"
 />
 {pending ? (
 <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-primary animate-spin" size={15} />
 ) : (
 <button
 type="button"
 onClick={clear}
 aria-label="Clear search"
 className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-admin-muted hover:text-admin-text peer-placeholder-shown:hidden"
 >
 <X size={15} />
 </button>
 )}
 </div>
 );
}
