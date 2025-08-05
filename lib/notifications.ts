export interface Notification {
  id: string
  type: "student_registration"
  title: string
  message: string
  data: any
  timestamp: string
  read: boolean
  userTypes: ("admin" | "staff")[]
}

export class NotificationManager {
  private static STORAGE_KEY = "app_notifications"

  static getNotifications(): Notification[] {
    if (typeof window === "undefined") {
      return []
    }
    try {
      const notifications = localStorage.getItem(this.STORAGE_KEY)
      return notifications ? JSON.parse(notifications) : []
    } catch (error) {
      console.error("Error loading notifications:", error)
      return []
    }
  }

  static saveNotifications(notifications: Notification[]): void {
    if (typeof window === "undefined") {
      return
    }
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications))
    } catch (error) {
      console.error("Error saving notifications:", error)
    }
  }

  static addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">): void {
    if (typeof window === "undefined") {
      return
    }
    const notifications = this.getNotifications()
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    }

    notifications.unshift(newNotification) // Add to beginning

    // Keep only last 100 notifications
    if (notifications.length > 100) {
      notifications.splice(100)
    }

    this.saveNotifications(notifications)
  }

  static markAsRead(notificationId: string): void {
    if (typeof window === "undefined") {
      return
    }
    const notifications = this.getNotifications()
    const notification = notifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.saveNotifications(notifications)
    }
  }

  static markAllAsRead(userType: "admin" | "staff"): void {
    if (typeof window === "undefined") {
      return
    }
    const notifications = this.getNotifications()
    notifications.forEach((notification) => {
      if (notification.userTypes.includes(userType)) {
        notification.read = true
      }
    })
    this.saveNotifications(notifications)
  }

  static getUnreadCount(userType: "admin" | "staff"): number {
    if (typeof window === "undefined") {
      return 0
    }
    const notifications = this.getNotifications()
    return notifications.filter((n) => !n.read && n.userTypes.includes(userType)).length
  }

  static getNotificationsForUser(userType: "admin" | "staff"): Notification[] {
    if (typeof window === "undefined") {
      return []
    }
    const notifications = this.getNotifications()
    return notifications.filter((n) => n.userTypes.includes(userType))
  }

  static createStudentRegistrationNotification(studentData: any): void {
    this.addNotification({
      type: "student_registration",
      title: "Pelajar Baru Didaftarkan",
      message: `Pelajar baru "${studentData.nama}" telah didaftarkan dalam sistem. No. Matrik: ${studentData.noMatrik}, Kelas: ${studentData.kelas}`,
      data: studentData,
      userTypes: ["admin", "staff"],
    })
  }
}
