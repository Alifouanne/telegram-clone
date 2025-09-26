import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useState } from "react";
import { useDebounce } from "./useDebounce";

/**
 * Custom hook for searching users with debounced input
 * Provides real-time user search functionality with loading states
 * @returns Object containing search state and results
 */
export function useUserSearch() {
  // State to track the current search input value
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce the search term to avoid excessive API calls
  // Waits 300ms after user stops typing before triggering search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Query Convex database for users matching the search term
  // Uses 'skip' when search term is empty to avoid unnecessary queries
  const searchResults = useQuery(
    api.users.searchUsers,
    debouncedSearchTerm.trim() ? { searchTerm: debouncedSearchTerm } : "skip"
  );

  return {
    // Current search input value
    searchTerm,
    // Function to update the search input
    setSearchTerm,
    // Array of user documents matching the search, defaults to empty array
    searchResults: (searchResults || []) as Doc<"users">[],
    // Loading state: true when query is pending and there's a search term
    isLoading: searchResults === undefined && debouncedSearchTerm.trim() !== "",
  };
}
