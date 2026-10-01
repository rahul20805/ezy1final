// Load from .env manually
import fs from 'fs';
const envConfig = fs.readFileSync('.env', 'utf-8');
const env = {};
envConfig.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

const brevoKey = env.BREVO_API_KEY;

async function checkBrevo() {
  console.log('=== BREVO DOMAINS & SENDERS INSPECTION ===\n');

  // 1. Get Domains
  console.log('1. Querying /v3/senders/domains...');
  const domRes = await fetch('https://api.brevo.com/v3/senders/domains', {
    headers: { 'api-key': brevoKey, 'accept': 'application/json' }
  });
  const domData = await domRes.json();
  console.log('Domains in Brevo:', JSON.stringify(domData, null, 2));

  // 2. Get specific domain details if ezy1.site exists
  console.log('\n2. Querying /v3/senders/domains/ezy1.site...');
  const ezyDomRes = await fetch('https://api.brevo.com/v3/senders/domains/ezy1.site', {
    headers: { 'api-key': brevoKey, 'accept': 'application/json' }
  });
  const ezyDomData = await ezyDomRes.json();
  console.log('ezy1.site details:', JSON.stringify(ezyDomData, null, 2));

  // 3. Get Senders
  console.log('\n3. Querying /v3/senders...');
  const sendersRes = await fetch('https://api.brevo.com/v3/senders', {
    headers: { 'api-key': brevoKey, 'accept': 'application/json' }
  });
  const sendersData = await sendersRes.json();
  console.log('Configured Senders in Brevo:', JSON.stringify(sendersData, null, 2));
}

checkBrevo().catch(err => console.error(err));
