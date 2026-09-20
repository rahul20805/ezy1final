// Test Live Subdomains & Endpoints
async function checkLive() {
  const domains = [
    "https://ezy1.site",
    "https://partner.ezy1.site",
    "https://admin.ezy1.site",
    "https://ezy1.site/api/v1/health",
  ];

  for (const url of domains) {
    try {
      const start = Date.now();
      const res = await fetch(url, { redirect: "manual" });
      const duration = Date.now() - start;
      console.log(`[HTTP ${res.status}] ${url} (${duration}ms)`);
      if (res.headers.get("location")) {
        console.log(`  -> Redirect to: ${res.headers.get("location")}`);
      }
    } catch (err) {
      console.error(`[FAILED] ${url}:`, err.message);
    }
  }
}

checkLive();
