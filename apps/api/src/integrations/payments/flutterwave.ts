import fetch from "node-fetch";

const baseUrl = "https://api.flutterwave.com/v3";
const secret = process.env.FLUTTERWAVE_SECRET_KEY ?? "";

async function initializePayment(params: {
  amount: number;
  currency: string;
  reference?: string;
}) {
  const res = await fetch(`${baseUrl}/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency,
      tx_ref: params.reference,
      redirect_url: process.env.PAYMENT_REDIRECT_URL,
    }),
  });
  const json = (await res.json()) as { data?: { link?: string } };
  return json?.data?.link ?? null;
}

async function handleWebhook(_body: unknown, _headers: unknown) {
  // TODO: verify signature and update invoice/payment status
  return true;
}

export const flutterwave = {
  initializePayment,
  handleWebhook,
};
