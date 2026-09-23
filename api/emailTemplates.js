/**
 * EZY1 Production Email Template System
 * Responsive, mobile-optimized HTML email templates for all transactional,
 * operational, partner, support, and marketing communication.
 */

const LOGO_URL = "https://ezy1.site/android-chrome-192x192.png";
const BASE_URL = process.env.VITE_FRONTEND_URL || "https://ezy1.site";

function wrapLayout({ title, previewText, content, unsubscribeUrl, showHeader = true, footerText }) {
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
    .header img { width: 48px; height: 48px; border-radius: 10px; margin-bottom: 8px; vertical-align: middle; }
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
      <img src="${LOGO_URL}" alt="EZY1 Logo">
      <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">${title}</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.95; color: #ffffff;">Everything You Need, One Platform</p>
    </div>` : ""}
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p style="margin: 0 0 8px 0;"><strong>EZY1 Platform Technologies Pvt. Ltd.</strong></p>
      <p style="margin: 0 0 8px 0;">Official Platform: <a href="${BASE_URL}" style="color: #FF5100; text-decoration: none;">https://ezy1.site</a> | Support: <a href="mailto:support@ezy1.site" style="color: #FF5100; text-decoration: none;">support@ezy1.site</a></p>
      ${footerText ? `<p style="margin: 8px 0 0 0; font-size: 11px; color: #9ca3af;">${footerText}</p>` : ""}
      ${unsubscribeUrl ? `<p style="margin: 10px 0 0 0; font-size: 11px;"><a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">Unsubscribe from marketing emails</a></p>` : ""}
    </div>
  </div>
</body>
</html>`;
}

// ----------------------------------------------------
// 1. AUTHENTICATION & SECURITY TEMPLATES
// ----------------------------------------------------

export function tplSignupOtp({ name, otp }) {
  const content = `
    <p>Hi <strong>${name || "there"}</strong>,</p>
    <p>Thank you for signing up for EZY1. Please use the following One-Time Password (OTP) to complete your account registration:</p>
    <div style="text-align: center; margin: 24px 0;">
      <div style="background: #FFF7ED; border: 2px dashed #FF5100; border-radius: 12px; padding: 18px 24px; display: inline-block;">
        <span style="font-size: 34px; font-weight: 900; letter-spacing: 6px; color: #FF5100; font-family: monospace;">${otp}</span>
      </div>
    </div>
    <p style="font-size: 12px; color: #6b7280; text-align: center;">This code will expire in <strong>5 minutes</strong>. Never share this code with anyone.</p>
  `;
  return wrapLayout({ title: "Verify Your EZY1 Account", previewText: `Your EZY1 signup code is ${otp}`, content });
}

export function tplLoginOtp({ name, otp }) {
  const content = `
    <p>Hi <strong>${name || "User"}</strong>,</p>
    <p>A login request was initiated for your EZY1 account. Enter the verification code below to securely sign in:</p>
    <div style="text-align: center; margin: 24px 0;">
      <div style="background: #FFF7ED; border: 2px dashed #FF5100; border-radius: 12px; padding: 18px 24px; display: inline-block;">
        <span style="font-size: 34px; font-weight: 900; letter-spacing: 6px; color: #FF5100; font-family: monospace;">${otp}</span>
      </div>
    </div>
    <p style="font-size: 12px; color: #6b7280; text-align: center;">Valid for <strong>5 minutes</strong>. If you did not request this login, please contact <a href="mailto:support@ezy1.site" style="color:#FF5100;">support@ezy1.site</a> immediately.</p>
  `;
  return wrapLayout({ title: "EZY1 Secure Login Code", previewText: `Your login code is ${otp}`, content });
}

export function tplPasswordResetOtp({ name, otp }) {
  const content = `
    <p>Hi <strong>${name || "User"}</strong>,</p>
    <p>We received a request to reset your password. Use the verification code below to set a new password:</p>
    <div style="text-align: center; margin: 24px 0;">
      <div style="background: #FFF7ED; border: 2px dashed #FF5100; border-radius: 12px; padding: 18px 24px; display: inline-block;">
        <span style="font-size: 34px; font-weight: 900; letter-spacing: 6px; color: #FF5100; font-family: monospace;">${otp}</span>
      </div>
    </div>
    <p style="font-size: 12px; color: #6b7280; text-align: center;">Valid for <strong>5 minutes</strong>. If you didn't request a password reset, you can safely ignore this email.</p>
  `;
  return wrapLayout({ title: "Reset Your Password", previewText: `Your password reset code is ${otp}`, content });
}

export function tplAccountCreated({ name, username, email }) {
  const content = `
    <p>Hi <strong>${name}</strong>,</p>
    <p>Welcome to <strong>EZY1</strong> — your all-in-one destination for instant groceries, healthcare bookings, transport, and home services.</p>
    <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
      <p style="margin: 0 0 8px 0;"><strong>Username:</strong> ${username}</p>
      <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}" class="button">Explore Marketplace →</a>
    </div>
  `;
  return wrapLayout({ title: "Welcome to EZY1!", previewText: "Your EZY1 account is now active", content });
}

// ----------------------------------------------------
// 2. ORDER & PAYMENT TEMPLATES
// ----------------------------------------------------

export function tplOrderConfirmation(data = {}) {
  const ord = data.order || data;
  const customerName = data.customerName || ord.customerName || "Valued Customer";
  const orderNumber = ord.orderNumber || ord.orderId || (ord.id ? `EZ-${ord.id}` : "EZ-ORD");
  const totalAmount = ord.totalAmount || ord.amount || 0;
  const items = Array.isArray(ord.items) ? ord.items : [];
  const paymentMethod = ord.paymentMethod || "UPI / Razorpay";
  const address = ord.deliveryAddress || ord.address || "Standard Address";

  const itemsRows = items.map((i) => `
    <tr>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6;">${i.name || i.title || "Item"}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; text-align: center;">x${i.quantity || 1}</td>
      <td style="padding: 10px 12px; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: bold;">₹${(i.price || 0) * (i.quantity || 1)}</td>
    </tr>
  `).join("");

  const content = `
    <p>Hi <strong>${customerName || "Valued Customer"}</strong>,</p>
    <p>Your order <strong>#${orderNumber}</strong> has been confirmed and forwarded to the partner store for packaging and dispatch.</p>
    
    <div style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <table style="width: 100%;">
        <tr>
          <td style="color: #9A3412; font-weight: 600;">Order ID:</td>
          <td style="text-align: right; font-weight: bold; color: #C2410C;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="color: #9A3412; font-weight: 600;">Payment Status:</td>
          <td style="text-align: right;"><span class="badge badge-success">PAID (${paymentMethod})</span></td>
        </tr>
        <tr>
          <td style="color: #9A3412; font-weight: 600;">Delivery Address:</td>
          <td style="text-align: right; font-weight: 600; color: #431407;">${address}</td>
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
        ${itemsRows}
        <tr style="background: #f9fafb;">
          <td colspan="2" style="padding: 12px; font-weight: 800; font-size: 15px;">Total Paid:</td>
          <td style="padding: 12px; font-weight: 800; font-size: 16px; color: #FF5100; text-align: right;">₹${totalAmount}</td>
        </tr>
      </tbody>
    </table>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/dashboard" class="button">Track Order on Dashboard →</a>
    </div>
  `;
  return wrapLayout({ title: "Order Confirmed!", previewText: `Order #${orderNumber} placed for ₹${totalAmount}`, content });
}

export function tplPaymentFailed({ orderId, amount, reason, retryUrl, customerName }) {
  const content = `
    <p>Hi <strong>${customerName || "Customer"}</strong>,</p>
    <p>We were unable to process your payment for Order <strong>#${orderId || "Pending"}</strong>.</p>
    <div style="background: #FEF2F2; border: 1px solid #FEE2E2; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #991B1B;"><strong>Amount:</strong> ₹${amount || 0}</p>
      <p style="margin: 8px 0 0 0; color: #B91C1C;"><strong>Reason:</strong> ${reason || "Transaction declined by bank or cancelled."}</p>
    </div>
    <p>Don't worry! Your cart has been saved. You can retry the payment anytime using the link below:</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${retryUrl || `${BASE_URL}/checkout`}" class="button" style="background-color: #DC2626;">Retry Payment Now →</a>
    </div>
  `;
  return wrapLayout({ title: "Payment Not Completed", previewText: "Action required: Payment was not completed", content });
}

export function tplOrderStatusChanged({ orderNumber, newStatus, trackingUrl, customerName }) {
  const content = `
    <p>Hi <strong>${customerName || "Customer"}</strong>,</p>
    <p>There is an update on your order <strong>#${orderNumber}</strong>:</p>
    <div style="text-align: center; margin: 24px 0;">
      <span class="badge badge-success" style="font-size: 14px; padding: 8px 16px;">${newStatus}</span>
    </div>
    <p>You can follow real-time live GPS driver tracking and partner dispatch updates on your dashboard.</p>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${trackingUrl || `${BASE_URL}/dashboard`}" class="button">View Live Tracking →</a>
    </div>
  `;
  return wrapLayout({ title: `Order Update: ${newStatus}`, previewText: `Order #${orderNumber} is now ${newStatus}`, content });
}

export function tplBookingConfirmed({ booking, customerName }) {
  const title = booking.title || booking.serviceName || booking.hotelName || "Service Booking";
  const refId = booking.id ? `EZY-BK-${String(booking.id).padStart(4, "0")}` : "Confirmed";
  const content = `
    <p>Hi <strong>${customerName || "Customer"}</strong>,</p>
    <p>Your booking for <strong>${title}</strong> has been confirmed.</p>
    <div style="background: #ECFDF5; border: 1px solid #D1FAE5; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #065F46;"><strong>Booking Ref:</strong> ${refId}</p>
      ${booking.date ? `<p style="margin: 6px 0 0 0; color: #047857;"><strong>Date:</strong> ${booking.date}</p>` : ""}
      ${booking.time ? `<p style="margin: 6px 0 0 0; color: #047857;"><strong>Time:</strong> ${booking.time}</p>` : ""}
      <p style="margin: 6px 0 0 0; color: #047857;"><strong>Amount Paid:</strong> ₹${booking.amount || booking.totalAmount || 0}</p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BASE_URL}/dashboard" class="button">View Booking Details →</a>
    </div>
  `;
  return wrapLayout({ title: "Booking Confirmed 🎉", previewText: `Your booking for ${title} is confirmed`, content });
}

// ----------------------------------------------------
// 3. PARTNER ECOSYSTEM TEMPLATES
// ----------------------------------------------------

export function tplPartnerApplicationReceived({ businessName, ownerName, phone, email }) {
  const content = `
    <p>Hi <strong>${ownerName || "Partner"}</strong>,</p>
    <p>Thank you for submitting your partner registration application for <strong>${businessName}</strong> on the EZY1 marketplace network.</p>
    <div style="background: #FFF7ED; border: 1px solid #FFEDD5; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #C2410C;"><strong>Status:</strong> Under Review (24-48 hours)</p>
      <p style="margin: 6px 0 0 0; color: #7C2D12;">Registered Phone: <strong>${phone}</strong></p>
      <p style="margin: 6px 0 0 0; color: #7C2D12;">Email: <strong>${email}</strong></p>
    </div>
    <p>Our merchant onboarding operations team is currently reviewing your catalog and identity documents. You will receive an activation email as soon as verification is complete.</p>
  `;
  return wrapLayout({ title: "Partner Application Received", previewText: `Application received for ${businessName}`, content });
}

export function tplPartnerApproved({ businessName, ownerName, loginUrl }) {
  const content = `
    <p>Hi <strong>${ownerName || "Partner"}</strong>,</p>
    <p>Congratulations! Your partner account for <strong>${businessName}</strong> has been officially approved and activated on EZY1.</p>
    <div style="background: #ECFDF5; border: 1px solid #D1FAE5; border-radius: 12px; padding: 16px; margin: 20px 0;">
      <p style="margin: 0; color: #065F46;"><strong>Status:</strong> Verified &amp; Active Merchant</p>
      <p style="margin: 6px 0 0 0; color: #047857;">You can now manage live inventory, adjust prices, and receive customer orders.</p>
    </div>
    <div style="text-align: center; margin: 24px 0;">
      <a href="${loginUrl || `${BASE_URL}/partner-login`}" class="button" style="background-color: #059669;">Log In to Partner Portal →</a>
    </div>
  `;
  return wrapLayout({ title: "Partner Account Approved 🎉", previewText: `Your partner account for ${businessName} is approved!`, content });
}

// ----------------------------------------------------
// 4. SUPPORT & FEEDBACK TEMPLATES (IMPROVX READY)
// ----------------------------------------------------

export function tplSupportTicketReceived({ ticketId, subject, customerName }) {
  const content = `
    <p>Hi <strong>${customerName || "Customer"}</strong>,</p>
    <p>We received your support enquiry: <strong>"${subject}"</strong>.</p>
    <div style="background: #f9fafb; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #e5e7eb;">
      <p style="margin: 0;"><strong>Ticket ID:</strong> #${ticketId}</p>
      <p style="margin: 6px 0 0 0; color: #6b7280;">Our customer experience team typically responds within 2-4 business hours.</p>
    </div>
    <p>You can reply directly to this email to add additional details or photos to your ticket.</p>
  `;
  return wrapLayout({ title: "Support Ticket Created", previewText: `Ticket #${ticketId} created`, content });
}

export function tplImprovxFeedbackRequest({ orderId, customerName }) {
  const content = `
    <p>Hi <strong>${customerName || "Valued Customer"}</strong>,</p>
    <p>How was your recent experience with EZY1 Order <strong>#${orderId}</strong>?</p>
    <p>Simply reply directly to this email with your feedback, rating (1 to 5), or any comments. Our team reads every customer reply!</p>
    <div style="background: #FFF7ED; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
      <p style="margin: 0; font-size: 20px;">⭐⭐⭐⭐⭐</p>
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #9A3412;">Hit "Reply" to share your experience</p>
    </div>
  `;
  return wrapLayout({ title: "How was your EZY1 Order?", previewText: `Feedback for Order #${orderId}`, content });
}

// ----------------------------------------------------
// 5. MARKETING & PROMOTIONAL TEMPLATES
// ----------------------------------------------------

export function tplPromotionalOffer({ title, discount, description, promoCode, actionUrl, unsubscribeUrl }) {
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge badge-success" style="font-size: 14px; padding: 6px 14px; background: #FF5100; color: #fff;">LIMITED TIME OFFER</span>
      <h2 style="font-size: 24px; color: #111; margin: 16px 0 8px 0;">${title || "Special Deal for You"}</h2>
      <p style="color: #6b7280; font-size: 14px; margin: 0;">${description || "Save big on your next purchase across EZY1."}</p>
    </div>

    ${promoCode ? `
    <div style="background: #FFF7ED; border: 2px dashed #FF5100; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0;">
      <p style="margin: 0 0 6px 0; font-size: 12px; color: #9A3412; font-weight: bold; text-transform: uppercase;">Use Promo Code</p>
      <span style="font-size: 28px; font-weight: 900; letter-spacing: 4px; color: #FF5100; font-family: monospace;">${promoCode}</span>
      <p style="margin: 6px 0 0 0; font-size: 12px; color: #7C2D12;">Get ${discount || "Flat Discount"} on Checkout</p>
    </div>` : ""}

    <div style="text-align: center; margin: 24px 0;">
      <a href="${actionUrl || BASE_URL}" class="button">Claim Offer Now →</a>
    </div>
  `;
  return wrapLayout({ title: title || "EZY1 Special Offer", previewText: `${discount || "Exclusive offer"} on EZY1!`, content, unsubscribeUrl });
}
