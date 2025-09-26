"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggleButton } from "@/components/Mainpage/mode-toggle";
import UserSyncWrapper from "@/components/Providers/UserSyncWrapper";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import stramClient from "@/lib/stream";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Chat } from "stream-chat-react";
import "stream-chat-react/dist/css/v2/index.css";
function Layout({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const chatTheme =
    resolvedTheme === "dark" ? "str-chat__theme-dark" : "str-chat__theme-light";
  return (
    <UserSyncWrapper>
      <Chat client={stramClient} theme={mounted ? chatTheme : undefined}>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "19rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset>
            <header className="flex items-center justify-between h-16 px-4">
              <div className="flex shrink-0 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <Link href="/dashboard">
                  <h1 className="text-lg font-bold tracking-wider uppercase">
                    Lynk
                  </h1>
                </Link>
              </div>
              <div className="flex items-center">
                <ThemeToggleButton variant="circle" blur className="size-8" />
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </Chat>
    </UserSyncWrapper>
  );
}

export default Layout;
