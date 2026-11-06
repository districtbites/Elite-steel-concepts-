"use client";

import React from "react";
import { usePathname } from "next/navigation";

/** Wraps public pages in the site header and footer. The admin area has its own layout. */
export default function SiteChrome({
  header,
  footer,
  children,
}: {
  header: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return <>{children}</>;

  return (
    <>
      {header}
      <main className="flex-grow">{children}</main>
      {footer}
    </>
  );
}
