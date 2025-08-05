"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Bell, Users, Check, CheckCheck, Clock, Trash2 } from "lucide-react"
import { NotificationManager, type Notification } from "@/lib/notifications"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [userType, setUserType] = useState<"admin" | "staff">("admin")
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    // Get user type from session
    if (typeof window !== "undefined") {
      // Guard localStorage access
      const userSession = JSON.parse(localStorage.getItem("userSession") || "{}")
      const currentUserType = userSession.type || "admin"
      setUserType(currentUserType)
      loadNotifications(currentUserType)
    }
  }, [])

  const loadNotifications = (currentUserType: "admin" | "staff") => {
    const userNotifications = NotificationManager.getNotificationsForUser(currentUserType)
    setNotifications(userNotifications)
  }

  const handleMarkAsRead = (notificationId: string) => {
    NotificationManager.markAsRead(notificationId)
    loadNotifications(userType)
  }

  const handleMarkAllAsRead = () => {
    NotificationManager.markAllAsRead(userType)
    loadNotifications(userType)
  }

  const handleDeleteNotification = (notificationId: string) => {
    const allNotifications = NotificationManager.getNotifications()
    const updatedNotifications = allNotifications.filter((n) => n.id !== notificationId)
    NotificationManager.saveNotifications(updatedNotifications)
    loadNotifications(userType)
  }

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true
    if (filter === "unread") return !notification.read
    return true
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DashboardLayout>
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-5 w-5 text-gray-600" />
            <h1 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifikasi Pelajar Baru
            </h1>
            {unreadCount > 0 && <Badge className="bg-red-500 text-white">{unreadCount} belum dibaca</Badge>}
          </div>
          <div className="text-sm text-gray-600">
            Welcome back, <span className="font-medium text-gray-900 capitalize">{userType}</span>
          </div>
        </header>

        <div className="flex-1 p-6">
          {/* Controls */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                Semua Notifikasi ({notifications.length})
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                Belum Dibaca ({unreadCount})
              </Button>
            </div>

            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} className="bg-green-600 hover:bg-green-700" size="sm">
                <CheckCheck className="h-4 w-4 mr-2" />
                Tandai Semua Dibaca
              </Button>
            )}
          </div>

          {/* Notifications List */}
          {filteredNotifications.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {filter === "unread" ? "Tiada Notifikasi Belum Dibaca" : "Tiada Notifikasi Pelajar Baru"}
                </h3>
                <p className="text-gray-600">
                  {filter === "unread"
                    ? "Semua notifikasi telah dibaca."
                    : "Notifikasi akan muncul di sini apabila ada pelajar baru didaftarkan dalam sistem."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`shadow-sm transition-all hover:shadow-md ${
                    !notification.read ? "bg-blue-50 border-blue-200 border-l-4" : "bg-white border-gray-200"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg ${!notification.read ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className={`font-semibold ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                              {notification.title}
                            </h3>
                            <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800">
                              Pelajar Baru
                            </Badge>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>

                          <p className={`text-sm mb-3 ${!notification.read ? "text-gray-700" : "text-gray-600"}`}>
                            {notification.message}
                          </p>

                          {/* Student Details */}
                          {notification.data && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <h4 className="text-xs font-medium text-gray-700 mb-2">Maklumat Pelajar:</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                                <div>
                                  <strong>Nama:</strong> {notification.data.nama}
                                </div>
                                <div>
                                  <strong>No. Matrik:</strong> {notification.data.noMatrik}
                                </div>
                                <div>
                                  <strong>Kelas:</strong> {notification.data.kelas}
                                </div>
                                <div>
                                  <strong>Sekolah:</strong> {notification.data.sekolah}
                                </div>
                                <div>
                                  <strong>Tahun:</strong> {notification.data.tahun}
                                </div>
                                <div>
                                  <strong>Jantina:</strong> {notification.data.jantina}
                                </div>
                                <div>
                                  <strong>Waris:</strong> {notification.data.namaWaris}
                                </div>
                                <div>
                                  <strong>Tel. Waris:</strong> {notification.data.noTelWaris}
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Timestamp */}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {new Date(notification.timestamp).toLocaleString("ms-MY", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Statistics */}
          {notifications.length > 0 && (
            <Card className="mt-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h3 className="font-semibold text-blue-900 mb-4">Statistik Pendaftaran Pelajar</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{notifications.length}</div>
                    <div className="text-sm text-blue-800">Jumlah Pelajar Baru</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {notifications.filter((n) => n.read).length}
                    </div>
                    <div className="text-sm text-green-800">Notifikasi Dibaca</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{unreadCount}</div>
                    <div className="text-sm text-orange-800">Belum Dibaca</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card className="mt-6 bg-green-50 border-green-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-green-900 mb-2">Maklumat Sistem Notifikasi:</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Sistem ini hanya memaparkan notifikasi untuk pendaftaran pelajar baru</li>
                <li>• Kedua-dua admin dan staff akan menerima notifikasi yang sama</li>
                <li>• Notifikasi akan muncul secara automatik selepas pelajar baru didaftarkan</li>
                <li>• Anda boleh menandakan notifikasi sebagai dibaca atau memadamkannya</li>
                <li>• Sistem menyimpan sehingga 100 notifikasi terkini</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </DashboardLayout>
  )
}
