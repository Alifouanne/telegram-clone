"use client";
import type { Doc } from "@/convex/_generated/dataModel";
import { useCreateNewChat } from "@/hooks/useCreateNewChat";
import { useUser } from "@clerk/nextjs";
import { type ReactNode, useState } from "react";
import { useChatContext } from "stream-chat-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import UserSearch from "./UserSearch";
import Image from "next/image";
import { Button } from "../ui/button";
import { XIcon } from "../ui/x";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

function NewChatDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Doc<"users">[]>([]);
  const [groupName, setGroupName] = useState("");
  const createNewChat = useCreateNewChat();
  const { user } = useUser();
  const { setActiveChannel } = useChatContext();

  const handleSelectUser = (u: Doc<"users">) => {
    setSelectedUsers((prev) => {
      if (prev.find((p) => p._id === u._id)) return prev;
      return [...prev, u];
    });
  };

  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedUsers([]);
      setGroupName("");
    }
  };

  const handleCreateChat = async () => {
    const totalMembers = selectedUsers.length + 1;
    const isGroupChat = totalMembers > 2;
    const channel = await createNewChat({
      members: [
        user?.id as string,
        ...selectedUsers.map((user) => user.userId),
      ],
      created_by_id: user?.id as string,
      groupName: isGroupChat ? groupName.trim() || undefined : undefined,
    });
    setActiveChannel(channel);
    setSelectedUsers([]);
    setGroupName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader className="animate-in slide-in-from-top-2 duration-500">
          <DialogTitle>Start a New Chat</DialogTitle>
          <DialogDescription>
            Search for users to start a conversation with
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="animate-in fade-in-0 duration-500 delay-100">
            <UserSearch onSelectUser={handleSelectUser} className="w-full" />
          </div>
          {selectedUsers.length > 0 && (
            <div className="space-y-3 animate-in slide-in-from-bottom-2 duration-500 delay-200">
              <h4 className="text-sm font-medium text-foreground dark:text-gray-100">
                Selected Users ({selectedUsers.length})
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {selectedUsers.map((user, index) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 bg-muted/50 dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg hover:bg-muted dark:hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02] animate-in fade-in-0 slide-in-from-left-2 "
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Image
                        src={user.imageUrl || "/placeholder.svg"}
                        alt={user.name}
                        width={24}
                        height={24}
                        className="size-6 rounded-full object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground dark:text-gray-100 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeUser(user._id)}
                      className="text-muted-foreground dark:text-gray-400 hover:text-destructive dark:hover:text-red-500 p-1 transition-all duration-300 hover:scale-110"
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {selectedUsers.length > 1 && (
                <div className="space-y-2 animate-in fade-in-0 duration-500 delay-300">
                  <Label
                    htmlFor="groupName"
                    className="text-sm font-medium text-foreground dark:text-gray-100"
                  >
                    Group Name (Optional)
                  </Label>
                  <Input
                    id="groupName"
                    type="text"
                    placeholder="Enter a name of your group chat..."
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 transition-all duration-300 focus:scale-[1.01]"
                  />
                  <p className="text-xs text-muted-foreground dark:text-gray-400">
                    Leave empty for a default name:&quot;Group chat (
                    {selectedUsers.length + 1} members)&quot;
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="animate-in slide-in-from-bottom-2 duration-500 delay-400">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={selectedUsers.length === 0}
            onClick={handleCreateChat}
            className="hover:scale-105 transition-transform duration-300"
          >
            {selectedUsers.length > 1
              ? `Create Chat Group (${selectedUsers.length + 1} members)`
              : selectedUsers.length === 1
                ? "Start Chat"
                : "Create Chat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default NewChatDialog;
