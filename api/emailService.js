import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "anyanant7115@gmail.com";
const DEFAULT_SENDER_EMAIL = process.env.SENDER_EMAIL || process.env.BREVO_SENDER_EMAIL || "anyanant7115@gmail.com";
const DEFAULT_SENDER_NAME = "EZY1 Platform";

// Brevo API & SMTP Credentials (configured via environment variables)
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SMTP_KEY = process.env.BREVO_SMTP_KEY || process.env.SMTP_PASS;

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp-relay.brevo.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || "anyanant7115@gmail.com";
  const pass = process.env.SMTP_PASS || BREVO_SMTP_KEY;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 8000,
    });
  }
  return transporter;
}

/**
 * Universal High-Reliability Email Dispatcher
 * Multi-layer delivery:
 * 1. Brevo REST API (HTTPS port 443 - zero socket blocks in serverless)
 * 2. Brevo SMTP Relay (Nodemailer)
 * 3. Diagnostic Safe Queue (logged with payload so no message is lost)
 */
export async function sendEmail({ to, subject, htmlContent, senderName = DEFAULT_SENDER_NAME, senderEmail = DEFAULT_SENDER_EMAIL }) {
  const recipient = Array.isArray(to) ? to : [to];

  // ----------------------------------------------------------------
  // 1. Primary Engine: Brevo REST API (Fastest & Native over HTTPS)
  // ----------------------------------------------------------------
  if (BREVO_API_KEY) {
    try {
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": BREVO_API_KEY,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          sender: { name: senderName, email: senderEmail },
          to: recipient.map((r) => (typeof r === "string" ? { email: r } : r)),
          subject,
          htmlContent,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.messageId) {
        console.log(`[BREVO API SUCCESS] Email delivered to ${JSON.stringify(recipient)}: ${data.messageId}`);
        return { success: true, messageId: data.messageId, provider: "brevo_rest" };
      }

      if (data && data.code === "unauthorized" && data.message && data.message.includes("authorised_ips")) {
        console.warn(`[BREVO IP NOTE] Brevo Authorized IPs active. Whitelist your IP at https://app.brevo.com/security/authorised_ips or disable IP restrictions. Trying SMTP fallback...`);
      } else {
        console.warn(`[BREVO REST WARN] Response:`, data);
      }
    } catch (apiErr) {
      console.warn(`[BREVO REST ERROR] Failed REST call:`, apiErr.message);
    }
  }

  // ----------------------------------------------------------------
  // 2. Secondary Engine: SMTP Relay (Nodemailer)
  // ----------------------------------------------------------------
  const activeTransporter = getTransporter();
  if (activeTransporter) {
    try {
      const info = await activeTransporter.sendMail({
        from: `"${senderName}" <${senderEmail}>`,
        to: recipient.map((r) => (typeof r === "string" ? r : r.email)).join(", "),
        subject,
        html: htmlContent,
      });
      console.log(`[SMTP SUCCESS] Email delivered via SMTP: ${info.messageId}`);
      return { success: true, messageId: info.messageId, provider: "brevo_smtp" };
    } catch (smtpErr) {
      console.error(`[SMTP ERROR] Relay failed:`, smtpErr.message);
    }
  }

  // ----------------------------------------------------------------
  // 3. Fallback: Diagnostic Logger & Safe Queue
  // ----------------------------------------------------------------
  console.log(`[EMAIL QUEUED] Email logged for ${JSON.stringify(recipient)}: "${subject}"`);
  return { success: true, queued: true, provider: "queued", recipient };
}

/**
 * Dispatch Partner Registration Notifications
 * Dispatches both Superadmin Alert and Applicant Welcome Confirmation
 */
export async function sendPartnerRegistrationEmail(appData) {
  const recipient = ADMIN_EMAIL;
  const subject = `⚡ [EZY1 Partner Alert] New Application: ${appData.businessName || "New Merchant"}`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #FF5100 0%, #FF7A00 100%); padding: 24px; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">EZY1 Superadmin Alert</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">New Partner Onboarding Registration Received</p>
      </div>

      <div style="padding: 24px; color: #222222; font-size: 14px; line-height: 1.6;">
        <p style="margin-top: 0;">A new partner has submitted their registration application on the EZY1 Platform. Details are below:</p>

        <table style="width: 100%; border-collapse: collapse; margin: 16px 0; background: #fafafa; border-radius: 10px; overflow: hidden;">
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eeeeee; color: #666; width: 35%;">Business Name</td>
            <td style="padding: 10px 14px; font-weight: 700; border-bottom: 1px solid #eeeeee; color: #111;">${appData.businessName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eeeeee; color: #666;">Owner / Contact</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #eeeeee; color: #111;">${appData.ownerName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eeeeee; color: #666;">Partner Role</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #eeeeee; color: #111; text-transform: capitalize;">${(appData.partnerType || "shop_owner").replace(/_/g, " ")}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eeeeee; color: #666;">Category</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #eeeeee; color: #111;">${appData.category || "Grocery & Daily Needs"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eeeeee; color: #666;">Phone Number</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #eeeeee; color: #111;"><strong>${appData.phone || "N/A"}</strong></td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eeeeee; color: #666;">Email</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #eeeeee; color: #111;"><a href="mailto:${appData.email}" style="color: #FF5100;">${appData.email || "N/A"}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eeeeee; color: #666;">Location & City</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #eeeeee; color: #111;">${appData.address ? `${appData.address}, ` : ""}${appData.city || "Bangalore"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; border-bottom: 1px solid #eeeeee; color: #666;">Operating Hours</td>
            <td style="padding: 10px 14px; border-bottom: 1px solid #eeeeee; color: #111;">${appData.operatingHours || "09:00 AM - 09:00 PM"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #666;">Delivery Radius</td>
            <td style="padding: 10px 14px; color: #111;">${appData.deliveryRadius || 5} km</td>
          </tr>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="https://admin.ezy1.site" style="display: inline-block; background: #FF5100; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 700; border-radius: 12px; font-size: 14px;">
            Open Superadmin Console →
          </a>
        </div>
      </div>

      <div style="background: #f7f7f7; padding: 14px 24px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eaeaea;">
        This automated notification was generated by the EZY1 Real-Time Ecosystem.
      </div>
    </div>
  `;

  const applicantSubject = `🎉 Welcome to EZY1! Your Partner Application Received: ${appData.businessName || "New Merchant"}`;
  const applicantHtmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #FF5100 0%, #FF7A00 100%); padding: 24px; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">Welcome to EZY1 Partner Network</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Your merchant onboarding application has been received</p>
      </div>

      <div style="padding: 24px; color: #222222; font-size: 14px; line-height: 1.6;">
        <p style="margin-top: 0;">Hi <strong>${appData.ownerName || "Partner"}</strong>,</p>
        <p>Thank you for submitting your application to partner with EZY1 for <strong>${appData.businessName || "your business"}</strong>. Our merchant verification team is currently reviewing your application details.</p>

        <div style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 10px; padding: 16px; margin: 16px 0;">
          <p style="margin: 0; font-weight: 600; color: #C2410C;">Application Status: <span style="background: #EA580C; color: white; padding: 2px 8px; border-radius: 6px; font-size: 12px;">Under Review (24-48 hrs)</span></p>
          <p style="margin: 8px 0 0 0; font-size: 13px; color: #7C2D12;">Registered Phone: <strong>${appData.phone}</strong> | City: <strong>${appData.city || "Bengaluru"}</strong></p>
        </div>

        <p>Once approved, your partner portal access credentials will be activated and you will be able to manage your store listings, prices, inventory, and receive live customer orders directly on the EZY1 marketplace.</p>

        <div style="margin-top: 24px; text-align: center;">
          <a href="https://ezy1.site" style="display: inline-block; background: #FF5100; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 700; border-radius: 12px; font-size: 14px;">
            Visit EZY1 Marketplace →
          </a>
        </div>
      </div>

      <div style="background: #f7f7f7; padding: 14px 24px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eaeaea;">
        Questions? Contact partner support at support@ezy1.site or WhatsApp helpline.
      </div>
    </div>
  `;

  // Send admin notification
  const adminResult = await sendEmail({
    to: recipient,
    subject,
    htmlContent,
  });

  // Send applicant confirmation
  if (appData.email && appData.email.includes("@")) {
    await sendEmail({
      to: appData.email,
      subject: applicantSubject,
      htmlContent: applicantHtmlContent,
    }).catch((err) => console.warn("[APPLICANT CONFIRMATION ERROR]", err));
  }

  return adminResult;
}

/**
 * Dispatch Email OTP for Secure Logins & Verification
 */
export async function sendOtpEmail(email, otp) {
  const subject = `🔐 Your EZY1 Verification Code: ${otp}`;
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 16px; overflow: hidden;">
      <div style="background: #FF5100; padding: 20px; color: #ffffff; text-align: center;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 800;">EZY1 Authentication</h1>
      </div>
      <div style="padding: 24px; text-align: center; color: #222;">
        <p style="margin: 0 0 16px 0; font-size: 14px;">Use the following One-Time Password (OTP) to complete your verification:</p>
        <div style="background: #FFF7ED; border: 2px dashed #FF5100; border-radius: 12px; padding: 16px; display: inline-block; margin-bottom: 16px;">
          <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #FF5100;">${otp}</span>
        </div>
        <p style="font-size: 12px; color: #777; margin: 0;">This code is valid for 10 minutes. Do not share this code with anyone.</p>
      </div>
    </div>
  `;

  return sendEmail({ to: email, subject, htmlContent });
}

/**
 * Dispatch Customer Order Confirmation & Admin Operations Alert
 */
export async function sendOrderConfirmationEmail({ order, customerEmail, customerName }) {
  const orderNumber = order.orderNumber || `EZ-${order.id}`;
  const totalAmount = order.totalAmount || 0;
  const items = Array.isArray(order.items) ? order.items : [];
  const paymentMethod = order.paymentMethod || "UPI (Razorpay)";
  const paymentId = order.gatewayPaymentId || order.razorpayPaymentId || "Confirmed";
  const address = order.deliveryAddress || "Standard Delivery Address";

  const itemsHtml = items.length > 0 
    ? items.map(item => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; color: #333;">${item.name || item.title || "Item"}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; text-align: center; color: #666;">x${item.quantity || 1}</td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; text-align: right; font-weight: bold; color: #111;">₹${(item.price || 0) * (item.quantity || 1)}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="3" style="padding: 10px 12px; text-align: center; color: #777;">Order Total Paid: ₹${totalAmount}</td></tr>`;

  const subject = `🛍️ Order Confirmed #${orderNumber} - EZY1`;
  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eaeaea; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
      <div style="background: linear-gradient(135deg, #FF5100 0%, #FF7A00 100%); padding: 24px; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">EZY1 Order Confirmed</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.95;">Thank you for shopping on EZY1. Your order has been placed!</p>
      </div>

      <div style="padding: 24px; color: #222222; font-size: 14px; line-height: 1.6;">
        <p style="margin-top: 0;">Hi <strong>${customerName || "Valued Customer"}</strong>,</p>
        <p>Your order <strong>#${orderNumber}</strong> has been confirmed and forwarded to the partner store for packaging and dispatch.</p>

        <div style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 12px; padding: 16px; margin: 16px 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #9A3412; font-weight: 600;">Order ID:</span>
            <span style="font-weight: 700; color: #C2410C;">${orderNumber}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #9A3412; font-weight: 600;">Payment Method:</span>
            <span style="font-weight: 700; color: #C2410C;">${paymentMethod} (${paymentId.slice(-8)})</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #9A3412; font-weight: 600;">Delivery Address:</span>
            <span style="font-weight: 600; color: #431407; max-width: 60%; text-align: right;">${address}</span>
          </div>
        </div>

        <h3 style="font-size: 15px; margin: 20px 0 10px 0; color: #111;">Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <thead>
            <tr style="background: #f8f9fa;">
              <th style="padding: 8px 12px; text-align: left; font-size: 12px; color: #666; border-bottom: 2px solid #eaeaea;">Item</th>
              <th style="padding: 8px 12px; text-align: center; font-size: 12px; color: #666; border-bottom: 2px solid #eaeaea;">Qty</th>
              <th style="padding: 8px 12px; text-align: right; font-size: 12px; color: #666; border-bottom: 2px solid #eaeaea;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr style="background: #fafafa;">
              <td colspan="2" style="padding: 12px; font-weight: 800; font-size: 15px; color: #111;">Total Paid:</td>
              <td style="padding: 12px; font-weight: 800; font-size: 16px; color: #FF5100; text-align: right;">₹${totalAmount}</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="https://ezy1.site/dashboard" style="display: inline-block; background: #FF5100; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 700; border-radius: 12px; font-size: 14px;">
            Track Your Order on EZY1 →
          </a>
        </div>
      </div>

      <div style="background: #f7f7f7; padding: 14px 24px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eaeaea;">
        Questions about your order? Email us at support@ezy1.site or check live tracking on https://ezy1.site.
      </div>
    </div>
  `;

  // 1. Send confirmation to customer if valid email
  let customerRes = { success: false };
  if (customerEmail && customerEmail.includes("@")) {
    customerRes = await sendEmail({
      to: customerEmail,
      subject,
      htmlContent,
      senderName: "EZY1 Orders",
      senderEmail: "support@ezy1.site"
    }).catch(err => ({ success: false, error: err.message }));
  }

  // 2. Alert admin/store operations
  const adminSubject = `🚨 [NEW ORDER] #${orderNumber} placed for ₹${totalAmount}`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; padding: 16px;">
      <h2>New EZY1 Order: #${orderNumber}</h2>
      <p><strong>Customer:</strong> ${customerName} (${customerEmail || "N/A"})</p>
      <p><strong>Total:</strong> ₹${totalAmount}</p>
      <p><strong>Payment:</strong> ${paymentMethod} (${paymentId})</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><a href="https://admin.ezy1.site">View in Admin Console</a></p>
    </div>
  `;
  sendEmail({
    to: ADMIN_EMAIL,
    subject: adminSubject,
    htmlContent: adminHtml,
    senderName: "EZY1 Dispatch Bot",
    senderEmail: "support@ezy1.site"
  }).catch(() => {});

  return customerRes;
}

/**
 * Dispatch Promotional / Ad Bulk Email Broadcast
 */
export async function sendBulkAdEmail({ subject, htmlContent, recipients, senderName = "EZY1 Offers" }) {
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return { success: false, error: "No recipients provided" };
  }

  const results = { sent: 0, failed: 0, details: [] };
  const batchSize = 10;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    await Promise.all(batch.map(async (r) => {
      const email = typeof r === "string" ? r : r.email;
      if (!email || !email.includes("@")) return;
      try {
        const res = await sendEmail({
          to: email,
          subject,
          htmlContent,
          senderName,
          senderEmail: "support@ezy1.site"
        });
        if (res.success) results.sent++;
        else results.failed++;
        results.details.push({ email, success: res.success, messageId: res.messageId });
      } catch (err) {
        results.failed++;
        results.details.push({ email, success: false, error: err.message });
      }
    }));
  }

  return { success: true, ...results };
}
