"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePermissions } from "@/hooks/use-permissions"

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]
  // Configurações de permissão
  resource?: string
  action?: string
  roles?: string[]
  requireAll?: boolean
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const { hasPermission, hasAnyRole, hasRole, isAdmin } = usePermissions()

  const checkAccess = (item: NavItem): boolean => {
    // Se é admin, tem acesso a tudo
    if (isAdmin()) return true

    // Se não tem configuração de permissão, permite acesso
    if (!item.resource && !item.action && (!item.roles || item.roles.length === 0)) {
      return true
    }

    const hasRequiredPermission = item.resource && item.action ? hasPermission(item.resource, item.action) : true

    const hasRequiredRole =
      item.roles && item.roles.length > 0
        ? item.requireAll
          ? item.roles.every(hasRole)
          : hasAnyRole(item.roles)
        : true

    return item.requireAll ? hasRequiredPermission && hasRequiredRole : hasRequiredPermission || hasRequiredRole
  }

  const filterItems = (items: NavItem[]): NavItem[] => {
    return items
      .filter(checkAccess)
      .map((item) => ({
        ...item,
        items: item.items ? filterItems(item.items) : undefined,
      }))
      .filter((item) => !item.items || item.items.length > 0) // Remove itens pai sem filhos
  }

  const filteredItems = filterItems(items)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
      <SidebarMenu>
        {filteredItems.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title} asChild={!item.items}>
                  {item.items ? (
                    <div className="flex items-center">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </div>
                  ) : (
                    <Link href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>
              </CollapsibleTrigger>
              {item.items && (
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              )}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
