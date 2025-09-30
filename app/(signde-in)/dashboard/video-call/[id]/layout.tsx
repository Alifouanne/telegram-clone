"use client";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  StreamCall,
  StreamVideo,
  StreamTheme,
  type Call,
  CallingState,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { createToken } from "@/actions/createToken";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Mainpage/LoadingSpinner";
import { AlertTriangle, Video } from "lucide-react";
import "@stream-io/video-react-sdk/dist/css/styles.css";

if (!process.env.NEXT_PUBLIC_STREAM_API_KEY) {
  throw new Error("NEXT_PUBLIC_STREAM_API_KEY is not defined");
}

function VideoCallLayout({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { id } = useParams();
  const [call, setCall] = useState<Call | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  const streamUser = useMemo(() => {
    if (!user?.id) return null;
    return {
      id: user.id,
      name:
        user.fullName || user.emailAddresses[0]?.emailAddress || "Unknown User",
      image: user.imageUrl || "",
      type: "authenticated" as const,
    };
  }, [user]);

  const tokenProvider = useCallback(async () => {
    if (!user?.id) {
      throw new Error("User not found");
    }
    return await createToken(user.id);
  }, [user?.id]);

  useEffect(() => {
    if (!streamUser) {
      setClient(null);
      return;
    }
    const newClient = new StreamVideoClient({
      apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY as string,
      user: streamUser,
      tokenProvider,
    });
    setClient(newClient);

    return () => {
      newClient.disconnectUser().catch(console.error);
    };
  }, [streamUser, tokenProvider]);

  useEffect(() => {
    if (!client || !id) {
      return;
    }
    setError(null);
    const streamCall = client.call("default", id as string);
    const joinCall = async () => {
      try {
        await streamCall.join({ create: true });
        setCall(streamCall);
      } catch (error) {
        console.error("Error joining call", error);
        setError(
          error instanceof Error ? error.message : "Could not join the call"
        );
      }
    };
    joinCall();

    return () => {
      if (streamCall && streamCall.state.callingState === CallingState.JOINED) {
        streamCall.leave().catch(console.error);
      }
    };
  }, [id, client]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-6 py-12">
        <div className="max-w-md w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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

          <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h2 className="text-2xl font-bold text-gray-900">Call Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>

          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Retry Connection
            </Button>
          </div>

          <p className="text-center text-sm text-gray-500 animate-in fade-in duration-500 delay-500">
            Please check your internet connection and try again
          </p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-6 py-12">
        <div className="max-w-md w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-center animate-in zoom-in duration-700 delay-100">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative">
                <Spinner size="lg" />
              </div>
            </div>
          </div>

          <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Initializing Client...
            </h2>
            <p className="text-gray-600">Setting up video call connection...</p>
          </div>

          <div className="flex justify-center gap-2 animate-in fade-in duration-500 delay-300">
            <div
              className="size-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="size-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="size-2 bg-blue-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!call) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 px-6 py-12">
        <div className="max-w-md w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-center animate-in zoom-in duration-700 delay-100">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse" />
              <div className="relative size-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Video className="size-10 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <h2 className="text-2xl font-bold text-gray-900">
              Joining Call...
            </h2>
            <p className="text-gray-600">Connecting to video room...</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-200 rounded-full">
              <div className="size-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 font-mono text-sm font-medium">
                Call ID: {id}
              </span>
            </div>
          </div>

          <div className="flex justify-center gap-2 animate-in fade-in duration-500 delay-300">
            <div
              className="size-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="size-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="size-2 bg-green-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamTheme className="text-white">
        <StreamCall call={call}>{children}</StreamCall>
      </StreamTheme>
    </StreamVideo>
  );
}

export default VideoCallLayout;
