import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {});

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    items: { name: string; price: number; quantity: number }[];
    totalPrice: number;
  }>(event);

  const config = useRuntimeConfig();
  const baseUrl = config.public.baseUrl || "http://localhost:3000"; 

  const lineItems = body.items.map((item) => ({
    price_data: {
      currency: "dkk",
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${baseUrl}/checkout?payment=success`,
    cancel_url: `${baseUrl}/checkout?payment=cancelled`,
  });

  return { url: session.url };
});
