"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuccessPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the session ID from the URL
    const queryParams = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = queryParams.get("session_id");
    if (sessionIdFromUrl) {
      setSessionId(sessionIdFromUrl);
    }
    setLoading(false);
  }, []);

  const handleGoHome = () => {
    router.push("/");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Thank You for Your Purchase!
      </h1>
      <Alert variant="default" className="mb-6">
        <AlertDescription>
          Your payment was successful! Your order will be processed shortly.
        </AlertDescription>
      </Alert>
      <div className="flex justify-center">
        <Button onClick={handleGoHome} size="lg" className="w-full">
          Go to Homepage
        </Button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          If you have any questions, please contact our support team with your
          session ID: <strong>{sessionId}</strong>.
        </p>
      </div>
    </div>
  );
}
