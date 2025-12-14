export const otpEmail = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Email Verification</title>
</head>
<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f4f4f5;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="padding: 24px 0;"
  >
    <tr>
      <td align="center">
        <!-- Card -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="
            max-width: 480px;
            background-color: #ffffff;
            border-radius: 12px;
            padding: 32px;
          "
        >
          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding-bottom: 16px;">
              <h1
                style="
                  margin: 0;
                  font-size: 24px;
                  font-weight: 600;
                  color: #111827;
                "
              >
                Papertrail
              </h1>
            </td>
          </tr>

          <!-- Heading -->
          <tr>
            <td style="padding-bottom: 12px;">
              <h2
                style="
                  margin: 0;
                  font-size: 18px;
                  font-weight: 600;
                  color: #111827;
                  text-align: center;
                "
              >
                Verify your email address
              </h2>
            </td>
          </tr>

          <!-- Description -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p
                style="
                  margin: 0;
                  font-size: 14px;
                  line-height: 1.5;
                  color: #374151;
                  text-align: center;
                "
              >
                Use the verification code below to complete your signup.
                This code will expire in <strong>10 minutes</strong>.
              </p>
            </td>
          </tr>

          <!-- OTP Box -->
          <tr>
            <td align="center" style="padding-bottom: 24px;">
              <div
                style="
                  display: inline-block;
                  padding: 16px 24px;
                  font-size: 28px;
                  font-weight: 700;
                  letter-spacing: 6px;
                  color: #111827;
                  background-color: #f9fafb;
                  border-radius: 8px;
                  border: 1px dashed #d1d5db;
                "
              >
                {{OTP_CODE}}
              </div>
            </td>
          </tr>

          <!-- Help text -->
          <tr>
            <td style="padding-bottom: 24px;">
              <p
                style="
                  margin: 0;
                  font-size: 13px;
                  color: #6b7280;
                  text-align: center;
                "
              >
                If you didn’t request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;" />
              <p
                style="
                  margin: 0;
                  font-size: 12px;
                  color: #9ca3af;
                  text-align: center;
                "
              >
                © 2025 Papertrail. All rights reserved.
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
