"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[v0] Root error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6 py-12">
      <div className="text-center max-w-md mx-auto animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <AlertTriangle className="h-16 w-16 text-destructive animate-pulse" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-2 border-destructive/20 animate-ping" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-3 animate-in slide-in-from-left-2 duration-700 delay-200">
          Something went wrong!
        </h2>

        <p className="text-muted-foreground text-base mb-6 leading-relaxed animate-in slide-in-from-right-2 duration-700 delay-300">
          {error.message || "An unexpected error occurred"}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-in fade-in-0 duration-700 delay-500">
          <Button
            onClick={reset}
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:scale-105 transition-transform w-full bg-transparent"
            >
              <Home className="size-4" />
              Go Home
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="text-muted-foreground text-xs mt-6 animate-in fade-in-0 duration-700 delay-700">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
