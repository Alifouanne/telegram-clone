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
      console.log("No channel or user ID found");
      return;
    }
    const confirm = window.confirm("Are you sure you want to leave this chat?");
    if (!confirm) return;
    try {
      await channel.removeMembers([user?.id as string]);
      setActiveChannel(undefined);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error leaving the chat:", error);
    }
  };
  return (
    <div className="flex flex-1 min-h-0 flex-col w-full">
      {channel ? (
        <Channel>
          <Window>
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex items-center justify-between">
                {channel.data?.member_count === 1 ? (
                  <ChannelHeader title="Everyone else has left this chat!" />
                ) : (
                  <ChannelHeader />
                )}
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleCall}>
                    <VideoIcon className="size-4" />
                    Video Call
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLeaveChat}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <LogoutIcon className="size-4" />
                    Leave Chat
                  </Button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <MessageList />
              </div>
              <div className="w-full ">
                <MessageInput />
              </div>
            </div>
          </Window>
          <Thread />
        </Channel>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-semibold text-muted-foreground mb-4">
            No chat selected
          </h2>
          <p className="text-muted-foreground mb-4">
            Select a chat from the sidebar or start a new conversation
          </p>
          <MessageCircleDashedIcon className="size-5 opacity-80 hover:scale-150" />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
