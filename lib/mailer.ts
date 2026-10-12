import nodemailer from "nodemailer";
import { GlobalSettings, Quote, Contact } from "@/lib/db";

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
const BRAND = {
    primary:    "#F7931E",   // Orange
    black:      "#000000",
    dark:       "#111111",
    darkCard:   "#1a1a1a",
    mid:        "#2a2a2a",
    text:       "#e5e5e5",
    muted:      "#888888",
    light:      "#f4f4f4",
    white:      "#ffffff",
    border:     "#2e2e2e",
    success:    "#22c55e",
    info:       "#3b82f6",
};

// ─── SMTP Config ─────────────────────────────────────────────────────────────
// .env SMTP_* values take priority over the admin-panel settings stored in the DB.
function withEnvSmtp(settings: GlobalSettings): GlobalSettings {
    const env = process.env;
    const port = env.SMTP_PORT ? Number(env.SMTP_PORT) : settings.smtpPort || 587;
    const secure = env.SMTP_SECURE
        ? env.SMTP_SECURE.toLowerCase() === "true"
        : settings.smtpSecure ?? port === 465;
    return {
        ...settings,
        smtpHost:          env.SMTP_HOST          || settings.smtpHost,
        smtpPort:          port,
        smtpSecure:        secure,
        smtpUser:          env.SMTP_USER          || settings.smtpUser,
        smtpPassword:      env.SMTP_PASSWORD      || settings.smtpPassword,
        smtpFrom:          env.SMTP_FROM          || settings.smtpFrom,
        notificationEmail: env.NOTIFICATION_EMAIL || settings.notificationEmail,
    };
}

// ─── Transporter ─────────────────────────────────────────────────────────────
// secure=true  → implicit SSL/TLS (port 465)
// secure=false → STARTTLS upgrade, required (port 587)
function transportOptions(settings: GlobalSettings) {
    const secure = settings.smtpSecure ?? false;
    return {
        host:       settings.smtpHost || "smtp.gmail.com",
        port:       settings.smtpPort || 587,
        secure,
        requireTLS: !secure,
        tls:        { minVersion: "TLSv1.2" as const },
        auth: {
            user: settings.smtpUser     || "",
            pass: settings.smtpPassword || "",
        },
    };
}

function createTransporter(settings: GlobalSettings) {
    return nodemailer.createTransport(transportOptions(settings));
}

// ─── Shared Utilities ─────────────────────────────────────────────────────────

function escapeHtml(text: string) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/** Returns a copy of a quote with every user-supplied text field HTML-escaped. */
function escapeQuote(quote: Quote): Quote {
    const escaped: Record<string, unknown> = { ...quote };
    for (const [key, value] of Object.entries(quote)) {
        if (typeof value === "string") escaped[key] = escapeHtml(value);
    }
    if (Array.isArray(quote.services)) escaped.services = quote.services.map(escapeHtml);
    return escaped as unknown as Quote;
}

function pill(text: string, color: string) {
    return `<span style="display:inline-block;background:${color}22;color:${color};border:1px solid ${color}44;padding:4px 14px;border-radius:100px;font-size:10px;font-weight:800;letter-spacing:2px;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">${text}</span>`;
}

function infoRow(label: string, value: string) {
    if (!value || value === "undefined" || value === "null" || value === "—") {
        if (!value || value === "undefined" || value === "null") return "";
    }
    return `
    <tr>
      <td style="padding:11px 16px 11px 0;border-bottom:1px solid ${BRAND.border};width:36%;vertical-align:top;">
        <span style="font-size:9px;font-weight:800;color:${BRAND.muted};letter-spacing:2px;text-transform:uppercase;font-family:'Helvetica Neue',Arial,sans-serif;">${label}</span>
      </td>
      <td style="padding:11px 0 11px 16px;border-bottom:1px solid ${BRAND.border};vertical-align:top;">
        <span style="font-size:13px;font-weight:600;color:${BRAND.white};font-family:'Helvetica Neue',Arial,sans-serif;">${value}</span>
      </td>
    </tr>`;
}

// ─── Master Wrapper ───────────────────────────────────────────────────────────

const ADMIN_FOOTER_NOTE = "This is an automated notification. Do not reply to this email.";

function emailWrapper(content: string, accentColor: string = BRAND.primary, footerNote: string = ADMIN_FOOTER_NOTE) {
    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Elite Steel Concepts</title>
</head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0d0d0d;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;">

          <!-- ══ HEADER ══ -->
          <tr>
            <td style="background:${BRAND.black};border-radius:16px 16px 0 0;padding:0;overflow:hidden;">
              <!-- Orange top stripe -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${accentColor};height:4px;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>
              <!-- Logo area -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:36px 44px 32px;border-bottom:1px solid ${BRAND.border};">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align:middle;">
                          <!-- Icon badge -->
                          <div style="display:inline-block;background:${accentColor};width:46px;height:46px;border-radius:10px;text-align:center;line-height:46px;font-size:22px;vertical-align:middle;margin-right:14px;">⚙️</div>
                        </td>
                        <td style="vertical-align:middle;">
                          <div style="font-size:20px;font-weight:900;color:${BRAND.white};letter-spacing:-0.5px;text-transform:uppercase;line-height:1.1;">Elite Steel Concepts</div>
                          <div style="font-size:10px;font-weight:600;color:${accentColor};letter-spacing:3px;text-transform:uppercase;margin-top:3px;">Custom Food Trucks &amp; Mobile Kitchens</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══ BODY ══ -->
          <tr>
            <td style="background:${BRAND.dark};padding:40px 44px;">
              ${content}
            </td>
          </tr>

          <!-- ══ FOOTER ══ -->
          <tr>
            <td style="background:${BRAND.black};border-radius:0 0 16px 16px;padding:28px 44px;border-top:1px solid ${BRAND.border};">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <p style="margin:0;font-size:11px;font-weight:700;color:${BRAND.muted};letter-spacing:1.5px;text-transform:uppercase;">
                      ELITE STEEL CONCEPTS &nbsp;·&nbsp; 11200 Bertalice Ct, Manassas, VA 20110 &nbsp;·&nbsp; (571) 651-0337
                    </p>
                    <p style="margin:8px 0 0;font-size:10px;color:#444444;">
                      ${footerNote}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUOTE NOTIFICATION TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════

export async function sendQuoteNotification(settings: GlobalSettings, quote: Quote) {
    settings = withEnvSmtp(settings);
    const to   = settings.notificationEmail || "esteelquotes@gmail.com";
    const from = settings.smtpFrom || `Elite Steel Concepts <${settings.smtpUser || "noreply@esteelconcepts.com"}>`;

    if (!settings.smtpUser || !settings.smtpPassword) {
        console.warn("[Mailer] SMTP not configured — skipping quote notification.");
        return;
    }

    const rawEmail = quote.email;
    quote = escapeQuote(quote);
    const servicesList = Array.isArray(quote.services) && quote.services.length > 0
        ? quote.services.join(" &nbsp;·&nbsp; ")
        : "—";

    const bodyContent = `

      <!-- Alert tag -->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td>${pill("New Quote Request", BRAND.primary)}&nbsp;&nbsp;${pill(quote.status || "New", BRAND.success)}</td>
        </tr>
      </table>

      <!-- Headline -->
      <h1 style="margin:0 0 6px;font-size:30px;font-weight:900;color:${BRAND.white};letter-spacing:-1px;line-height:1.15;">
        Quote from <span style="color:${BRAND.primary};">${quote.name}</span>
      </h1>
      <p style="margin:0 0 36px;font-size:12px;color:${BRAND.muted};font-weight:500;letter-spacing:0.5px;">
        Received on ${quote.date}
      </p>

      <!-- Divider -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          <td style="height:1px;background:${BRAND.border};font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>

      <!-- Section: Client Info -->
      <p style="margin:0 0 14px;font-size:9px;font-weight:800;color:${BRAND.primary};letter-spacing:3px;text-transform:uppercase;">
        01 &nbsp;/ &nbsp;Client Information
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        ${infoRow("Full Name",  quote.name)}
        ${infoRow("Email",      `<a href="mailto:${quote.email}" style="color:${BRAND.primary};text-decoration:none;">${quote.email}</a>`)}
        ${infoRow("Phone",      quote.phone  || "—")}
        ${infoRow("Company",    quote.company || "—")}
      </table>

      <!-- Section: Vending Location -->
      <p style="margin:0 0 14px;font-size:9px;font-weight:800;color:${BRAND.primary};letter-spacing:3px;text-transform:uppercase;">
        Where Will You Be Vending?
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        ${infoRow("State", quote.vendingState || "—")}
        ${infoRow("City",  quote.vendingCity  || "—")}
      </table>

      <!-- Section: Project Specs -->
      <p style="margin:0 0 14px;font-size:9px;font-weight:800;color:${BRAND.primary};letter-spacing:3px;text-transform:uppercase;">
        02 &nbsp;/ &nbsp;Project Specifications
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        ${infoRow("Looking For",        quote.projectType)}
        ${infoRow("Food Type",          quote.menuType          || "—")}
        ${infoRow("Budget",             quote.budget            || "—")}
        ${infoRow("Timeline",           quote.timeline          || "—")}
        ${infoRow("Vehicle",            quote.sourcing          || "—")}
        ${infoRow("Preferred Size",     quote.dimensions        || "—")}
        ${infoRow("Power Source",       quote.powerRequirements || "—")}
        ${infoRow("Equipment",          quote.equipment         || "—")}
        ${quote.brandingNeeds ? infoRow("Branding Needs", quote.brandingNeeds) : ""}
        ${infoRow("Add-Ons",            servicesList)}
      </table>

      ${quote.message ? `
      <!-- Section: Message -->
      <p style="margin:0 0 14px;font-size:9px;font-weight:800;color:${BRAND.primary};letter-spacing:3px;text-transform:uppercase;">
        03 &nbsp;/ &nbsp;Client Message
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          <td style="background:${BRAND.mid};border-left:3px solid ${BRAND.primary};border-radius:0 10px 10px 0;padding:18px 20px;">
            <p style="margin:0;color:${BRAND.text};font-size:13px;line-height:1.8;">${quote.message.replace(/\n/g, "<br>")}</p>
          </td>
        </tr>
      </table>
      ` : ""}

      <!-- CTA -->
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-top:8px;">
            <a href="https://www.esteelconcepts.com/admin/quotes"
               style="display:inline-block;background:${BRAND.primary};color:${BRAND.black};font-weight:900;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;padding:15px 32px;border-radius:10px;text-decoration:none;">
              View in Dashboard &nbsp;→
            </a>
          </td>
        </tr>
      </table>
    `;

    const transporter = createTransporter(settings);
    await transporter.sendMail({
        from,
        to,
        replyTo: rawEmail,
        subject: `🔔 New Quote Request — ${quote.name} | Elite Steel Concepts`,
        html: emailWrapper(bodyContent, BRAND.primary),
    });
    console.log(`[Mailer] Quote notification sent to ${to}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT NOTIFICATION TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════

export async function sendContactNotification(settings: GlobalSettings, contact: Contact) {
    settings = withEnvSmtp(settings);
    const to   = settings.notificationEmail || "esteelquotes@gmail.com";
    const from = settings.smtpFrom || `Elite Steel Concepts <${settings.smtpUser || "noreply@esteelconcepts.com"}>`;

    if (!settings.smtpUser || !settings.smtpPassword) {
        console.warn("[Mailer] SMTP not configured — skipping contact notification.");
        return;
    }

    const name    = escapeHtml(contact.name);
    const email   = escapeHtml(contact.email);
    const phone   = contact.phone ? escapeHtml(contact.phone) : "—";
    const message = escapeHtml(contact.message).replace(/\n/g, "<br>");

    const bodyContent = `

      <!-- Alert tag -->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td>${pill("New Contact Message", BRAND.info)}&nbsp;&nbsp;${pill(contact.status || "New", BRAND.success)}</td>
        </tr>
      </table>

      <!-- Headline -->
      <h1 style="margin:0 0 6px;font-size:30px;font-weight:900;color:${BRAND.white};letter-spacing:-1px;line-height:1.15;">
        Message from <span style="color:${BRAND.primary};">${name}</span>
      </h1>
      <p style="margin:0 0 36px;font-size:12px;color:${BRAND.muted};font-weight:500;letter-spacing:0.5px;">
        Received on ${contact.date}
      </p>

      <!-- Divider -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          <td style="height:1px;background:${BRAND.border};font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>

      <!-- Section: Sender Details -->
      <p style="margin:0 0 14px;font-size:9px;font-weight:800;color:${BRAND.primary};letter-spacing:3px;text-transform:uppercase;">
        01 &nbsp;/ &nbsp;Sender Details
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        ${infoRow("First Name", name)}
        ${infoRow("Email",     `<a href="mailto:${email}" style="color:${BRAND.primary};text-decoration:none;">${email}</a>`)}
        ${infoRow("Phone",     phone)}
      </table>

      <!-- Section: Message -->
      <p style="margin:0 0 14px;font-size:9px;font-weight:800;color:${BRAND.primary};letter-spacing:3px;text-transform:uppercase;">
        02 &nbsp;/ &nbsp;Message
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          <td style="background:${BRAND.mid};border-left:3px solid ${BRAND.primary};border-radius:0 10px 10px 0;padding:20px 22px;">
            <p style="margin:0;color:${BRAND.text};font-size:13px;line-height:1.85;">${message}</p>
          </td>
        </tr>
      </table>

      <!-- Quick Reply CTA -->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
        <tr>
          <td style="padding-right:12px;">
            <a href="mailto:${email}?subject=Re: Your inquiry — Elite Steel Concepts"
               style="display:inline-block;background:${BRAND.primary};color:${BRAND.black};font-weight:900;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;padding:15px 28px;border-radius:10px;text-decoration:none;">
              Reply to ${name} &nbsp;→
            </a>
          </td>
          <td>
            <a href="https://www.esteelconcepts.com/admin/contacts"
               style="display:inline-block;background:transparent;color:${BRAND.muted};border:1px solid ${BRAND.border};font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:15px 24px;border-radius:10px;text-decoration:none;">
              View in Dashboard
            </a>
          </td>
        </tr>
      </table>
    `;

    const transporter = createTransporter(settings);
    await transporter.sendMail({
        from,
        to,
        replyTo: contact.email,
        subject: `💬 New Contact Message — ${contact.name} | Elite Steel Concepts`,
        html: emailWrapper(bodyContent, BRAND.primary),
    });
    console.log(`[Mailer] Contact notification sent to ${to}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOMER CONFIRMATION TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════

// Light, client-facing palette (admin emails keep the dark theme above).
const CLIENT = {
    page:    "#f2f2f0",
    card:    "#ffffff",
    ink:     "#111111",
    body:    "#4a4a4a",
    muted:   "#8a8a8a",
    line:    "#ececec",
    soft:    "#f8f8f7",
    font:    "'Helvetica Neue',Helvetica,Arial,sans-serif",
};

function siteUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.esteelconcepts.com").replace(/\/$/, "");
}

function telHref(phone: string) {
    const digits = phone.replace(/[^\d+]/g, "");
    return digits.startsWith("+") ? digits : `+1${digits}`;
}

function clientSection(label: string, content: string) {
    return `
      <tr>
        <td style="padding:0 48px 36px;" class="px">
          ${label ? `<p style="margin:0 0 16px;font-family:${CLIENT.font};font-size:11px;font-weight:800;color:${BRAND.primary};letter-spacing:2.5px;text-transform:uppercase;">${label}</p>` : ""}
          ${content}
        </td>
      </tr>`;
}

/** Numbered "what happens next" timeline. */
function clientSteps(steps: { title: string; text: string }[]) {
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">${steps.map((step, i) => `
        <tr>
          <td width="48" style="vertical-align:top;padding:0 0 ${i === steps.length - 1 ? 0 : 22}px;">
            <table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
              <td width="32" height="32" align="center" style="width:32px;height:32px;border-radius:16px;background:${BRAND.primary};font-family:${CLIENT.font};font-size:14px;font-weight:900;color:${BRAND.black};">${i + 1}</td>
            </tr></table>
          </td>
          <td style="vertical-align:top;padding:5px 0 ${i === steps.length - 1 ? 0 : 22}px;font-family:${CLIENT.font};">
            <div style="font-size:15px;font-weight:700;color:${CLIENT.ink};margin-bottom:4px;">${step.title}</div>
            <div style="font-size:14px;color:${CLIENT.body};line-height:1.6;">${step.text}</div>
          </td>
        </tr>`).join("")}
      </table>`;
}

/** Two-column label/value list, used for the request summary. */
function clientDetails(rows: [string, string | undefined][]) {
    const filled = rows.filter(([, value]) => value);
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="border:1px solid ${CLIENT.line};border-radius:10px;border-collapse:separate;">${filled.map(([label, value], i) => `
        <tr>
          <td width="38%" style="padding:14px 18px;${i ? `border-top:1px solid ${CLIENT.line};` : ""}background:${CLIENT.soft};font-family:${CLIENT.font};font-size:12px;font-weight:700;color:${CLIENT.muted};text-transform:uppercase;letter-spacing:1px;vertical-align:top;">${label}</td>
          <td style="padding:14px 18px;${i ? `border-top:1px solid ${CLIENT.line};` : ""}font-family:${CLIENT.font};font-size:14px;font-weight:600;color:${CLIENT.ink};vertical-align:top;">${value}</td>
        </tr>`).join("")}
      </table>`;
}

/** 2×2 grid of contact channels; stacks on mobile. */
function clientContactGrid(settings: GlobalSettings) {
    const phone = settings.phone || "(571) 651-0337";
    const email = settings.email || "esteelquotes@gmail.com";
    const mapsHref = settings.googleMapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || "")}`;
    const link = `color:${CLIENT.ink};text-decoration:none;`;

    const cell = (label: string, value: string, side: "left" | "right") => `
        <td class="stack" width="50%" style="width:50%;padding:0 ${side === "left" ? 6 : 0}px 12px ${side === "right" ? 6 : 0}px;vertical-align:top;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
            <tr><td style="background:${CLIENT.soft};border:1px solid ${CLIENT.line};border-radius:10px;padding:16px 18px;font-family:${CLIENT.font};">
              <div style="font-size:11px;font-weight:800;color:${CLIENT.muted};letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">${label}</div>
              <div style="font-size:14px;font-weight:700;color:${CLIENT.ink};line-height:1.5;">${value}</div>
            </td></tr>
          </table>
        </td>`;

    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation">
        <tr>
          ${cell("Call Us", `<a href="tel:${telHref(phone)}" style="${link}">${escapeHtml(phone)}</a>`, "left")}
          ${cell("Email Us", `<a href="mailto:${escapeHtml(email)}" style="${link}">${escapeHtml(email)}</a>`, "right")}
        </tr>
        <tr>
          ${cell("Visit Our Shop", `<a href="${escapeHtml(mapsHref)}" style="${link}">${escapeHtml(settings.address || "11200 Bertalice Ct, Manassas, VA 20110")}</a>`, "left")}
          ${cell("Business Hours", escapeHtml(settings.businessHours || "Mon–Sat | 9:00 AM – 5:00 PM"), "right")}
        </tr>
      </table>`;
}

function clientButtons(settings: GlobalSettings, secondary: { label: string; href: string }) {
    const phone = settings.phone || "(571) 651-0337";
    const button = (href: string, label: string, primary: boolean) => `
        <td class="stack" style="padding:0 12px 12px 0;">
          <a href="${href}" style="display:inline-block;background:${primary ? BRAND.primary : CLIENT.card};color:${BRAND.black};border:2px solid ${primary ? BRAND.primary : CLIENT.ink};border-radius:8px;padding:14px 28px;font-family:${CLIENT.font};font-size:13px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;">${label}</a>
        </td>`;
    return `
      <table cellpadding="0" cellspacing="0" border="0" role="presentation">
        <tr>
          ${button(`tel:${telHref(phone)}`, "Call Us Now", true)}
          ${button(secondary.href, secondary.label, false)}
        </tr>
      </table>`;
}

/** Client-facing email shell: white logo header, dark hero band, light body, dark footer. */
function clientEmail(opts: {
    settings: GlobalSettings;
    preheader: string;
    badge: string;
    heading: string;
    intro: string;
    sections: string;
}) {
    const { settings } = opts;
    const site = siteUrl();
    const logo = settings.logoUrl?.startsWith("http") ? settings.logoUrl : `${site}${settings.logoUrl || "/logo.png"}`;
    const socials = [
        ["Instagram", settings.instagram],
        ["Facebook", settings.facebook],
        ["YouTube", settings.youtube],
    ].filter(([, href]) => href) as [string, string][];

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="light only" />
  <title>Elite Steel Concepts</title>
  <style>
    @media only screen and (max-width: 620px) {
      .px { padding-left: 24px !important; padding-right: 24px !important; }
      .stack { display: block !important; width: 100% !important; box-sizing: border-box; padding-left: 0 !important; padding-right: 0 !important; }
      .h1 { font-size: 26px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${CLIENT.page};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${opts.preheader}</div>

  <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation" style="background:${CLIENT.page};">
    <tr>
      <td align="center" style="padding:40px 12px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" role="presentation" style="max-width:600px;width:100%;background:${CLIENT.card};border-radius:14px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">

          <!-- Brand stripe + logo -->
          <tr><td style="background:${BRAND.primary};height:5px;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr>
            <td align="center" style="padding:28px 48px 24px;" class="px">
              <a href="${site}" style="text-decoration:none;">
                <img src="${logo}" width="96" height="96" alt="Elite Steel Concepts" style="display:block;width:96px;height:96px;border:0;outline:none;font-family:${CLIENT.font};font-size:18px;font-weight:900;color:${CLIENT.ink};" />
              </a>
            </td>
          </tr>

          <!-- Hero -->
          <tr>
            <td style="background:${BRAND.dark};padding:40px 48px;" class="px">
              <table cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                <td style="background:rgba(247,147,30,0.15);border:1px solid rgba(247,147,30,0.45);border-radius:100px;padding:6px 14px;font-family:${CLIENT.font};font-size:11px;font-weight:800;color:${BRAND.primary};letter-spacing:2px;text-transform:uppercase;">✓&nbsp; ${opts.badge}</td>
              </tr></table>
              <h1 class="h1" style="margin:20px 0 14px;font-family:${CLIENT.font};font-size:32px;font-weight:900;line-height:1.2;color:${BRAND.white};letter-spacing:-0.5px;">${opts.heading}</h1>
              <p style="margin:0;font-family:${CLIENT.font};font-size:16px;line-height:1.7;color:#cfcfcf;">${opts.intro}</p>
            </td>
          </tr>

          <tr><td style="height:40px;font-size:0;line-height:0;">&nbsp;</td></tr>
          ${opts.sections}

          <!-- Sign-off -->
          <tr>
            <td style="padding:4px 48px 44px;" class="px">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
                <td style="border-top:1px solid ${CLIENT.line};padding-top:28px;font-family:${CLIENT.font};font-size:15px;line-height:1.7;color:${CLIENT.body};">
                  Talk soon,<br />
                  <strong style="color:${CLIENT.ink};">The Elite Steel Concepts Team</strong><br />
                  <span style="font-size:13px;color:${CLIENT.muted};">Custom Food Trucks &amp; Mobile Kitchens · Built in Manassas, VA</span>
                </td>
              </tr></table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background:${BRAND.dark};padding:30px 48px;" class="px">
              <p style="margin:0 0 6px;font-family:${CLIENT.font};font-size:14px;font-weight:900;color:${BRAND.white};letter-spacing:2px;text-transform:uppercase;">Elite Steel Concepts</p>
              <p style="margin:0 0 14px;font-family:${CLIENT.font};font-size:12px;line-height:1.7;color:#9a9a9a;">
                <a href="${escapeHtml(settings.googleMapsLink || site)}" style="color:#9a9a9a;text-decoration:none;">${escapeHtml(settings.address || "11200 Bertalice Ct, Manassas, VA 20110")}</a>
                &nbsp;·&nbsp;
                <a href="tel:${telHref(settings.phone || "(571) 651-0337")}" style="color:#9a9a9a;text-decoration:none;">${escapeHtml(settings.phone || "(571) 651-0337")}</a>
              </p>
              <p style="margin:0 0 18px;font-family:${CLIENT.font};font-size:12px;">
                <a href="${site}" style="color:${BRAND.primary};text-decoration:none;font-weight:700;">esteelconcepts.com</a>
                ${socials.map(([name, href]) => `&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${escapeHtml(href)}" style="color:${BRAND.primary};text-decoration:none;font-weight:700;">${name}</a>`).join("")}
              </p>
              <p style="margin:0;font-family:${CLIENT.font};font-size:11px;line-height:1.6;color:#6b6b6b;">
                You're receiving this email because you contacted Elite Steel Concepts.<br />Just reply to this email to reach our team.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Confirmation sent to the customer after they submit the Contact Us form. */
export async function sendContactConfirmation(settings: GlobalSettings, contact: Contact) {
    settings = withEnvSmtp(settings);
    const from = settings.smtpFrom || `Elite Steel Concepts <${settings.smtpUser || "noreply@esteelconcepts.com"}>`;
    const replyTo = settings.notificationEmail || settings.email || "esteelquotes@gmail.com";

    if (!settings.smtpUser || !settings.smtpPassword) {
        console.warn("[Mailer] SMTP not configured — skipping contact confirmation.");
        return;
    }

    const name    = escapeHtml(contact.name);
    const message = escapeHtml(contact.message).replace(/\n/g, "<br>");

    const sections = [
        clientSection("Your Message", `
          <table width="100%" cellpadding="0" cellspacing="0" border="0" role="presentation"><tr>
            <td style="background:${CLIENT.soft};border-left:4px solid ${BRAND.primary};border-radius:0 10px 10px 0;padding:18px 22px;font-family:${CLIENT.font};font-size:15px;line-height:1.7;color:${CLIENT.ink};">${message}</td>
          </tr></table>`),
        clientSection("What Happens Next", clientSteps([
            { title: "We review your message", text: "A real member of our team reads every inquiry personally." },
            { title: "We get in touch", text: "Expect a call or email from us, usually within one business day." },
            { title: "We plan your build", text: "Ready to go further? We'll walk you through design, pricing and timeline." },
        ])),
        clientSection("Need Us Sooner?", clientContactGrid(settings)),
        clientSection("", clientButtons(settings, { label: "Request a Quote", href: `${siteUrl()}/quote` })),
    ].join("");

    const transporter = createTransporter(settings);
    await transporter.sendMail({
        from,
        to: contact.email,
        replyTo,
        subject: `We received your message — Elite Steel Concepts`,
        html: clientEmail({
            settings,
            preheader: "Thanks for reaching out — our team will get back to you shortly.",
            badge: "Message Received",
            heading: `Thanks for reaching out, <span style="color:${BRAND.primary};">${name}</span>!`,
            intro: "We've received your message. A member of our team will get back to you shortly to discuss your custom food truck or trailer.",
            sections,
        }),
    });
    console.log(`[Mailer] Contact confirmation sent to ${contact.email}`);
}

/** Confirmation sent to the customer after they submit the Quote form. */
export async function sendQuoteConfirmation(settings: GlobalSettings, quote: Quote) {
    settings = withEnvSmtp(settings);
    const from = settings.smtpFrom || `Elite Steel Concepts <${settings.smtpUser || "noreply@esteelconcepts.com"}>`;
    const replyTo = settings.notificationEmail || settings.email || "esteelquotes@gmail.com";

    if (!settings.smtpUser || !settings.smtpPassword) {
        console.warn("[Mailer] SMTP not configured — skipping quote confirmation.");
        return;
    }

    const to = quote.email;
    const q = escapeQuote(quote);
    const location = [q.vendingCity, q.vendingState].filter(Boolean).join(", ");
    const services = Array.isArray(q.services) && q.services.length > 0 ? q.services.join(", ") : "";

    const sections = [
        clientSection("Your Request Summary", clientDetails([
            ["Looking For", q.projectType],
            ["Food Type", q.menuType],
            ["Vending In", location],
            ["Budget", q.budget],
            ["Timeline", q.timeline],
            ["Preferred Size", q.dimensions],
            ["Add-Ons", services],
            ["Submitted", q.date],
        ])),
        clientSection("What Happens Next", clientSteps([
            { title: "Project review", text: "Our fabrication team reviews your concept, menu and equipment needs." },
            { title: "Free consultation call", text: "We'll reach out, usually within one business day, to talk through your build." },
            { title: "Custom design & quote", text: "You get a floor plan built around your menu and a real price based on your exact spec." },
        ])),
        clientSection("Questions In The Meantime?", clientContactGrid(settings)),
        clientSection("", clientButtons(settings, { label: "See Our Builds", href: `${siteUrl()}/portfolio` })),
    ].join("");

    const transporter = createTransporter(settings);
    await transporter.sendMail({
        from,
        to,
        replyTo,
        subject: `Your quote request is in — Elite Steel Concepts`,
        html: clientEmail({
            settings,
            preheader: "We've received your build request. Here's what happens next.",
            badge: "Quote Request Received",
            heading: `Your build request is in, <span style="color:${BRAND.primary};">${q.name}</span>!`,
            intro: "Thank you for choosing Elite Steel Concepts. Our team is reviewing your project details and will contact you shortly to schedule your free consultation.",
            sections,
        }),
    });
    console.log(`[Mailer] Quote confirmation sent to ${to}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST EMAIL TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════

export async function sendTestEmail(settings: GlobalSettings) {
    settings = withEnvSmtp(settings);
    const to   = settings.notificationEmail || "esteelquotes@gmail.com";
    const from = settings.smtpFrom || `Elite Steel Concepts <${settings.smtpUser || "noreply@esteelconcepts.com"}>`;

    const bodyContent = `

      <!-- Success banner -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          <td style="background:#0d2e1a;border:1px solid #1a5c33;border-radius:12px;padding:20px 24px;text-align:center;">
            <p style="margin:0;font-size:11px;font-weight:800;color:${BRAND.success};letter-spacing:3px;text-transform:uppercase;">
              ✅ &nbsp; SMTP Connection Verified
            </p>
          </td>
        </tr>
      </table>

      <!-- Headline -->
      <h1 style="margin:0 0 10px;font-size:28px;font-weight:900;color:${BRAND.white};letter-spacing:-0.5px;text-align:center;">
        Your Email System is <span style="color:${BRAND.primary};">Active</span>
      </h1>
      <p style="margin:0 0 36px;font-size:13px;color:${BRAND.muted};text-align:center;line-height:1.7;">
        Elite Steel Concepts will now automatically deliver email alerts<br>
        for every new quote request and contact form submission.
      </p>

      <!-- Divider -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          <td style="height:1px;background:${BRAND.border};font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>

      <!-- Config summary -->
      <p style="margin:0 0 14px;font-size:9px;font-weight:800;color:${BRAND.primary};letter-spacing:3px;text-transform:uppercase;">
        Active Configuration
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:36px;">
        ${infoRow("SMTP Host",         settings.smtpHost || "smtp.gmail.com")}
        ${infoRow("SMTP Port",         String(settings.smtpPort || 587))}
        ${infoRow("Username",          settings.smtpUser || "—")}
        ${infoRow("Notifications To",  to)}
        ${infoRow("Encryption",        settings.smtpSecure ? "TLS / SSL (465)" : "STARTTLS (587)")}
      </table>

      <!-- CTA -->
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center">
            <a href="https://www.esteelconcepts.com/admin/settings"
               style="display:inline-block;background:${BRAND.primary};color:${BRAND.black};font-weight:900;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;padding:15px 36px;border-radius:10px;text-decoration:none;">
              Open Settings Panel &nbsp;→
            </a>
          </td>
        </tr>
      </table>
    `;

    const transporter = createTransporter(settings);
    await transporter.sendMail({
        from,
        to,
        subject: `✅ SMTP Test Successful — Elite Steel Concepts`,
        html: emailWrapper(bodyContent, BRAND.success),
    });
    console.log(`[Mailer] Test email sent to ${to}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// NEWSLETTER BLAST TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════

export async function sendNewsletterBlast(
    settings: GlobalSettings, 
    subject: string, 
    headerOverride: string, 
    message: string, 
    subscribers: string[]
) {
    settings = withEnvSmtp(settings);
    const from = settings.smtpFrom || `Elite Steel Concepts <${settings.smtpUser || "noreply@esteelconcepts.com"}>`;

    if (!settings.smtpUser || !settings.smtpPassword) {
        console.warn("[Mailer] SMTP not configured — skipping newsletter blast.");
        return { success: false, error: "SMTP not configured." };
    }

    if (subscribers.length === 0) {
        return { success: false, error: "No subscribers found." };
    }

    const bodyContent = `
      <!-- Alert tag -->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td>${pill("Exclusive Update", BRAND.info)}</td>
        </tr>
      </table>

      <!-- Headline -->
      <h1 style="margin:0 0 16px;font-size:28px;font-weight:900;color:${BRAND.white};letter-spacing:-0.5px;line-height:1.15;">
        ${headerOverride || "Elite Steel Concepts Update"}
      </h1>

      <!-- Divider -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          <td style="height:1px;background:${BRAND.border};font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>

      <!-- Message Body -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          <td style="background:${BRAND.mid};border-left:3px solid ${BRAND.primary};border-radius:0 10px 10px 0;padding:24px 28px;">
            <p style="margin:0;color:${BRAND.text};font-size:14px;line-height:1.8;">${message.replace(/\n/g, "<br>")}</p>
          </td>
        </tr>
      </table>

      <!-- CTA -->
      <table cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-top:12px;">
            <a href="https://www.esteelconcepts.com/portfolio"
               style="display:inline-block;background:${BRAND.primary};color:${BRAND.black};font-weight:900;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;padding:15px 36px;border-radius:10px;text-decoration:none;">
              View New Builds &nbsp;→
            </a>
          </td>
        </tr>
      </table>
    `;

    // Use connection pooling for bulk sending
    const transporter = nodemailer.createTransport({
        ...transportOptions(settings),
        pool:   true,
        maxConnections: 5,
        maxMessages: 100,
    });

    const htmlContent = emailWrapper(bodyContent, BRAND.info);
    
    let successCount = 0;
    let failCount = 0;

    // Send concurrently but limited by connection pool
    const promises = subscribers.map(async (email) => {
        try {
            await transporter.sendMail({
                from,
                to: email,
                subject: subject,
                html: htmlContent,
            });
            successCount++;
        } catch (err) {
            console.error(`[Mailer] Failed to send to ${email}:`, err);
            failCount++;
        }
    });

    await Promise.all(promises);
    
    transporter.close();

    console.log(`[Mailer] Newsletter blast complete. Sent: ${successCount}, Failed: ${failCount}`);
    return { success: true, sent: successCount, failed: failCount };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GENERIC SYSTEM EMAIL TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
    const { getSettings } = await import("@/lib/db");
    const settings = withEnvSmtp(await getSettings());
    const from = settings.smtpFrom || `Elite Steel Concepts <${settings.smtpUser || "noreply@esteelconcepts.com"}>`;

    if (!settings.smtpUser || !settings.smtpPassword) {
        throw new Error("SMTP not configured.");
    }

    const transporter = createTransporter(settings);
    await transporter.sendMail({
        from,
        to,
        subject,
        html,
    });
}
