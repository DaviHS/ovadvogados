"use client"

import type * as React from "react"
import { Home } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
// import { NavSecondary } from "./nav-secundary"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"
import Link from "next/link"  

const data = {
  navMain: [
    {
      icon: Home,
      title: "Início",
      url: `/app`,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  
  const user = {
    name: session?.user.fullName || "Usuário",
    email: session?.user.email || "email@seuemail.com",
    treatment: "",
  }

  return (
    <Sidebar className="top-[--header-height] !h-[calc(100svh-var(--header-height))]" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href={`/app`}>
                <div className="flex h-14 items-center gap-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`/logo-aviao.png`} alt="Company logo" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">RampSync</span>
                  <span className="truncate text-xs">email suporte aqui</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/*<NavProjects projects={data.projects} />*/}
        {/*<NavSecondary items={data.navSecondary} className="mt-auto" />*/}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
