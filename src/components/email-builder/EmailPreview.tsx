import type { EmailState } from "@/types/email";

function renderBlockHtml(block: { type: string; content: string }): string {
  const content = block.content || "";

  switch (block.type) {
    case "hero":
      return `<div style="background:#003087;color:#ffffff;padding:48px 32px;border-radius:12px;text-align:center;margin-bottom:16px;">
        <h1 style="color:#fff;font-size:26px;margin:0 0 12px;font-weight:700;line-height:1.3;white-space:pre-line;">${content || "Your Hero Headline"}</h1>
      </div>`;

    case "features": {
      const lines = (content || "Feature 1\nFeature 2\nFeature 3").split("\n").filter(Boolean);
      const heading = lines[0];
      const items = lines.slice(1);
      const cards = items
        .map(
          (item) =>
            `<div style="background:#f0f4ff;padding:14px 18px;border-radius:8px;font-size:14px;color:#1e293b;border-left:4px solid #003087;margin-bottom:8px;">${item}</div>`
        )
        .join("");
      return `<div style="margin-bottom:16px;">
        <h2 style="font-size:18px;font-weight:700;color:#003087;margin:0 0 12px;white-space:pre-line;">${heading || ""}</h2>
        ${cards}
      </div>`;
    }

    case "callout":
      return `<div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:16px;border-radius:8px;margin-bottom:16px;font-size:14px;color:#92400e;white-space:pre-line;">
        ${content || "Important callout message"}
      </div>`;

    case "text":
      return `<div style="padding:12px 0;font-size:14px;line-height:1.7;color:#334155;margin-bottom:16px;white-space:pre-line;">
        ${(content || "Your text content here.").replace(/\n/g, "<br/>")}
      </div>`;

    default:
      return "";
  }
}

export function generateEmailHtml(email: EmailState): string {
  const blocks = email.blocks.map(renderBlockHtml).join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="margin:0;padding:24px;font-family:Arial,sans-serif;background:#f8fafc;">
    <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;padding:32px;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
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
