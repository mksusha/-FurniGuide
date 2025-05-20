'use client'
import * as React from "react";

import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  categories: {
    id: string;
    name: string;
    slug: string;
  }[];
};
export function AppSidebar({ categories, ...props }: AppSidebarProps) {

  return (
      <SidebarProvider>
        <Sidebar
            {...props}
            className={`pt-14 hidden !lg:block ${props.className ?? ""}`}
        >

        <SidebarHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Категории</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-[2px]">
                  {categories.map(cat => (
                      <SidebarMenuItem key={cat.id}>
                        <SidebarMenuButton
                            asChild
                            className="hover:text-indigo-600"
                        >
                          <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
  );
}
