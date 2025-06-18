"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { type PropsWithChildren } from "react";
import { SiteHeader } from "@/components/sidebar/site-header";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { PageContent } from "@/components/page";

export default function AppLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col h-full">
        <SiteHeader />
        <div className="flex flex-1 h-full">
          <AppSidebar />
            <div className="flex-1 overflow-auto font-sans">
              <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 bg-gray-50">
                <PageContent>
                  {children}
                </PageContent>
              </div>
            </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
