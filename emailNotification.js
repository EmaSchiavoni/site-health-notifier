const BREVO_API_KEY = process.env.BREVO_API_KEY;
const NOTIFY_EMAIL_TO = process.env.NOTIFY_EMAIL_TO;
const NOTIFY_EMAIL_FROM = process.env.NOTIFY_EMAIL_FROM;

export async function sendEmailNotification(subject, content) {
  if (!BREVO_API_KEY || !NOTIFY_EMAIL_TO || !NOTIFY_EMAIL_FROM) return;
  await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: { email: NOTIFY_EMAIL_FROM },
      to: [{ email: NOTIFY_EMAIL_TO }],
      subject: subject,
      htmlContent: `<p>${content}</p>`
    })
  });
}
