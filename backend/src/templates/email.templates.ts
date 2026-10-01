/**
 * EZY1 Production Email Template System (TypeScript)
 * Responsive, mobile-optimized HTML email templates for transactional,
 * operational, partner, support, and marketing communication.
 */

const LOGO_URL = "https://ezy1.site/android-chrome-192x192.png";
const BASE_URL = process.env.VITE_FRONTEND_URL || "https://ezy1.site";

interface WrapLayoutOptions {
  title?: string;
  previewText?: string;
  content: string;
  unsubscribeUrl?: string;
  showHeader?: boolean;
  footerText?: string;
}

export function wrapLayout({ title, previewText, content, unsubscribeUrl, showHeader = true }: WrapLayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || "EZY1"}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f6f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
    .container { max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
    .header { background: linear-gradient(135deg, #FF5100 0%, #FF7A00 100%); padding: 28px 24px; text-align: center; color: #ffffff; }
    .header img { width: 56px; height: 56px; border-radius: 14px; margin-bottom: 8px; vertical-align: middle; border: 2px solid rgba(255,255,255,0.4); display: block; margin-left: auto; margin-right: auto; }
    .content { padding: 32px 24px; color: #1f2937; line-height: 1.6; font-size: 14px; }
    .footer { background-color: #f9fafb; padding: 20px 24px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #f3f4f6; }
    .button { display: inline-block; background-color: #FF5100; color: #ffffff !important; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px; margin-top: 16px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .badge-success { background-color: #ecfdf5; color: #059669; }
    .badge-warning { background-color: #fffbeb; color: #d97706; }
    .badge-danger { background-color: #fef2f2; color: #dc2626; }
    table { width: 100%; border-collapse: collapse; }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${previewText}</div>` : ""}
  <div class="container">
    ${showHeader ? `
    <div class="header">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="text-align: center;">
            <a href="${BASE_URL}" style="text-decoration: none; display: inline-block;">
              <img src="${LOGO_URL}" width="56" height="56" alt="EZY1 Logo" />
              <div style="color: #ffffff; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; line-height: 1.2;">
                <span>ezy</span><span style="color: #FFD700;">1</span>
              </div>
            </a>
            <div style="color: rgba(255,255,255,0.92); font-size: 13px; font-weight: 600; margin-top: 4px; letter-spacing: 0.2px;">
              Local Super App for Everything
            </div>
            ${title ? `<div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 17px; font-weight: 700; color: #ffffff;">${title}</div>` : ""}
          </td>
        </tr>
      </table>
    </div>` : ""}
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0; font-weight: 700; color: #374151;">EZY1 Platform Technologies Pvt. Ltd.</p>
      <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 11px;">Local Super App for Everything — Daily Essentials, Groceries, Medicines, Transport &amp; Home Services</p>
      <p style="margin: 0 0 8px 0;">Official Platform: <a href="${BASE_URL}" style="color: #FF5100; text-decoration: none; font-weight: 600;">https://ezy1.site</a> | Support: <a href="mailto:support@ezy1.site" style="color: #FF5100; text-decoration: none; font-weight: 600;">support@ezy1.site</a></p>
      <p style="margin: 0; color: #9ca3af; font-size: 11px;">Official Notice: EZY1 never requests your banking PIN, OTP, or CVV. All transactions are securely processed via certified RBI-compliant gateways.</p>
      ${unsubscribeUrl ? `<p style="margin-top: 8px;"><a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe from marketing emails</a></p>` : ""}
    </div>
  </div>
</body>
</html>`;
}

export function tplOrderConfirmation(data: any = {}): string {
  const ord = data.order || data;
  const customerName = data.customerName || ord.customerName || "Valued Customer";
  const orderNumber = ord.orderNumber || ord.orderId || (ord.id ? `EZ-${ord.id}` : "EZ-ORD");
  const totalAmount = ord.totalAmount || ord.amount || 0;
  const items = Array.isArray(ord.items) ? ord.items : [];
  const paymentMethod = ord.paymentMethod || "UPI / Razorpay";
  const address = ord.deliveryAddress || ord.address || "Customer Delivery Address";

  const itemsRows = items.map((i: any) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6;">${i.name || i.title || "Item"}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">x${i.quantity || 1}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: bold;">₹${(Number(i.price || i.unitPrice || 0) * Number(i.quantity || 1)).toFixed(2)}</td>
    </tr>
  `).join("");

  const content = `
    <p>Hi <strong>${customerName}</strong>,</p>
    <p>Your order <strong>#${orderNumber}</strong> has been successfully placed and forwarded to the partner store for packaging and dispatch.</p>
    
    <div style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <table style="width: 100%;">
        <tr>
          <td style="color: #9A3412; font-weight: 600; padding: 4px 0;">Order Reference:</td>
          <td style="text-align: right; font-weight: bold; color: #C2410C; padding: 4px 0;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="color: #9A3412; font-weight: 600; padding: 4px 0;">Payment Method:</td>
          <td style="text-align: right; padding: 4px 0;"><span class="badge badge-success">${paymentMethod}</span></td>
        </tr>
        <tr>
          <td style="color: #9A3412; font-weight: 600; padding: 4px 0;">Delivery Address:</td>
          <td style="text-align: right; font-weight: 600; color: #431407; padding: 4px 0;">${typeof address === "object" ? (address.formattedAddress || address.street || "Bengaluru") : address}</td>
        </tr>
      </table>
    </div>

    <h3 style="font-size: 14px; margin: 20px 0 10px 0; color: #111;">Items Ordered</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
      <thead>
        <tr style="background: #f9fafb; font-size: 12px; color: #6b7280;">
          <th style="padding: 8px 12px; text-align: left;">Item</th>
          <th style="padding: 8px 12px; text-align: center;">Qty</th>
          <th style="padding: 8px 12px; text-align: right;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows || `<tr><td colspan="3" style="padding: 10px 12px; text-align: center; color: #6b7280;">Standard Super-App Items</td></tr>`}
        <tr style="background: #f9fafb;">
          <td colspan="2" style="padding: 12px; font-weight: 800; font-size: 15px;">Total Amount:</td>
          <td style="padding: 12px; font-weight: 800; font-size: 16px; color: #FF5100; text-align: right;">₹${Number(totalAmount).toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/my-orders" class="button">Track Order on EZY1 →</a>
    </div>
  `;
  return wrapLayout({ title: "Order Confirmed!", previewText: `Order #${orderNumber} placed for ₹${Number(totalAmount).toFixed(2)}`, content });
}

export function tplBookingConfirmed(data: any = {}): string {
  const booking = data.booking || data;
  const customerName = data.customerName || booking.customerName || "Valued Customer";
  const title = booking.title || booking.serviceName || booking.hotelName || booking.doctorName || "Super-App Booking";
  const refId = booking.orderNumber || (booking.id ? `EZY-BK-${String(booking.id).padStart(4, "0")}` : "Confirmed");
  const amount = Number(booking.amount || booking.totalAmount || 0).toFixed(2);

  const content = `
    <p>Hi <strong>${customerName}</strong>,</p>
    <p>Your booking for <strong>${title}</strong> has been successfully confirmed.</p>
    <div style="background: #ECFDF5; border: 1px solid #D1FAE5; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #065F46;"><strong>Booking Ref:</strong> ${refId}</p>
      ${booking.date ? `<p style="margin: 6px 0 0 0; color: #047857;"><strong>Date:</strong> ${booking.date}</p>` : ""}
      ${booking.time ? `<p style="margin: 6px 0 0 0; color: #047857;"><strong>Time:</strong> ${booking.time}</p>` : ""}
      <p style="margin: 6px 0 0 0; color: #047857;"><strong>Total Paid:</strong> ₹${amount}</p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/my-bookings" class="button">View Booking Details →</a>
    </div>
  `;
  return wrapLayout({ title: "Booking Confirmed 🎉", previewText: `Your booking for ${title} is confirmed`, content });
}

export function tplLoginOtp({ name, otp }: { name?: string; otp: string }): string {
  const content = `
    <p>Hi <strong>${name || "User"}</strong>,</p>
    <p>A login request was initiated for your EZY1 account. Enter the verification code below to securely sign in:</p>
    <div style="text-align: center; margin: 24px 0;">
      <div style="background: #FFF7ED; border: 2px dashed #FF5100; border-radius: 12px; padding: 18px 24px; display: inline-block;">
        <span style="font-size: 34px; font-weight: 900; letter-spacing: 6px; color: #FF5100; font-family: monospace;">${otp}</span>
      </div>
    </div>
    <p style="font-size: 12px; color: #6b7280; text-align: center;">Valid for <strong>10 minutes</strong>. If you did not request this code, please ignore this email or contact <a href="mailto:support@ezy1.site" style="color:#FF5100;">support@ezy1.site</a>.</p>
  `;
  return wrapLayout({ title: "EZY1 Secure Verification Code", previewText: `Your verification code is ${otp}`, content });
}

export function tplPartnerApplicationReceived(data: { businessName?: string; ownerName?: string; phone?: string; email?: string }): string {
  const content = `
    <p>Hi <strong>${data.ownerName || "Partner"}</strong>,</p>
    <p>Thank you for submitting your partner registration application for <strong>${data.businessName || "Your Business"}</strong> on the EZY1 ecosystem.</p>
    <div style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #C2410C;"><strong>Status:</strong> Under Review (24-48 hours)</p>
      <p style="margin: 6px 0 0 0; color: #7C2D12;">Registered Phone: <strong>${data.phone || "N/A"}</strong></p>
      <p style="margin: 6px 0 0 0; color: #7C2D12;">Email: <strong>${data.email || "N/A"}</strong></p>
    </div>
    <p>Our merchant operations team is reviewing your documents. You will receive an activation email as soon as verification is complete.</p>
  `;
  return wrapLayout({ title: "Partner Application Received", previewText: `Application received for ${data.businessName}`, content });
}

export function tplEmailVerification({ name, otp }: { name?: string; otp: string }): string {
  const content = `
    <p>Hi <strong>${name || "Valued User"}</strong>,</p>
    <p>Welcome to <strong>EZY1</strong> — your local Super App for daily essentials, healthcare, transport &amp; on-demand home services.</p>
    <p>Please enter the 6-digit security code below to verify your email address and activate your persistent user account:</p>
    <div style="text-align: center; margin: 28px 0;">
      <div style="background: #FFF7ED; border: 2px dashed #FF5100; border-radius: 14px; padding: 20px 32px; display: inline-block;">
        <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #FF5100; font-family: monospace;">${otp}</span>
      </div>
    </div>
    <div style="background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 10px; padding: 12px 16px; margin: 20px 0; font-size: 12px; color: #4B5563;">
      <p style="margin: 0;">⏱️ This verification code is valid for <strong>5 minutes</strong>.</p>
      <p style="margin: 4px 0 0 0;">🔒 Never share this code with anyone. EZY1 representatives will never ask for your OTP or password.</p>
    </div>
    <p style="font-size: 12px; color: #6b7280; text-align: center;">If you did not create an account on EZY1, please ignore this email or reach us at <a href="mailto:support@ezy1.site" style="color:#FF5100;">support@ezy1.site</a>.</p>
  `;
  return wrapLayout({ title: "Verify Your EZY1 Account", previewText: `Your verification code is ${otp}`, content });
}

export function tplPasswordReset({ name, otp }: { name?: string; otp: string }): string {
  const content = `
    <p>Hi <strong>${name || "Valued User"}</strong>,</p>
    <p>We received a request to reset the password for your <strong>EZY1</strong> account.</p>
    <p>Enter the 6-digit password recovery code below to choose a new password:</p>
    <div style="text-align: center; margin: 28px 0;">
      <div style="background: #FEF2F2; border: 2px dashed #DC2626; border-radius: 14px; padding: 20px 32px; display: inline-block;">
        <span style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #DC2626; font-family: monospace;">${otp}</span>
      </div>
    </div>
    <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 10px; padding: 12px 16px; margin: 20px 0; font-size: 12px; color: #92400E;">
      <p style="margin: 0; font-weight: bold;">⚠️ Security Notice:</p>
      <p style="margin: 4px 0 0 0;">This password reset code expires in <strong>5 minutes</strong>. If you did not request a password reset, someone may have entered your email by mistake. Your account remains secure and no changes have been made.</p>
    </div>
    <p style="font-size: 12px; color: #6b7280; text-align: center;">Need assistance? Contact our 24/7 security team at <a href="mailto:support@ezy1.site" style="color:#FF5100;">support@ezy1.site</a>.</p>
  `;
  return wrapLayout({ title: "Password Reset Request", previewText: `Your password recovery code is ${otp}`, content });
}

