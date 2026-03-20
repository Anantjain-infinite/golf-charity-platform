export const html = ({
    fullName,
    drawMonth,
    drawnNumbers,
    userScores,
    matchCount,
    prizeAmount,
    appName,
  }) => {
    const drawnSet = new Set(drawnNumbers);
    const matchLabel =
      matchCount === 5
        ? 'Jackpot'
        : matchCount === 4
        ? '4 Number Match'
        : matchCount === 3
        ? '3 Number Match'
        : 'No Match';
  
    const scoreCircles = userScores
      .map(
        (s) =>
          `<span style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;border-radius:50%;background-color:${
            drawnSet.has(s) ? '#6EE7B7' : '#1C1C28'
          };color:${drawnSet.has(s) ? '#0A0A0F' : '#9CA3AF'};font-size:14px;font-weight:700;margin:4px;">${s}</span>`
      )
      .join('');
  
    const drawnCircles = drawnNumbers
      .map(
        (n) =>
          `<span style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;border-radius:50%;background-color:#F59E0B20;color:#F59E0B;border:1px solid #F59E0B;font-size:14px;font-weight:700;margin:4px;">${n}</span>`
      )
      .join('');
  
    return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background-color:#0A0A0F;font-family:'DM Sans',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0F;padding:40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#13131A;border-radius:16px;border:1px solid #2A2A3D;max-width:600px;width:100%;">
            <tr>
              <td style="padding:40px 40px 32px;border-bottom:1px solid #2A2A3D;">
                <h1 style="margin:0;color:#6EE7B7;font-size:24px;font-weight:700;">${appName}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:40px;">
                <h2 style="margin:0 0 8px;color:#F9FAFB;font-size:28px;font-weight:700;">Draw Results</h2>
                <p style="margin:0 0 32px;color:#6B7280;font-size:15px;">${drawMonth}</p>
                <p style="margin:0 0 12px;color:#9CA3AF;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Drawn Numbers</p>
                <div style="margin-bottom:32px;">${drawnCircles}</div>
                <p style="margin:0 0 12px;color:#9CA3AF;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your Scores</p>
                <div style="margin-bottom:32px;">${scoreCircles}</div>
                <div style="background-color:#1C1C28;border-radius:12px;padding:24px;margin-bottom:32px;">
                  <p style="margin:0 0 8px;color:#6B7280;font-size:14px;">Result</p>
                  <p style="margin:0;color:${matchCount >= 3 ? '#6EE7B7' : '#F9FAFB'};font-size:22px;font-weight:700;">${matchLabel}</p>
                  ${prizeAmount ? `<p style="margin:8px 0 0;color:#F59E0B;font-size:18px;font-weight:700;">GBP ${prizeAmount}</p>` : ''}
                </div>
                <a href="${process.env.FRONTEND_URL}/dashboard"
                  style="display:inline-block;background-color:#6EE7B7;color:#0A0A0F;padding:14px 32px;border-radius:10px;font-weight:700;font-size:16px;text-decoration:none;">
                  View Dashboard
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