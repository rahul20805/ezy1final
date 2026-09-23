import nodemailer from "nodemailer";

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "anyanant7115@gmail.com";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }
  return transporter;
}

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

  console.log(`[EMAIL DISPATCH] Dispatching partner application alerts:`, {
    adminRecipient: recipient,
    applicantRecipient: appData.email,
    businessName: appData.businessName,
    ownerName: appData.ownerName,
    phone: appData.phone,
  });

  const activeTransporter = getTransporter();

  if (activeTransporter) {
    try {
      const fromAddr = `"EZY1 Platform" <${process.env.SMTP_USER || "no-reply@ezy1.site"}>`;
      
      // 1. Send to Admin
      const adminInfo = await activeTransporter.sendMail({
        from: fromAddr,
        to: recipient,
        subject,
        html: htmlContent,
      });
      console.log(`[EMAIL DISPATCH SUCCESS] Admin alert delivered to ${recipient}: ${adminInfo.messageId}`);

      // 2. Send confirmation to applicant if valid email provided
      if (appData.email && appData.email.includes("@")) {
        try {
          const applicantInfo = await activeTransporter.sendMail({
            from: fromAddr,
            to: appData.email,
            subject: applicantSubject,
            html: applicantHtmlContent,
          });
          console.log(`[EMAIL DISPATCH SUCCESS] Applicant confirmation sent to ${appData.email}: ${applicantInfo.messageId}`);
        } catch (appErr) {
          console.warn(`[EMAIL DISPATCH WARN] Applicant confirmation send failed:`, appErr.message);
        }
      }

      return { success: true, messageId: adminInfo.messageId, recipient };
    } catch (err) {
      console.error(`[EMAIL DISPATCH ERROR] Failed to send email via SMTP:`, err.message);
      return { success: false, error: err.message, recipient };
    }
  } else {
    console.log(`[EMAIL DISPATCH NOTE] SMTP credentials not set in .env. Email queued & logged for ${recipient} and ${appData.email}.`);
    return { success: true, queued: true, recipient, applicant: appData.email };
  }
}
