"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Upload, FileText, User, Phone, School, Calendar, Users } from "lucide-react"
import { StudentList } from "@/components/student-list"
import { NotificationManager } from "@/lib/notifications"

export default function MaklumatPelajar() {
  const [formData, setFormData] = useState({
    gambar: null as File | null,
    nama: "",
    icNo: "",
    sekolah: "",
    tahun: "",
    jantina: "",
    namaWaris: "",
    noTelWaris: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg")
    ) {
      setFormData((prev) => ({ ...prev, gambar: file }))
    } else {
      alert("Please upload a PDF, PNG, or JPG file only")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const saveStudentToDatabase = (studentData: any) => {
    if (typeof window !== "undefined") {
      // Guard localStorage access
      const existingStudents = JSON.parse(localStorage.getItem("students") || "[]")
      const newStudent = {
        id: Date.now(), // Simple ID generation
        nama: studentData.nama,
        icNo: studentData.icNo,
        sekolah: studentData.sekolah,
        tahun: studentData.tahun,
        jantina: studentData.jantina,
        namaWaris: studentData.namaWaris,
        noTelWaris: studentData.noTelWaris,
        noMatrik: `2024${String(existingStudents.length + 1).padStart(3, "0")}`, // Auto-generate matrik number
        kelas: `5${String.fromCharCode(65 + (existingStudents.length % 3))}`, // Auto-assign class (5A, 5B, 5C)
        createdAt: new Date().toISOString(),
      }
      existingStudents.push(newStudent)
      localStorage.setItem("students", JSON.stringify(existingStudents))

      // Create notification for new student registration
      NotificationManager.createStudentRegistrationNotification(newStudent)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      // Save student to localStorage
      saveStudentToDatabase(formData)

      setIsSubmitting(false)
      alert("Maklumat pelajar berjaya disimpan!")
      // Reset form
      setFormData({
        gambar: null,
        nama: "",
        icNo: "",
        sekolah: "",
        tahun: "",
        jantina: "",
        namaWaris: "",
        noTelWaris: "",
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
            <h1 className="text-lg font-semibold text-gray-900">Maklumat Pelajar</h1>
          </div>
          <div className="text-sm text-gray-600">
            Welcome back, <span className="font-medium text-gray-900">Admin</span>
          </div>
        </header>

        <div className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-gray-900">Borang Maklumat Pelajar</CardTitle>
                <CardDescription className="text-gray-600">
                  Sila isi semua maklumat yang diperlukan untuk pendaftaran pelajar
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Gambar Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="gambar" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Gambar (PDF, PNG, JPG sahaja)
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                      <input
                        id="gambar"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                      <label htmlFor="gambar" className="cursor-pointer">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {formData.gambar ? formData.gambar.name : "Klik untuk muat naik fail PDF, PNG, atau JPG"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG sahaja, maksimum 5MB</p>
                      </label>
                    </div>
                  </div>

                  {/* Nama */}
                  <div className="space-y-2">
                    <Label htmlFor="nama" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Nama Penuh
                    </Label>
                    <Input
                      id="nama"
                      type="text"
                      placeholder="Masukkan nama penuh pelajar"
                      value={formData.nama}
                      onChange={(e) => handleInputChange("nama", e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  {/* IC No */}
                  <div className="space-y-2">
                    <Label htmlFor="icNo" className="text-sm font-medium text-gray-700">
                      No. Kad Pengenalan
                    </Label>
                    <Input
                      id="icNo"
                      type="text"
                      placeholder="Contoh: 051234-56-7890"
                      value={formData.icNo}
                      onChange={(e) => handleInputChange("icNo", e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  {/* Sekolah */}
                  <div className="space-y-2">
                    <Label htmlFor="sekolah" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <School className="h-4 w-4" />
                      Sekolah
                    </Label>
                    <Input
                      id="sekolah"
                      type="text"
                      placeholder="Masukkan nama sekolah"
                      value={formData.sekolah}
                      onChange={(e) => handleInputChange("sekolah", e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  {/* Tahun */}
                  <div className="space-y-2">
                    <Label htmlFor="tahun" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Tahun
                    </Label>
                    <Select
                      value={formData.tahun}
                      onValueChange={(value) => handleInputChange("tahun", value)}
                      required
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih tahun" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Jantina */}
                  <div className="space-y-2">
                    <Label htmlFor="jantina" className="text-sm font-medium text-gray-700">
                      Jantina
                    </Label>
                    <Select
                      value={formData.jantina}
                      onValueChange={(value) => handleInputChange("jantina", value)}
                      required
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Pilih jantina" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lelaki">Lelaki</SelectItem>
                        <SelectItem value="perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Nama Waris */}
                  <div className="space-y-2">
                    <Label htmlFor="namaWaris" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Nama Waris
                    </Label>
                    <Input
                      id="namaWaris"
                      type="text"
                      placeholder="Masukkan nama waris/penjaga"
                      value={formData.namaWaris}
                      onChange={(e) => handleInputChange("namaWaris", e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  {/* No Tel Waris */}
                  <div className="space-y-2">
                    <Label htmlFor="noTelWaris" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      No. Telefon Waris
                    </Label>
                    <Input
                      id="noTelWaris"
                      type="tel"
                      placeholder="Contoh: 012-3456789"
                      value={formData.noTelWaris}
                      onChange={(e) => handleInputChange("noTelWaris", e.target.value)}
                      className="h-12"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-base shadow-lg"
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
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Arahan:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Pastikan semua maklumat diisi dengan betul</li>
                  <li>• Gambar mesti dalam format PDF, PNG, atau JPG sahaja</li>
                  <li>• No. Kad Pengenalan mesti dalam format yang betul</li>
                  <li>• No. telefon waris mesti aktif untuk dihubungi</li>
                </ul>
              </CardContent>
            </Card>

            {/* Student List */}
            <StudentList />
          </div>
        </div>
      </SidebarInset>
    </DashboardLayout>
  )
}
