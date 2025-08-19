"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Users, TrendingUp, BarChart3, RefreshCw } from "lucide-react"
import { ScatterPlot } from "@/components/ScatterPlot"
import { PieChart } from "@/components/PieChart" // Import the PieChart component from components/PieChart.tsx

interface Student {
  id: number
  nama: string
  noMatrik: string
  kelas: string
}

interface AttendanceData {
  studentId: number
  studentName: string
  bm: number
  bi: number
  math: number
  robotic: number
  totalAttendance: number // Sum of all subject percentages
  averageAttendance: number // Average of all subject percentages
}

interface DailyAttendanceEntry {
  date: string
  records: {
    studentId: number
    bm: boolean
    bi: boolean
    math: boolean
    robotic: boolean
  }[]
}

const subjects = [
  { code: "bm", name: "Bahasa Malaysia", color: "#3b82f6" },
  { code: "bi", name: "Bahasa Inggeris", color: "#10b981" },
  { code: "math", name: "Matematik", color: "#8b5cf6" },
  { code: "robotic", name: "Robotik", color: "#f59e0b" },
]

const PIE_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]

export default function MaklumatTerperinci() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [selectedSubjectComparison, setSelectedSubjectComparison] = useState<string>("bm-bi") // For ScatterPlot
  const [highlightedStudent, setHighlightedStudent] = useState<number | null>(null) // For ScatterPlot
  const [refreshTrigger, setRefreshTrigger] = useState(0) // New state to trigger data refresh

  useEffect(() => {
    loadStudents()
    generateAttendanceData()
  }, [refreshTrigger]) // Depend on refreshTrigger

  const loadStudents = () => {
    if (typeof window !== "undefined") {
      const savedStudents = JSON.parse(localStorage.getItem("students") || "[]")
      setStudents(savedStudents)
    }
  }

  const generateAttendanceData = () => {
    if (typeof window === "undefined") {
      return [] as AttendanceData[]
    }
    const savedStudents: Student[] = JSON.parse(localStorage.getItem("students") || "[]")
    const allDailyRecords: DailyAttendanceEntry[] = JSON.parse(localStorage.getItem("daily_attendance_records") || "[]")

    const calculatedAttendanceData: AttendanceData[] = savedStudents.map((student) => {
      let totalBmClasses = 0
      let attendedBmClasses = 0
      let totalBiClasses = 0
      let attendedBiClasses = 0
      let totalMathClasses = 0
      let attendedMathClasses = 0
      let totalRoboticClasses = 0
      let attendedRoboticClasses = 0

      allDailyRecords.forEach((dailyEntry) => {
        const studentRecord = dailyEntry.records.find((rec) => rec.studentId === student.id)
        if (studentRecord) {
          totalBmClasses++
          if (studentRecord.bm) attendedBmClasses++
          totalBiClasses++
          if (studentRecord.bi) attendedBiClasses++
          totalMathClasses++
          if (studentRecord.math) attendedMathClasses++
          totalRoboticClasses++
          if (studentRecord.robotic) attendedRoboticClasses++
        }
      })

      const bmPercentage = totalBmClasses > 0 ? (attendedBmClasses / totalBmClasses) * 100 : 0
      const biPercentage = totalBiClasses > 0 ? (attendedBiClasses / totalBiClasses) * 100 : 0
      const mathPercentage = totalMathClasses > 0 ? (attendedMathClasses / totalMathClasses) * 100 : 0
      const roboticPercentage = totalRoboticClasses > 0 ? (attendedRoboticClasses / totalRoboticClasses) * 100 : 0

      const totalAttendance = bmPercentage + biPercentage + mathPercentage + roboticPercentage
      const averageAttendance = totalAttendance / 4

      return {
        studentId: student.id,
        studentName: student.nama,
        bm: Math.round(bmPercentage),
        bi: Math.round(biPercentage),
        math: Math.round(mathPercentage),
        robotic: Math.round(roboticPercentage),
        totalAttendance: Math.round(totalAttendance),
        averageAttendance: Math.round(averageAttendance),
      }
    })

    setAttendanceData(calculatedAttendanceData)
    // If no student is selected, or the previously selected student is no longer in the list, select the first one
    if (!selectedStudent && calculatedAttendanceData.length > 0) {
      setSelectedStudent(calculatedAttendanceData[0].studentId.toString())
    } else if (selectedStudent && !calculatedAttendanceData.some((s) => s.studentId.toString() === selectedStudent)) {
      // If selected student is no longer available, reset selection
      setSelectedStudent(calculatedAttendanceData.length > 0 ? calculatedAttendanceData[0].studentId.toString() : "")
    }
  }

  const getSelectedStudentData = () => {
    if (!selectedStudent) return null
    return attendanceData.find((data) => data.studentId.toString() === selectedStudent)
  }

  // The getPieChartData is no longer directly used by the PieChart component from components/PieChart.tsx
  // as that component expects an array of AttendanceData and calculates its own averages.
  // However, we still need it for the summary section below the chart.
  const getPieChartSummaryData = () => {
    const studentData = getSelectedStudentData()
    if (!studentData) return []

    return [
      { name: "Bahasa Malaysia", value: studentData.bm, color: PIE_COLORS[0] },
      { name: "Bahasa Inggeris", value: studentData.bi, color: PIE_COLORS[1] },
      { name: "Matematik", value: studentData.math, color: PIE_COLORS[2] },
      { name: "Robotik", value: studentData.robotic, color: PIE_COLORS[3] },
    ]
  }

  // Set highlighted student for scatter plot when selected student changes
  useEffect(() => {
    if (selectedStudent) {
      setHighlightedStudent(Number.parseInt(selectedStudent))
    } else {
      setHighlightedStudent(null)
    }
  }, [selectedStudent])

  const selectedStudentAttendanceData = getSelectedStudentData()

  return (
    <DashboardLayout>
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-5 w-5 text-gray-600" />
            <h1 className="text-lg font-semibold text-gray-900">Maklumat Terperinci</h1>
          </div>
          <div className="text-sm text-gray-600">
            Welcome back, <span className="font-medium text-gray-900">Admin</span>
          </div>
        </header>

        <div className="flex-1 p-6">
          {/* Student Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Pilih Pelajar untuk Analisis Terperinci
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Pilih pelajar untuk melihat graf kehadiran" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.nama} - {student.noMatrik} ({student.kelas})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setRefreshTrigger((prev) => prev + 1)} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {students.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">Tiada Data Kehadiran</h3>
                  <p className="text-sm">Sila tambah pelajar terlebih dahulu untuk melihat analisis kehadiran.</p>
                </div>
                <Button
                  onClick={() => (typeof window !== "undefined" ? (window.location.href = "/students") : null)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Tambah Pelajar
                </Button>
              </CardContent>
            </Card>
          ) : !selectedStudent ? (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">Pilih Pelajar</h3>
                  <p className="text-sm">
                    Sila pilih pelajar dari dropdown di atas untuk melihat graf kehadiran terperinci.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student-Specific Pie Chart */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center">
                    Graf Pai Kehadiran - {selectedStudentAttendanceData?.studentName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {selectedStudentAttendanceData ? (
                      <PieChart
                        data={[selectedStudentAttendanceData]} // Pass the selected student's data in an array
                        colors={PIE_COLORS}
                        onSegmentClick={(subject) => {
                          console.log(
                            `Clicked on subject: ${subject} for student ${selectedStudentAttendanceData.studentName}`,
                          )
                        }}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        Tiada data kehadiran untuk dipaparkan.
                      </div>
                    )}
                  </div>

                  {/* Pie Chart Summary */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Ringkasan Kehadiran:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {getPieChartSummaryData().map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                          <span>
                            {item.name}: {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <p className="font-medium">
                        Purata Keseluruhan: {selectedStudentAttendanceData?.averageAttendance}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Student-Specific Scatter Plot (similar to dashboard) */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Korelasi Kehadiran Subjek - {selectedStudentAttendanceData?.studentName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Select value={selectedSubjectComparison} onValueChange={setSelectedSubjectComparison}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih perbandingan subjek" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bm-bi">Bahasa Malaysia vs Bahasa Inggeris</SelectItem>
                        <SelectItem value="math-robotic">Matematik vs Robotik</SelectItem>
                        <SelectItem value="bm-math">Bahasa Malaysia vs Matematik</SelectItem>
                        <SelectItem value="bi-robotic">Bahasa Inggeris vs Robotik</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="h-80">
                    <ScatterPlot
                      data={attendanceData} // Use all students' data
                      comparison={selectedSubjectComparison}
                      onPointClick={(studentId) => setSelectedStudent(studentId.toString())} // Select student on click
                      highlightedStudent={highlightedStudent}
                    />
                  </div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Analisis Korelasi:</h4>
                    <p className="text-sm text-gray-700">
                      Graf ini menunjukkan hubungan antara kehadiran pelajar dalam dua subjek yang dipilih. Titik yang
                      disorot adalah pelajar yang sedang dipilih.
                    </p>
                    <p className="text-sm text-gray-700 mt-2">
                      Titik di kuadran kanan atas menunjukkan prestasi kehadiran yang baik dalam kedua-dua subjek.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* All Students Summary Table */}
          {students.length > 0 && (
            <Card className="mt-6 shadow-lg">
              <CardHeader>
                <CardTitle>Ringkasan Kehadiran Semua Pelajar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama Pelajar</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">BM (%)</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">BI (%)</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Math (%)</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Robotik (%)</th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">Purata (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((student) => (
                        <tr key={student.studentId} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{student.studentName}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                student.bm >= 90
                                  ? "bg-green-100 text-green-800"
                                  : student.bm >= 80
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.bm}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                student.bi >= 90
                                  ? "bg-green-100 text-green-800"
                                  : student.bi >= 80
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.bi}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                student.math >= 90
                                  ? "bg-green-100 text-green-800"
                                  : student.math >= 80
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.math}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                student.robotic >= 90
                                  ? "bg-green-100 text-green-800"
                                  : student.robotic >= 80
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.robotic}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                student.averageAttendance >= 90
                                  ? "bg-green-100 text-green-800"
                                  : student.averageAttendance >= 80
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {student.averageAttendance}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </DashboardLayout>
  )
}
