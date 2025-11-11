import fetch from "node-fetch";

const baseUrl = "https://api.paystack.co";
const secret = process.env.PAYSTACK_SECRET_KEY ?? "";

async function initializePayment(params: {
  amount: number;
  currency: string;
  reference?: string;
}) {
  const res = await fetch(`${baseUrl}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(params.amount * 100),
      currency: params.currency,
      reference: params.reference,
    }),
  });
  const json = (await res.json()) as { data?: { authorization_url?: string } };
  return json?.data?.authorization_url ?? null;
}

async function handleWebhook(_body: unknown, _headers: unknown) {
  // TODO: verify signature and update invoice/payment status
  return true;
}

export const paystack = {
  initializePayment,
  handleWebhook,
};
