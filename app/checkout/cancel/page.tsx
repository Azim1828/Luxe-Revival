"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CancelPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/checkout");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Payment Canceled
      </h1>
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>
          It seems like your payment was canceled. Please try again or contact
          support if you need assistance.
        </AlertDescription>
      </Alert>
      <div className="flex justify-center">
        <Button onClick={handleGoBack} size="lg" className="w-full">
          Return to Checkout
        </Button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          If you encounter any issues, please reach out to our customer support
          team for assistance.
        </p>
      </div>
    </div>
  );
}
