"use client"

import { LayoutDashboard, Users, Building, UserCheck, Settings, FileText, LogOut } from "lucide-react"
import { usePathname } from "next/navigation"
import { NotificationIndicator } from "@/components/notification-indicator"
import { useState, useEffect } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const [userType, setUserType] = useState<"admin" | "staff">("admin")

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Guard localStorage access
      const userSession = JSON.parse(localStorage.getItem("userSession") || "{}")
      setUserType(userSession.type || "admin")
    }
  }, [])

  const navigationItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Maklumat Pelajar",
      url: "/students",
      icon: Users,
    },
    {
      title: "Maklumat Fasi",
      url: "/facilities",
      icon: Building,
    },
    {
      title: "Kehadiran",
      url: "/attendance",
      icon: UserCheck,
    },
    {
      title: "Pengurusan",
      url: "/management",
      icon: Settings,
    },
    {
      title: "Maklumat Terperinci",
      url: "/detailed",
      icon: FileText,
    },
    {
      title: "Laporan",
      url: "/reports",
      icon: FileText,
    },
    {
      title: "Notifikasi",
      url: "/notifications",
      icon: () => <NotificationIndicator userType={userType} />,
    },
    {
      title: "Logout",
      url: "/logout",
      icon: LogOut,
    },
  ]

  return (
    <Sidebar className="border-r-0">
      <div className="flex h-full flex-col bg-gradient-to-b from-blue-600 to-blue-800">
        <SidebarHeader className="border-b border-blue-500/20 p-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">EduEmpower</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="flex-1 px-3 py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`
                          w-full justify-start px-4 py-3 text-blue-100 hover:bg-blue-500/20 hover:text-white transition-colors
                          ${isActive ? "bg-blue-500/30 text-white font-medium" : ""}
                        `}
                      >
                        <a href={item.url} className="flex items-center gap-3">
                          {typeof item.icon === "function" ? item.icon() : <item.icon className="h-5 w-5" />}
                          <span className="text-sm">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
      <SidebarRail />
    </Sidebar>
  )
}
