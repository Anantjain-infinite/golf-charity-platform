export const html = ({ fullName, appName }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ${appName}</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0F;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0A0A0F;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#13131A;border-radius:16px;border:1px solid #2A2A3D;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="padding:40px 40px 32px;border-bottom:1px solid #2A2A3D;">
              <h1 style="margin:0;color:#6EE7B7;font-size:24px;font-weight:700;letter-spacing:-0.5px;">${appName}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#F9FAFB;font-size:28px;font-weight:700;">Welcome, ${fullName}</h2>
              <p style="margin:0 0 24px;color:#9CA3AF;font-size:16px;line-height:1.6;">
                You have joined a community of golfers making a real difference. Every time you play, you are contributing to causes that matter.
              </p>
              <p style="margin:0 0 32px;color:#9CA3AF;font-size:16px;line-height:1.6;">
                Subscribe to get started, enter your Stableford scores, and you will be entered into the monthly prize draw automatically.
              </p>
              <a href="${process.env.FRONTEND_URL}/subscribe"
                style="display:inline-block;background-color:#6EE7B7;color:#0A0A0F;padding:14px 32px;border-radius:10px;font-weight:700;font-size:16px;text-decoration:none;">
                Get Started
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #2A2A3D;">
              <p style="margin:0;color:#6B7280;font-size:13px;">
                This email was sent by ${appName}. If you did not create an account, you can ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;