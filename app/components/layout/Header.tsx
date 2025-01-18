"use client";

import { useAuth } from "@/app/contexts/auth-context";
import { useShopping } from "@/app/contexts/shopping-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { user, logout } = useAuth();
  const { cartItemsCount, wishlistItemsCount } = useShopping();

  return (
    <header className="border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">
              Luxe Revival
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/wishlist" className="relative">
              <Heart className="h-6 w-6 text-gray-400 hover:text-gray-500" />
              {wishlistItemsCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 min-w-[20px] h-5"
                >
                  {wishlistItemsCount}
                </Badge>
              )}
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-6 w-6 text-gray-400 hover:text-gray-500" />
              {cartItemsCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 min-w-[20px] h-5"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Link>
            {user ? (
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
