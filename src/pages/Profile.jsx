import React, { useState } from "react";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import Navbar from "@/components/FindABuddy/Navbar";
import ProfileForm from "@/components/FindABuddy/ProfileForm";
import BuddiesGrid from "@/components/FindABuddy/BuddiesGrid";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Profile() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="max-w-3xl w-full mx-auto px-5 py-8 flex-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create / Update Profile</CardTitle>
            <CardDescription>
              This is how other people find you in the browse list.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignedIn>
              <ProfileForm onSaved={() => setRefreshKey((k) => k + 1)} />
            </SignedIn>
            <SignedOut>
              <p className="text-muted-foreground text-sm mb-4">
                Sign in to create or update your profile.
              </p>
              <div className="flex justify-center">
                <SignIn routing="hash" />
              </div>
            </SignedOut>
          </CardContent>
        </Card>

        <SignedIn>
          <Card>
            <CardHeader>
              <CardTitle>Your profile in the list</CardTitle>
              <CardDescription>
                This is how others see you. Updates after you save.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BuddiesGrid refreshKey={refreshKey} />
            </CardContent>
          </Card>
        </SignedIn>
      </main>

      <footer className="border-t border-border">
        <div className="max-w-3xl mx-auto px-5 py-6 text-center text-xs text-muted-foreground">
          FindABuddy — connect with learners worldwide.
        </div>
      </footer>
    </div>
  );
}