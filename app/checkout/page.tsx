"use client";

import { useShopping } from "@/app/contexts/shopping-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal } = useShopping();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const shippingAddress = {
      fullName: formData.get("fullName") as string,
      streetAddress: formData.get("streetAddress") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      phone: formData.get("phone") as string,
    };

    try {
      console.log(
        "Cart data being sent:",
        JSON.stringify(
          {
            items: cart,
            shippingAddress,
            subtotal: cartTotal,
            shipping: cartTotal >= 100 ? 0 : 10,
            total: cartTotal >= 100 ? cartTotal : cartTotal + 10,
          },
          null,
          2
        )
      );

      // Create Stripe checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          shippingAddress,
          subtotal: cartTotal,
          shipping: cartTotal >= 100 ? 0 : 10,
          total: cartTotal >= 100 ? cartTotal : cartTotal + 10,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();

      // Redirect to Stripe checkout
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        throw error;
      }
    } catch (err) {
      setError("Failed to process checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Checkout
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping form fields remain the same */}
        {/* ... */}

        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{cartTotal >= 100 ? "Free" : "$10"}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total</span>
              <span>${cartTotal >= 100 ? cartTotal : cartTotal + 10}</span>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Processing..." : "Proceed to Payment"}
        </Button>
      </form>
    </div>
  );
}
