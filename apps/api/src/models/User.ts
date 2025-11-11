import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone?: string;
  password: string; // optional if using Supabase Auth or OAuth
  avatar?: string;

  businessName?: string;
  businessLogo?: string;
  businessAddress?: string;
  currency?: string; // e.g. 'NGN', 'GHS', 'KES'

  plan: "free" | "pro" | "enterprise";
  subscription?: {
    plan: string;
    startDate: Date;
    endDate: Date;
    autoRenew: boolean;
    paymentGateway?: "paystack" | "flutterwave" | "monnify";
    referenceId?: string;
  };

  preferences?: {
    invoicePrefix?: string;
    theme?: "light" | "dark";
    language?: string;
    notifications?: {
      email: boolean;
      whatsapp: boolean;
      sms: boolean;
    };
  };

  stats?: {
    totalInvoices: number;
    totalClients: number;
    totalPaidAmount: number;
    totalOutstanding: number;
    averagePaymentTime?: number; // in days
  };

  verified: boolean;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String },

    password: { type: String },
    avatar: { type: String },

    businessName: { type: String },
    businessLogo: { type: String },
    businessAddress: { type: String },
    currency: { type: String, default: "NGN" },

    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },

    subscription: {
      plan: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      autoRenew: { type: Boolean, default: false },
      paymentGateway: { type: String },
      referenceId: { type: String },
    },

    preferences: {
      invoicePrefix: { type: String, default: "INV" },
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      language: { type: String, default: "en" },
      notifications: {
        email: { type: Boolean, default: true },
        whatsapp: { type: Boolean, default: true },
        sms: { type: Boolean, default: false },
      },
    },

    stats: {
      totalInvoices: { type: Number, default: 0 },
      totalClients: { type: Number, default: 0 },
      totalPaidAmount: { type: Number, default: 0 },
      totalOutstanding: { type: Number, default: 0 },
      averagePaymentTime: { type: Number, default: 0 },
    },

    verified: { type: Boolean, default: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isActive: { type: Boolean, default: true },
    passwordChangedAt: { type: Date },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
