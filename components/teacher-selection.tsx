"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Briefcase, GraduationCap, Award, ArrowLeft, FileText } from "lucide-react"

interface Staff {
  id: number
  nama: string
  jawatanGred: string
  kelayakanAkademik: string
  latarBelakangJawatan: string
  pengalamanKerja: string
  staffId: string
  createdAt: string
}

interface TeacherSelectionProps {
  onBack: () => void
}

export function TeacherSelection({ onBack }: TeacherSelectionProps) {
  const [teachers, setTeachers] = useState<Staff[]>([])
  const [selectedTeacher, setSelectedTeacher] = useState<Staff | null>(null)

  useEffect(() => {
    loadTeachers()
  }, [])

  const loadTeachers = () => {
    if (typeof window !== "undefined") {
      // Guard localStorage access
      const savedStaff = JSON.parse(localStorage.getItem("staff") || "[]")
      setTeachers(savedStaff)
    }
  }

  const handleTeacherSelect = (teacher: Staff) => {
    setSelectedTeacher(teacher)
  }

  const handleBackToList = () => {
    setSelectedTeacher(null)
  }

  const getJawatanColor = (jawatan: string) => {
    const lowerJawatan = jawatan.toLowerCase()
    if (lowerJawatan.includes("cemerlang")) {
      return "bg-yellow-100 text-yellow-800"
    } else if (lowerJawatan.includes("kanan")) {
      return "bg-blue-100 text-blue-800"
    } else if (lowerJawatan.includes("besar") || lowerJawatan.includes("pengetua")) {
      return "bg-red-100 text-red-800"
    } else if (lowerJawatan.includes("penolong")) {
      return "bg-green-100 text-green-800"
    } else {
      return "bg-gray-100 text-gray-800"
    }
  }

  if (selectedTeacher) {
    // Show detailed view of selected teacher
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button onClick={handleBackToList} variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Senarai
                </Button>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900">Profil Tenaga Pengajar</CardTitle>
                  <p className="text-gray-600 mt-1">Maklumat terperinci {selectedTeacher.nama}</p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Teacher Profile Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-6">
                {/* Profile Picture Placeholder */}
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{selectedTeacher.nama}</h2>
                    <Badge variant="outline">{selectedTeacher.staffId}</Badge>
                  </div>
                  <Badge className={`${getJawatanColor(selectedTeacher.jawatanGred)} mb-3`}>
                    {selectedTeacher.jawatanGred}
                  </Badge>
                  <p className="text-sm text-gray-600">
                    Didaftarkan pada:{" "}
                    {new Date(selectedTeacher.createdAt).toLocaleDateString("ms-MY", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="grid grid-cols-1 gap-6">
              {/* Kelayakan Akademik */}
              <Card className="border-0 shadow-sm bg-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Kelayakan Akademik</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedTeacher.kelayakanAkademik}</p>
                </CardContent>
              </Card>

              {/* Latar Belakang Jawatan */}
              <Card className="border-0 shadow-sm bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Latar Belakang Jawatan</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedTeacher.latarBelakangJawatan}</p>
                </CardContent>
              </Card>

              {/* Pengalaman Kerja */}
              <Card className="border-0 shadow-sm bg-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Award className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Pengalaman Kerja</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedTeacher.pengalamanKerja}</p>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <Button onClick={handleBackToList} className="bg-blue-600 hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali ke Senarai
              </Button>
              <Button variant="outline" onClick={() => (typeof window !== "undefined" ? window.print() : null)}>
                <FileText className="h-4 w-4 mr-2" />
                Cetak Profil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show teacher selection grid
  return (
    <div className="max-w-6xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Senarai Tenaga Pengajar</CardTitle>
              <p className="text-gray-600 mt-1">Pilih tenaga pengajar untuk melihat maklumat terperinci</p>
            </div>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {teachers.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiada Tenaga Pengajar Didaftarkan</h3>
              <p className="text-gray-600">Pentadbir belum mendaftarkan sebarang tenaga pengajar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <Card
                  key={teacher.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
                  onClick={() => handleTeacherSelect(teacher)}
                >
                  <CardContent className="p-6 text-center">
                    {/* Profile Picture Placeholder */}
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>

                    {/* Teacher Info */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{teacher.nama}</h3>
                    <Badge className={`${getJawatanColor(teacher.jawatanGred)} mb-3`}>{teacher.jawatanGred}</Badge>
                    <p className="text-sm text-gray-600 mb-4">ID: {teacher.staffId}</p>

                    {/* View Details Button */}
                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTeacherSelect(teacher)
                      }}
                    >
                      Lihat Maklumat
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Info Card for Staff */}
          {teachers.length > 0 && (
            <Card className="mt-6 bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Panduan untuk Staff:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Klik pada kad tenaga pengajar untuk melihat maklumat terperinci</li>
                  <li>• Maklumat ini telah didaftarkan oleh pentadbir sistem</li>
                  <li>• Anda boleh mencetak profil tenaga pengajar jika diperlukan</li>
                  <li>• Untuk mengubah maklumat, sila hubungi pentadbir</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
