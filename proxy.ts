import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname, hostname } = request.nextUrl;

    // ── Enforce www canonical ─────────────────────────────────────────
    // Redirect non-www to www so Google treats them as one site
    if (hostname === "esteelconcepts.com") {
        const wwwUrl = new URL(request.url);
        wwwUrl.hostname = "www.esteelconcepts.com";
        return NextResponse.redirect(wwwUrl, { status: 301 });
    }

    // ── Admin auth guard ──────────────────────────────────────────────
    if (pathname.startsWith("/admin")) {
        if (pathname === "/admin/login") {
            return NextResponse.next();
        }

        const adminSession = request.cookies.get("admin_session");
        if (!adminSession) {
            return NextResponse.redirect(new URL("/admin/login", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Run on all routes except Next.js internals and static files
        "/((?!_next/static|_next/image|favicon|logo|uploads|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf)$).*)",
    ],
};
