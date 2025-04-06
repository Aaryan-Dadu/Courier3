"use client";

import * as React from "react";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/registry/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/ui/resizeable";
import { Separator } from "@/registry/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import { TooltipProvider } from "@/registry/ui/tooltip";
// --- CHANGE IMPORT HERE ---
import { AccountDisplay } from "@/components/account-switcher"; // Changed AccountSwitcher to AccountDisplay
// --- END CHANGE ---
import { MailDisplay } from "@/components/mail-display";
import { MailList } from "@/components/mail-list";
import { Nav } from "@/components/nav";
import { type Mail } from "@/data/data";
import { useMail } from "@/use-mail";

// Define the Account interface (can also be imported if defined elsewhere)
interface Account {
  label: string;
  email: string;
  icon: React.ReactNode;
}
interface MailProps {
  // accounts: { // Original type
  //   label: string
  //   email: string
  //   icon: React.ReactNode
  // }[]
  accounts: Account[]; // Use the interface
  mails: Mail[];
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  accounts,
  mails,
  defaultLayout = [20, 32, 48],
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [mail] = useMail();

  // Handle case where accounts might be empty, though unlikely based on previous code
  const currentAccount = accounts && accounts.length > 0 ? accounts[0] : null;

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout:mail=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true
            )}`;
          }}
          // Use onExpand for consistency if available, otherwise use onResize
          // Or check size in onResize: onResize={(size) => { if (size > navCollapsedSize) setIsCollapsed(false); ... }}
          onExpand={() => { // Assuming onExpand exists, otherwise handle in onResize
             setIsCollapsed(false);
             document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
          }}
          onResize={(size, prevSize) => { // Fallback/alternative if no onExpand
            // Check if it just expanded from collapsed state
            if (prevSize !== undefined && prevSize <= navCollapsedSize && size > navCollapsedSize && isCollapsed) {
               setIsCollapsed(false);
               document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
            } else if (size > navCollapsedSize && isCollapsed) {
              // Handle initial resize from collapsed state if needed
               setIsCollapsed(false);
               document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(false)}`;
            }
          }}
          className={cn(
            isCollapsed &&
              "min-w-[50px] transition-all duration-300 ease-in-out"
          )}
        >
          <div
            className={cn(
              "flex h-[52px] items-center justify-center",
              isCollapsed ? "h-[52px]" : "px-2"
            )}
          >
            {/* --- CHANGE COMPONENT AND PROPS HERE --- */}
            {currentAccount ? ( // Only render if an account exists
              <AccountDisplay
                isCollapsed={isCollapsed}
                account={currentAccount} // Pass the single account object
              />
            ) : (
              // Optional: Render a placeholder or nothing if no accounts
              <div className={cn(isCollapsed && "h-9 w-9 shrink-0")}></div>
            )}
            {/* --- END CHANGE --- */}
          </div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              { title: "Inbox", label: "128", icon: Inbox, variant: "default", href: "/inbox" },
              { title: "Drafts", label: "9", icon: File, variant: "ghost", href: "/drafts" },
              { title: "Sent", label: "", icon: Send, variant: "ghost", href: "/sent" },
              { title: "Junk", label: "23", icon: ArchiveX, variant: "ghost", href: "/junk" },
              { title: "Trash", label: "", icon: Trash2, variant: "ghost", href: "/trash" },
              { title: "Archive", label: "", icon: Archive, variant: "ghost", href: "/archive" },
            ]}
          />
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              { title: "Social", label: "972", icon: Users2, variant: "ghost", href: "/social" },
              { title: "Updates", label: "342", icon: AlertCircle, variant: "ghost", href: "/updates" },
              { title: "Forums", label: "128", icon: MessagesSquare, variant: "ghost", href: "/forums" },
              { title: "Shopping", label: "8", icon: ShoppingCart, variant: "ghost", href: "/shopping" },
              { title: "Promotions", label: "21", icon: Archive, variant: "ghost", href: "/promotions" },
            ]}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          {/* ... rest of the Tabs and MailList component ... */}
           <Tabs defaultValue="all">
             <div className="flex items-center px-4 py-2">
               <h1 className="text-xl font-bold">Inbox</h1>
               <TabsList className="ml-auto">
                 <TabsTrigger
                   value="all"
                   className="text-zinc-600 dark:text-zinc-200"
                 >
                   All mail
                 </TabsTrigger>
                 <TabsTrigger
                   value="unread"
                   className="text-zinc-600 dark:text-zinc-200"
                 >
                   Unread
                 </TabsTrigger>
               </TabsList>
             </div>
             <Separator />
             <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
               <form>
                 <div className="relative">
                   <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input placeholder="Search" className="pl-8" />
                 </div>
               </form>
             </div>
             <TabsContent value="all" className="m-0">
               <MailList items={mails} />
             </TabsContent>
             <TabsContent value="unread" className="m-0">
               <MailList items={mails.filter((item) => !item.read)} />
             </TabsContent>
           </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
          <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </TooltipProvider>
  );
}