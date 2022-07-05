// Email HTML body
export function html({
  code,
  host,
  email,
}: Record<'code' | 'host' | 'email', string>) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`;
  const escapedHost = `${host.replace(/\./g, '&#8203;.')}`;

  // Some simple styling options
  const backgroundColor = '#f9f9f9';
  const textColor = '#282f36';
  const primaryColor = '#18e597';
  const greyColor = '#a8acb1';
  const mainBackgroundColor = '#ffffff';

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedHost}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Sign in as <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="font-family: Helvetica, Arial, sans-serif; color: ${textColor}; font-size: 16px;">
        Copy and paste the code below into Persistful in order to login.
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 25px 0; font-family: Helvetica, Arial, sans-serif; color: ${primaryColor}; font-size: 32px;">
        ${code}
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 12px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${greyColor};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
export function text({ code, host }: Record<'code' | 'host', string>) {
  return `Sign into ${host}\nWith code: ${code}\n\n`;
}
