export const html = ({ fullName, appName }) => `
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
              <div style="display:inline-block;background-color:#EF444420;color:#EF4444;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:24px;">Action Required</div>
              <h2 style="margin:0 0 16px;color:#F9FAFB;font-size:28px;font-weight:700;">Payment Failed</h2>
              <p style="margin:0 0 24px;color:#9CA3AF;font-size:16px;line-height:1.6;">
                Hi ${fullName}, we were unable to process your subscription payment. Your account has been paused until payment is resolved.
              </p>
              <p style="margin:0 0 32px;color:#9CA3AF;font-size:16px;line-height:1.6;">
                Please update your billing details to continue participating in draws and supporting your chosen charity.
              </p>
              <a href="${process.env.FRONTEND_URL}/dashboard"
                style="display:inline-block;background-color:#EF4444;color:#ffffff;padding:14px 32px;border-radius:10px;font-weight:700;font-size:16px;text-decoration:none;">
                Update Billing Details
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #2A2A3D;">
              <p style="margin:0;color:#6B7280;font-size:13px;">If you believe this is an error, please contact support.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;