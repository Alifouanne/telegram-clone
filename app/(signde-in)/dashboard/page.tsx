"use client";

import { Button } from "@/components/ui/button";
import { LogoutIcon } from "@/components/ui/logout";
import { MessageCircleDashedIcon } from "@/components/ui/message-circle-dashed";
import { useSidebar } from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  useChatContext,
  Window,
} from "stream-chat-react";

function DashboardPage() {
  const { user } = useUser();
  const router = useRouter();
  const { channel, setActiveChannel } = useChatContext();
  const { setOpen } = useSidebar();

  const handleCall = () => {
    if (!channel) return;
    router.push(`/dashboard/video-call/${channel.id}`);
    setOpen(false);
  };

  const handleLeaveChat = async () => {
    if (!channel || !user?.id) {
      console.log("[v0] No channel or user ID found");
      return;
    }
    const confirm = window.confirm("Are you sure you want to leave this chat?");
    if (!confirm) return;
    try {
      await channel.removeMembers([user?.id as string]);
      setActiveChannel(undefined);
      router.push("/dashboard");
    } catch (error) {
      console.error("[v0] Error leaving the chat:", error);
    }
  };

  return (
    <div className="flex flex-1 min-h-0 flex-col w-full">
      {channel ? (
        <Channel>
          <Window>
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-between animate-in fade-in-0 slide-in-from-top-2 duration-500">
                {channel.data?.member_count === 1 ? (
                  <ChannelHeader title="Everyone else has left this chat!" />
                ) : (
                  <ChannelHeader />
                )}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCall}
                    className="hover:scale-105 transition-all duration-300 hover:shadow-md bg-transparent"
                  >
                    <VideoIcon className="size-4" />
                    Video Call
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLeaveChat}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 hover:scale-105 transition-all duration-300 bg-transparent"
                  >
                    <LogoutIcon className="size-4" />
                    Leave Chat
                  </Button>
                </div>
              </div>
              <div className="flex-1 min-h-0 animate-in fade-in-0 duration-700 delay-200">
                <MessageList />
              </div>
              <div className="w-full animate-in slide-in-from-bottom-2 duration-500 delay-300">
                <MessageInput />
              </div>
            </div>
          </Window>
          <Thread />
        </Channel>
      ) : (
        <div className="flex flex-col items-center justify-center h-full animate-in fade-in-0 zoom-in-95 duration-700">
          <div className="mb-6 animate-in fade-in-0 duration-700 delay-200">
            <MessageCircleDashedIcon className="size-16 opacity-50 hover:scale-110 transition-transform duration-300" />
          </div>
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4 animate-in slide-in-from-bottom-2 duration-700 delay-300">
            No chat selected
          </h2>
          <p className="text-muted-foreground mb-4 animate-in slide-in-from-bottom-2 duration-700 delay-400">
            Select a chat from the sidebar or start a new conversation
          </p>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
