import nodemailer from "nodemailer";
import { ENV } from "../config/env.config.js";
import * as templates from "../templates/email.templates.js";
import { execute } from "../repositories/database.adapter.js";

export const SENDER_IDENTITIES = {
  SUPPORT: {
    email: "support@ezy1.site",
    name: "EZY1 Support",
    replyTo: "support@ezy1.site",
  },
  ORDERS: {
    email: "orders@ezy1.site",
    name: "EZY1 Orders",
    replyTo: "orders@ezy1.site",
  },
  NOREPLY: {
    email: "no-reply@ezy1.site",
    name: "EZY1",
    replyTo: undefined,
  },
  ADMIN: {
    email: "admin@ezy1.site",
    name: "EZY1 Admin",
    replyTo: "admin@ezy1.site",
  },
};

export interface EmailLogEntry {
  id: string;
  eventId?: string;
  type: string;
  recipient: string;
  sender: string;
  subject: string;
  relatedUserId?: number | null;
  relatedOrderId?: number | null;
  brevoMessageId?: string | null;
  status: "delivered" | "queued" | "failed";
  timestamp: string;
}

const idempotencyCache = new Map<string, { timestamp: number; messageId: string }>();
const inMemoryEmailLogs: EmailLogEntry[] = [];

let transporter: nodemailer.Transporter | null = null;
function getTransporter(): nodemailer.Transporter | null {
  if (transporter) return transporter;
  const host = ENV.SMTP_HOST || "smtp-relay.brevo.com";
  const port = Number(ENV.SMTP_PORT) || 587;
  const user = ENV.SMTP_USER || "anyanant7115@gmail.com";
  const pass = ENV.SMTP_PASS;

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

export function getSenderForType(type = "") {
  const upper = type.toUpperCase();
  if (upper.includes("OTP") || upper.includes("VERIF") || upper.includes("RESET") || upper.includes("PASSWORD")) {
    return SENDER_IDENTITIES.NOREPLY;
  }
  if (upper.includes("ORDER") || upper.includes("PAYMENT") || upper.includes("INVOICE") || upper.includes("BOOKING") || upper.includes("REFUND")) {
    return SENDER_IDENTITIES.ORDERS;
  }
  if (upper.includes("SUPPORT") || upper.includes("TICKET") || upper.includes("FEEDBACK") || upper.includes("COMPLAINT")) {
    return SENDER_IDENTITIES.SUPPORT;
  }
  return SENDER_IDENTITIES.ADMIN;
}

function recordEmailLog(entry: EmailLogEntry) {
  inMemoryEmailLogs.unshift(entry);
  if (inMemoryEmailLogs.length > 500) {
    inMemoryEmailLogs.pop();
  }
}

export const emailService = {
  async sendEmail(options: {
    to: string | string[];
    subject: string;
    htmlContent: string;
    type?: string;
    idempotencyKey?: string;
    replyTo?: string;
    senderName?: string;
    senderEmail?: string;
    relatedUserId?: number | null;
    relatedOrderId?: number | null;
  }) {
    const {
      to,
      subject,
      htmlContent,
      type = "GENERAL",
      idempotencyKey,
      replyTo,
      senderName,
      senderEmail,
      relatedUserId,
      relatedOrderId
    } = options;

    const recipientsList = Array.isArray(to) ? to : [to];
    const cleanRecipients = recipientsList
      .map(r => String(r || "").trim())
      .filter(e => e && e.includes("@"));

    if (cleanRecipients.length === 0) {
      console.warn("[EMAIL WARN] No valid recipients provided for subject:", subject);
      return { success: false, error: "No valid recipient email address" };
    }

    // 1. Idempotency Check
    const key = idempotencyKey || `${type}_${cleanRecipients.sort().join(",")}_${subject}`;
    if (idempotencyCache.has(key)) {
      const cached = idempotencyCache.get(key)!;
      if (Date.now() - cached.timestamp < 10 * 60 * 1000) {
        console.log(`[EMAIL IDEMPOTENT] Suppressed duplicate email for key: "${key}"`);
        return { success: true, duplicate: true, messageId: cached.messageId };
      }
    }

    // 2. Sender Identity
    const resolvedIdentity = getSenderForType(type);
    const activeSenderName = senderName || resolvedIdentity.name;
    const activeSenderEmail = senderEmail || resolvedIdentity.email;
    const activeReplyTo = replyTo !== undefined ? replyTo : resolvedIdentity.replyTo;

    const logRecord: EmailLogEntry = {
      id: `eml_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      eventId: key,
      type,
      recipient: cleanRecipients.join(", "),
      sender: activeSenderEmail,
      subject,
      relatedUserId: relatedUserId || null,
      relatedOrderId: relatedOrderId || null,
      brevoMessageId: null,
      status: "queued",
      timestamp: new Date().toISOString(),
    };

    // 3. Primary Dispatch Engine: Brevo REST API v3 (HTTPS port 443)
    const brevoApiKey = ENV.BREVO_API_KEY;
    if (brevoApiKey) {
      try {
        const payload: any = {
          sender: { name: activeSenderName, email: activeSenderEmail },
          to: cleanRecipients.map(r => ({ email: r })),
          subject,
          htmlContent,
        };
        if (activeReplyTo) {
          payload.replyTo = { email: activeReplyTo, name: activeSenderName };
        }

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": brevoApiKey,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data: any = await response.json().catch(() => ({}));

        if (response.ok && (data?.messageId || response.status === 201)) {
          const msgId = data.messageId || `msg_${Date.now()}`;
          console.log(`[BREVO API SUCCESS] Dispatched to ${cleanRecipients.join(", ")} | MessageId: ${msgId}`);
          logRecord.status = "delivered";
          logRecord.brevoMessageId = msgId;
          idempotencyCache.set(key, { timestamp: Date.now(), messageId: msgId });
          recordEmailLog(logRecord);
          return { success: true, messageId: msgId, provider: "brevo_rest" };
        } else {
          console.warn("[BREVO API NON-200]", response.status, data);
        }
      } catch (err: any) {
        console.warn("[BREVO API ERROR]", err.message);
      }
    }

    // 4. Secondary Dispatch Engine: Brevo SMTP Relay
    const activeTransporter = getTransporter();
    if (activeTransporter) {
      try {
        const mailOptions: any = {
          from: `"${activeSenderName}" <${activeSenderEmail}>`,
          to: cleanRecipients.join(", "),
          subject,
          html: htmlContent,
        };
        if (activeReplyTo) {
          mailOptions.replyTo = activeReplyTo;
        }

        const info = await activeTransporter.sendMail(mailOptions);
        console.log(`[BREVO SMTP SUCCESS] Delivered to ${cleanRecipients.join(", ")} | MessageId: ${info.messageId}`);
        logRecord.status = "delivered";
        logRecord.brevoMessageId = info.messageId;
        idempotencyCache.set(key, { timestamp: Date.now(), messageId: info.messageId });
        recordEmailLog(logRecord);
        return { success: true, messageId: info.messageId, provider: "brevo_smtp" };
      } catch (smtpErr: any) {
        console.warn("[BREVO SMTP ERROR]", smtpErr.message);
      }
    }

    // 5. Fallback Diagnostic Logging
    logRecord.status = "queued";
    idempotencyCache.set(key, { timestamp: Date.now(), messageId: logRecord.id });
    recordEmailLog(logRecord);
    console.log(`[EMAIL QUEUED] Email logged in memory for ${cleanRecipients.join(", ")}: "${subject}"`);
    return { success: true, queued: true, messageId: logRecord.id };
  },

  async sendOrderConfirmationEmail(params: {
    order: any;
    customerEmail?: string;
    customerName?: string;
  }) {
    const { order, customerEmail, customerName } = params;
    const orderNumber = order.orderNumber || (order.id ? `ORD-2026-${String(order.id).padStart(5, "0")}` : "ORD-2026");
    const totalAmount = order.totalAmount || 0;
    const targetEmail = customerEmail || order.customerEmail;
    const targetName = customerName || order.customerName || "Valued Customer";

    const subject = `🛍️ Order Confirmed #${orderNumber} - EZY1`;
    const htmlContent = templates.tplOrderConfirmation({ order, customerName: targetName });

    let customerRes: any = { success: false, note: "No customer email provided" };
    if (targetEmail && targetEmail.includes("@")) {
      customerRes = await this.sendEmail({
        to: targetEmail,
        subject,
        htmlContent,
        type: "ORDER_CONFIRMATION",
        relatedOrderId: order.id,
        idempotencyKey: `order_confirm_${order.id || orderNumber}`,
      });
    }

    // Alert Admin Operations
    const adminEmail = ENV.ADMIN_NOTIFICATION_EMAIL || "anyanant7115@gmail.com";
    if (adminEmail) {
      this.sendEmail({
        to: adminEmail,
        subject: `🚨 [NEW ORDER] #${orderNumber} placed for ₹${Number(totalAmount).toFixed(2)}`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 16px;">
            <h2>New EZY1 Order: #${orderNumber}</h2>
            <p><strong>Customer:</strong> ${targetName} (${targetEmail || "N/A"})</p>
            <p><strong>Total:</strong> ₹${Number(totalAmount).toFixed(2)}</p>
            <p><strong>Payment:</strong> ${order.paymentMethod || "UPI / Razorpay"}</p>
            <p><strong>Address:</strong> ${typeof order.deliveryAddress === "object" ? (order.deliveryAddress.formattedAddress || order.deliveryAddress.street) : (order.deliveryAddress || "N/A")}</p>
            <p><a href="https://admin.ezy1.site" style="color: #FF5100; font-weight: bold;">View in Admin Console →</a></p>
          </div>
        `,
        type: "NEW_ORDER_ALERT",
        relatedOrderId: order.id,
        idempotencyKey: `admin_order_alert_${order.id || orderNumber}`,
      }).catch(err => console.warn("[ADMIN ORDER ALERT EMAIL WARN]", err));
    }

    return customerRes;
  },

  async sendOtpEmail(email: string, otp: string, name?: string) {
    const subject = `🔐 Your EZY1 Verification Code: ${otp}`;
    const htmlContent = templates.tplLoginOtp({ name, otp });
    return this.sendEmail({
      to: email,
      subject,
      htmlContent,
      type: "AUTH_OTP",
      idempotencyKey: `otp_${email}_${otp}`,
    });
  },

  async sendEmailVerificationOtp(email: string, otp: string, name?: string) {
    const subject = `🔐 Verify Your EZY1 Account: ${otp}`;
    const htmlContent = templates.tplEmailVerification({ name, otp });
    return this.sendEmail({
      to: email,
      subject,
      htmlContent,
      type: "EMAIL_VERIFICATION",
      idempotencyKey: `email_verif_${email}_${otp}`,
    });
  },

  async sendPasswordResetEmail(email: string, otp: string, name?: string) {
    const subject = `🔑 Reset Your EZY1 Password: ${otp}`;
    const htmlContent = templates.tplPasswordReset({ name, otp });
    return this.sendEmail({
      to: email,
      subject,
      htmlContent,
      type: "PASSWORD_RESET",
      idempotencyKey: `pwd_reset_${email}_${otp}`,
    });
  },

  async sendBookingConfirmationEmail(params: {
    booking: any;
    customerEmail?: string;
    customerName?: string;
  }) {
    const { booking, customerEmail, customerName } = params;
    const targetEmail = customerEmail || booking.customerEmail;
    const targetName = customerName || booking.customerName || "Valued Customer";
    const title = booking.title || booking.serviceName || booking.doctorName || "Super-App Booking";

    if (!targetEmail || !targetEmail.includes("@")) {
      return { success: false, note: "No target email" };
    }

    const subject = `🎉 Booking Confirmed: ${title} - EZY1`;
    const htmlContent = templates.tplBookingConfirmed({ booking, customerName: targetName });
    return this.sendEmail({
      to: targetEmail,
      subject,
      htmlContent,
      type: "BOOKING_CONFIRMATION",
      idempotencyKey: `booking_${booking.id || Date.now()}`,
    });
  },

  async sendPartnerApplicationEmail(appData: {
    businessName: string;
    ownerName: string;
    phone: string;
    email: string;
  }) {
    if (appData.email && appData.email.includes("@")) {
      await this.sendEmail({
        to: appData.email,
        subject: `🎉 Application Received: ${appData.businessName} - EZY1`,
        htmlContent: templates.tplPartnerApplicationReceived(appData),
        type: "PARTNER_APPLICATION",
        idempotencyKey: `partner_app_${appData.email}`,
      }).catch(() => {});
    }

    const adminEmail = ENV.ADMIN_NOTIFICATION_EMAIL || "anyanant7115@gmail.com";
    return this.sendEmail({
      to: adminEmail,
      subject: `⚡ [EZY1 Partner Alert] New Application: ${appData.businessName}`,
      htmlContent: `
        <h2>New Partner Registration Application</h2>
        <p><strong>Business:</strong> ${appData.businessName}</p>
        <p><strong>Owner:</strong> ${appData.ownerName}</p>
        <p><strong>Phone:</strong> ${appData.phone}</p>
        <p><strong>Email:</strong> ${appData.email}</p>
      `,
      type: "NEW_PARTNER_ALERT",
      idempotencyKey: `partner_admin_${appData.email}`,
    });
  },

  getEmailLogs(filter: { type?: string; status?: string; limit?: number } = {}) {
    let list = inMemoryEmailLogs;
    if (filter.type) list = list.filter(l => l.type.toLowerCase() === filter.type!.toLowerCase());
    if (filter.status) list = list.filter(l => l.status.toLowerCase() === filter.status!.toLowerCase());
    return list.slice(0, Number(filter.limit || 50));
  }
};
