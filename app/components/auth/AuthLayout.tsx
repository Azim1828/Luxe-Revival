"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export enum Tab {
  LOGIN = "login",
  REGISTER = "register",
}

interface AuthLayoutProps {
  children: React.ReactNode;
  defaultTab?: Tab;
}

export default function AuthLayout({
  children,
  defaultTab = Tab.LOGIN,
}: AuthLayoutProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value as Tab);
  };

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0">
          <Image
            src="/auth-bg.jpg"
            alt="Authentication background"
            fill
            className="object-cover opacity-90"
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Luxe Revival
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This store has transformed how I shop for shoes. The
              quality and service are unmatched!&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome to Luxe Revival
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to continue
            </p>
          </div>
          <Tabs
            defaultValue={defaultTab}
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={Tab.LOGIN}>Login</TabsTrigger>
              <TabsTrigger value={Tab.REGISTER}>Register</TabsTrigger>
            </TabsList>
            <TabsContent value={Tab.LOGIN}>
              <LoginForm />
            </TabsContent>
            <TabsContent value={Tab.REGISTER}>
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
