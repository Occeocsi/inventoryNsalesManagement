"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { NotificationManager } from "@/lib/notifications"

interface NotificationIndicatorProps {
  userType: "admin" | "staff"
}

export function NotificationIndicator({ userType }: NotificationIndicatorProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [currentUserType, setUserType] = useState(userType)

  useEffect(() => {
    const updateCount = () => {
      const count = NotificationManager.getUnreadCount(currentUserType)
      setUnreadCount(count)
    }

    // Initial load
    updateCount()

    // Set up interval to check for new notifications
    const interval = setInterval(updateCount, 1000)

    // Listen for storage changes (when notifications are added from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "app_notifications") {
        updateCount()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [currentUserType])

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Guard localStorage access
      const userSession = JSON.parse(localStorage.getItem("userSession") || "{}")
      setUserType(userSession.type || "admin")
    }
  }, [])

  return (
    <div className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
          {unreadCount > 99 ? "99+" : unreadCount}
        </div>
      )}
    </div>
  )
}
