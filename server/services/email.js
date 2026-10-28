import { Resend } from 'resend';
import { config } from '../config.js';

let client;
const getClient = () => (client ||= new Resend(config.email.apiKey));

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/** Sends via Resend. With no RESEND_API_KEY it prints the email to the console (local dev). */
export async function sendEmail({ to, subject, html, text }) {
  if (!config.email.apiKey) {
    console.log(`\n[email:dev] To: ${to}\n[email:dev] Subject: ${subject}\n[email:dev] ${text}\n`);
    return { skipped: true };
  }
  const { data, error } = await getClient().emails.send({ from: config.email.from, to, subject, html, text });
  if (error) throw new Error(`Resend: ${error.message}`);
  return data;
}

function layout(title, intro, buttonLabel, url) {
  return `<div style="font-family:system-ui,sans-serif;max-width:480px;margin:auto;padding:24px">
  <h2 style="margin:0 0 12px">${esc(title)}</h2>
  <p style="color:#444;line-height:1.5">${intro}</p>
  <p><a href="${esc(url)}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">${esc(buttonLabel)}</a></p>
  <p style="color:#888;font-size:12px">If the button doesn't work, paste this link into your browser:<br>${esc(url)}</p>
</div>`;
}

export function sendVerificationEmail(user, token) {
  const url = `${config.appUrl}/verify-email?token=${token}`;
  return sendEmail({
    to: user.email,
    subject: `Verify your email for ${config.appName}`,
    html: layout('Verify your email', `Hi ${esc(user.name || 'there')}, confirm your email address to finish setting up your ${esc(config.appName)} account. This link expires in 24 hours.`, 'Verify email', url),
    text: `Verify your email: ${url} (expires in 24 hours)`,
  });
}

export function sendPasswordResetEmail(user, token) {
  const url = `${config.appUrl}/reset-password?token=${token}`;
  return sendEmail({
    to: user.email,
    subject: `Reset your ${config.appName} password`,
    html: layout('Reset your password', 'We received a request to reset your password. This link expires in 1 hour. If you did not ask for this, you can ignore this email.', 'Reset password', url),
    text: `Reset your password: ${url} (expires in 1 hour). Ignore this email if you did not request it.`,
  });
}
