"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Upload, FileText, User, GraduationCap, Briefcase, Award, Settings, Users, BookOpen } from "lucide-react"
import { StaffList } from "@/components/staff-list"
import { SecretariatList } from "@/components/secretariat-list"
import { TeacherSelection } from "@/components/teacher-selection"
import { OrganizationalChart } from "@/components/organizational-chart"

type ViewMode = "selection" | "secretariat" | "teacher"

export default function Pengurusan() {
  const [viewMode, setViewMode] = useState<ViewMode>("selection")
  const [userType, setUserType] = useState<string>("")
  const [teacherFormData, setTeacherFormData] = useState({
    gambar: null as File | null,
    nama: "",
    jawatanGred: "",
    kelayakanAkademik: "",
    latarBelakangJawatan: "",
    pengalamanKerja: "",
  })
  const [secretariatFormData, setSecretariatFormData] = useState({
    gambar: null as File | null,
    nama: "",
    jawatan: "",
    bahagian: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check user type from session
    const userSession = JSON.parse(localStorage.getItem("userSession") || "{}")
    setUserType(userSession.type || "admin")
  }, [])

  const handleTeacherFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg")
    ) {
      setTeacherFormData((prev) => ({ ...prev, gambar: file }))
    } else {
      alert("Sila muat naik fail PDF, PNG, atau JPG sahaja")
    }
  }

  const handleSecretariatFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (
      file &&
      (file.type === "application/pdf" ||
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/jpg")
    ) {
      setSecretariatFormData((prev) => ({ ...prev, gambar: file }))
    } else {
      alert("Sila muat naik fail PDF, PNG, atau JPG sahaja")
    }
  }

  const handleTeacherInputChange = (field: string, value: string) => {
    setTeacherFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSecretariatInputChange = (field: string, value: string) => {
    setSecretariatFormData((prev) => ({ ...prev, [field]: value }))
  }

  const saveTeacherToDatabase = (staffData: any) => {
    const existingStaff = JSON.parse(localStorage.getItem("staff") || "[]")
    const newStaff = {
      id: Date.now(),
      nama: staffData.nama,
      jawatanGred: staffData.jawatanGred,
      kelayakanAkademik: staffData.kelayakanAkademik,
      latarBelakangJawatan: staffData.latarBelakangJawatan,
      pengalamanKerja: staffData.pengalamanKerja,
      staffId: `STF${String(existingStaff.length + 1).padStart(4, "0")}`,
      createdAt: new Date().toISOString(),
    }
    existingStaff.push(newStaff)
    localStorage.setItem("staff", JSON.stringify(existingStaff))

    // Remove notification creation - notifications only for students now
  }

  const saveSecretariatToDatabase = (secretariatData: any) => {
    const existingSecretariat = JSON.parse(localStorage.getItem("secretariat") || "[]")
    const newSecretariat = {
      id: Date.now(),
      nama: secretariatData.nama,
      jawatan: secretariatData.jawatan,
      bahagian: secretariatData.bahagian,
      secretariatId: `SEC${String(existingSecretariat.length + 1).padStart(4, "0")}`,
      createdAt: new Date().toISOString(),
    }
    existingSecretariat.push(newSecretariat)
    localStorage.setItem("secretariat", JSON.stringify(existingSecretariat))

    // Remove notification creation - notifications only for students now
  }

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      saveTeacherToDatabase(teacherFormData)
      setIsSubmitting(false)
      alert("Maklumat tenaga pengajar berjaya disimpan!")
      setTeacherFormData({
        gambar: null,
        nama: "",
        jawatanGred: "",
        kelayakanAkademik: "",
        latarBelakangJawatan: "",
        pengalamanKerja: "",
      })
    }, 2000)
  }

  const handleSecretariatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      saveSecretariatToDatabase(secretariatFormData)
      setIsSubmitting(false)
      alert("Maklumat ahli sekretariat berjaya disimpan!")
      setSecretariatFormData({
        gambar: null,
        nama: "",
        jawatan: "",
        bahagian: "",
      })
    }, 2000)
  }

  const handleBackToSelection = () => {
    setViewMode("selection")
  }

  return (
    <DashboardLayout>
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-5 w-5 text-gray-600" />
            <h1 className="text-lg font-semibold text-gray-900">Pengurusan</h1>
            {viewMode !== "selection" && (
              <Button onClick={handleBackToSelection} variant="outline" size="sm" className="ml-4 bg-transparent">
                ← Kembali
              </Button>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Welcome back, <span className="font-medium text-gray-900">Admin</span>
          </div>
        </header>

        <div className="flex-1 p-6">
          {/* Selection View */}
          {viewMode === "selection" && (
            <div className="max-w-4xl mx-auto">
              <Card className="shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Settings className="h-6 w-6" />
                    Sistem Pengurusan
                  </CardTitle>
                  <CardDescription className="text-gray-600">Pilih bahagian yang ingin diuruskan</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Lihat Sekretariat */}
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                      onClick={() => setViewMode("secretariat")}
                    >
                      <CardContent className="p-8 text-center">
                        <div className="mb-4">
                          <Users className="h-16 w-16 mx-auto text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Lihat Sekretariat</h3>
                        <p className="text-gray-600 mb-4">Urus maklumat ahli sekretariat dan pentadbiran</p>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Masuk Sekretariat</Button>
                      </CardContent>
                    </Card>

                    {/* Lihat Tenaga Pengajar */}
                    <Card
                      className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300"
                      onClick={() => setViewMode("teacher")}
                    >
                      <CardContent className="p-8 text-center">
                        <div className="mb-4">
                          <BookOpen className="h-16 w-16 mx-auto text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Lihat Tenaga Pengajar</h3>
                        <p className="text-gray-600 mb-4">Urus maklumat guru dan tenaga pengajar</p>
                        <Button className="w-full bg-green-600 hover:bg-green-700">Masuk Tenaga Pengajar</Button>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Users className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Jumlah Sekretariat</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {JSON.parse(localStorage.getItem("secretariat") || "[]").length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Jumlah Tenaga Pengajar</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {JSON.parse(localStorage.getItem("staff") || "[]").length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Secretariat View */}
          {viewMode === "secretariat" && (
            <div className="max-w-4xl mx-auto">
              {userType === "admin" ? (
                // Show existing admin form
                <>
                  <Card className="shadow-lg">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <Users className="h-6 w-6" />
                        Borang Maklumat Ahli Sekretariat
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Sila isi semua maklumat yang diperlukan untuk pendaftaran ahli sekretariat
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleSecretariatSubmit} className="space-y-6">
                        {/* Keep all existing form fields */}
                        {/* Gambar Upload */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="secretariat-gambar"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Gambar (PDF, PNG, JPG sahaja) *
                          </Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <input
                              id="secretariat-gambar"
                              type="file"
                              accept=".pdf,.png,.jpg,.jpeg"
                              onChange={handleSecretariatFileChange}
                              className="hidden"
                              required
                            />
                            <label htmlFor="secretariat-gambar" className="cursor-pointer">
                              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">
                                {secretariatFormData.gambar
                                  ? secretariatFormData.gambar.name
                                  : "Klik untuk muat naik fail PDF, PNG, atau JPG"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG sahaja, maksimum 10MB</p>
                            </label>
                          </div>
                        </div>

                        {/* Nama */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="secretariat-nama"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            Nama Penuh *
                          </Label>
                          <Input
                            id="secretariat-nama"
                            type="text"
                            placeholder="Masukkan nama penuh"
                            value={secretariatFormData.nama}
                            onChange={(e) => handleSecretariatInputChange("nama", e.target.value)}
                            className="h-12"
                            required
                          />
                        </div>

                        {/* Jawatan */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="secretariat-jawatan"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <Briefcase className="h-4 w-4" />
                            Jawatan *
                          </Label>
                          <Input
                            id="secretariat-jawatan"
                            type="text"
                            placeholder="Contoh: Pengarah, Timbalan Pengarah, Ketua Bahagian"
                            value={secretariatFormData.jawatan}
                            onChange={(e) => handleSecretariatInputChange("jawatan", e.target.value)}
                            className="h-12"
                            required
                          />
                        </div>

                        {/* Bahagian */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="secretariat-bahagian"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <Settings className="h-4 w-4" />
                            Bahagian *
                          </Label>
                          <Select
                            value={secretariatFormData.bahagian}
                            onValueChange={(value) => handleSecretariatInputChange("bahagian", value)}
                            required
                          >
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Pilih bahagian" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pengarah">Pengarah (Tidak termasuk dalam bahagian)</SelectItem>
                              <SelectItem value="kajian-strategik">Bahagian Kajian Strategik</SelectItem>
                              <SelectItem value="komuniti">Bahagian Komuniti</SelectItem>
                            </SelectContent>
                          </Select>
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
                              "Hantar Maklumat Ahli Sekretariat"
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Instructions Card */}
                  <Card className="mt-6 bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-blue-900 mb-2">Arahan Pengisian:</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Pastikan semua maklumat diisi dengan lengkap dan tepat</li>
                        <li>• Gambar mesti dalam format PDF, PNG, atau JPG sahaja (maksimum 10MB)</li>
                        <li>• Pengarah tidak termasuk dalam mana-mana bahagian khusus</li>
                        <li>• Pilih bahagian yang sesuai dengan tugas dan tanggungjawab</li>
                        <li>• Semua medan bertanda (*) adalah wajib diisi</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Secretariat List */}
                  <SecretariatList />
                </>
              ) : (
                // Show organizational chart for staff
                <OrganizationalChart onBack={handleBackToSelection} />
              )}
            </div>
          )}

          {/* Teacher View */}
          {viewMode === "teacher" && (
            <div className="max-w-4xl mx-auto">
              {userType === "admin" ? (
                // Show existing admin form
                <Card className="shadow-lg">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                      <BookOpen className="h-6 w-6" />
                      Borang Maklumat Tenaga Pengajar
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Sila isi semua maklumat yang diperlukan untuk pendaftaran tenaga pengajar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {/* Keep existing admin form content */}
                    <form onSubmit={handleTeacherSubmit} className="space-y-6">
                      {/* All existing form fields */}
                      {/* Gambar Upload */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="teacher-gambar"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Gambar (PDF, PNG, JPG sahaja) *
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                          <input
                            id="teacher-gambar"
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={handleTeacherFileChange}
                            className="hidden"
                            required
                          />
                          <label htmlFor="teacher-gambar" className="cursor-pointer">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              {teacherFormData.gambar
                                ? teacherFormData.gambar.name
                                : "Klik untuk muat naik fail PDF, PNG, atau JPG"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PDF, PNG, JPG sahaja, maksimum 10MB</p>
                          </label>
                        </div>
                      </div>

                      {/* Personal Information */}
                      <div className="grid grid-cols-1 gap-6">
                        {/* Nama */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="teacher-nama"
                            className="text-sm font-medium text-gray-700 flex items-center gap-2"
                          >
                            <User className="h-4 w-4" />
                            Nama Penuh *
                          </Label>
                          <Input
                            id="teacher-nama"
                            type="text"
                            placeholder="Masukkan nama penuh"
                            value={teacherFormData.nama}
                            onChange={(e) => handleTeacherInputChange("nama", e.target.value)}
                            className="h-12"
                            required
                          />
                        </div>
                      </div>

                      {/* Jawatan/Gred */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="teacher-jawatanGred"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Briefcase className="h-4 w-4" />
                          Jawatan/Gred *
                        </Label>
                        <Input
                          id="teacher-jawatanGred"
                          type="text"
                          placeholder="Contoh: Guru DG44, Guru Kanan, Penolong Kanan"
                          value={teacherFormData.jawatanGred}
                          onChange={(e) => handleTeacherInputChange("jawatanGred", e.target.value)}
                          className="h-12"
                          required
                        />
                      </div>

                      {/* Kelayakan Akademik */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="teacher-kelayakanAkademik"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <GraduationCap className="h-4 w-4" />
                          Kelayakan Akademik *
                        </Label>
                        <Textarea
                          id="teacher-kelayakanAkademik"
                          placeholder="Contoh: Ijazah Sarjana Muda Pendidikan (Matematik) - Universiti Malaya, Diploma Perguruan - Institut Pendidikan Guru"
                          value={teacherFormData.kelayakanAkademik}
                          onChange={(e) => handleTeacherInputChange("kelayakanAkademik", e.target.value)}
                          className="min-h-[100px]"
                          required
                        />
                      </div>

                      {/* Latar Belakang Jawatan */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="teacher-latarBelakangJawatan"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Briefcase className="h-4 w-4" />
                          Latar Belakang Jawatan *
                        </Label>
                        <Textarea
                          id="teacher-latarBelakangJawatan"
                          placeholder="Nyatakan jawatan-jawatan yang pernah dipegang dan tempoh perkhidmatan"
                          value={teacherFormData.latarBelakangJawatan}
                          onChange={(e) => handleTeacherInputChange("latarBelakangJawatan", e.target.value)}
                          className="min-h-[100px]"
                          required
                        />
                      </div>

                      {/* Pengalaman Kerja */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="teacher-pengalamanKerja"
                          className="text-sm font-medium text-gray-700 flex items-center gap-2"
                        >
                          <Award className="h-4 w-4" />
                          Pengalaman Kerja *
                        </Label>
                        <Textarea
                          id="teacher-pengalamanKerja"
                          placeholder="Nyatakan pengalaman kerja yang berkaitan dengan bidang pendidikan"
                          value={teacherFormData.pengalamanKerja}
                          onChange={(e) => handleTeacherInputChange("pengalamanKerja", e.target.value)}
                          className="min-h-[100px]"
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
                            "Hantar Maklumat Tenaga Pengajar"
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                // Show teacher selection for staff
                <TeacherSelection onBack={handleBackToSelection} />
              )}

              {userType === "admin" && (
                <>
                  {/* Instructions Card */}
                  <Card className="mt-6 bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-green-900 mb-2">Arahan Pengisian:</h3>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Pastikan semua maklumat diisi dengan lengkap dan tepat</li>
                        <li>• Gambar mesti dalam format PDF, PNG, atau JPG sahaja (maksimum 10MB)</li>
                        <li>• Kelayakan akademik hendaklah disusun mengikut tahap tertinggi</li>
                        <li>• Nyatakan pengalaman kerja secara terperinci dengan tempoh masa</li>
                        <li>• Semua medan bertanda (*) adalah wajib diisi</li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Staff List */}
                  <StaffList />
                </>
              )}
            </div>
          )}
        </div>
      </SidebarInset>
    </DashboardLayout>
  )
}
