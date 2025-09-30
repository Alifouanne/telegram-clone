"use client";

import { Spinner } from "@/components/Mainpage/LoadingSpinner";
import StatusCard from "@/components/Mainpage/StatusCard";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function VideoCallPage() {
  const { useCallCallingState, useParticipants } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participants = useParticipants();
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const { setOpen } = useSidebar();

  const handleLeave = () => {
    router.push("/dashboard");
    setOpen(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("[v0] Failed to copy:", error);
    }
  };

  if (callingState === CallingState.JOINING) {
    return (
      <StatusCard
        title="Joining Call.."
        description="Please wait while we connect you to the call."
        className="bg-gray-50 rounded-lg"
      >
        <Spinner size="lg" />
      </StatusCard>
    );
  }

  if (callingState === CallingState.RECONNECTING) {
    return (
      <StatusCard
        title="Reconnecting.."
        description="Connection Lost, attempting to reconnect. "
        className="bg-yellow-50 rounded-lg border border-yellow-200"
      >
        <div className="animate-pulse rounded-full size-12 bg-yellow-400 mx-auto"></div>
      </StatusCard>
    );
  }

  if (callingState !== CallingState.JOINED) {
    return (
      <StatusCard
        title="Loading Call..."
        description={`Status : ${callingState}`}
        className="bg-gray-50 rounded-lg "
      >
        <div className="animate-pulse rounded-full size-12 bg-gray-400 mx-auto"></div>
      </StatusCard>
    );
  }

  return (
    <div className="flex flex-col animate-in fade-in-0 duration-500">
      <div className="flex-1 relative">
        <SpeakerLayout />
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 animate-in slide-in-from-bottom-4 duration-500 delay-200">
        <CallControls onLeave={handleLeave} />
      </div>
      {participants.length === 1 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in-0 duration-700">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-500">
            <div className="text-center space-y-6">
              <div className="size-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto animate-in zoom-in-95 duration-500 delay-200">
                <Copy className="size-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-500 delay-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Waiting for others to join...
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Share the link below to invite others to the call.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 animate-in slide-in-from-bottom-2 duration-500 delay-400">
                <div className="flex items-center gap-3">
                  <div className="flex-1 text-sm text-gray-700 dark:text-gray-300 font-mono break-all">
                    {window.location.href}
                  </div>
                  <Button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                  >
                    {copied ? (
                      <>
                        <Check className="size-4" />
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 animate-in fade-in-0 duration-500 delay-500">
                Others will be able to join using this link.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoCallPage;
