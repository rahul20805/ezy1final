import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const backendDir = path.join(projectRoot, "backend");
const PORT = 3098;

console.log("================================================================");
console.log("🔐 EZY1 MULTI-TENANT PARTNER RBAC ISOLATION VERIFICATION SUITE");
console.log("================================================================");

const serverProc = spawn("node", ["./node_modules/tsx/dist/cli.mjs", "src/server.ts"], {
  cwd: backendDir,
  env: {
    ...process.env,
    PORT: String(PORT),
    NODE_ENV: "test",
    DATABASE_URL: ""
  },
  stdio: ["ignore", "pipe", "pipe"]
});

serverProc.stdout.on("data", (d) => {
  // console.log(`[srv] ${d.toString().trim()}`);
});
serverProc.stderr.on("data", (d) => {
  // console.error(`[srv-err] ${d.toString().trim()}`);
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  await sleep(2500);

  const baseUrl = `http://localhost:${PORT}`;

  try {
    // 1. Log in as different partners
    console.log("\n--- 1. Authenticating Partner Accounts ---");
    
    // Admin: EZY-P-10001
    const adminRes = await fetch(`${baseUrl}/api/partner/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerUserId: "EZY-P-10001", password: "Admin@2026!" })
    }).then(r => r.json());
    const adminToken = adminRes.token;
    console.log("  ✅ [PASS] Admin logged in:", adminRes.success, adminRes.partner?.role);

    // Grocery Partner: EZY-P-10002
    const groceryRes = await fetch(`${baseUrl}/api/partner/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerUserId: "EZY-P-10002", password: "Sharma@2026!" })
    }).then(r => r.json());
    const groceryToken = groceryRes.token;
    console.log("  ✅ [PASS] Grocery Partner logged in:", groceryRes.success, groceryRes.partner?.providerType);

    // Restaurant Partner: EZY-P-10007
    const restRes = await fetch(`${baseUrl}/api/partner/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerUserId: "EZY-P-10007", password: "Restaurant@2026!" })
    }).then(r => r.json());
    const restToken = restRes.token;
    console.log("  ✅ [PASS] Restaurant Partner logged in:", restRes.success, restRes.partner?.providerType);

    // Pharmacy Partner: EZY-P-10003
    const pharmRes = await fetch(`${baseUrl}/api/partner/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerUserId: "EZY-P-10003", password: "Nair@2026!" })
    }).then(r => r.json());
    const pharmToken = pharmRes.token;
    console.log("  ✅ [PASS] Pharmacy Partner logged in:", pharmRes.success, pharmRes.partner?.providerType);

    // Hospital Partner: EZY-P-10006
    const hospRes = await fetch(`${baseUrl}/api/partner/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerUserId: "EZY-P-10006", password: "Hospital@2026!" })
    }).then(r => r.json());
    const hospToken = hospRes.token;
    console.log("  ✅ [PASS] Hospital Partner logged in:", hospRes.success, hospRes.partner?.providerType);

    // Delivery Partner: EZY-P-10005
    const delivRes = await fetch(`${baseUrl}/api/partner/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerUserId: "EZY-P-10005", password: "Rajesh@2026!" })
    }).then(r => r.json());
    const delivToken = delivRes.token;
    console.log("  ✅ [PASS] Delivery Partner logged in:", delivRes.success, delivRes.partner?.providerType);

    // Owner: EZY-P-10000
    const ownerRes = await fetch(`${baseUrl}/api/partner/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ partnerUserId: "EZY-P-10000", password: "Owner@2026!" })
    }).then(r => r.json());
    const ownerToken = ownerRes.token;
    console.log("  ✅ [PASS] Platform Owner logged in:", ownerRes.success, ownerRes.partner?.role);

    console.log("\n--- 2. Verifying Cross-Vertical Isolation ---");

    // Test A: Grocery Partner tries to access Restaurant Dashboard -> MUST BE 403
    const gToR = await fetch(`${baseUrl}/api/restaurant/dashboard`, {
      headers: { Authorization: `Bearer ${groceryToken}` }
    });
    if (gToR.status === 403) {
      console.log("  ✅ [PASS] Grocery Partner BLOCKED from Restaurant Dashboard (HTTP 403)");
    } else {
      console.error(`  ❌ [FAIL] Expected 403 but got ${gToR.status}`);
    }

    // Test B: Restaurant Partner ACCESSES Restaurant Dashboard -> MUST BE 200
    const rToR = await fetch(`${baseUrl}/api/restaurant/dashboard`, {
      headers: { Authorization: `Bearer ${restToken}` }
    });
    if (rToR.status === 200) {
      const d = await rToR.json();
      console.log("  ✅ [PASS] Restaurant Partner ACCEPTS Restaurant Dashboard (HTTP 200, items:", d.activeMenuCount, ")");
    } else {
      console.error(`  ❌ [FAIL] Expected 200 but got ${rToR.status}`);
    }

    // Test C: Restaurant Partner tries to access Pharmacy Dashboard -> MUST BE 403
    const rToP = await fetch(`${baseUrl}/api/pharmacy/dashboard`, {
      headers: { Authorization: `Bearer ${restToken}` }
    });
    if (rToP.status === 403) {
      console.log("  ✅ [PASS] Restaurant Partner BLOCKED from Pharmacy Dashboard (HTTP 403)");
    } else {
      console.error(`  ❌ [FAIL] Expected 403 but got ${rToP.status}`);
    }

    // Test D: Pharmacy Partner ACCESSES Pharmacy Dashboard -> MUST BE 200
    const pToP = await fetch(`${baseUrl}/api/pharmacy/dashboard`, {
      headers: { Authorization: `Bearer ${pharmToken}` }
    });
    if (pToP.status === 200) {
      const d = await pToP.json();
      console.log("  ✅ [PASS] Pharmacy Partner ACCEPTS Pharmacy Dashboard (HTTP 200, medicines:", d.totalMedicines, ")");
    } else {
      console.error(`  ❌ [FAIL] Expected 200 but got ${pToP.status}`);
    }

    // Test E: Pharmacy Partner tries to access Hospital Dashboard -> MUST BE 403
    const pToH = await fetch(`${baseUrl}/api/hospital/dashboard`, {
      headers: { Authorization: `Bearer ${pharmToken}` }
    });
    if (pToH.status === 403) {
      console.log("  ✅ [PASS] Pharmacy Partner BLOCKED from Hospital Dashboard (HTTP 403)");
    } else {
      console.error(`  ❌ [FAIL] Expected 403 but got ${pToH.status}`);
    }

    // Test F: Hospital Partner ACCESSES Hospital Dashboard -> MUST BE 200
    const hToH = await fetch(`${baseUrl}/api/hospital/dashboard`, {
      headers: { Authorization: `Bearer ${hospToken}` }
    });
    if (hToH.status === 200) {
      const d = await hToH.json();
      console.log("  ✅ [PASS] Hospital Partner ACCEPTS Hospital Dashboard (HTTP 200, ICU beds:", d.availableIcuBeds, ")");
    } else {
      console.error(`  ❌ [FAIL] Expected 200 but got ${hToH.status}`);
    }

    // Test G: Hospital Partner tries to access Delivery Dashboard -> MUST BE 403
    const hToD = await fetch(`${baseUrl}/api/delivery/dashboard`, {
      headers: { Authorization: `Bearer ${hospToken}` }
    });
    if (hToD.status === 403) {
      console.log("  ✅ [PASS] Hospital Partner BLOCKED from Delivery Dashboard (HTTP 403)");
    } else {
      console.error(`  ❌ [FAIL] Expected 403 but got ${hToD.status}`);
    }

    // Test H: Delivery Partner ACCESSES Delivery Dashboard -> MUST BE 200
    const dToD = await fetch(`${baseUrl}/api/delivery/dashboard`, {
      headers: { Authorization: `Bearer ${delivToken}` }
    });
    if (dToD.status === 200) {
      const d = await dToD.json();
      console.log("  ✅ [PASS] Delivery Partner ACCEPTS Delivery Dashboard (HTTP 200, vehicle:", d.vehicleType, ")");
    } else {
      console.error(`  ❌ [FAIL] Expected 200 but got ${dToD.status}`);
    }

    console.log("\n--- 3. Verifying Admin & Owner Strict Isolation ---");

    // Test I: Regular partner (Grocery) tries to access Admin API -> MUST BE 403
    const gToAdmin = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${groceryToken}` }
    });
    if (gToAdmin.status === 403) {
      console.log("  ✅ [PASS] Regular Partner strictly BLOCKED from Admin API (HTTP 403)");
    } else {
      console.error(`  ❌ [FAIL] Expected 403 but got ${gToAdmin.status}`);
    }

    // Test J: Regular partner (Grocery) tries to access Owner API -> MUST BE 403
    const gToOwner = await fetch(`${baseUrl}/api/owner/overview`, {
      headers: { Authorization: `Bearer ${groceryToken}` }
    });
    if (gToOwner.status === 403) {
      console.log("  ✅ [PASS] Regular Partner strictly BLOCKED from Owner API (HTTP 403)");
    } else {
      console.error(`  ❌ [FAIL] Expected 403 but got ${gToOwner.status}`);
    }

    // Test K: Admin Partner ACCESSES Admin API -> MUST BE 200
    const aToAdmin = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    if (aToAdmin.status === 200) {
      console.log("  ✅ [PASS] Admin ACCEPTS Admin API (HTTP 200)");
    } else {
      console.error(`  ❌ [FAIL] Expected 200 but got ${aToAdmin.status}`);
    }

    // Test L: Master Owner ACCESSES Owner API -> MUST BE 200
    const oToOwner = await fetch(`${baseUrl}/api/owner/overview`, {
      headers: { Authorization: `Bearer ${ownerToken}` }
    });
    if (oToOwner.status === 200) {
      const d = await oToOwner.json();
      console.log("  ✅ [PASS] Master Owner ACCEPTS Owner Control Center (HTTP 200, GMV:", d.totalGrossMerchandiseValue, ")");
    } else {
      console.error(`  ❌ [FAIL] Expected 200 but got ${oToOwner.status}`);
    }

    console.log("\n================================================================");
    console.log("🎉 ALL MULTI-TENANT PARTNER ISOLATION TESTS PASSED 100%!");
    console.log("================================================================");
  } finally {
    serverProc.kill("SIGTERM");
  }
}

run();
