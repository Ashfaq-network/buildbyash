const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, service, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email and message are required." });
  }

  try {
    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,     // your Gmail address
        pass: process.env.GMAIL_PASS,     // your Gmail app password
      },
    });

    // Email sent TO you (the notification)
    await transporter.sendMail({
      from: `"buildsbyash Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `🚀 New Contact from ${name} — buildsbyash`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#07051a;color:#f0ecff;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#5c18cc,#3e0ea0);padding:28px 32px;">
            <h2 style="margin:0;font-size:22px;color:#fff;">New Contact Form Submission</h2>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.65);font-size:13px;">buildsbyash.vercel.app</p>
          </div>
          <div style="padding:28px 32px;background:#0d0a25;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(139,53,255,0.15);font-size:13px;color:rgba(195,175,255,0.55);width:110px;">Name</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(139,53,255,0.15);font-size:14px;font-weight:600;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(139,53,255,0.15);font-size:13px;color:rgba(195,175,255,0.55);">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(139,53,255,0.15);font-size:14px;"><a href="mailto:${email}" style="color:#b070ff;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;border-bottom:1px solid rgba(139,53,255,0.15);font-size:13px;color:rgba(195,175,255,0.55);">Service</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(139,53,255,0.15);font-size:14px;">${service || "Not specified"}</td>
              </tr>
              <tr>
                <td style="padding:14px 0 0;font-size:13px;color:rgba(195,175,255,0.55);vertical-align:top;">Message</td>
                <td style="padding:14px 0 0;font-size:14px;line-height:1.7;">${message}</td>
              </tr>
            </table>
            <a href="mailto:${email}" style="display:inline-block;margin-top:24px;background:linear-gradient(135deg,#7b2fff,#5010c0);color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">Reply to ${name}</a>
          </div>
        </div>
      `,
    });

    // Auto-reply TO the person who contacted
    await transporter.sendMail({
      from: `"Ashfaq | buildsbyash" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: `Got your message, ${name}! 👋`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#07051a;color:#f0ecff;border-radius:16px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#5c18cc,#3e0ea0);padding:28px 32px;">
            <h2 style="margin:0;font-size:22px;color:#fff;">Thanks for reaching out! 🚀</h2>
            <p style="margin:6px 0 0;color:rgba(255,255,255,0.65);font-size:13px;">buildsbyash — Web Design & Development</p>
          </div>
          <div style="padding:28px 32px;background:#0d0a25;line-height:1.7;font-size:15px;">
            <p>Hey <strong>${name}</strong>,</p>
            <p style="margin-top:12px;color:rgba(195,175,255,0.8);">I've received your message and I'll get back to you within <strong style="color:#f0ecff;">24 hours</strong>.</p>
            <p style="margin-top:12px;color:rgba(195,175,255,0.8);">Here's a copy of what you sent:</p>
            <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(139,53,255,0.2);border-radius:10px;padding:16px 20px;margin-top:12px;font-size:14px;color:rgba(200,180,255,0.7);line-height:1.7;">
              ${message}
            </div>
            <p style="margin-top:24px;color:rgba(195,175,255,0.8);">While you wait, feel free to check out my work at <a href="https://buildsbyash.vercel.app" style="color:#b070ff;">buildsbyash.vercel.app</a></p>
            <p style="margin-top:20px;">Talk soon,<br><strong>Ashfaq</strong><br><span style="color:rgba(195,175,255,0.5);font-size:13px;">buildsbyash.vercel.app</span></p>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true, message: "Email sent successfully!" });

  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Failed to send email. Please try again." });
  }
}
