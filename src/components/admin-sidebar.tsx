
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Stethoscope,
  LayoutDashboard,
  Users,
  LogOut,
  LifeBuoy,
  UserCircle,
  Settings,
  Shield,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/settings", label: "System Settings", icon: Settings },
  { href: "/admin/security", label: "Security Logs", icon: Shield },
];

const bottomMenuItems = [
    { href: "/account", label: "My Account", icon: UserCircle },
    { href: "/support", label: "Help/Support", icon: LifeBuoy },
]

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isActive = (href: string) => pathname.startsWith(href) && (href !== '/dashboard' || pathname === '/dashboard');

  if (!user) return null;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Stethoscope className="w-8 h-8 text-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tighter">
              HealthHub Admin
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
             <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
           <SidebarMenuItem>
            <Link href="/login">
              <SidebarMenuButton tooltip="Logout">
                <LogOut />
                <span>Logout</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarSeparator />
         <div className="flex items-center gap-3 px-2 py-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar"/>
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{user.name}</span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
      </SidebarFooter>
    </Sidebar>
  );
}
