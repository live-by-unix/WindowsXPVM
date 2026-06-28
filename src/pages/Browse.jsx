import React from "react";
import Navbar from "@/components/FindABuddy/Navbar";
import BuddiesGrid from "@/components/FindABuddy/BuddiesGrid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Browse() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <section className="border-b border-border bg-gradient-to-b from-secondary/40 to-background">
        <div className="max-w-3xl mx-auto px-5 py-14 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Find your{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              study buddy
            </span>
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Browse learners by topic — no sign-in needed. Sign in only when you want to post your own profile.
          </p>
        </div>
      </section>

      <main className="max-w-3xl w-full mx-auto px-5 py-8 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Browse FindABuddy</CardTitle>
            <CardDescription>
              Search and filter by topic to find your match.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BuddiesGrid refreshKey={0} />
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-5 py-6 text-center text-xs text-muted-foreground">
          FindABuddy — connect with learners worldwide.
        </div>
      </footer>
    </div>
  );
}