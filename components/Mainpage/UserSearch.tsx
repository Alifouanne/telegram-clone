"use client";
import { Doc } from "@/convex/_generated/dataModel";
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

/**
 * UserSearch component for searching and selecting users
 * Provides a searchable interface with real-time results and user selection
 *
 * @param onSelectUser - Callback function called when a user is selected
 * @param placeholder - Placeholder text for the search input
 * @param className - Additional CSS classes for styling
 */
function UserSearch({
  onSelectUser,
  placeholder = "Search users by name or email...",
  className,
}: {
  onSelectUser: (user: Doc<"users">) => void;
  placeholder?: string;
  className?: string;
}) {
  // Get search functionality from custom hook
  const { isLoading, searchResults, searchTerm, setSearchTerm } =
    useUserSearch();

  // Get current authenticated user from Clerk
  const { user } = useUser();

  // Filter out the current user from search results to prevent self-selection
  const filteredResults = searchResults.filter(
    (searchUser) => searchUser.userId !== user?.id
  );

  /**
   * Handle user selection from search results
   * Calls the onSelectUser callback and clears the search input
   */
  const handleSelectUser = (user: (typeof searchResults)[0]) => {
    onSelectUser?.(user);
    setSearchTerm(""); // Clear search after selection
  };

  /**
   * Clear the search input and reset search state
   */
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Search Input Container */}
      <div className="relative">
        {/* Search Icon */}
        <SearchIcon className="absolute left-2 size-4 translate-y-1/2 text-muted-foreground dark:text-gray-400" />

        {/* Search Input Field */}
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-10 h-12 text-base dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700"
        />

        {/* Clear Button - Only shown when there's text in the input */}
        {searchTerm && (
          <Button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:scale-110 transition-colors"
          >
            <XIcon className="size-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown - Only shown when there's a search term */}
      {searchTerm.trim() && (
        <div className="mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto dark:bg-gray-900 dark:border-gray-700">
          {/* Loading State */}
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground dark:text-gray-400">
              <div className="flex items-center justify-center space-x-2">
                <Spinner className="size-6" />
                <span>Searching...</span>
              </div>
            </div>
          ) : filteredResults.length === 0 ? (
            /* No Results State */
            <div className="p-4 text-center text-muted-foreground dark:text-gray-400">
              <UserIcon className="size-8 mx-auto mb-2 opacity-50" />
              <p>No users found matching &quot;{searchTerm}&quot;</p>
            </div>
          ) : (
            /* Search Results List */
            <div className="py-2 overflow-x-hidden">
              {filteredResults.map((user) => (
                <button
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors ",
                    "focus:outline-none",
                    "group",
                    // Add margin for spacing from parent
                    "mx-2",
                    // Remove border for all, add rounded and bg on hover
                    "rounded-lg",
                    "hover:bg-accent dark:hover:bg-gray-800",
                    // Add border only to each item except last, but with rounded corners
                    "border border-border dark:border-gray-700",
                    "mb-2 last:mb-0"
                  )}
                >
                  <div className="flex items-center space-x-3">
                    {/* User Avatar */}
                    <div className="relative">
                      <Image
                        src={user.imageUrl}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="size-10 rounded-full object-cover ring-2 ring-border dark:ring-gray-700"
                      />
                    </div>

                    {/* User Information */}
                    <div className="flex-1 min-w-0">
                      {/* User Name */}
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-foreground truncate dark:text-gray-100">
                          {user.name || "No Name"}
                        </p>
                      </div>

                      {/* User Email */}
                      <div className="flex items-center space-x-1 mt-1">
                        <Mail className="size-3 text-muted-foreground dark:text-gray-400" />
                        <p className="text-sm text-muted-foreground truncate dark:text-gray-400">
                          {user.email || "No Email"}
                        </p>
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    <div className="flex shrink-0">
                      <div className="size-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity dark:bg-blue-400" />
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
