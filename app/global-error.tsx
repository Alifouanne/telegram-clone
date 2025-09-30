"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-6 py-12">
          <div className="max-w-md w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Error Icon */}
            <div className="flex justify-center animate-in zoom-in duration-700 delay-100">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                <div className="relative size-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <AlertTriangle
                    className="size-10 text-white"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>

            {/* Error Content */}
            <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <h1 className="text-3xl font-bold text-gray-900">
                Something went wrong!
              </h1>
              <p className="text-gray-600 text-lg">
                A critical error occurred in the application.
              </p>
              {error.message && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800 font-mono break-words">
                    {error.message}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <button
                onClick={reset}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Try Again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="w-full px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Go to Homepage
              </button>
            </div>

            {/* Help Text */}
            <p className="text-center text-sm text-gray-500 animate-in fade-in duration-500 delay-500">
              If this problem persists, please contact support
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
