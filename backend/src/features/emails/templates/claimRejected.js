export const html = ({ fullName, drawMonth, adminNote, appName }) => `
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
              <h2 style="margin:0 0 16px;color:#F9FAFB;font-size:28px;font-weight:700;">Claim Update</h2>
              <p style="margin:0 0 24px;color:#9CA3AF;font-size:16px;line-height:1.6;">
                Hi ${fullName}, unfortunately your prize claim for the ${drawMonth} draw could not be approved at this time.
              </p>
              ${
                adminNote
                  ? `<div style="background-color:#1C1C28;border-left:3px solid #EF4444;padding:16px 20px;border-radius:0 8px 8px 0;margin-bottom:24px;">
                      <p style="margin:0;color:#9CA3AF;font-size:14px;line-height:1.6;">${adminNote}</p>
                    </div>`
                  : ''
              }
              <p style="margin:0 0 32px;color:#9CA3AF;font-size:16px;line-height:1.6;">
                If you believe this is an error, please contact support with your draw details.
              </p>
              <a href="${process.env.FRONTEND_URL}/dashboard"
                style="display:inline-block;background-color:#6EE7B7;color:#0A0A0F;padding:14px 32px;border-radius:10px;font-weight:700;font-size:16px;text-decoration:none;">
                Go to Dashboard
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