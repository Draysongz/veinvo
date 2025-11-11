import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  apiVersion: string;
  cors: {
    origin: string[];
    credentials: boolean;
  };
  logging: {
    level: string;
    filePath: string;
  };
  slowDown: {
    delayMs: number;
  };
  payments: {
    paystackSecret?: string;
    flutterwaveSecret?: string;
    monnifyApiKey?: string;
    monnifySecretKey?: string;
    redirectUrl?: string;
  };
  notifications: {
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    whatsappFrom?: string;
    emailProviderApiKey?: string;
    emailFrom?: string;
  };
  security: {
    jwtSecret?: string;
    jwtExpiresIn: string;
  };
  rateLimit: {
    windowMs: number;
    max: number;
  };

  mongodb:{
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };

}

const validateConfig = (): Config => {
  const requiredEnvVars = ["MONGODB_URL"];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return {
    nodeEnv: process.env["NODE_ENV"] || "development",
    port: parseInt(process.env["PORT"] || "4000", 10),
    apiVersion: process.env["API_VERSION"] || "v1",
    cors: {
      origin: (process.env["CORS_ORIGIN"] || "http://localhost:3000").split(
        ","
      ),
      credentials: process.env["CORS_CREDENTIALS"] === "true",
    },
    logging: {
      level: process.env["LOG_LEVEL"] || "info",
      filePath: process.env["LOG_FILE_PATH"] || "logs/app.log",
    },
    
    payments: {
      paystackSecret: process.env["PAYSTACK_SECRET_KEY"] || undefined,
      flutterwaveSecret: process.env["FLUTTERWAVE_SECRET_KEY"] || undefined,
      monnifyApiKey: process.env["MONNIFY_API_KEY"] || undefined,
      monnifySecretKey: process.env["MONNIFY_SECRET_KEY"] || undefined,
      redirectUrl: process.env["PAYMENT_REDIRECT_URL"] || undefined,
    },
    notifications: {
      twilioAccountSid: process.env["TWILIO_ACCOUNT_SID"] || undefined,
      twilioAuthToken: process.env["TWILIO_AUTH_TOKEN"] || undefined,
      whatsappFrom: process.env["WHATSAPP_FROM"] || undefined,
      emailProviderApiKey: process.env["EMAIL_PROVIDER_API_KEY"] || undefined,
      emailFrom: process.env["EMAIL_FROM"] || undefined,
    },
    security: {
      jwtSecret: process.env["JWT_SECRET"] || undefined,
      jwtExpiresIn: process.env["JWT_EXPIRES_IN"] || "24h",
    },
    rateLimit: {
      windowMs: parseInt(process.env["RATE_LIMIT_WINDOW_MS"] || "900000", 10),
      max: parseInt(process.env["RATE_LIMIT_MAX_REQUESTS"] || "100", 10),
    },
    slowDown: {
      delayMs: parseInt(process.env["SLOW_DOWN_DELAY_MS"] || "1000", 10),
    },
    mongodb: {
      url: process.env["MONGODB_URL"] || "",
    },
    jwt: {
      secret: process.env["JWT_SECRET"] || "",
      expiresIn: process.env["JWT_EXPIRES_IN"] || "24h",
    },
  };
};

export const config = validateConfig();
