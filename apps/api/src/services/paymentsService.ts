import { paystack } from "../integrations/payments/paystack.js";
import { flutterwave } from "../integrations/payments/flutterwave.js";
import { monnify } from "../integrations/payments/monnify.js";

type Provider = "paystack" | "flutterwave" | "monnify";

async function initializePayment(params: {
  amount: number;
  currency: string;
  reference?: string;
  provider?: Provider;
}) {
  const provider = params.provider ?? "paystack";
  if (provider === "paystack") return paystack.initializePayment(params);
  if (provider === "flutterwave") return flutterwave.initializePayment(params);
  return monnify.initializePayment(params);
}

async function handleWebhook(
  provider: Provider,
  body: unknown,
  headers: unknown
) {
  if (provider === "paystack") return paystack.handleWebhook(body, headers);
  if (provider === "flutterwave")
    return flutterwave.handleWebhook(body, headers);
  return monnify.handleWebhook(body, headers);
}

export const paymentsService = {
  initializePayment,
  handleWebhook,
};
