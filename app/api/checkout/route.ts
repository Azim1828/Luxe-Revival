import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, shippingAddress, subtotal, shipping, total } = body;

    // Debug log
    console.log("Received items:", JSON.stringify(items, null, 2));

    // Validate items and create line items for Stripe
    const lineItems = items.map((item: any) => {
      // Ensure price is a valid number and convert to cents
      const unitAmount = Math.round(parseFloat(item.basePrice) * 100);

      if (isNaN(unitAmount)) {
        throw new Error(`Invalid price for item: ${item.name}`);
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name || "Product",
            images: item.image ? [item.image] : [],
            metadata: {
              productId: item.productId,
              size: item.size,
            },
          },
          unit_amount: unitAmount,
        },
        quantity: parseInt(item.quantity) || 1,
      };
    });

    // Add shipping as a separate line item if applicable
    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    // Debug log
    console.log("Stripe line items:", JSON.stringify(lineItems, null, 2));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
    });

    console.log("Stripe Checkout session created:", session.id);

    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
