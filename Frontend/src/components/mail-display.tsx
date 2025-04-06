// In your MailDisplay component file
"use client";

import {
  Archive,
  ArchiveX,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Trash2,
  Moon,
  Sun,
  Edit, // Compose icon
} from "lucide-react";
import { format } from "date-fns/format";
import { DropdownMenuContent, DropdownMenuItem } from "@/registry/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/ui/avatar";
import { Button } from "@/registry/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/registry/ui/nydropdown-menu";
import { Label } from "@/registry/ui/label";
import { Separator } from "@/registry/ui/separator";
import { Switch } from "@/registry/ui/switch";
import { Textarea } from "@/registry/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/registry/ui/tooltip";
import { Mail } from "@/data/data";
import { useTheme } from "@/context/ThemeContext";

// Import Link from react-router-dom
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { retrieveMessages, retrieveUserCID } from "@/contract/userMaps";
import { retrieveMsg, retrieveUser } from "@/funs";
import { decryptData, decryptPrivateKey } from "@/utils";

interface MailDisplayProps {
  mail: Mail | null;
}

// Defined but not called here
const getInbox = async () => {
  // 2. Get cookie safely (check if it exists)
  const currentCookieValue = Cookies.get("username");
  const hashPass = Cookies.get("password");

  if (!currentCookieValue) {
      console.error("Username cookie not found.");
      // Decide how to handle missing cookie: return null, empty array, or throw error
      return null;
  }
  if(!hashPass){
    console.error("Password not found");
    return null;
  }

  try {
    const messageCIDSResult = await retrieveMessages(currentCookieValue);
    console.log("Raw Result:", messageCIDSResult);

    // Check if the result is valid and array-like
    if (!messageCIDSResult || typeof messageCIDSResult.length !== 'number') {
         console.error("retrieveMessages did not return a valid array-like structure.");
         return null;
    }

    // *** Convert the Result proxy to a standard JS array ***
    const messageCIDS: string[] = Array.from(messageCIDSResult);
    // Or using spread syntax: const messageCIDS: string[] = [...messageCIDSResult];

    console.log("Converted Array:", messageCIDS); // Now it's a real array

    // Now iterate over the standard array
    for (const msgCID of messageCIDS) {
        console.log("Processing CID:", msgCID);

         // Ensure msgCID is actually a string before proceeding
        if (typeof msgCID !== 'string' || !msgCID.startsWith('Qm')) {
             console.warn(`Skipping invalid item found in message CIDs: ${msgCID}`);
             continue;
        }

        // --- Rest of your logic ---
        const msgData = await retrieveMsg(msgCID);
         // ... (decryption, etc.) ...

    }

    // Return processed data...

} catch (error) {
    console.error("Failed to retrieve or process messages:", error);
    return null;
}
};

// Called IMMEDIATELY when the file loads, outside any function// ERROR: currentCookieValue doesn't exist here!

export function MailDisplay({ mail }: MailDisplayProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          {/* Compose Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/compose">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Compose</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Compose</TooltipContent>
          </Tooltip>

          {/* Archive Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>

          {/* Junk Button */}
          {getInbox()}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>

          {/* Trash Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Move to trash</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to trash</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Dark Mode Toggle Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Right side buttons (Reply, etc.) */}
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!mail}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.name} />
                <AvatarFallback>
                  {mail.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.name}</div>
                <div className="line-clamp-1 text-xs">{mail.subject}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-To:</span> {mail.email}
                </div>
              </div>
            </div>
            {mail.date && (
              <div className="ml-auto text-xs text-muted-foreground">
                {format(new Date(mail.date), "PPpp")}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            {mail.text}
          </div>
          <Separator className="mt-auto" />
          <div className="p-4">
            <form>
              <div className="grid gap-4">
                <Textarea
                  className="p-4"
                  placeholder={`Reply ${mail.name}...`}
                />
                <div className="flex items-center">
                  <Label
                    htmlFor="mute"
                    className="flex items-center gap-2 text-xs font-normal"
                  >
                    <Switch id="mute" aria-label="Mute thread" /> Mute this
                    thread
                  </Label>
                  <Button
                    onClick={(e) => e.preventDefault()}
                    size="sm"
                    className="ml-auto"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}
