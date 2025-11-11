import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import slowDown from "express-slow-down";
import xss from "xss-clean";
import { healthRouter } from "./routes/health";
import { clientsRouter } from "./routes/clients";
import { expensesRouter } from "./routes/expenses";
import { authRouter } from "./routes/auth.js";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import { config } from "./config/index";
import { securityMiddleware } from "./middlewares/security";
import { logger } from "./config/logger";
import connectDB from "./db/db";
import { usersRouter } from "./routes/User";

export const app = express();

const baseUrl='/v1/api'

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());app.use(
  cors({
    origin: config.cors.origin,
    credentials: config.cors.credentials,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);app.use(compression());
app.use(express.json());

connectDB()


const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// Slow down requests
const speedLimiter = slowDown({
  windowMs: config.rateLimit.windowMs,
  delayAfter: Math.floor(config.rateLimit.max * 0.8),
  delayMs: ()=>config.slowDown.delayMs,
});



// Apply rate limiting
app.use(`${baseUrl}`, limiter);
app.use(`${baseUrl}`, speedLimiter);


// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Security middleware
app.use(xss());
app.use(hpp());

app.use(
  morgan("combined", {
    stream: { write: (message: string) => logger.info(message.trim()) },
  })
);

// Custom security middleware
app.use(securityMiddleware);

app.use(cookieParser());




app.use("/health", healthRouter);
app.use(`${baseUrl}/clients`, clientsRouter);
app.use(`${baseUrl}/expenses`, expensesRouter);
app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/user`, usersRouter)

 // 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);