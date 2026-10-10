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

const CUSTOMER_FOOTER_NOTE = "You're receiving this email because you contacted Elite Steel Concepts. Reply to this email to reach our team.";

function siteUrl() {
    return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.esteelconcepts.com").replace(/\/$/, "");
}

function sectionLabel(text: string) {
    return `<p style="margin:0 0 14px;font-size:9px;font-weight:800;color:${BRAND.primary};letter-spacing:3px;text-transform:uppercase;">${text}</p>`;
}

/** "What happens next" list — a numbered orange badge per step. */
function nextSteps(steps: { title: string; text: string }[]) {
    const rows = steps.map((step, i) => `
        <tr>
          <td style="width:44px;vertical-align:top;padding:0 0 18px;">
            <div style="width:30px;height:30px;border-radius:8px;background:${BRAND.primary};color:${BRAND.black};font-size:13px;font-weight:900;text-align:center;line-height:30px;">${i + 1}</div>
          </td>
          <td style="vertical-align:top;padding:4px 0 18px;">
            <div style="font-size:14px;font-weight:800;color:${BRAND.white};margin-bottom:4px;">${step.title}</div>
            <div style="font-size:13px;color:${BRAND.muted};line-height:1.7;">${step.text}</div>
          </td>
        </tr>`).join("");
    return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">${rows}</table>`;
}

/** Contact details card with phone, email, address and hours. */
function contactCard(settings: GlobalSettings) {
    const phone = settings.phone || "(571) 651-0337";
    const email = settings.email || "esteelquotes@gmail.com";
    const tel = phone.replace(/[^\d+]/g, "");
    const telHref = tel.startsWith("+") ? tel : `+1${tel}`;
    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.darkCard};border:1px solid ${BRAND.border};border-radius:12px;margin-bottom:32px;">
        <tr>
          <td style="padding:22px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              ${infoRow("Phone",   `<a href="tel:${telHref}" style="color:${BRAND.primary};text-decoration:none;">${escapeHtml(phone)}</a>`)}
              ${infoRow("Email",   `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND.primary};text-decoration:none;">${escapeHtml(email)}</a>`)}
              ${settings.address ? infoRow("Visit Us", escapeHtml(settings.address)) : ""}
              ${settings.businessHours ? infoRow("Hours", escapeHtml(settings.businessHours)) : ""}
            </table>
          </td>
        </tr>
      </table>`;
}

function customerCtas(settings: GlobalSettings, secondary: { label: string; href: string }) {
    const tel = (settings.phone || "(571) 651-0337").replace(/[^\d+]/g, "");
    const telHref = tel.startsWith("+") ? tel : `+1${tel}`;
    return `
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:8px;">
        <tr>
          <td style="padding:0 12px 12px 0;">
            <a href="tel:${telHref}"
               style="display:inline-block;background:${BRAND.primary};color:${BRAND.black};font-weight:900;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;padding:15px 28px;border-radius:10px;text-decoration:none;">
              Call Us Now &nbsp;→
            </a>
          </td>
          <td style="padding:0 0 12px;">
            <a href="${secondary.href}"
               style="display:inline-block;background:transparent;color:${BRAND.white};border:1px solid ${BRAND.border};font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:15px 24px;border-radius:10px;text-decoration:none;">
              ${secondary.label}
            </a>
          </td>
        </tr>
      </table>`;
}

function divider() {
    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          <td style="height:1px;background:${BRAND.border};font-size:0;line-height:0;">&nbsp;</td>
        </tr>
      </table>`;
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

    const bodyContent = `
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td>${pill("Message Received", BRAND.success)}</td>
        </tr>
      </table>

      <h1 style="margin:0 0 12px;font-size:30px;font-weight:900;color:${BRAND.white};letter-spacing:-1px;line-height:1.15;">
        Thanks for reaching out, <span style="color:${BRAND.primary};">${name}</span>!
      </h1>
      <p style="margin:0 0 36px;font-size:15px;color:${BRAND.text};line-height:1.75;">
        We've received your message. A member of our team will get back to you shortly to discuss your custom food truck or trailer.
      </p>

      ${divider()}

      ${sectionLabel("01 &nbsp;/ &nbsp;Your Message")}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          <td style="background:${BRAND.mid};border-left:3px solid ${BRAND.primary};border-radius:0 10px 10px 0;padding:20px 22px;">
            <p style="margin:0;color:${BRAND.text};font-size:13px;line-height:1.85;">${message}</p>
          </td>
        </tr>
      </table>

      ${sectionLabel("02 &nbsp;/ &nbsp;What Happens Next")}
      ${nextSteps([
          { title: "We review your message", text: "Our team reads every inquiry personally — no bots, no auto-routing." },
          { title: "We get in touch", text: "Expect a call or email from us, usually within one business day." },
          { title: "We plan your build", text: "Ready to go further? We'll walk you through design, pricing and timeline." },
      ])}

      ${sectionLabel("03 &nbsp;/ &nbsp;Need Us Sooner?")}
      ${contactCard(settings)}

      ${customerCtas(settings, { label: "Request a Quote", href: `${siteUrl()}/quote` })}
    `;

    const transporter = createTransporter(settings);
    await transporter.sendMail({
        from,
        to: contact.email,
        replyTo,
        subject: `We received your message — Elite Steel Concepts`,
        html: emailWrapper(bodyContent, BRAND.primary, CUSTOMER_FOOTER_NOTE),
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
    const services = Array.isArray(q.services) && q.services.length > 0 ? q.services.join(" &nbsp;·&nbsp; ") : "";

    const bodyContent = `
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td>${pill("Quote Request Received", BRAND.success)}</td>
        </tr>
      </table>

      <h1 style="margin:0 0 12px;font-size:30px;font-weight:900;color:${BRAND.white};letter-spacing:-1px;line-height:1.15;">
        Your build request is in, <span style="color:${BRAND.primary};">${q.name}</span>!
      </h1>
      <p style="margin:0 0 36px;font-size:15px;color:${BRAND.text};line-height:1.75;">
        Thank you for choosing Elite Steel Concepts. Our team is reviewing your project details and will contact you shortly to schedule your free consultation.
      </p>

      ${divider()}

      ${sectionLabel("01 &nbsp;/ &nbsp;Your Request Summary")}
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        ${q.projectType ? infoRow("Looking For", q.projectType) : ""}
        ${q.menuType ? infoRow("Food Type", q.menuType) : ""}
        ${location ? infoRow("Vending In", location) : ""}
        ${q.budget ? infoRow("Budget", q.budget) : ""}
        ${q.timeline ? infoRow("Timeline", q.timeline) : ""}
        ${q.dimensions ? infoRow("Preferred Size", q.dimensions) : ""}
        ${services ? infoRow("Add-Ons", services) : ""}
        ${infoRow("Submitted", q.date)}
      </table>

      ${sectionLabel("02 &nbsp;/ &nbsp;What Happens Next")}
      ${nextSteps([
          { title: "Project review", text: "Our fabrication team reviews your concept, menu and equipment needs." },
          { title: "Free consultation call", text: "We'll reach out — usually within one business day — to talk through your build." },
          { title: "Custom design & quote", text: "You get a floor plan built around your menu and a real number based on your actual spec." },
      ])}

      ${sectionLabel("03 &nbsp;/ &nbsp;Questions In The Meantime?")}
      ${contactCard(settings)}

      ${customerCtas(settings, { label: "See Our Builds", href: `${siteUrl()}/portfolio` })}
    `;

    const transporter = createTransporter(settings);
    await transporter.sendMail({
        from,
        to,
        replyTo,
        subject: `Your quote request is in — Elite Steel Concepts`,
        html: emailWrapper(bodyContent, BRAND.primary, CUSTOMER_FOOTER_NOTE),
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
