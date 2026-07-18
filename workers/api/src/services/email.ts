import type { Env } from "../env";

export async function sendEmail(
  env: Env,
  to: string,
  subject: string,
  html: string
): Promise<{ ok: boolean; message: string }> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      message: "Email service not configured. Set RESEND_API_KEY on the API worker.",
    };
  }

  const from = env.EMAIL_FROM ?? "Speak Coach <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    return { ok: false, message: `Email failed: ${err}` };
  }

  return { ok: true, message: "Weekly report sent to your email." };
}
