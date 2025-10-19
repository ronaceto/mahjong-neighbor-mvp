const { Client } = require("pg");
const nodemailer = require("nodemailer");

const {
  DATABASE_URL, SMTP_HOST, SMTP_PORT="465", SMTP_SECURE="true",
  SMTP_USER, SMTP_PASS, EMAIL_FROM, NEXT_PUBLIC_SITE_URL
} = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST, port: Number(SMTP_PORT),
  secure: String(SMTP_SECURE) === "true",
  auth: { user: SMTP_USER, pass: SMTP_PASS }
});

async function sendEmail({to,subject,html,text,headers}) {
  await transporter.sendMail({ from: EMAIL_FROM || SMTP_USER, to, subject, html, text, headers });
}

exports.handler = async function () {
  const db = new Client({ connectionString: DATABASE_URL });
  await db.connect();

  const q24 = `
    select sg.id signup_id, sg.email, sg.name, sg.unsub_at,
           se.id session_id, se.title, se.starts_at, se.ends_at, se.location
    from signup sg join session se on se.id = sg.session_id
    where sg.unsub_at is null and sg.reminder_24h_sent_at is null
      and se.starts_at between (now() at time zone 'utc' + interval '24 hour' - interval '15 minute')
                           and (now() at time zone 'utc' + interval '24 hour' + interval '15 minute')`;
  const q2h = `
    select sg.id signup_id, sg.email, sg.name, sg.unsub_at,
           se.id session_id, se.title, se.starts_at, se.ends_at, se.location
    from signup sg join session se on se.id = sg.session_id
    where sg.unsub_at is null and sg.reminder_2h_sent_at is null
      and se.starts_at between (now() at time zone 'utc' + interval '2 hour' - interval '15 minute')
                           and (now() at time zone 'utc' + interval '2 hour' + interval '15 minute')`;

  const { rows: due24 } = await db.query(q24);
  const { rows: due2h } = await db.query(q2h);

  const tz = "America/Chicago";
  const format = d => new Date(d).toLocaleString("en-US",{ timeZone: tz, dateStyle:"full", timeStyle:"short" });

  async function sendReminder(row, col) {
    const subject = (col === "reminder_24h_sent_at" ? "Tomorrow: " : "Soon: ") + row.title;
    const manageUrl = `${NEXT_PUBLIC_SITE_URL}/sessions/${row.session_id}`;
    const text = [
      `Hi ${row.name || "there"},`,
      `${col === "reminder_24h_sent_at" ? "Reminder for tomorrow" : "Starting soon"}: "${row.title}"`,
      `When: ${format(row.starts_at)} – ${format(row.ends_at)}`,
      `Where: ${row.location || "TBD"}`,
      `Details: ${manageUrl}`,
    ].join("\n");
    await sendEmail({ to: row.email, subject, text, html: text.replace(/\n/g,"<br>") });
    await db.query(`update signup set ${col}=now() where id=$1`, [row.signup_id]);
  }

  for (const r of due24) await sendReminder(r, "reminder_24h_sent_at");
  for (const r of due2h) await sendReminder(r, "reminder_2h_sent_at");

  await db.end();
  return { statusCode: 200, body: "ok" };
};

exports.config = { schedule: "@every 15m" };