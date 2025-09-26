import { useEffect, useState } from "react";

/**
 * Custom hook that debounces a value to prevent excessive updates
 * Useful for search inputs, API calls, or any operation that should be delayed
 * until the user stops making changes
 *
 * @param value - The value to debounce (can be any type)
 * @param delay - Delay in milliseconds before updating the debounced value
 * @returns The debounced value that updates after the specified delay
 */
export function useDebounce<T>(value: T, delay: number): T {
  // State to hold the debounced value, initialized with the current value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timer if the effect runs again
    // This prevents multiple timers from running simultaneously
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect when value or delay changes

  return debouncedValue;
}
