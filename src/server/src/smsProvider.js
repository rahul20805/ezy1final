/**
 * EZY1 Production SMS & OTP Provider Engine
 * Multi-provider SMS gateway supporting India DLT & Global SMS delivery:
 * - Twilio
 * - MSG91 (DLT OTP route)
 * - Fast2SMS (Indian Quick OTP)
 * - Textlocal (Indian DLT SMS)
 * - WhatsApp Cloud API
 * - Console/Test Provider (Restricted strictly to Development/Test environments)
 */

export class SmsProviderError extends Error {
  constructor(message, provider, statusCode = 500) {
    super(message);
    this.name = "SmsProviderError";
    this.provider = provider;
    this.statusCode = statusCode;
  }
}

/**
 * Send OTP using the configured SMS/WhatsApp gateway
 * @param {Object} options
 * @param {string} options.phone - Canonical phone number (e.g. "919876543210")
 * @param {string} options.otp - 6-digit numeric OTP code
 * @returns {Promise<{ success: boolean, messageId?: string, provider: string }>}
 */
export async function dispatchOtpSms({ phone, otp }) {
  const provider = (process.env.OTP_PROVIDER || "").toLowerCase().trim();
  const isProduction = process.env.NODE_ENV === "production";
  const isTestAllowed = !isProduction && (process.env.ENABLE_TEST_OTP === "true" || process.env.NODE_ENV === "test" || !provider);

  // Normalize phone for display and delivery
  const rawDigits = phone.replace(/[^0-9]/g, "");
  const tenDigit = rawDigits.slice(-10);
  const countryCode = rawDigits.length > 10 ? rawDigits.slice(0, rawDigits.length - 10) : "91";
  const fullE164 = `+${countryCode}${tenDigit}`;

  // 1. Twilio Gateway
  if (provider === "twilio") {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || process.env.OTP_API_KEY;
    const authToken = process.env.TWILIO_AUTH_TOKEN || process.env.OTP_API_SECRET;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER || process.env.OTP_SENDER_ID;
    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

    if (!accountSid || !authToken || (!fromNumber && !messagingServiceSid)) {
      throw new SmsProviderError("Twilio credentials missing. Required: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER", "twilio");
    }

    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const params = new URLSearchParams();
    params.append("To", fullE164);
    if (messagingServiceSid) {
      params.append("MessagingServiceSid", messagingServiceSid);
    } else {
      params.append("From", fromNumber);
    }
    params.append("Body", `Your EZY1 verification code is: ${otp}. Valid for 5 minutes. Do not share this OTP with anyone.`);

    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const res = await fetch(twilioUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new SmsProviderError(data.message || `Twilio SMS dispatch failed with status ${res.status}`, "twilio", res.status);
    }

    return { success: true, messageId: data.sid, provider: "twilio" };
  }

  // 2. MSG91 Gateway (India DLT Compliant OTP API)
  if (provider === "msg91") {
    const authKey = process.env.MSG91_AUTH_KEY || process.env.OTP_API_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID || process.env.OTP_TEMPLATE_ID;

    if (!authKey || !templateId) {
      throw new SmsProviderError("MSG91 configuration missing. Required: MSG91_AUTH_KEY and MSG91_TEMPLATE_ID", "msg91");
    }

    const msg91Url = `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId)}&mobile=${encodeURIComponent(fullE164.replace("+", ""))}&authkey=${encodeURIComponent(authKey)}&otp=${encodeURIComponent(otp)}`;
    const res = await fetch(msg91Url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.type === "error") {
      throw new SmsProviderError(data.message || "MSG91 OTP dispatch failed", "msg91", res.status);
    }

    return { success: true, messageId: data.message, provider: "msg91" };
  }

  // 3. Fast2SMS Gateway (India High-Speed OTP Route)
  if (provider === "fast2sms") {
    const apiKey = process.env.FAST2SMS_API_KEY || process.env.OTP_API_KEY;
    if (!apiKey) {
      throw new SmsProviderError("Fast2SMS API Key missing. Required: FAST2SMS_API_KEY", "fast2sms");
    }

    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: tenDigit,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.return) {
      throw new SmsProviderError(data.message?.[0] || "Fast2SMS OTP dispatch failed", "fast2sms", res.status);
    }

    return { success: true, messageId: data.request_id, provider: "fast2sms" };
  }

  // 4. Textlocal Gateway
  if (provider === "textlocal") {
    const apiKey = process.env.TEXTLOCAL_API_KEY || process.env.OTP_API_KEY;
    const sender = process.env.TEXTLOCAL_SENDER || process.env.OTP_SENDER_ID || "TXTLCL";

    if (!apiKey) {
      throw new SmsProviderError("Textlocal API key missing. Required: TEXTLOCAL_API_KEY", "textlocal");
    }

    const params = new URLSearchParams({
      apiKey,
      numbers: tenDigit,
      message: `Your EZY1 verification code is ${otp}. Valid for 5 minutes.`,
      sender,
    });

    const res = await fetch("https://api.textlocal.in/send/?" + params.toString());
    const data = await res.json().catch(() => ({}));
    if (data.status === "failure") {
      throw new SmsProviderError(data.errors?.[0]?.message || "Textlocal SMS dispatch failed", "textlocal");
    }

    return { success: true, messageId: data.batch_id, provider: "textlocal" };
  }

  // 5. WhatsApp Cloud API Gateway
  if (provider === "whatsapp") {
    const token = process.env.WHATSAPP_TOKEN || process.env.OTP_API_KEY;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID || process.env.OTP_SENDER_ID;
    const template = process.env.WHATSAPP_TEMPLATE_NAME || process.env.OTP_TEMPLATE_ID || "otp_verification";

    if (!token || !phoneId) {
      throw new SmsProviderError("WhatsApp Cloud API configuration missing. Required: WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID", "whatsapp");
    }

    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: fullE164.replace("+", ""),
        type: "template",
        template: {
          name: template,
          language: { code: "en_US" },
          components: [
            {
              type: "body",
              parameters: [{ type: "text", text: otp }],
            },
            {
              type: "button",
              sub_type: "url",
              index: "0",
              parameters: [{ type: "text", text: otp }],
            },
          ],
        },
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) {
      throw new SmsProviderError(data.error?.message || "WhatsApp OTP dispatch failed", "whatsapp", res.status);
    }

    return { success: true, messageId: data.messages?.[0]?.id, provider: "whatsapp" };
  }

  // 6. Non-Production Fallback: Console/Test Provider
  if (isTestAllowed) {
    console.log(`[SMS-GATEWAY-DEV] Dispatched OTP to ${fullE164} via simulated SMS gateway: [${otp}]`);
    return { success: true, messageId: `sim_${Date.now()}`, provider: "console-dev" };
  }

  // In production with no valid provider
  throw new SmsProviderError(
    "SMS Gateway not configured in production environment. Please provide valid OTP_PROVIDER credentials (twilio, msg91, fast2sms, textlocal, whatsapp).",
    "none",
    503
  );
}
