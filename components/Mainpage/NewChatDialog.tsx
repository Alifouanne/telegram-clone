"use client";
// Dialog component to start a new 1:1 or group chat.
// - Search and select users
// - Optional group name when creating a group chat (3+ total members)
// - Persists the chat via `useCreateNewChat` and activates it in Stream
import { Doc } from "@/convex/_generated/dataModel";
import { useCreateNewChat } from "@/hooks/useCreateNewChat";
import { useUser } from "@clerk/nextjs";
import { ReactNode, useState } from "react";
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
/**
 * Renders a trigger (children) that opens a dialog for creating a new chat.
 * Manages selected users, optional group name, and channel creation.
 */
function NewChatDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // Users selected to include in the chat (excluding current user)
  const [selectedUsers, setSelectedUsers] = useState<Doc<"users">[]>([]);
  // Optional name for group chats
  const [groupName, setGroupName] = useState("");
  const createNewChat = useCreateNewChat();
  const { user } = useUser();
  const { setActiveChannel } = useChatContext();
  //!edit this one
  // Add a user to the selection if not already present
  // const handleSelectUser = (user: Doc<"users">) => {
  //   if (!selectedUsers.find((u) => u._id === user._id)) {
  //     setSelectedUsers((prev) => [...prev, user]);
  //   }
  // };
  const handleSelectUser = (u: Doc<"users">) => {
    setSelectedUsers((prev) => {
      if (prev.find((p) => p._id === u._id)) return prev;
      return [...prev, u];
    });
  };
  // Remove a user from the selection
  const removeUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((user) => user._id !== userId));
  };
  // Sync dialog open state; reset fields when closing
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedUsers([]);
      setGroupName("");
    }
  };
  //!edit this also
  // Create the channel (1:1 or group) then set it as active in Stream
  // const handleCreateChat = async () => {
  //   const totalMembers = selectedUsers.length + 1;
  //   const isGroupChat = totalMembers > 2;
  //   const channel = await createNewChat({
  //     members: [user?.id as string, ...selectedUsers.map((user) => user._id)],
  //     created_by_id: user?.id as string,
  //     groupName: isGroupChat ? groupName.trim() || undefined : undefined,
  //   });
  //   setActiveChannel(channel);
  //   setSelectedUsers([]);
  //   setGroupName("");
  //   setOpen(false);
  // };
  const handleCreateChat = async () => {
    if (!user?.id) return;
    try {
      const selectedIds = selectedUsers.map((u) => u._id);
      // all members must include the current user plus selected users (no duplicates)
      const members = Array.from(new Set([user.id, ...selectedIds]));

      const totalMembers = members.length;
      const isGroupChat = totalMembers > 2;

      const channel = await createNewChat({
        members,
        created_by_id: user.id,
        groupName: isGroupChat ? groupName.trim() || undefined : undefined,
      });

      setActiveChannel(channel);
      setSelectedUsers([]);
      setGroupName("");
      setOpen(false);
    } catch (err) {
      console.error("Failed to create chat:", err);
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Start a New Chat</DialogTitle>
          <DialogDescription>
            Search for users to start a conversation with
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Search existing users and add them to the selection */}
          <UserSearch onSelectUser={handleSelectUser} className="w-full" />
          {selectedUsers.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground dark:text-gray-100">
                Selected Users ({selectedUsers.length})
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {selectedUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-2 bg-muted/50 dark:bg-gray-800 border border-border dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Image
                        src={user.imageUrl}
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
                    {/* Remove a selected user */}
                    <Button
                      onClick={() => removeUser(user._id)}
                      className="text-muted-foreground dark:text-gray-400 hover:text-destructive dark:hover:text-red-500 p-1 transition-colors"
                    >
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              {selectedUsers.length > 1 && (
                <div className="space-y-2">
                  {/* Group name is shown only when creating a group chat */}
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
                    className="w-full dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
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
        <DialogFooter>
          {/* Close without creating a chat */}
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          {/* Create the chat; disabled until at least one user is selected */}
          <Button
            disabled={selectedUsers.length === 0}
            onClick={handleCreateChat}
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
