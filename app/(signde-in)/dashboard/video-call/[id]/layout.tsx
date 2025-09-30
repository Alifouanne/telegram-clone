"use client";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  StreamCall,
  StreamVideo,
  StreamTheme,
  Call,
  CallingState,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { createToken } from "@/actions/createToken";
import StatusCard from "@/components/Mainpage/StatusCard";
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

  //create token provider function outside of useEffect and useCallback to avoid recreating it on every render
  const tokenProvider = useCallback(async () => {
    if (!user?.id) {
      throw new Error("User not found");
    }
    return await createToken(user.id);
  }, [user?.id]);
  //initialize the client and call inside useEffect
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
    //cleanup function to leave the call when component unmounts
    return () => {
      if (streamCall && streamCall.state.callingState === CallingState.JOINED) {
        streamCall.leave().catch(console.error);
      }
    };
  }, [id, client]);

  if (error) {
    return (
      <StatusCard
        title="Call Error"
        description={error}
        className="min-h-screen bg-red-50 text-gray-500"
        action={
          <Button
            onClick={() => window.location.reload()}
            variant="destructive"
          >
            Retry
          </Button>
        }
      >
        <div className="size-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertTriangle className="size-8 text-red-600" />
        </div>
      </StatusCard>
    );
  }

  if (!client) {
    return (
      <StatusCard
        title="Initializing Client..."
        description="Setting up video call connection..."
        className="min-h-screen bg-blue-50"
      >
        <Spinner size="lg" />
      </StatusCard>
    );
  }
  if (!call) {
    return (
      <StatusCard title="Joining Call..." className="min-h-screen bg-green-50">
        <div className="animate-bounce size-16 mx-auto">
          <div className="size-16 bg-green-200 rounded-full flex items-center justify-center">
            <Video className="size-8 text-green-600" />
          </div>
        </div>
        <div className="text-green-600 font-mono text-sm bg-green-100 px-3 py-1 rounded-full inline-block">
          Call ID: {id}
        </div>
      </StatusCard>
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
