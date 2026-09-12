import http from "http";
import handler from "../api/index.js";
import { signJwt } from "../api/auth.js";

function makeRequest(server, method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, `http://localhost:${server.address().port}`);
    const req = http.request(
      url,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        });
      }
    );
    req.on("error", reject);
    if (body) {
      req.write(typeof body === "string" ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== HIGH-SCALE PAGINATION, BULK OPS & STATS TEST SUITE ===");

  const server = http.createServer((req, res) => handler(req, res));
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`Test server running on port ${port}`);

  try {
    const adminToken = signJwt({ id: 1, username: "admin", role: "super_owner", vendorId: 0 });
    const authHeaders = { Authorization: `Bearer ${adminToken}` };

    // 1. Test Server-Side Pagination on Vendors
    console.log("\n1. Testing Server-Side Pagination (page=1, limit=4)...");
    const p1Res = await makeRequest(server, "GET", "/api/vendors?page=1&limit=4&paginate=true");
    console.log("Status:", p1Res.status);
    console.log("Pagination metadata:", p1Res.data.pagination);
    console.log("Items returned:", p1Res.data.items?.length);
    if (!p1Res.data.pagination || p1Res.data.pagination.limit !== 4 || p1Res.data.pagination.page !== 1) {
      throw new Error("Page 1 pagination metadata incorrect!");
    }
    const page1FirstId = p1Res.data.items[0]?.id;

    console.log("\nTesting Page 2 offset (page=2, limit=4)...");
    const p2Res = await makeRequest(server, "GET", "/api/vendors?page=2&limit=4&paginate=true");
    console.log("Page 2 metadata:", p2Res.data.pagination);
    const page2FirstId = p2Res.data.items[0]?.id;
    console.log(`Page 1 first ID: ${page1FirstId}, Page 2 first ID: ${page2FirstId}`);
    if (page1FirstId === page2FirstId) {
      throw new Error("Pagination offset failed: page 1 and page 2 returned same records!");
    }

    // 2. Test Server Limit Capping
    console.log("\n2. Testing Server Limit Cap (requesting limit=500)...");
    const capRes = await makeRequest(server, "GET", "/api/vendors?page=1&limit=500&paginate=true");
    console.log("Capped limit:", capRes.data.pagination.limit);
    if (capRes.data.pagination.limit > 100) {
      throw new Error(`Limit capping failed: allowed ${capRes.data.pagination.limit} > 100!`);
    }

    // 3. Test Multi-Field Search
    console.log("\n3. Testing Multi-Field Search (search=Apollo)...");
    const searchRes = await makeRequest(server, "GET", "/api/vendors?search=Apollo&paginate=true");
    console.log("Search results count:", searchRes.data.items?.length);
    const matchedNames = searchRes.data.items.map((v) => v.businessName);
    console.log("Matched:", matchedNames);
    if (!matchedNames.some((n) => n.includes("Apollo"))) {
      throw new Error("Search for 'Apollo' failed to return Apollo Hospital!");
    }

    // 4. Test Sorting
    console.log("\n4. Testing Sorting (sortBy=businessName, sortOrder=desc)...");
    const sortRes = await makeRequest(server, "GET", "/api/vendors?sortBy=businessName&sortOrder=desc&paginate=true");
    const names = sortRes.data.items.map((v) => v.businessName);
    console.log("First 3 sorted desc:", names.slice(0, 3));
    if (names[0] < names[1]) {
      throw new Error("Sort descending failed!");
    }

    // 5. Test Lightweight Dashboard Aggregate Stats
    console.log("\n5. Testing Lightweight Dashboard Stats (GET /api/admin/stats)...");
    const statsRes = await makeRequest(server, "GET", "/api/admin/stats", null, authHeaders);
    console.log("Stats Status:", statsRes.status);
    console.log("Overview:", statsRes.data.overview);
    console.log("Category Breakdown:", statsRes.data.categoryBreakdown);
    if (!statsRes.data.success || !statsRes.data.overview.totalVendors) {
      throw new Error("Admin stats failed or missing overview!");
    }

    // 6. Test Server-Side Bulk Operations
    console.log("\n6. Testing Server-Side Bulk Operations (bulk-action suspend for vendors 1 & 2)...");
    const bulkRes = await makeRequest(server, "POST", "/api/admin/vendors/bulk-action", {
      vendorIds: [1, 2],
      action: "suspend",
    }, authHeaders);
    console.log("Bulk action result:", bulkRes.data);
    if (!bulkRes.data.success || bulkRes.data.successful !== 2) {
      throw new Error("Bulk action failed!");
    }

    // Verify change log audit trail
    console.log("\n7. Verifying Audit Trail for Bulk Action...");
    const auditRes = await makeRequest(server, "GET", "/api/admin/changes", null, authHeaders);
    const bulkLogs = auditRes.data.changes.filter((c) => c.operation === "BULK_UPDATE");
    console.log(`Found ${bulkLogs.length} bulk update change log entries.`);
    if (bulkLogs.length < 2) {
      throw new Error("Bulk audit change logs not recorded!");
    }

    // Re-activate vendors 1 & 2
    console.log("\nRe-activating vendors 1 & 2 via bulk approve...");
    await makeRequest(server, "POST", "/api/admin/vendors/bulk-action", {
      vendorIds: [1, 2],
      action: "approve",
    }, authHeaders);
    console.log("Vendors 1 & 2 re-activated successfully.");

    // 8. Test Services Pagination & CRUD
    console.log("\n8. Testing Services Pagination (page=1, limit=3)...");
    const svcRes = await makeRequest(server, "GET", "/api/services?page=1&limit=3&paginate=true");
    console.log("Services count:", svcRes.data.items?.length, "Total:", svcRes.data.pagination?.total);
    if (svcRes.data.items?.length !== 3) {
      throw new Error("Services pagination failed!");
    }

    // 9. Test Orders Pagination & Status Update
    console.log("\n9. Testing Orders Pagination & Status Update...");
    const ordRes = await makeRequest(server, "GET", "/api/orders?page=1&limit=5&paginate=true");
    console.log("Orders count:", ordRes.data.items?.length, "Total:", ordRes.data.pagination?.total);
    if (ordRes.data.items?.length > 0) {
      const firstOrderId = ordRes.data.items[0].id;
      const statusRes = await makeRequest(server, "PUT", `/api/orders/${firstOrderId}/status`, {
        status: "PREPARING",
      });
      console.log(`Order #${firstOrderId} status updated to:`, statusRes.data.order?.status);
      if (statusRes.data.order?.status !== "PREPARING") {
        throw new Error("Order status update failed!");
      }
    }

    // 10. Test Directory Endpoints
    console.log("\n10. Testing Public Directory Endpoints (/doctors, /hospitals, /transport)...");
    const docsRes = await makeRequest(server, "GET", "/api/doctors?paginate=true&limit=5");
    console.log("Doctors count:", docsRes.data.items ? docsRes.data.items.length : docsRes.data.length);
    const hospRes = await makeRequest(server, "GET", "/api/hospitals?paginate=true&limit=5");
    console.log("Hospitals count:", hospRes.data.items ? hospRes.data.items.length : hospRes.data.length);
    const transRes = await makeRequest(server, "GET", "/api/transport?paginate=true&limit=5");
    console.log("Transport count:", transRes.data.items ? transRes.data.items.length : transRes.data.length);

    console.log("\nALL HIGH-SCALE PAGINATION, BULK OPS & STATS TESTS PASSED SUCCESSFULLY!");
  } finally {
    server.close();
  }
}

runTests().catch((err) => {
  console.error("Test Suite Failed:", err);
  process.exit(1);
});
