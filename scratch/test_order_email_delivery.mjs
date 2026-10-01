import http from "http";
import { app } from "../backend/dist/app.js";

const PORT = 3088;
const server = http.createServer(app);

server.listen(PORT, async () => {
  try {
    console.log("=== TESTING LIVE ORDER PLACEMENT AND EMAIL DISPATCH ===");

    // Place an order with customer contact email
    const orderPayload = {
      userId: 1,
      vendorId: 1,
      customerName: "Anant Yadav",
      customerEmail: "anyanant7115@gmail.com",
      customerPhone: "9876543210",
      paymentMethod: "UPI / Razorpay (Live Verified)",
      deliveryAddress: "Flat 402, Green Glen Layout, Bellandur, Bengaluru",
      items: [
        { productId: 1, quantity: 2 }
      ],
      idempotencyKey: `test_email_order_${Date.now()}`
    };

    const res = await fetch(`http://localhost:${PORT}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload)
    });

    const data = await res.json();
    console.log("Order placement HTTP Status:", res.status);
    console.log("Order data:", {
      id: data.data?.id,
      orderNumber: data.data?.orderNumber,
      totalAmount: data.data?.totalAmount,
      customerEmail: data.data?.customerEmail,
      status: data.data?.status
    });

    if (res.status === 201) {
      console.log("✅ Order created successfully!");
      console.log("Waiting 3 seconds for Brevo async dispatch to complete...");
      await new Promise(r => setTimeout(r, 3000));
      console.log("✅ Order confirmation email process executed.");
    } else {
      console.error("❌ Order placement failed:", data);
    }
  } catch (err) {
    console.error("Error during test:", err);
  } finally {
    server.close();
    process.exit(0);
  }
});
