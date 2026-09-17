import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes.js";
import { initDb } from "./db.js";
import { verifyJwt } from "./authService.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.locals.verifyJwt = verifyJwt;

app.use(cors());
app.use(express.json());

// Mount the mega router
app.use("/api", router);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "EZY1 Mega API is running" });
});

// Start DB and Server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(console.error);
