import { stylesToInline } from "./BlockStylePanel";
import { getCardTheme, getHeroBg } from "./ColorThemePicker";
import type { EmailState, ContentBlock } from "@/types/email";

function parseMeta(block: ContentBlock): Record<string, any> {
  try {
    return block.meta ? JSON.parse(block.meta) : {};
  } catch {
    return {};
  }
}

function e(str?: string): string {
  if (!str) return "";
  return Array.from(str)
    .map((char) => {
      const code = char.codePointAt(0);
      if (code && code > 127) {
        return `&#x${code.toString(16).toUpperCase()};`;
      }
      return char;
    })
    .join("");
}

function encodeMeta(meta: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(meta)) {
    if (typeof value === "string") {
      result[key] = e(value);
    } else if (Array.isArray(value)) {
      result[key] = value.map((item) => {
        if (typeof item === "string") return e(item);
        if (typeof item === "object" && item !== null) return encodeMeta(item);
        return item;
      });
    } else if (typeof value === "object" && value !== null) {
      result[key] = encodeMeta(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function logoImg(logoUrl: string, height: number, centered = false): string {
  return `<img src="${logoUrl}" alt="skillBetter" style="height:${height}px;width:auto;display:block;${centered ? "margin:0 auto;" : ""}border:0;outline:none;text-decoration:none;" />`;
}

function emojiBox(icon?: string, size = 16): string {
  if (!icon) return "";
  return `<span style="display:inline-block;width:${size}px;height:${size}px;line-height:${size}px;text-align:center;vertical-align:middle;font-size:${Math.max(size - 2, 12)}px;font-family:'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;">${icon}</span>`;
}

function checkCircle(background: string, color: string): string {
  return `<span style="display:inline-block;width:18px;height:18px;border-radius:999px;background:${background};vertical-align:middle;text-align:center;line-height:18px;">
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 12 12" style="vertical-align:middle;margin-top:-1px;">
      <path d="M2 6.5L4.5 9L10 3" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>
  </span>`;
}

function textPill(text: string, background: string, color: string, border: string): string {
  return `<span style="display:inline-block;padding:11px 20px;border-radius:999px;background:${background};color:${color};border:${border};font-size:9px;font-weight:700;letter-spacing:1.2px;line-height:1;text-transform:uppercase;white-space:nowrap;vertical-align:middle;">${text}</span>`;
}

function iconTextLabel(icon: string | undefined, text: string, color: string): string {
  return `<table role="presentation" style="border-collapse:collapse;margin:0 0 10px 0;"><tr><td valign="middle" style="padding-right:8px;line-height:1;">${emojiBox(icon, 14)}</td><td valign="middle" style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${color};line-height:1;white-space:nowrap;">${text}</td></tr></table>`;
}

function renderTopbar(m: Record<string, any>, logoUrl: string): string {
  return `
  <div style="background:#ffffff;padding:16px 32px;border-bottom:1px solid #e8ecf0;">
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tr>
        <td valign="middle">
          <table role="presentation" style="border-collapse:collapse;">
            <tr>
              <td valign="middle" style="padding-right:14px;">${logoImg(logoUrl, 34)}</td>
              <td valign="middle" style="padding-right:14px;"><div style="width:1px;height:28px;background:#d0d8e0;"></div></td>
              <td valign="middle">
                <div style="display:inline-block;background:#f0f4f8;border:1px solid #dde3ea;border-radius:10px;padding:8px 14px;vertical-align:middle;">
                  <table role="presentation" style="border-collapse:collapse;">
                    <tr>
                      <td valign="middle" style="padding-right:6px;line-height:1;">${emojiBox("&#x1F91D;", 12)}</td>
                      <td valign="middle" style="font-size:10px;font-weight:700;color:#1a3c6e;letter-spacing:0.5px;line-height:1;white-space:nowrap;">${m.partnerName || "PARTNER"}</td>
                    </tr>
                  </table>
                  <div style="font-size:9px;font-weight:600;color:#7a8a9a;letter-spacing:0.3px;line-height:1.35;margin-top:5px;white-space:nowrap;">${m.partnerSub || ""}</div>
                </div>
              </td>
            </tr>
          </table>
        </td>
        <td valign="middle" style="text-align:right;font-size:11px;font-weight:700;color:#1a6fa8;letter-spacing:0.2px;white-space:nowrap;">${m.label || "Update"}</td>
      </tr>
    </table>
  </div>`;
}

function renderPointers(pointers: { text?: string; subItems?: string[] }[], checkBg: string, checkColor: string, textColor: string, subColor: string, dotColor: string): string {
  if (!pointers || pointers.length === 0) return "";
  return `<div style="margin-top:20px;">
    ${pointers.map((p) => {
      const titleHtml = p.text ? `<tr><td valign="top" style="padding:0 10px 6px 0;line-height:1;">${checkCircle(checkBg, checkColor)}</td><td valign="top" style="font-size:13px;font-weight:600;color:${textColor};line-height:1.55;padding:0 0 6px 0;">${p.text}</td></tr>` : "";
      const subHtml = (p.subItems || []).map((sub: string) =>
        `<tr><td valign="top" style="padding:0 8px 6px ${p.text ? "28px" : "0"};line-height:1;"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${dotColor};vertical-align:middle;"></span></td><td valign="top" style="font-size:12px;color:${subColor};line-height:1.55;padding:0 0 6px 0;">${sub}</td></tr>`
      ).join("");
      return `<table role="presentation" style="border-collapse:collapse;margin-bottom:12px;">${titleHtml}${subHtml}</table>`;
    }).join("")}
  </div>`;
}

function renderHero(m: Record<string, any>): string {
  const pointers = (m.pointers || []) as { text?: string; subItems?: string[] }[];
  const bg = getHeroBg(m.heroBg || "navy");
  const sections = (m.sections || []) as { label: string; color: string }[];

  const sectionsHtml = sections.length > 0 ? `<div style="margin-top:20px;">${sections.map((s) =>
    `<span style="display:inline-block;background:${s.color}22;border:1px solid ${s.color}55;border-radius:8px;padding:6px 12px;margin:0 6px 6px 0;font-size:11px;font-weight:600;color:#ffffff;">&#x25CF;&nbsp;${s.label}</span>`
  ).join("")}</div>` : "";

  const pointersHtml = renderPointers(pointers, `${bg.highlightColor}40`, bg.pillColor, "#ffffff", "rgba(255,255,255,0.65)", `${bg.pillColor}80`);

  return `
  <div style="background:${bg.gradient};padding:50px 40px;position:relative;overflow:hidden;">
    <div style="display:inline-block;background:${bg.pillBg};border:1px solid ${bg.pillBorder};border-radius:20px;padding:5px 14px;margin-bottom:20px;">
      <table role="presentation" style="border-collapse:collapse;">
        <tr>
          <td valign="middle" style="padding-right:8px;line-height:1;">${emojiBox(m.pillEmoji, 12)}</td>
          <td valign="middle" style="font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${bg.pillColor};line-height:1;white-space:nowrap;">${m.pill || "UPDATE"}</td>
        </tr>
      </table>
    </div>
    <h1 style="font-size:34px;font-weight:800;color:#ffffff;line-height:1.22;margin:0 0 18px;max-width:520px;">${m.title || "Headline"} <span style="color:${bg.highlightColor};">${m.titleHighlight || ""}</span></h1>
    <p style="color:rgba(255,255,255,0.78);font-size:14px;line-height:1.78;max-width:490px;margin:0;white-space:pre-line;">${m.body || ""}</p>
    ${sectionsHtml}
    ${pointersHtml}
  </div>`;
}

function renderSectionText(m: Record<string, any>): string {
  const eyebrowHtml = m.eyebrow ? iconTextLabel(m.eyebrowEmoji, m.eyebrow, "#1a6fa8") : "";
  const titleHtml = m.title ? `<h2 style="font-size:21px;font-weight:700;color:#0c2752;line-height:1.3;margin:0 0 13px;">${m.title}</h2>` : "";
  const bodyHtml = m.body ? `<p style="font-size:13.5px;color:#4a5e72;line-height:1.78;margin:0;white-space:pre-line;">${m.body}</p>` : "";
  return `<div style="padding:42px 40px 0;">${eyebrowHtml}${titleHtml}${bodyHtml}</div>`;
}

function renderLiveStatus(m: Record<string, any>): string {
  const items = (m.items || []) as string[];
  const itemsHtml = items
    .map((item) => {
      const cleanItem = item.replace(/\s*[✓✔]$/, "");
      return `<tr><td valign="top" style="padding:0 10px 10px 0;line-height:1;">${checkCircle("#d5f1df", "#166534")}</td><td valign="top" style="font-size:12px;color:#166534;line-height:1.55;padding:0 0 10px 0;">${cleanItem}</td></tr>`;
    })
    .join("");

  return `
  <div style="padding:0 40px;">
    <div style="background:#f0fdf6;border:1px solid #b8efd4;border-left:4px solid #22c55e;border-radius:10px;padding:17px 20px;margin-top:20px;">
      <table role="presentation" style="border-collapse:collapse;">
        <tr>
          <td valign="top" style="padding-right:13px;"><div style="width:11px;height:11px;background:#22c55e;border-radius:50%;box-shadow:0 0 0 4px rgba(34,197,94,0.17);margin-top:4px;"></div></td>
          <td valign="top">
            <h4 style="font-size:13.5px;font-weight:600;color:#14532d;margin:0 0 8px;line-height:1.3;">${m.title || "Status"}</h4>
            <table role="presentation" style="border-collapse:collapse;">${itemsHtml}</table>
          </td>
        </tr>
      </table>
    </div>
  </div>`;
}

function renderDivider(): string {
  return `<div style="height:1px;background:linear-gradient(to right,transparent,#d4dfe8,transparent);margin:40px 40px 0;"></div>`;
}

function renderFeatureCard(m: Record<string, any>): string {
  const themeKey = m.iconColor || "teal";
  const theme = getCardTheme(themeKey);
  const bullets = (m.bullets || []) as { text: string; check: string }[];
  const pointers = (m.pointers || []) as { text?: string; subItems?: string[] }[];

  const bulletsHtml = bullets
    .map((b) => {
      const t = getCardTheme(b.check || themeKey);
      return `<tr><td valign="top" style="padding:0 12px 14px 0;line-height:1;">${checkCircle(t.checkBg, t.checkColor)}</td><td valign="top" style="font-size:13px;color:#3d4f60;line-height:1.62;padding:0 0 14px 0;">${b.text}</td></tr>`;
    })
    .join("");

  const badgeHtml = m.badge ? textPill(m.badge, "#fff8e1", "#92530a", "1px solid #f9c846") : "";
  const pointersHtml = renderPointers(pointers, theme.checkBg, theme.checkColor, "#3d4f60", "#6b7280", "#94a3b8");

  return `
  <div style="padding:0 40px;">
    <div style="border:1px solid #e0eaf2;border-radius:12px;overflow:hidden;margin-top:18px;">
      <div style="padding:17px 20px 13px;background:#fff;">
        <table role="presentation" style="width:100%;border-collapse:collapse;">
          <tr>
            <td valign="middle" style="width:54px;padding-right:13px;"><div style="width:40px;height:40px;border-radius:12px;background:${theme.iconBg};text-align:center;line-height:40px;">${emojiBox(m.icon || "&#x2B50;", 18)}</div></td>
            <td valign="middle">
              <div style="font-size:14px;font-weight:700;color:#0c2752;line-height:1.2;">${m.name || "Feature"}</div>
              <div style="font-size:11px;color:#7a8ea0;line-height:1.35;margin-top:4px;">${m.subtitle || ""}</div>
            </td>
            <td valign="middle" style="text-align:right;white-space:nowrap;padding-left:16px;">${badgeHtml}</td>
          </tr>
        </table>
      </div>
      <div style="padding:14px 20px 18px;background:#f8fafb;border-top:1px solid #edf2f6;">
        ${m.description ? `<p style="font-size:12.5px;color:#516070;line-height:1.65;margin:0 0 16px;">${m.description}</p>` : ""}
        <table role="presentation" style="border-collapse:collapse;">${bulletsHtml}</table>
        ${pointersHtml}
      </div>
    </div>
  </div>`;
}

function renderStrategyBox(m: Record<string, any>): string {
  const subtitleHtml = m.subtitle
    ? `<table role="presentation" style="border-collapse:collapse;margin:0 0 9px 0;"><tr><td valign="middle" style="padding-right:8px;line-height:1;">${emojiBox(m.subtitleEmoji, 14)}</td><td valign="middle" style="font-size:14px;font-weight:700;color:#0c2752;line-height:1.3;">${m.subtitle}</td></tr></table>`
    : "";
  return `
  <div style="padding:42px 40px 0;">
    ${iconTextLabel(m.eyebrowEmoji, m.eyebrow || "", "#1a6fa8")}
    <h2 style="font-size:21px;font-weight:700;color:#0c2752;line-height:1.3;margin:0 0 13px;">${m.title || ""}</h2>
    <div style="background:linear-gradient(135deg,#edf3fb 0%,#e4eefc 100%);border:1px solid #c5d6ee;border-radius:12px;padding:24px 26px;margin-top:18px;">
      ${subtitleHtml}
      <p style="font-size:13px;color:#3d4f60;line-height:1.78;margin:0;">${m.body || ""}</p>
    </div>
  </div>`;
}

function renderAiCard(m: Record<string, any>): string {
  const themeKey = m.variant || "teal";
  const theme = getCardTheme(themeKey);
  const labelBg = `${theme.accent}30`;
  const labelColor = theme.accentLight;

  const bullets = (m.bullets || []) as { title: string; text: string; check: string }[];
  const pointers = (m.pointers || []) as { text?: string; subItems?: string[] }[];

  const bulletsHtml = bullets
    .map((b) => {
      const t = getCardTheme(b.check || themeKey);
      return `<tr><td valign="top" style="padding:0 12px 14px 0;line-height:1;">${checkCircle(t.checkBg, t.checkColor)}</td><td valign="top" style="font-size:13px;color:#3d4f60;line-height:1.62;padding:0 0 14px 0;"><strong style="color:#0c2752;font-weight:700;">${b.title}</strong> &mdash; ${b.text}</td></tr>`;
    })
    .join("");

  const pointersHtml = renderPointers(pointers, theme.checkBg, theme.checkColor, "#3d4f60", "#6b7280", "#94a3b8");

  return `
  <div style="padding:0 40px;">
    <div style="border:1px solid #e0eaf2;border-radius:12px;overflow:hidden;margin-top:20px;">
      <div style="padding:20px 24px 16px;background:${theme.gradient};">
        <table role="presentation" style="width:100%;border-collapse:collapse;">
          <tr>
            <td valign="top" style="width:58px;padding-right:14px;"><div style="width:44px;height:44px;background:rgba(255,255,255,0.12);border-radius:11px;text-align:center;line-height:44px;">${emojiBox(m.labelEmoji, 21)}</div></td>
            <td valign="top">
              <span style="display:inline-block;padding:10px 16px;border-radius:999px;margin-bottom:10px;background:${labelBg};color:${labelColor};font-size:9px;font-weight:700;letter-spacing:1.5px;line-height:1;text-transform:uppercase;white-space:nowrap;">${m.label || "AI"}</span>
              <h3 style="font-size:15.5px;font-weight:700;color:#fff;line-height:1.25;margin:0 0 6px;">${m.title || ""}</h3>
              <p style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.55;margin:0;">${m.subtitle || ""}</p>
            </td>
          </tr>
        </table>
      </div>
      <div style="padding:18px 24px 22px;background:#fff;">
        <table role="presentation" style="border-collapse:collapse;">${bulletsHtml}</table>
        ${pointersHtml}
      </div>
    </div>
  </div>`;
}

function renderFooter(m: Record<string, any>, logoUrl: string): string {
  return `
  <div style="background:#f6f9fc;border-top:2px solid #e0eaf2;padding:30px 40px;text-align:center;">
    <div style="margin-bottom:18px;">${logoImg(logoUrl, 32, true)}</div>
    <p style="font-size:13px;color:#4a5e72;line-height:1.7;margin:0 0 16px;">${m.tagline || ""}</p>
    <p style="font-size:10px;color:#a0adb8;margin:14px 0 0;">${m.note || ""}</p>
  </div>`;
}

function renderBlockHtml(block: ContentBlock, logoUrl: string): string {
  const rawMeta = parseMeta(block);
  const customStyles = rawMeta._styles ? stylesToInline(rawMeta._styles) : "";
  const m = encodeMeta(rawMeta);
  const content = block.content || "";
  const wrapWithStyles = (html: string) => {
    if (!customStyles) return html;
    return `<div style="${customStyles}">${html}</div>`;
  };

  switch (block.type) {
    case "topbar":
      return wrapWithStyles(renderTopbar(m, logoUrl));
    case "hero":
      return wrapWithStyles(renderHero(m));
    case "live-status":
      return wrapWithStyles(renderLiveStatus(m));
    case "feature-card":
      return wrapWithStyles(renderFeatureCard(m));
    case "strategy-box":
      return wrapWithStyles(renderStrategyBox(m));
    case "ai-card":
      return wrapWithStyles(renderAiCard(m));
    case "footer":
      return wrapWithStyles(renderFooter(m, logoUrl));
    case "divider":
      return wrapWithStyles(renderDivider());
    case "text":
      if (m.eyebrow || m.title) return wrapWithStyles(renderSectionText(m));
      return wrapWithStyles(`<div style="padding:12px 40px;font-size:14px;line-height:1.7;color:#334155;white-space:pre-line;">${e(content).replace(/\n/g, "<br/>")}</div>`);
    case "features": {
      const lines = (content || "Feature 1\nFeature 2\nFeature 3").split("\n").filter(Boolean);
      const heading = lines[0];
      const items = lines.slice(1);
      const cards = items.map((item) => `<div style="background:#f0f4ff;padding:14px 18px;border-radius:8px;font-size:14px;color:#1e293b;border-left:4px solid #003087;margin-bottom:8px;">${e(item)}</div>`).join("");
      return wrapWithStyles(`<div style="padding:0 40px;margin-bottom:16px;"><h2 style="font-size:18px;font-weight:700;color:#003087;margin:0 0 12px;">${e(heading) || ""}</h2>${cards}</div>`);
    }
    case "callout":
      return wrapWithStyles(`<div style="margin:0 40px 16px;background:#fffbeb;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;font-size:14px;color:#92400e;white-space:pre-line;">${e(content) || "Important callout message"}</div>`);
    case "image-placeholder":
      return wrapWithStyles(`<div style="height:180px;background:linear-gradient(135deg,#e4f0fa,#d0e6f5);text-align:center;color:#4a7fa8;font-size:12.5px;font-weight:500;line-height:180px;">${emojiBox("&#x1F4F7;", 14)}&nbsp;${e(content) || "Image placeholder"}</div>`);
    default:
      return "";
  }
}

export function generateEmailHtml(email: EmailState, logoUrl: string): string {
  const blocks = email.blocks.map((b) => renderBlockHtml(b, logoUrl)).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f0f2f5; font-family: 'Inter', sans-serif; color: #1a1a2e; -webkit-font-smoothing: antialiased; }
    img { max-width: 100%; height: auto; }
  </style>
</head>
<body style="margin:0;padding:24px;font-family:'Inter',sans-serif;background:#f0f2f5;">
  <div style="max-width:680px;margin:0 auto;background:#ffffff;overflow:hidden;">
    ${blocks || '<p style="color:#94a3b8;text-align:center;padding:40px 0;">Add content sections to see the preview</p>'}
  </div>
</body>
</html>`;
}

interface EmailPreviewProps {
  email: EmailState;
  logoUrl: string;
}

export function EmailPreview({ email, logoUrl }: EmailPreviewProps) {
  const html = generateEmailHtml(email, logoUrl);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold text-foreground">Live Preview</h3>
        {email.subject && (
          <span className="inline-flex items-center rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
            {email.template || "No template"}
          </span>
        )}
      </div>
      <div className="flex-1 rounded-lg border bg-card shadow-card overflow-hidden">
        <iframe
          title="Email Preview"
          srcDoc={html}
          className="w-full h-full min-h-[500px] border-0"
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  );
}
