"use client"

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle } from "lucide-react"

export default function UserDashboardPage() {
  return (
    <DashboardLayout>
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-5 w-5 text-gray-600" />
            <h1 className="text-lg font-semibold text-gray-900">User Dashboard</h1>
          </div>
          <div className="text-sm text-gray-600">
            Welcome back, <span className="font-medium text-gray-900">User</span>
          </div>
        </header>

        <div className="flex-1 p-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <UserCircle className="h-6 w-6" />
                Welcome to Your Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-4">This is a placeholder for the user-specific dashboard content.</p>
              <p className="text-sm text-gray-500">More features and personalized data will be added here soon.</p>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </DashboardLayout>
  )
}
