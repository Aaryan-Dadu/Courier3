"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Define the shape of a single account
interface Account {
  label: string;
  email: string;
  icon: React.ReactNode;
}

interface AccountDisplayProps {
  isCollapsed: boolean;
  // Accept a single account object instead of an array
  account: Account;
}

// Rename the component for clarity
export function AccountDisplay({
  isCollapsed,
  account,
}: AccountDisplayProps) {
  // No need for state anymore

  // Use a div instead of SelectTrigger
  return (
    <div
      className={cn(
        "flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0",
        // Apply collapsed styles directly to the div
        isCollapsed &&
          "flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden" // Adjusted collapsed styles
      )}
      aria-label={`Account: ${account.label}`} // Add an aria-label for accessibility
    >
      {/* Render the icon directly */}
      {/* {account.icon} */}
      {/* Render the label conditionally */}
      <span className={cn("ml-2", isCollapsed && "hidden")}>
        {account.label}
      </span>
      {/* If you prefer to show email when expanded, you can use account.email instead */}
      {/* <span className={cn("ml-2", isCollapsed && "hidden")}>{account.email}</span> */}
    </div>
  );
}

// Optional: Update display name if needed elsewhere
// AccountDisplay.displayName = "AccountDisplay";