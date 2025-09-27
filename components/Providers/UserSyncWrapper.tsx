"use client";

// UserSyncWrapper ensures the authenticated Clerk user is
// 1) persisted/updated in Convex, and
// 2) connected/disconnected to the Stream chat client.
// It also shows a loading spinner while syncing and a friendly
// error state if something goes wrong.

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Spinner } from "../Mainpage/LoadingSpinner";
import { AlertCircle } from "lucide-react";
import stramClient from "@/lib/stream";
import { createToken } from "@/actions/createToken";
// Wrap any children that require an authenticated, synced, and connected user
function UserSyncWrapper({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  // Local UI state for sync lifecycle
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Convex mutation to upsert (create or update) the user record
  const createOrUpdateUser = useMutation(api.users.upsertUser);
  // Synchronizes the current Clerk user to Convex and connects to Stream
  const syncUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      setIsLoading(true);
      setError(null);
      // Provides a JWT token for Stream using a server action
      const tokenProvider = async () => {
        if (!user.id) {
          throw new Error("User not found");
        }
        const token = await createToken(user.id);
        return token;
      };
      // Save or update the user in Convex
      await createOrUpdateUser({
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name:
          user.fullName ||
          user.firstName ||
          user.emailAddresses[0]?.emailAddress ||
          "Unknown User",
        imageUrl: user.imageUrl || "",
      });
      // Connect the user to Stream chat using the token provider
      await stramClient.connectUser(
        {
          id: user.id,
          name:
            user.fullName ||
            user.firstName ||
            user.emailAddresses[0]?.emailAddress ||
            "Unknown User",
          image: user.imageUrl || "",
        },
        tokenProvider
      );
    } catch (err) {
      console.error("Error syncing user:", err);
      setError(err instanceof Error ? err.message : "Failed to sync User");
    } finally {
      setIsLoading(false);
    }
  }, [createOrUpdateUser, user]);

  // Disconnects the user from Stream (called on sign-out and unmount)
  const disconnectUser = useCallback(async () => {
    try {
      await stramClient.disconnectUser();
    } catch (err) {
      console.error("Error disconnecting user from Stream:", err);
    }
  }, []);

  // When Clerk finishes loading, sync if authenticated; otherwise disconnect.
  // Also disconnect on unmount if there was a user connected.
  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      syncUser();
    } else {
      disconnectUser();
      setIsLoading(false);
    }
    //cleanup function
    return () => {
      if (user) {
        disconnectUser();
      }
    };
  }, [user, isLoaded, syncUser, disconnectUser]);

  // Initial loading state while Clerk and sync operations complete
  if (!isLoaded || isLoading) {
    return (
      <div className="min-h-screen flex flex-col space-y-3 items-center justify-center">
        <Spinner variant="ring" size={40} />
        <p className="text-sm text-muted-foreground ">Sync User Data</p>
      </div>
    );
  }

  // Friendly error state if syncing fails
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="text-center max-w-md mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <AlertCircle className="h-16 w-16 text-red-500 animate-pulse" />
              <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-red-200 animate-ping" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-red-600 mb-3 animate-in slide-in-from-left-2 duration-700 delay-200">
            Sync Error
          </h2>

          <p className="text-gray-700 text-base mb-6 leading-relaxed animate-in slide-in-from-right-2 duration-700 delay-300">
            {error}
          </p>

          <p className="text-gray-500 text-sm leading-relaxed animate-in fade-in-0 duration-700 delay-500">
            Please try restarting the app or{" "}
            <button className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors">
              contact support
            </button>{" "}
            if the issue persists
          </p>
        </div>
      </div>
    );
  }
  // Render children once user is ready and no errors occurred
  return <div>{children}</div>;
}

export default UserSyncWrapper;
