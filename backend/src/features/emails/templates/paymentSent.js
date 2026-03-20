export const html = ({ fullName, prizeAmount, drawMonth, appName }) => `
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
              <div style="display:inline-block;background-color:#10B98120;color:#10B981;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:24px;">Payment Sent</div>
              <h2 style="margin:0 0 16px;color:#F9FAFB;font-size:28px;font-weight:700;">Your payment is on its way</h2>
              <p style="margin:0 0 24px;color:#9CA3AF;font-size:16px;line-height:1.6;">
                Hi ${fullName}, your prize of GBP ${prizeAmount} from the ${drawMonth} draw has been sent. Please allow 3 to 5 business days for it to arrive.
              </p>
              <p style="margin:0 0 32px;color:#9CA3AF;font-size:16px;line-height:1.6;">
                Thank you for being part of ${appName} and helping support charity through the game you love.
              </p>
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