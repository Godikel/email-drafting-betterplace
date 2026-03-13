import type { BuilderBlock, BuilderEmailState } from '@/types/builder';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function blockToHtml(block: BuilderBlock): string {
  const p = block.props;

  switch (block.type) {
    case 'text':
      return `<tr><td style="padding:8px 0;font-size:${p.fontSize || 16}px;color:${p.color || '#333333'};line-height:1.6;text-align:${p.alignment || 'left'};font-family:Arial,Helvetica,sans-serif;">${p.content || ''}</td></tr>`;

    case 'hero': {
      const cta = p.ctaText
        ? `<a href="${esc(p.ctaLink || '#')}" style="display:inline-block;padding:14px 32px;background:${p.ctaBgColor || '#ffffff'};color:${p.ctaTextColor || '#667eea'};border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;font-family:Arial,Helvetica,sans-serif;">${esc(p.ctaText)}</a>`
        : '';
      // Gradient fallback: use first color as bg, add background for capable clients
      const bgFallback = p.gradient?.match(/#[0-9a-fA-F]{6}/)?.[0] || '#667eea';
      return `<tr><td style="background:${p.gradient || bgFallback};background-color:${bgFallback};padding:48px 32px;text-align:center;border-radius:8px;">
        ${p.icon ? `<div style="font-size:48px;margin-bottom:16px;">${p.icon}</div>` : ''}
        <h1 style="color:#ffffff;font-size:28px;margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-weight:700;">${esc(p.title || '')}</h1>
        <p style="color:rgba(255,255,255,0.85);font-size:16px;margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;">${esc(p.subtitle || '')}</p>
        ${cta}
      </td></tr>`;
    }

    case 'info-box':
      return `<tr><td style="padding:8px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:4px solid ${p.borderColor || '#3b82f6'};background:${p.bgColor || '#eff6ff'};border-radius:8px;">
          <tr><td style="padding:16px;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:top;padding-right:12px;font-size:20px;">${p.icon || '💡'}</td>
              <td style="font-family:Arial,Helvetica,sans-serif;">
                <div style="font-weight:600;font-size:15px;color:#1a1a2e;margin-bottom:4px;">${esc(p.title || '')}</div>
                <div style="font-size:14px;color:#555;">${esc(p.description || '')}</div>
              </td>
            </tr></table>
          </td></tr>
        </table>
      </td></tr>`;

    case 'feature-card': {
      const bulletsHtml = (p.bullets || []).map((b: string) =>
        `<tr><td style="padding:3px 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#555;">
          <span style="color:${p.icon ? '#3b82f6' : '#333'};margin-right:8px;">•</span>${esc(b)}
        </td></tr>`
      ).join('');
      return `<tr><td style="padding:8px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e5e7eb;border-radius:8px;">
          <tr><td style="padding:20px;font-family:Arial,Helvetica,sans-serif;">
            <div style="font-size:24px;margin-bottom:8px;">${p.icon || ''}</div>
            <div style="font-weight:600;font-size:16px;color:#1a1a2e;margin-bottom:6px;">${esc(p.title || '')}</div>
            <div style="font-size:14px;color:#555;margin-bottom:12px;">${esc(p.description || '')}</div>
            ${bulletsHtml ? `<table cellpadding="0" cellspacing="0" border="0">${bulletsHtml}</table>` : ''}
          </td></tr>
        </table>
      </td></tr>`;
    }

    case 'image': {
      if (!p.src) return '';
      const align = p.alignment || 'center';
      return `<tr><td style="padding:8px 0;text-align:${align};">
        <img src="${esc(p.src)}" alt="${esc(p.alt || '')}" style="max-width:${p.maxWidth || 100}%;border-radius:${p.borderRadius || 0}px;display:inline-block;" />
        ${p.caption ? `<p style="font-size:12px;color:#888;margin:8px 0 0;text-align:center;font-family:Arial,Helvetica,sans-serif;">${esc(p.caption)}</p>` : ''}
      </td></tr>`;
    }

    case 'video': {
      const thumb = p.thumbnailSrc || 'https://via.placeholder.com/680x380/333/fff?text=Video';
      const link = p.videoUrl || '#';
      return `<tr><td style="padding:8px 0;text-align:center;">
        <a href="${esc(link)}" target="_blank" style="display:inline-block;position:relative;">
          <img src="${esc(thumb)}" alt="Video" style="max-width:100%;border-radius:8px;display:block;" />
        </a>
      </td></tr>`;
    }

    case 'divider':
      return `<tr><td style="padding:${p.margin || 16}px 0;">
        <hr style="border:none;border-top:${p.thickness || 1}px solid ${p.color || '#e5e7eb'};margin:0;" />
      </td></tr>`;

    case 'spacer':
      return `<tr><td style="height:${p.height || 32}px;line-height:${p.height || 32}px;font-size:1px;">&nbsp;</td></tr>`;

    case 'button': {
      const align = p.alignment || 'center';
      const width = p.fullWidth ? 'width:100%;' : '';
      return `<tr><td style="padding:8px 0;text-align:${align};">
        <a href="${esc(p.link || '#')}" style="display:inline-block;padding:14px 28px;background:${p.bgColor || '#3b82f6'};color:${p.textColor || '#ffffff'};border-radius:${p.borderRadius || 6}px;text-decoration:none;font-weight:600;font-size:14px;font-family:Arial,Helvetica,sans-serif;text-align:center;${width}">${esc(p.label || 'Click Here')}</a>
      </td></tr>`;
    }

    case 'status-card':
      return `<tr><td style="padding:8px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:4px solid ${p.accentColor || '#10b981'};border:1px solid #e5e7eb;border-left:4px solid ${p.accentColor || '#10b981'};border-radius:8px;">
          <tr><td style="padding:16px;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:top;padding-right:12px;font-size:20px;">${p.icon || '✅'}</td>
              <td style="font-family:Arial,Helvetica,sans-serif;">
                <div style="font-weight:600;font-size:15px;color:#1a1a2e;margin-bottom:4px;">${esc(p.title || '')}</div>
                <div style="font-size:14px;color:#555;">${esc(p.description || '')}</div>
              </td>
            </tr></table>
          </td></tr>
        </table>
      </td></tr>`;

    case 'two-column':
    case 'three-column': {
      const cols = block.children || [];
      const colCount = block.type === 'two-column' ? 2 : 3;
      const colWidth = Math.floor(100 / colCount);
      const colsHtml = cols.map(col => {
        const inner = col.map(b => blockToHtml(b)).join('');
        return `<td style="width:${colWidth}%;vertical-align:top;padding:0 8px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">${inner || '<tr><td>&nbsp;</td></tr>'}</table>
        </td>`;
      }).join('');
      return `<tr><td style="padding:8px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${colsHtml}</tr></table>
      </td></tr>`;
    }

    default:
      return '';
  }
}

export function generateBuilderHtml(email: BuilderEmailState): string {
  const w = email.wrapper;
  const blocksHtml = email.blocks.map(b => blockToHtml(b)).join('\n');

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${esc(email.subject || 'Email')}</title>
  <style>
    body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-spacing: 0; border-collapse: collapse; }
    img { border: 0; display: block; outline: none; text-decoration: none; }
    @media only screen and (max-width: 620px) {
      .email-wrapper { width: 100% !important; padding: 12px !important; }
      .responsive-col { display: block !important; width: 100% !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#f0f0f5;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f0f0f5;">
    <tr><td align="center" style="padding:24px 16px;">
      <table class="email-wrapper" cellpadding="0" cellspacing="0" border="0" style="max-width:${w.maxWidth}px;width:100%;background:${w.bgColor};border-radius:${w.borderRadius}px;overflow:hidden;">
        <tr><td style="padding:${w.padding}px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${blocksHtml}
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
