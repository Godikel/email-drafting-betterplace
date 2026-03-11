import type { EmailState } from "@/types/email";

function renderBlockHtml(block: { type: string; content: string }): string {
  switch (block.type) {
    case "hero":
      return `<div style="background:linear-gradient(135deg,#3b82f6,#4338ca);padding:40px 24px;border-radius:12px;text-align:center;margin-bottom:16px;">
        <h1 style="color:#fff;font-size:24px;margin:0;font-weight:700;">${block.content || "Your Hero Headline"}</h1>
      </div>`;
    case "features": {
      const items = (block.content || "Feature 1\nFeature 2\nFeature 3").split("\n").filter(Boolean);
      const cards = items
        .map(
          (item) =>
            `<div style="flex:1;min-width:140px;background:#f0f4ff;padding:16px;border-radius:8px;text-align:center;font-size:14px;color:#1e293b;">${item}</div>`
        )
        .join("");
      return `<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;">${cards}</div>`;
    }
    case "callout":
      return `<div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;margin-bottom:16px;font-size:14px;color:#92400e;">
        ${block.content || "Important callout message"}
      </div>`;
    case "text":
      return `<div style="padding:12px 0;font-size:14px;line-height:1.6;color:#334155;margin-bottom:16px;">
        ${(block.content || "Your text content here.").replace(/\n/g, "<br/>")}
      </div>`;
    default:
      return "";
  }
}

export function generateEmailHtml(email: EmailState): string {
  const blocks = email.blocks.map(renderBlockHtml).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="margin:0;padding:24px;font-family:Arial,sans-serif;background:#f8fafc;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
      ${blocks || '<p style="color:#94a3b8;text-align:center;padding:40px 0;">Add content sections to see the preview</p>'}
    </div>
  </body></html>`;
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
