import type { EmailState, ContentBlock } from "@/types/email";

function getAssetUrl(path: string): string {
  if (typeof window === "undefined") return path;
  return new URL(path, window.location.origin).toString();
}

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

function logoImg(height: number, align: "left" | "center" = "left"): string {
  return `<img src="${getAssetUrl("/images/skillbetter-logo.png")}" alt="skillBetter" style="height:${height}px;width:auto;display:block;margin:${align === "center" ? "0 auto" : "0"};border:0;outline:none;text-decoration:none;" />`;
}

function emojiGlyph(icon?: string, size = 16): string {
  if (!icon) return "";
  return `<span style="display:inline-flex;align-items:center;justify-content:center;font-family:'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;font-size:${size}px;line-height:1;vertical-align:middle;">${icon}</span>`;
}

function emojiBadge(icon?: string, size = 16, bg = "transparent", color = "inherit"): string {
  if (!icon) return "";
  return `<span style="display:inline-flex;align-items:center;justify-content:center;width:${size + 10}px;height:${size + 10}px;border-radius:999px;background:${bg};color:${color};font-family:'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;font-size:${size}px;line-height:1;vertical-align:middle;flex:0 0 ${size + 10}px;">${icon}</span>`;
}

function checkMark(bg: string, color: string): string {
  return `<span style="display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:999px;background:${bg};color:${color};font-size:11px;line-height:1;font-family:Arial,sans-serif;font-weight:700;flex:0 0 18px;">&#10003;</span>`;
}

function pill(text: string, background: string, color: string, border: string): string {
  return `<span style="display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding:0 22px;border-radius:999px;background:${background};color:${color};border:${border};font-size:9px;font-weight:700;letter-spacing:1.2px;line-height:1;text-transform:uppercase;white-space:nowrap;">${text}</span>`;
}

function renderTopbar(m: Record<string, any>): string {
  return `
  <div style="background:#ffffff;padding:16px 32px;border-bottom:1px solid #e8ecf0;">
    <table role="presentation" style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:middle;">
          <table role="presentation" style="border-collapse:collapse;">
            <tr>
              <td style="vertical-align:middle;padding-right:12px;">${logoImg(36)}</td>
              <td style="vertical-align:middle;padding-right:12px;"><div style="width:1px;height:26px;background:#d0d8e0;"></div></td>
              <td style="vertical-align:middle;">
                <div style="background:#f0f4f8;border:1px solid #dde3ea;border-radius:10px;padding:8px 16px;display:inline-block;">
                  <div style="display:flex;align-items:center;gap:8px;color:#1a3c6e;font-size:10px;font-weight:700;letter-spacing:0.5px;line-height:1;white-space:nowrap;">
                    ${emojiGlyph("&#x1F91D;", 12)}
                    <span>${m.partnerName || "PARTNER"}</span>
                  </div>
                  <div style="font-size:9px;font-weight:600;color:#7a8a9a;letter-spacing:0.3px;line-height:1.4;margin-top:6px;">${m.partnerSub || ""}</div>
                </div>
              </td>
            </tr>
          </table>
        </td>
        <td style="vertical-align:middle;text-align:right;white-space:nowrap;font-size:11px;font-weight:700;color:#1a6fa8;letter-spacing:0.2px;">${m.label || "Update"}</td>
      </tr>
    </table>
  </div>`;
}

function renderHero(m: Record<string, any>): string {
  return `
  <div style="background:linear-gradient(155deg,#0c2752 0%,#1a4a8a 55%,#1568a8 100%);padding:50px 40px;position:relative;overflow:hidden;">
    <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(77,184,200,0.16);border:1px solid rgba(77,184,200,0.38);color:#7de8f4;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:5px 14px;border-radius:20px;margin-bottom:20px;line-height:1;">
      ${emojiGlyph(m.pillEmoji, 12)}
      <span>${m.pill || "UPDATE"}</span>
    </div>
    <h1 style="font-size:34px;font-weight:800;color:#ffffff;line-height:1.22;margin:0 0 18px;max-width:520px;">
      ${m.title || "Headline"} <span style="color:#4db8c8;">${m.titleHighlight || ""}</span>
    </h1>
    <p style="color:rgba(255,255,255,0.78);font-size:14px;line-height:1.78;max-width:490px;margin:0;white-space:pre-line;">${m.body || ""}</p>
  </div>`;
}

function renderSectionText(m: Record<string, any>): string {
  const eyebrowHtml = m.eyebrow
    ? `<div style="display:inline-flex;align-items:center;gap:8px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1a6fa8;margin-bottom:10px;line-height:1;">${emojiGlyph(m.eyebrowEmoji, 12)}<span>${m.eyebrow}</span></div>`
    : "";
  const titleHtml = m.title
    ? `<h2 style="font-size:21px;font-weight:700;color:#0c2752;line-height:1.3;margin:0 0 13px;">${m.title}</h2>`
    : "";
  const bodyHtml = m.body
    ? `<p style="font-size:13.5px;color:#4a5e72;line-height:1.78;margin:0;white-space:pre-line;">${m.body}</p>`
    : "";
  return `<div style="padding:42px 40px 0;">${eyebrowHtml}${titleHtml}${bodyHtml}</div>`;
}

function renderLiveStatus(m: Record<string, any>): string {
  const items = (m.items || []) as string[];
  const itemsHtml = items
    .map((item: string) => {
      const cleanItem = item.replace(/\s*[✓✔]$/, "");
      return `<div style="display:flex;align-items:flex-start;gap:10px;margin-top:8px;">${checkMark("#cdf5d8", "#166534")}<span style="font-size:12px;color:#166534;line-height:1.55;">${cleanItem}</span></div>`;
    })
    .join("");
  return `
  <div style="padding:0 40px;">
    <div style="background:#f0fdf6;border:1px solid #b8efd4;border-left:4px solid #22c55e;border-radius:10px;padding:17px 20px;margin-top:20px;display:flex;align-items:flex-start;gap:13px;">
      <div style="width:11px;height:11px;background:#22c55e;border-radius:50%;box-shadow:0 0 0 4px rgba(34,197,94,0.17);flex-shrink:0;margin-top:4px;"></div>
      <div>
        <h4 style="font-size:13.5px;font-weight:600;color:#14532d;margin:0 0 4px;">${m.title || "Status"}</h4>
        ${itemsHtml}
      </div>
    </div>
  </div>`;
}

function renderDivider(): string {
  return `<div style="height:1px;background:linear-gradient(to right,transparent,#d4dfe8,transparent);margin:40px 40px 0;"></div>`;
}

function renderFeatureCard(m: Record<string, any>): string {
  const iconBg = m.iconColor === "navy" ? "#dfe7f5" : "#dceff2";
  const bullets = (m.bullets || []) as { text: string; check: string }[];
  const checkColors: Record<string, { bg: string; color: string }> = {
    teal: { bg: "#d5f1f4", color: "#0f7c90" },
    navy: { bg: "#dae6ff", color: "#2457d6" },
    purple: { bg: "#ece6ff", color: "#6d28d9" },
  };

  const bulletsHtml = bullets
    .map((b) => {
      const c = checkColors[b.check] || checkColors.teal;
      return `
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
        ${checkMark(c.bg, c.color)}
        <span style="font-size:13px;color:#3d4f60;line-height:1.62;">${b.text}</span>
      </div>`;
    })
    .join("");

  const badgeHtml = m.badge ? pill(m.badge, "#fff8e1", "#92530a", "1px solid #f9c846") : "";

  return `
  <div style="padding:0 40px;">
    <div style="border:1px solid #e0eaf2;border-radius:12px;overflow:hidden;margin-top:18px;">
      <div style="padding:17px 20px 13px;display:flex;align-items:center;gap:13px;background:#fff;">
        <div style="width:40px;height:40px;border-radius:12px;background:${iconBg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">${emojiGlyph(m.icon || "&#x2B50;", 18)}</div>
        <div style="min-width:0;flex:1;">
          <div style="font-size:14px;font-weight:700;color:#0c2752;line-height:1.2;">${m.name || "Feature"}</div>
          <div style="font-size:11px;color:#7a8ea0;margin-top:4px;line-height:1.35;">${m.subtitle || ""}</div>
        </div>
        ${badgeHtml}
      </div>
      <div style="padding:14px 20px 18px;background:#f8fafb;border-top:1px solid #edf2f6;">
        ${m.description ? `<p style="font-size:12.5px;color:#516070;line-height:1.65;margin:0 0 12px;">${m.description}</p>` : ""}
        ${bulletsHtml}
      </div>
    </div>
  </div>`;
}

function renderStrategyBox(m: Record<string, any>): string {
  const subtitleHtml = m.subtitle
    ? `<div style="display:flex;align-items:center;gap:8px;margin:0 0 9px;">${emojiGlyph(m.subtitleEmoji, 14)}<h4 style="font-size:14px;font-weight:700;color:#0c2752;margin:0;line-height:1.3;">${m.subtitle}</h4></div>`
    : "";

  return `
  <div style="padding:42px 40px 0;">
    <div style="display:inline-flex;align-items:center;gap:8px;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1a6fa8;margin-bottom:10px;line-height:1;">${emojiGlyph(m.eyebrowEmoji, 12)}<span>${m.eyebrow || ""}</span></div>
    <h2 style="font-size:21px;font-weight:700;color:#0c2752;line-height:1.3;margin:0 0 13px;">${m.title || ""}</h2>
    <div style="background:linear-gradient(135deg,#edf3fb 0%,#e4eefc 100%);border:1px solid #c5d6ee;border-radius:12px;padding:24px 26px;margin-top:18px;">
      ${subtitleHtml}
      <p style="font-size:13px;color:#3d4f60;line-height:1.78;margin:0;">${m.body || ""}</p>
    </div>
  </div>`;
}

function renderAiCard(m: Record<string, any>): string {
  const isPurple = m.variant === "purple";
  const topBg = isPurple
    ? "linear-gradient(135deg,#3b1a7a,#5a38ae)"
    : "linear-gradient(135deg,#0c2752,#1a4a8a)";
  const labelBg = isPurple ? "rgba(255,255,255,0.14)" : "rgba(77,184,200,0.18)";
  const labelColor = isPurple ? "#ddd6fe" : "#7de8f4";

  const bullets = (m.bullets || []) as { title: string; text: string; check: string }[];
  const checkColors: Record<string, { bg: string; color: string }> = {
    teal: { bg: "#d5f1f4", color: "#0f7c90" },
    navy: { bg: "#dae6ff", color: "#2457d6" },
    purple: { bg: "#ece6ff", color: "#6d28d9" },
  };

  const bulletsHtml = bullets
    .map((b) => {
      const c = checkColors[b.check] || checkColors.teal;
      return `
      <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:14px;">
        ${checkMark(c.bg, c.color)}
        <span style="font-size:13px;color:#3d4f60;line-height:1.62;"><strong style="color:#0c2752;font-weight:700;">${b.title}</strong> &mdash; ${b.text}</span>
      </div>`;
    })
    .join("");

  return `
  <div style="padding:0 40px;">
    <div style="border:1px solid #e0eaf2;border-radius:12px;overflow:hidden;margin-top:20px;">
      <div style="padding:20px 24px 16px;display:flex;gap:14px;align-items:flex-start;background:${topBg};">
        <div style="width:44px;height:44px;background:rgba(255,255,255,0.12);border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${emojiGlyph(m.labelEmoji, 21)}</div>
        <div style="min-width:0;flex:1;">
          <span style="display:inline-flex;align-items:center;justify-content:center;min-height:32px;padding:0 18px;border-radius:999px;margin-bottom:8px;background:${labelBg};color:${labelColor};font-size:9px;font-weight:700;letter-spacing:1.5px;line-height:1;text-transform:uppercase;">${m.label || "AI"}</span>
          <h3 style="font-size:15.5px;font-weight:700;color:#fff;line-height:1.25;margin:0 0 6px;">${m.title || ""}</h3>
          <p style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.55;margin:0;">${m.subtitle || ""}</p>
        </div>
      </div>
      <div style="padding:18px 24px 22px;background:#fff;">
        ${bulletsHtml}
      </div>
    </div>
  </div>`;
}

function renderFooter(m: Record<string, any>): string {
  return `
  <div style="background:#f6f9fc;border-top:2px solid #e0eaf2;padding:30px 40px;text-align:center;">
    <div style="margin-bottom:18px;">${logoImg(32, "center")}</div>
    <p style="font-size:13px;color:#4a5e72;line-height:1.7;margin:0 0 16px;">${m.tagline || ""}</p>
    <p style="font-size:10px;color:#a0adb8;margin:14px 0 0;">${m.note || ""}</p>
  </div>`;
}

function renderBlockHtml(block: ContentBlock): string {
  const m = encodeMeta(parseMeta(block));
  const content = block.content || "";

  switch (block.type) {
    case "topbar":
      return renderTopbar(m);
    case "hero":
      return renderHero(m);
    case "live-status":
      return renderLiveStatus(m);
    case "feature-card":
      return renderFeatureCard(m);
    case "strategy-box":
      return renderStrategyBox(m);
    case "ai-card":
      return renderAiCard(m);
    case "footer":
      return renderFooter(m);
    case "divider":
      return renderDivider();
    case "text":
      if (m.eyebrow || m.title) {
        return renderSectionText(m);
      }
      return `<div style="padding:12px 40px;font-size:14px;line-height:1.7;color:#334155;white-space:pre-line;">${e(content).replace(/\n/g, "<br/>")}</div>`;
    case "features": {
      const lines = (content || "Feature 1\nFeature 2\nFeature 3").split("\n").filter(Boolean);
      const heading = lines[0];
      const items = lines.slice(1);
      const cards = items
        .map(
          (item) =>
            `<div style="background:#f0f4ff;padding:14px 18px;border-radius:8px;font-size:14px;color:#1e293b;border-left:4px solid #003087;margin-bottom:8px;">${e(item)}</div>`
        )
        .join("");
      return `<div style="padding:0 40px;margin-bottom:16px;">
        <h2 style="font-size:18px;font-weight:700;color:#003087;margin:0 0 12px;">${e(heading) || ""}</h2>
        ${cards}
      </div>`;
    }
    case "callout":
      return `<div style="margin:0 40px 16px;background:#fffbeb;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;font-size:14px;color:#92400e;white-space:pre-line;">${e(content) || "Important callout message"}</div>`;
    case "image-placeholder":
      return `<div style="height:180px;background:linear-gradient(135deg,#e4f0fa,#d0e6f5);display:flex;align-items:center;justify-content:center;color:#4a7fa8;font-size:12.5px;font-weight:500;">${emojiGlyph("&#x1F4F7;", 14)}&nbsp;${e(content) || "Image placeholder"}</div>`;
    default:
      return "";
  }
}

export function generateEmailHtml(email: EmailState): string {
  const blocks = email.blocks.map(renderBlockHtml).join("");
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
}

export function EmailPreview({ email }: EmailPreviewProps) {
  const html = generateEmailHtml(email);

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
