"use client";
import type { Doc } from "@/convex/_generated/dataModel";
import { useUserSearch } from "@/hooks/useUserSearch";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { SearchIcon } from "../ui/search";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { XIcon } from "../ui/x";
import { Spinner } from "./LoadingSpinner";
import { Mail, UserIcon } from "lucide-react";
import Image from "next/image";

function UserSearch({
  onSelectUser,
  placeholder = "Search users by name or email...",
  className,
}: {
  onSelectUser: (user: Doc<"users">) => void;
  placeholder?: string;
  className?: string;
}) {
  const { isLoading, searchResults, searchTerm, setSearchTerm } =
    useUserSearch();

  const { user } = useUser();

  const filteredResults = searchResults.filter(
    (searchUser) => searchUser.userId !== user?.id
  );

  const handleSelectUser = (user: (typeof searchResults)[0]) => {
    onSelectUser?.(user);
    setSearchTerm("");
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <div className="relative animate-in fade-in-0 duration-500">
        <SearchIcon className="absolute left-2 size-4 translate-y-1/2 text-muted-foreground dark:text-gray-400" />

        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 h-12 text-base dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 transition-all duration-300 focus:scale-[1.01]"
        />

        {searchTerm && (
          <Button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:scale-110 transition-all duration-300"
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>

      {searchTerm.trim() && (
        <div className="mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto dark:bg-gray-900 dark:border-gray-700 animate-in slide-in-from-top-2 fade-in-0 duration-300">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground dark:text-gray-400 animate-in fade-in-0 duration-300">
              <div className="flex items-center justify-center space-x-2">
                <Spinner className="size-6" />
                <span>Searching...</span>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground dark:text-gray-400 animate-in fade-in-0 zoom-in-95 duration-500">
              <UserIcon className="size-8 mx-auto mb-2 opacity-50" />
              <p>No users found matching &quot;{searchTerm}&quot;</p>
            </div>
          ) : (
            <div className="py-2 overflow-x-hidden">
              {filteredResults.map((user, index) => (
                <button
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-all duration-300",
                    "focus:outline-none",
                    "group",
                    "mx-2",
                    "rounded-lg",
                    "hover:bg-accent dark:hover:bg-gray-800 hover:scale-[1.02]",
                    "border border-border dark:border-gray-700",
                    "mb-2 last:mb-0",
                    "animate-in fade-in-0 slide-in-from-left-2"
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "both",
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={user.imageUrl || "/placeholder.svg"}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover ring-2 ring-border dark:ring-gray-700 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-foreground truncate dark:text-gray-100">
                          {user.name || "No Name"}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 mt-1">
                        <Mail className="size-3 text-muted-foreground dark:text-gray-400" />
                        <p className="text-sm text-muted-foreground truncate dark:text-gray-400">
                          {user.email || "No Email"}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0">
                      <div className="size-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300 dark:bg-blue-400 group-hover:scale-150" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UserSearch;
