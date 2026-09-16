import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config.js";
import { csrfProtection } from "./middleware/csrf.js";
import authRoutes from "./routes/auth.js";
import publicRoutes from "./routes/public.js";
import adminRoutes from "./routes/admin.js";
import { createId } from "./utils/helpers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
fs.mkdirSync(env.uploadDir, { recursive: true });

const app = express();

app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use((_req, res, next) => {
  // Aucune fonctionnalité du site n'a besoin de caméra, micro, GPS ou Bluetooth.
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), bluetooth=(), usb=()",
  );
  next();
});
app.use(
  cors({
    origin(origin, cb) {
      if (!origin || env.frontendOrigins.includes(origin))
        return cb(null, true);
      return cb(new Error(`Origin non autorisée: ${origin}`));
    },
    credentials: true,
    exposedHeaders: ["X-Request-Id", "X-CSRF-Token"],
  }),
);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  const requestId = req.get("X-Request-Id") || createId().slice(0, 12);
  res.setHeader("X-Request-Id", requestId);
  next();
});

app.use(env.publicUploadUrl, express.static(env.uploadDir));

const api = express.Router();
api.use(csrfProtection);
api.use("/auth", authRoutes);
api.use(publicRoutes);
api.use("/admin", adminRoutes);

app.use(env.apiPrefix, api);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.message?.includes("Origin non autorisée") ? 403 : err.status || 500;
  res.status(status).json({
    error: {
      code: status === 403 ? "FORBIDDEN" : "INTERNAL_ERROR",
      message: err.message || "Erreur serveur",
    },
  });
});

const server = app.listen(env.port, () => {
  console.log(`Wasomi API listening on http://localhost:${env.port}${env.apiPrefix}`);
  console.log(`Uploads: ${env.uploadDir} → ${env.publicUploadUrl}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n Erreur: Le port ${env.port} est déjà utilisé par un autre processus.`);
    console.error(` Libérez le port ${env.port} (ex: fuser -k ${env.port}/tcp) puis relancez le serveur.\n`);
    process.exit(1);
  }
  throw err;
});
