import dns from 'dns/promises';

async function checkDns() {
  console.log('=== DNS INSPECTION FOR ezy1.site ===\n');

  try {
    const txtRecords = await dns.resolveTxt('ezy1.site');
    console.log('TXT records for ezy1.site:');
    txtRecords.forEach(r => console.log(' - ' + r.join('')));
  } catch (e) {
    console.log('Error resolving TXT for ezy1.site:', e.message);
  }

  try {
    const mxRecords = await dns.resolveMx('ezy1.site');
    console.log('\nMX records for ezy1.site:');
    mxRecords.forEach(r => console.log(` - priority ${r.priority}: ${r.exchange}`));
  } catch (e) {
    console.log('\nError resolving MX for ezy1.site:', e.message);
  }

  try {
    const dmarc = await dns.resolveTxt('_dmarc.ezy1.site');
    console.log('\nDMARC record (_dmarc.ezy1.site):');
    dmarc.forEach(r => console.log(' - ' + r.join('')));
  } catch (e) {
    console.log('\nError resolving DMARC for _dmarc.ezy1.site:', e.message);
  }

  try {
    const bimi = await dns.resolveTxt('default._bimi.ezy1.site');
    console.log('\nBIMI record (default._bimi.ezy1.site):');
    bimi.forEach(r => console.log(' - ' + r.join('')));
  } catch (e) {
    console.log('\nError resolving BIMI for default._bimi.ezy1.site:', e.message);
  }

  // Check Brevo DKIM selectors
  for (const sel of ['mail', 'sib', 'brevo', 'k1', 'smtp', 'google', 'default']) {
    try {
      const dkim = await dns.resolveTxt(`${sel}._domainkey.ezy1.site`);
      console.log(`\nDKIM selector '${sel}' (${sel}._domainkey.ezy1.site):`);
      dkim.forEach(r => console.log(' - ' + r.join('')));
    } catch (e) {
      // not found
    }
  }
}

checkDns();
