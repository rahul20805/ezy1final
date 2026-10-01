import fs from 'fs';

const envConfig = fs.readFileSync('.env', 'utf-8');
const env = {};
envConfig.split('\n').forEach(line => {
  const [k, ...v] = line.split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim().replace(/^["']|["']$/g, '');
});

async function checkEvents() {
  const targetEmail = process.argv[2] || 'anyanant7115@gmail.com';
  console.log(`Checking events for ${targetEmail}...`);
  const res = await fetch(`https://api.brevo.com/v3/smtp/statistics/events?email=${encodeURIComponent(targetEmail)}&limit=5`, {
    headers: { 'api-key': env.BREVO_API_KEY, 'accept': 'application/json' }
  });
  const data = await res.json();
  console.log('Brevo Events:');
  console.log(JSON.stringify(data, null, 2));
}

checkEvents().catch(console.error);
