"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut, CheckCircle } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear any stored session data
    if (typeof window !== "undefined") {
      localStorage.removeItem("userSession")
      sessionStorage.clear()
    }

    // Show logout message briefly then redirect
    const timer = setTimeout(() => {
      router.push("/")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <LogOut className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Logout Berjaya</h1>
          <p className="text-gray-600 mb-6">Anda telah berjaya log keluar dari sistem EduEmpower.</p>

          <div className="space-y-3 text-sm text-gray-500">
            <p>✓ Sesi anda telah ditamatkan dengan selamat</p>
            <p>✓ Data anda telah disimpan</p>
            <p>✓ Mengalihkan ke halaman utama...</p>
          </div>

          {/* Loading animation */}
          <div className="mt-6">
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Sila tunggu sebentar...</p>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">Terima kasih kerana menggunakan EduEmpower</p>
            <p className="text-xs text-gray-400 mt-1">© 2024 EduEmpower. Semua hak terpelihara.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
