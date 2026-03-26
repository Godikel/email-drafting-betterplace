import type { EmailState } from "@/types/email";

const rawHtml = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Gender Inclusivity Toolkit — BetterPlace x BII</title>
<!--[if mso]>
<style>
  table, td { font-family: Arial, sans-serif !important; }
</style>
<![endif]-->
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; }
  body { margin: 0; padding: 0; background: #F0EDE8; font-family: 'DM Sans', Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  @media (max-width: 620px) {
    .email-container { width: 100% !important; }
    .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    .hero-img { height: auto !important; max-height: 280px !important; }
    .stats-table td { display: block !important; width: 100% !important; text-align: center !important; padding: 12px 0 !important; border-left: none !important; }
    .stats-table td + td { border-top: 1px solid rgba(255,255,255,0.18) !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#F0EDE8;font-family:'DM Sans',Arial,sans-serif;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F0EDE8;">
  <tr>
    <td align="center" style="padding:40px 16px;">

      <table role="presentation" class="email-container" width="620" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;background:#FFFFFF;">

        <!-- BRAND BAR -->
        <tr>
          <td style="background:#1b2d93;padding:18px 40px;" class="mobile-padding">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align:middle;">
                  <img src="https://better-place-logo-haven.lovable.app/assets/logo-white-horizontal-C-ZsDXkd.png" alt="BetterPlace" height="40" style="display:inline-block;vertical-align:middle;height:40px;width:auto;" />
                  <span style="display:inline-block;width:1px;height:20px;background:rgba(255,255,255,0.25);margin:0 16px;vertical-align:middle;"></span>
                  <img src="https://better-place-logo-haven.lovable.app/assets/bii-logo-white-Ddd3MNaw.png" alt="British International Investment" height="26" style="display:inline-block;vertical-align:middle;height:26px;width:auto;" />
                </td>
                <td style="vertical-align:middle;text-align:right;">
                  <span style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.45);letter-spacing:1.5px;text-transform:uppercase;">NEW LAUNCH</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- HERO IMAGE -->
        <tr>
          <td style="background:#1B2B5E;padding:0;line-height:0;">
            <img class="hero-img" src="https://images12345.lovable.app/assets/panel-discussion-CuiK1Phd.png" alt="Panel Discussion — Advancing Gender Inclusivity, Bangalore Feb 2026" width="620" style="display:block;width:100%;height:auto;max-height:380px;" />
          </td>
        </tr>

        <!-- HERO CAPTION -->
        <tr>
          <td style="background:#1B2B5E;padding:20px 32px 24px 32px;" class="mobile-padding">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:#FFFFFF;padding-bottom:10px;">
                  BANGALORE &nbsp;&middot;&nbsp; 26 FEB 2026
                </td>
              </tr>
              <tr>
                <td style="font-family:'DM Serif Display',Georgia,serif;font-size:23px;color:#E07B2A;line-height:1.3;font-style:italic;">
                  &#8220;Where intent meets reality.&#8221;
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- INTRO -->
        <tr>
          <td style="padding:44px 40px 8px;" class="mobile-padding">
            <p style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#6B7280;margin:0 0 22px;">Hello,</p>
            <p style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;line-height:1.78;color:#1F2937;margin:0 0 14px;">
              A few weeks ago, we hosted a closed-door evening in Bangalore with CHROs and HR heads from
              <strong style="font-weight:600;color:#1B2B5E;">PhonePe, Royal Orchid, OkayGo</strong> and many more &mdash; brought together by one question:
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
              <tr>
                <td style="border-left:3px solid #E07B2A;background:#FDF6EF;padding:18px 24px;font-family:'DM Serif Display',Georgia,serif;font-size:18px;font-style:italic;color:#1B2B5E;line-height:1.5;">
                  How do organisations actually build gender-inclusive frontline workforces?
                </td>
              </tr>
            </table>

            <p style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;color:#9CA3AF;font-style:italic;margin:0 0 8px;">Not the policy version. The execution version.</p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:30px 0;">
              <tr><td style="border-top:1px solid #E5E7EB;font-size:0;line-height:0;">&nbsp;</td></tr>
            </table>

            <p style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:#E07B2A;margin:0 0 10px;">INTRODUCING</p>
            <p style="font-family:'DM Serif Display',Georgia,serif;font-size:20px;color:#1B2B5E;line-height:1.2;margin:0 0 8px;">India&#8217;s first Gender Inclusivity Toolkit</p>
            <p style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;color:#6B7280;line-height:1.65;margin:0 0 28px;">
              Built by BetterPlace in partnership with British International Investment (BII) &mdash;
              and available to your team at <strong style="color:#1B2B5E;font-weight:600;">no cost.</strong>
            </p>

            <!-- FEATURE 1 -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;background:#F7F8FF;border-left:3px solid #1B2B5E;">
              <tr>
                <td width="60" style="padding:18px 0 18px 20px;vertical-align:top;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="38" height="38" align="center" valign="middle" style="background:#1B2B5E;border-radius:50%;color:#FFFFFF;font-size:17px;text-align:center;line-height:38px;">
                        &#127891;
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="padding:18px 20px 18px 0;vertical-align:top;">
                  <p style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:#1B2B5E;margin:0 0 4px;">4-Hour Masterclass &mdash; 10 Modules</p>
                  <p style="font-family:'DM Sans',Arial,sans-serif;font-size:13px;color:#6B7280;line-height:1.55;margin:0;">Bias-free hiring, workplace safety, inclusive onboarding, policy design, and leadership. Certified. Self-paced.</p>
                </td>
              </tr>
            </table>

            <!-- FEATURE 2 -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;background:#F7F8FF;border-left:3px solid #1B2B5E;">
              <tr>
                <td width="60" style="padding:18px 0 18px 20px;vertical-align:top;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="38" height="38" align="center" valign="middle" style="background:#1B2B5E;border-radius:50%;color:#FFFFFF;font-size:17px;text-align:center;line-height:38px;">
                        &#128214;
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="padding:18px 20px 18px 0;vertical-align:top;">
                  <p style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:#1B2B5E;margin:0 0 4px;">Gender Inclusive Content Playbook</p>
                  <p style="font-family:'DM Sans',Arial,sans-serif;font-size:13px;color:#6B7280;line-height:1.55;margin:0;">India&#8217;s first end-to-end playbook for frontline workforces. Practical checklists, language guides, and frameworks. Download instantly.</p>
                </td>
              </tr>
            </table>

            <!-- FEATURE 3 -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;background:#F7F8FF;border-left:3px solid #1B2B5E;">
              <tr>
                <td width="60" style="padding:18px 0 18px 20px;vertical-align:top;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="38" height="38" align="center" valign="middle" style="background:#1B2B5E;border-radius:50%;color:#FFFFFF;font-size:17px;text-align:center;line-height:38px;">
                        &#127942;
                      </td>
                    </tr>
                  </table>
                </td>
                <td style="padding:18px 20px 18px 0;vertical-align:top;">
                  <p style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:#1B2B5E;margin:0 0 4px;">Completion Certificate</p>
                  <p style="font-family:'DM Sans',Arial,sans-serif;font-size:13px;color:#6B7280;line-height:1.55;margin:0;">Co-branded by BetterPlace and BII. Shareable on LinkedIn. Recognised across India&#8217;s HR community.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- STATS STRIP -->
        <tr>
          <td style="background:#1B2B5E;padding:30px 40px;" class="mobile-padding">
            <p style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.45);margin:0 0 20px;">Results from organisations that made the shift</p>
            <table role="presentation" class="stats-table" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="33%" align="center" style="padding:0 10px;vertical-align:top;">
                  <p style="font-family:'DM Serif Display',Georgia,serif;font-size:34px;color:#E07B2A;line-height:1;margin:0 0 7px;">20&#8211;40%</p>
                  <p style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.55);line-height:1.45;margin:0;">increase in women<br>applicants</p>
                </td>
                <td width="33%" align="center" style="padding:0 10px;vertical-align:top;border-left:1px solid rgba(255,255,255,0.18);">
                  <p style="font-family:'DM Serif Display',Georgia,serif;font-size:34px;color:#E07B2A;line-height:1;margin:0 0 7px;">30%</p>
                  <p style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.55);line-height:1.45;margin:0;">reduction in<br>frontline attrition</p>
                </td>
                <td width="34%" align="center" style="padding:0 10px;vertical-align:top;border-left:1px solid rgba(255,255,255,0.18);">
                  <p style="font-family:'DM Serif Display',Georgia,serif;font-size:34px;color:#E07B2A;line-height:1;margin:0 0 7px;">91%</p>
                  <p style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.55);line-height:1.45;margin:0;">training completion<br>vs. 52% avg</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA SECTION -->
        <tr>
          <td style="padding:36px 40px 28px;" class="mobile-padding">
            <p style="font-family:'DM Sans',Arial,sans-serif;font-size:15px;color:#1F2937;line-height:1.75;margin:0 0 28px;">
              This toolkit is built to help your organisation make that shift &mdash; from well-intentioned
              policies to frontline systems that actually work. <strong style="color:#1B2B5E;font-weight:600;">No signup friction. No cost.</strong>
              Just 4 hours that could change how your frontline teams are built.
            </p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
              <tr>
                <td align="center" style="background:#E07B2A;">
                  <a href="https://drive.google.com/file/d/1dUJAM-qpJACxX-j9xiMVd-6QTsJFgDjh/view?usp=sharing" style="display:block;padding:17px 28px;font-family:'DM Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;text-align:center;letter-spacing:0.3px;">&#9654;&nbsp;&nbsp;Watch the Launch Video</a>
                </td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
              <tr>
                <td align="center" style="border:2px solid #1B2B5E;">
                  <a href="https://bii-onboarding.betterplace.co.in/" style="display:block;padding:15px 28px;font-family:'DM Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:#1B2B5E;text-decoration:none;text-align:center;">Access the Free Masterclass &rarr;</a>
                </td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" style="border:1px solid #9CA3AF;">
                  <a href="https://genderinclusivityresources.lovable.app/" style="display:block;padding:13px 28px;font-family:'DM Sans',Arial,sans-serif;font-size:13px;font-weight:500;color:#374151;text-decoration:none;text-align:center;">Download the Playbook (PDF) &rarr;</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CLOSING -->
        <tr>
          <td style="padding:0 40px 32px;" class="mobile-padding">
            <p style="font-family:'DM Sans',Arial,sans-serif;font-size:14px;color:#6B7280;line-height:1.7;margin:0;">
              We&#8217;d love to help your teams get started. Happy to schedule a walkthrough or answer any questions.
            </p>
            <p style="font-family:'DM Serif Display',Georgia,serif;font-size:19px;color:#1B2B5E;margin:18px 0 0;">The BetterPlace Team</p>
            <p style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:#9CA3AF;letter-spacing:1.2px;text-transform:uppercase;margin:3px 0 0;">Gender Inclusivity Initiative</p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#111827;padding:26px 40px;" class="mobile-padding">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align:middle;">
                  <img src="https://better-place-logo-haven.lovable.app/assets/logo-white-horizontal-C-ZsDXkd.png" alt="BetterPlace" height="32" style="display:inline-block;vertical-align:middle;height:32px;width:auto;opacity:0.85;" />
                </td>
                <td style="vertical-align:middle;padding:0 10px;">
                  <span style="color:rgba(255,255,255,0.3);font-size:14px;">&times;</span>
                </td>
                <td style="vertical-align:middle;">
                  <img src="https://better-place-logo-haven.lovable.app/assets/bii-logo-white-Ddd3MNaw.png" alt="British International Investment" height="20" style="display:inline-block;vertical-align:middle;height:20px;width:auto;opacity:0.8;" />
                </td>
              </tr>
            </table>
            <p style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:rgba(255,255,255,0.3);line-height:1.7;margin:12px 0 0;">
              You&#8217;re receiving this because you&#8217;re a valued partner of BetterPlace.<br>
              <a href="#" style="color:rgba(255,255,255,0.5);text-decoration:underline;">Unsubscribe</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;<a href="#" style="color:rgba(255,255,255,0.5);text-decoration:underline;">View in browser</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;

export const biiGenderInclusivityTemplate: EmailState = {
  subject: "Gender Inclusivity Toolkit — BetterPlace x BII",
  recipients: "",
  template: "bii-gender-inclusivity",
  blocks: [],
  rawHtml: rawHtml,
};
