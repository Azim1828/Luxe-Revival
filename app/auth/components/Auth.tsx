"use client";

import AuthLayout, { Tab } from "@/app/components/auth/AuthLayout";
import LoginForm from "@/app/components/auth/LoginForm";
import RegisterForm from "@/app/components/auth/RegisterForm";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

export default function Auth() {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.LOGIN);
  const searchParams = useSearchParams();

  useEffect(() => {
    const tab = searchParams.get("tab") as Tab;
    setCurrentTab(tab || Tab.LOGIN);
  }, [searchParams]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayout defaultTab={currentTab}>
        {currentTab === Tab.LOGIN ? <LoginForm /> : <RegisterForm />}
      </AuthLayout>
    </Suspense>
  );
}
