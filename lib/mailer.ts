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

// ─── Transporter ─────────────────────────────────────────────────────────────
function createTransporter(settings: GlobalSettings) {
    return nodemailer.createTransport({
        host:   settings.smtpHost     || "smtp.gmail.com",
        port:   settings.smtpPort     || 587,
        secure: settings.smtpSecure   ?? false,
        auth: {
            user: settings.smtpUser     || "",
            pass: settings.smtpPassword || "",
        },
    });
}

// ─── Shared Utilities ─────────────────────────────────────────────────────────

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

function emailWrapper(content: string, accentColor: string = BRAND.primary) {
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
                      This is an automated notification. Do not reply to this email.
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
    const to   = settings.notificationEmail || "esteelquotes@gmail.com";
    const from = settings.smtpFrom || `Elite Steel Concepts <${settings.smtpUser || "noreply@esteelconcepts.com"}>`;

    if (!settings.smtpUser || !settings.smtpPassword) {
        console.warn("[Mailer] SMTP not configured — skipping quote notification.");
        return;
    }

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

      <!-- Section: Project Specs -->
      <p style="margin:0 0 14px;font-size:9px;font-weight:800;color:${BRAND.primary};letter-spacing:3px;text-transform:uppercase;">
        02 &nbsp;/ &nbsp;Project Specifications
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        ${infoRow("Project Type",       quote.projectType)}
        ${infoRow("Budget Range",       quote.budget)}
        ${infoRow("Timeline",           quote.timeline)}
        ${infoRow("Sourcing",           quote.sourcing)}
        ${infoRow("Menu Type",          quote.menuType          || "—")}
        ${infoRow("Dimensions",         quote.dimensions        || "—")}
        ${infoRow("Equipment",          quote.equipment         || "—")}
        ${infoRow("Branding Needs",     quote.brandingNeeds     || "—")}
        ${infoRow("Power Requirements", quote.powerRequirements || "—")}
        ${infoRow("Services Needed",    servicesList)}
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
        subject: `🔔 New Quote Request — ${quote.name} | Elite Steel Concepts`,
        html: emailWrapper(bodyContent, BRAND.primary),
    });
    console.log(`[Mailer] Quote notification sent to ${to}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT NOTIFICATION TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════

export async function sendContactNotification(settings: GlobalSettings, contact: Contact) {
    const to   = settings.notificationEmail || "esteelquotes@gmail.com";
    const from = settings.smtpFrom || `Elite Steel Concepts <${settings.smtpUser || "noreply@esteelconcepts.com"}>`;

    if (!settings.smtpUser || !settings.smtpPassword) {
        console.warn("[Mailer] SMTP not configured — skipping contact notification.");
        return;
    }

    const bodyContent = `

      <!-- Alert tag -->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
        <tr>
          <td>${pill("New Contact Message", BRAND.info)}&nbsp;&nbsp;${pill(contact.status || "New", BRAND.success)}</td>
        </tr>
      </table>

      <!-- Headline -->
      <h1 style="margin:0 0 6px;font-size:30px;font-weight:900;color:${BRAND.white};letter-spacing:-1px;line-height:1.15;">
        Message from <span style="color:${BRAND.primary};">${contact.name}</span>
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
        ${infoRow("Full Name", contact.name)}
        ${infoRow("Email",     `<a href="mailto:${contact.email}" style="color:${BRAND.primary};text-decoration:none;">${contact.email}</a>`)}
        ${infoRow("Phone",     contact.phone || "—")}
      </table>

      <!-- Section: Message -->
      <p style="margin:0 0 14px;font-size:9px;font-weight:800;color:${BRAND.primary};letter-spacing:3px;text-transform:uppercase;">
        02 &nbsp;/ &nbsp;Message
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
        <tr>
          <td style="background:${BRAND.mid};border-left:3px solid ${BRAND.primary};border-radius:0 10px 10px 0;padding:20px 22px;">
            <p style="margin:0;color:${BRAND.text};font-size:13px;line-height:1.85;">${contact.message.replace(/\n/g, "<br>")}</p>
          </td>
        </tr>
      </table>

      <!-- Quick Reply CTA -->
      <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
        <tr>
          <td style="padding-right:12px;">
            <a href="mailto:${contact.email}?subject=Re: Your inquiry — Elite Steel Concepts"
               style="display:inline-block;background:${BRAND.primary};color:${BRAND.black};font-weight:900;font-size:11px;letter-spacing:2.5px;text-transform:uppercase;padding:15px 28px;border-radius:10px;text-decoration:none;">
              Reply to ${contact.name} &nbsp;→
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
        subject: `💬 New Contact Message — ${contact.name} | Elite Steel Concepts`,
        html: emailWrapper(bodyContent, BRAND.primary),
    });
    console.log(`[Mailer] Contact notification sent to ${to}`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEST EMAIL TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════

export async function sendTestEmail(settings: GlobalSettings) {
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
        host:   settings.smtpHost     || "smtp.gmail.com",
        port:   settings.smtpPort     || 587,
        secure: settings.smtpSecure   ?? false,
        pool:   true,
        maxConnections: 5,
        maxMessages: 100,
        auth: {
            user: settings.smtpUser     || "",
            pass: settings.smtpPassword || "",
        },
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
    const settings = await getSettings();
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
