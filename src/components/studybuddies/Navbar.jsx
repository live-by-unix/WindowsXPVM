import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user } = useUser();
  const { pathname } = useLocation();
  const name =
    user?.firstName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "there";

  const linkCls = (path) =>
    `text-sm transition-colors ${
      pathname === path
        ? "text-foreground font-medium"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
              S
            </div>
            <span className="font-semibold tracking-tight">FindABuddy</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className={linkCls("/")}>Browse</Link>
            <Link to="/profile" className={linkCls("/profile")}>My Profile</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <SignedIn>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              Hi, {name}
            </span>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <Link to="/profile">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}