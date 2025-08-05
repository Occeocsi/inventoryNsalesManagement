"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { User, CreditCard, Building2, Phone } from "lucide-react"
import { FacilitatorList } from "@/components/facilitator-list"

export default function MaklumatFasi() {
  const [formData, setFormData] = useState({
    nama: "",
    noMatrik: "",
    fakulti: "",
    noTelefon: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const saveFacilitatorToDatabase = (facilitatorData: any) => {
    if (typeof window !== "undefined") {
      // Guard localStorage access
      const existingFacilitators = JSON.parse(localStorage.getItem("facilitators") || "[]")
      const newFacilitator = {
        id: Date.now(),
        nama: facilitatorData.nama,
        noMatrik: facilitatorData.noMatrik,
        fakulti: facilitatorData.fakulti,
        noTelefon: facilitatorData.noTelefon,
        createdAt: new Date().toISOString(),
      }
      existingFacilitators.push(newFacilitator)
      localStorage.setItem("facilitators", JSON.stringify(existingFacilitators))

      // Remove notification creation - notifications only for students now
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      alert("Maklumat fasilitator berjaya disimpan!")
      saveFacilitatorToDatabase(formData)
      // Reset form
      setFormData({
        nama: "",
        noMatrik: "",
        fakulti: "",
        noTelefon: "",
      })
    }, 2000)
  }

  return (
    <DashboardLayout>
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-5 w-5 text-gray-600" />
            <h1 className="text-lg font-semibold text-gray-900">Maklumat Fasi</h1>
          </div>
          <div className="text-sm text-gray-600">
            Welcome back, <span className="font-medium text-gray-900">Admin</span>
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Borang Maklumat Fasilitator</CardTitle>
                <CardDescription className="text-gray-600">
                  Sila isi semua maklumat yang diperlukan untuk pendaftaran fasilitator
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nama */}
                  <div className="space-y-2">
                    <Label htmlFor="nama" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nama Penuh
                    </Label>
                    <Input
                      id="nama"
                      type="text"
                      placeholder="Masukkan nama penuh fasilitator"
                      value={formData.nama}
                      onChange={(e) => handleInputChange("nama", e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  {/* No Matrik */}
                  <div className="space-y-2">
                    <Label htmlFor="noMatrik" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      No. Matrik
                    </Label>
                    <Input
                      id="noMatrik"
                      type="text"
                      placeholder="Contoh: A20EC0123"
                      value={formData.noMatrik}
                      onChange={(e) => handleInputChange("noMatrik", e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  {/* Fakulti */}
                  <div className="space-y-2">
                    <Label htmlFor="fakulti" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Fakulti
                    </Label>
                    <Input
                      id="fakulti"
                      type="text"
                      placeholder="Masukkan nama fakulti"
                      value={formData.fakulti}
                      onChange={(e) => handleInputChange("fakulti", e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  {/* No Telefon */}
                  <div className="space-y-2">
                    <Label htmlFor="noTelefon" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      No. Telefon
                    </Label>
                    <Input
                      id="noTelefon"
                      type="tel"
                      placeholder="Contoh: 012-3456789"
                      value={formData.noTelefon}
                      onChange={(e) => handleInputChange("noTelefon", e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-base shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Menyimpan...
                        </div>
                      ) : (
                        "Hantar Maklumat"
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card className="mt-6 bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-green-900 mb-2">Arahan:</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Pastikan semua maklumat diisi dengan betul</li>
                  <li>• No. Matrik mesti dalam format yang betul (contoh: A20EC0123)</li>
                  <li>• Nama fakulti mesti lengkap dan tepat</li>
                  <li>• No. telefon mesti aktif untuk dihubungi</li>
                </ul>
              </CardContent>
            </Card>

            {/* Additional Info Card */}
            <Card className="mt-4 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Maklumat Tambahan:</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Fasilitator akan menerima notifikasi setelah pendaftaran berjaya</p>
                  <p>• Maklumat ini akan digunakan untuk pengurusan program</p>
                  <p>• Sebarang pertanyaan boleh hubungi pentadbir sistem</p>
                </div>
              </CardContent>
            </Card>

            {/* Facilitator List - show for both admin and staff */}
            <FacilitatorList />
          </div>
        </div>
      </SidebarInset>
    </DashboardLayout>
  )
}
