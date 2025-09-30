"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Video } from "lucide-react";
import { useRouter } from "next/navigation";

export default function VideoCallError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("[v0] Video call error:", error);
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
          Video Call Error
        </h2>

        <p className="text-muted-foreground text-base mb-6 leading-relaxed animate-in slide-in-from-right-2 duration-700 delay-300">
          {error.message || "Failed to connect to video call"}
        </p>

        <div className="flex flex-col gap-3 justify-center animate-in fade-in-0 duration-700 delay-500">
          <Button
            onClick={reset}
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Video className="size-4" />
            Back to Dashboard
          </Button>
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
