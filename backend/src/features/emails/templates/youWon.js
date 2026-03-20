export const html = ({
    fullName,
    drawMonth,
    matchCount,
    prizeAmount,
    appName,
    dashboardUrl,
  }) => {
    const tierLabel =
      matchCount === 5
        ? 'Jackpot Winner'
        : matchCount === 4
        ? '4 Number Match Winner'
        : '3 Number Match Winner';
  
    return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background-color:#0A0A0F;font-family:'DM Sans',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0F;padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#13131A;border-radius:16px;border:1px solid #F59E0B;max-width:600px;width:100%;">
            <tr>
              <td style="padding:40px 40px 32px;border-bottom:1px solid #2A2A3D;">
                <h1 style="margin:0;color:#6EE7B7;font-size:24px;font-weight:700;">${appName}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;">
                <div style="display:inline-block;background-color:#F59E0B20;color:#F59E0B;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:24px;">${tierLabel}</div>
                <h2 style="margin:0 0 16px;color:#F9FAFB;font-size:32px;font-weight:700;">You won, ${fullName}</h2>
                <p style="margin:0 0 8px;color:#9CA3AF;font-size:16px;">Draw month: ${drawMonth}</p>
                <p style="margin:0 0 32px;color:#F59E0B;font-size:36px;font-weight:700;">GBP ${prizeAmount}</p>
                <p style="margin:0 0 16px;color:#9CA3AF;font-size:16px;line-height:1.6;">
                  To claim your prize, please upload a screenshot of your golf scores from your golf tracking app. Go to the Winnings tab in your dashboard.
                </p>
                <p style="margin:0 0 32px;color:#9CA3AF;font-size:16px;line-height:1.6;">
                  Your claim will be reviewed within 3 business days.
                </p>
                <a href="${dashboardUrl}"
                  style="display:inline-block;background-color:#F59E0B;color:#0A0A0F;padding:14px 32px;border-radius:10px;font-weight:700;font-size:16px;text-decoration:none;">
                  Upload Proof Now
                </a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
  };