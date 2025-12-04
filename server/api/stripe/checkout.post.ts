import Stripe from "stripe";

type CheckoutItem = {
  name: string;
  price: number;
  quantity: number;
};

type CheckoutRequestBody = {
  items: CheckoutItem[];
};

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const stripe = new Stripe(config.stripeSecretKey as string, {});

  const body = await readBody<CheckoutRequestBody | null>(event);

  // ✅ First guard: make sure body exists and has items
  if (
    !body ||
    !body.items ||
    !Array.isArray(body.items) ||
    body.items.length === 0
  ) {
    setResponseStatus(event, 400);
    return { message: "No items provided for Stripe checkout." };
  }

  // From here on, TS knows body is not null/undefined
  const lineItems = body.items.map((item) => ({
    price_data: {
      currency: "dkk",
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100), // DKK → øre
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: "http://localhost:3000/checkout?payment=success",
    cancel_url: "http://localhost:3000/checkout?payment=cancelled",
  });

  return { url: session.url };
});
