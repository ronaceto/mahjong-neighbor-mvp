import nodemailer from "nodemailer";

type SendArgs = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: any[];
  headers?: Record<string, string>;
  bcc?: string | string[]; // 👈 added for internal notifications
};

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  EMAIL_FROM,
  NOTIFY_TO, // 👈 added
} = process.env;

const transporter =
  SMTP_HOST && SMTP_USER && SMTP_PASS
    ? nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT ?? 465),
        secure: String(SMTP_SECURE ?? "true") === "true",
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      })
    : null;

export async function sendEmail({
  to,
  subject,
  html,
  text,
  attachments,
  headers,
  bcc,
}: SendArgs) {
  if (!transporter) throw new Error("SMTP not configured");

  // combine any route-provided BCC with global NOTIFY_TO
