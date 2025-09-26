"use client";

import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL env in your .env.local");
}
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export default ConvexClientProvider;
