"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Check, X, Save, Calendar, Users } from "lucide-react"

interface Student {
  id: number
  nama: string
  noMatrik: string
  kelas: string
}

interface AttendanceRecord {
  studentId: number
  bm: boolean
  bi: boolean
  math: boolean
  robotic: boolean
}

const subjects = [
  { code: "bm", name: "Bahasa Malaysia", color: "bg-blue-100 text-blue-800" },
  { code: "bi", name: "Bahasa Inggeris", color: "bg-green-100 text-green-800" },
  { code: "math", name: "Matematik", color: "bg-purple-100 text-purple-800" },
  { code: "robotic", name: "Robotik", color: "bg-orange-100 text-orange-800" },
]

export default function Kehadiran() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [students, setStudents] = useState<Student[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Load students from localStorage on component mount
  useEffect(() => {
    const loadStudents = () => {
      if (typeof window !== "undefined") {
        const savedStudents = JSON.parse(localStorage.getItem("students") || "[]")
        setStudents(savedStudents)
      }
    }
    loadStudents()
  }, [])

  // Initialize attendance when students are loaded
  useEffect(() => {
    if (students.length > 0) {
      setAttendance(
        students.map((student) => ({
          studentId: student.id,
          bm: true,
          bi: true,
          math: true,
          robotic: true,
        })),
      )
    }
  }, [students])

  const toggleAttendance = (studentId: number, subject: keyof Omit<AttendanceRecord, "studentId">) => {
    setAttendance((prev) =>
      prev.map((record) => (record.studentId === studentId ? { ...record, [subject]: !record[subject] } : record)),
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      alert(`Kehadiran untuk tarikh ${selectedDate} berjaya disimpan!`)
    }, 2000)
  }

  const getAttendanceForStudent = (studentId: number) => {
    return attendance.find((record) => record.studentId === studentId)
  }

  const getAttendanceStats = () => {
    const totalStudents = students.length
    const stats = subjects.map((subject) => {
      const presentCount = attendance.filter(
        (record) => record[subject.code as keyof Omit<AttendanceRecord, "studentId">],
      ).length
      return {
        subject: subject.name,
        present: presentCount,
        absent: totalStudents - presentCount,
        percentage: Math.round((presentCount / totalStudents) * 100),
      }
    })
    return stats
  }

  return (
    <DashboardLayout>
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-5 w-5 text-gray-600" />
            <h1 className="text-lg font-semibold text-gray-900">Kehadiran</h1>
          </div>
          <div className="text-sm text-gray-600">
            Welcome back, <span className="font-medium text-gray-900">Admin</span>
          </div>
        </header>

        <div className="flex-1 p-6">
          {/* Date Selection and Stats */}
          <div className="mb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Calendar className="h-5 w-5 text-gray-600" />
                <div>
                  <label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Pilih Tarikh:
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="ml-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Menyimpan...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Simpan Kehadiran
                  </div>
                )}
              </Button>
            </div>

            {/* Attendance Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {getAttendanceStats().map((stat, index) => (
                <Card key={index} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${subjects[index].color}`}
                    >
                      {stat.subject}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.percentage}%</div>
                    <div className="text-sm text-gray-600">
                      {stat.present} hadir, {stat.absent} tidak hadir
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Attendance Table */}
          {students.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">Tiada Pelajar Dijumpai</h3>
                  <p className="text-sm">Sila tambah pelajar melalui bahagian "Maklumat Pelajar" terlebih dahulu.</p>
                </div>
                <Button onClick={() => (window.location.href = "/students")} className="bg-blue-600 hover:bg-blue-700">
                  Tambah Pelajar
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Senarai Kehadiran -{" "}
                  {new Date(selectedDate).toLocaleDateString("ms-MY", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">No.</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Pelajar</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">No. Matrik</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Kelas</th>
                        {subjects.map((subject) => (
                          <th key={subject.code} className="text-center py-3 px-4 font-semibold text-gray-700">
                            <div className={`inline-block px-2 py-1 rounded-full text-xs ${subject.color}`}>
                              {subject.name}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => {
                        const studentAttendance = getAttendanceForStudent(student.id)
                        return (
                          <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 text-gray-900">{index + 1}</td>
                            <td className="py-4 px-4 text-gray-900 font-medium">{student.nama}</td>
                            <td className="py-4 px-4 text-gray-600">{student.noMatrik}</td>
                            <td className="py-4 px-4 text-gray-600">{student.kelas}</td>
                            {subjects.map((subject) => (
                              <td key={subject.code} className="py-4 px-4 text-center">
                                <button
                                  onClick={() =>
                                    toggleAttendance(
                                      student.id,
                                      subject.code as keyof Omit<AttendanceRecord, "studentId">,
                                    )
                                  }
                                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                    studentAttendance?.[subject.code as keyof Omit<AttendanceRecord, "studentId">]
                                      ? "bg-green-100 text-green-600 hover:bg-green-200"
                                      : "bg-red-100 text-red-600 hover:bg-red-200"
                                  }`}
                                >
                                  {studentAttendance?.[subject.code as keyof Omit<AttendanceRecord, "studentId">] ? (
                                    <Check className="h-5 w-5" />
                                  ) : (
                                    <X className="h-5 w-5" />
                                  )}
                                </button>
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card className="mt-6 bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Panduan:</h3>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">Hadir</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                    <X className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">Tidak Hadir</span>
                </div>
                <div className="text-gray-600">• Klik pada simbol untuk mengubah status kehadiran</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </DashboardLayout>
  )
}
