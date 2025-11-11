import fetch from "node-fetch";

const baseUrl = "https://api.monnify.com/api/v1";
const apiKey = process.env.MONNIFY_API_KEY ?? "";
const secretKey = process.env.MONNIFY_SECRET_KEY ?? "";

async function initializePayment(params: {
  amount: number;
  currency: string;
  reference?: string;
}) {
  const res = await fetch(`${baseUrl}/merchant/transactions/init-transaction`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${apiKey}:${secretKey}`).toString(
        "base64"
      )}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amount,
      currencyCode: params.currency,
      paymentReference: params.reference,
      redirectUrl: process.env.PAYMENT_REDIRECT_URL,
    }),
  });
  const json = (await res.json()) as {
    responseBody?: { checkoutUrl?: string };
  };
  return json?.responseBody?.checkoutUrl ?? null;
}

async function handleWebhook(_body: unknown, _headers: unknown) {
  // TODO: verify signature and update invoice/payment status
  return true;
}

export const monnify = {
  initializePayment,
  handleWebhook,
};
