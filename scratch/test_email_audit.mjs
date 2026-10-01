import fs from 'fs';

const envConfig = fs.readFileSync('.env', 'utf-8');
const env = {};
envConfig.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const brevoKey = env.BREVO_API_KEY;

import { tplOrderConfirmation } from '../api/emailTemplates.js';

async function sendAuditEmail() {
  console.log('=== SENDING LIVE AUDIT TEST EMAIL ===\n');

  const htmlContent = tplOrderConfirmation({
    order: {
      orderNumber: 'TEST-BIMI-' + Date.now(),
      totalAmount: 499,
      items: [{ name: 'EZY1 Brand Authentication Test Pack', quantity: 1, price: 499 }],
      paymentMethod: 'Verified Payment Gateway',
      deliveryAddress: 'EZY1 Headquarters, Delhi NCR'
    },
    customerName: 'Anant Yadav'
  });

  const payload = {
    sender: { name: 'EZY1', email: 'support@ezy1.site' },
    to: [{ email: 'anyanant7115@gmail.com', name: 'Anant Yadav' }],
    replyTo: { email: 'support@ezy1.site', name: 'EZY1 Support' },
    subject: 'EZY1 Sender Brand & Avatar Verification Audit',
    htmlContent
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': brevoKey,
      'content-type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  console.log('HTTP Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));
}

sendAuditEmail().catch(err => console.error(err));
