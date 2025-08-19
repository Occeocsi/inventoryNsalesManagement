"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { PieChart } from "@/components/PieChart"
import { ScatterPlot } from "@/components/ScatterPlot"
import { TrendingUp, BarChart3, RefreshCw } from "lucide-react"

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
  averageAttendance: number
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

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]
const SUBJECT_CODES = ["bm", "bi", "math", "robotic"]

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([])
  const [selectedSubjectComparison, setSelectedSubjectComparison] = useState<string>("bm-bi")
  const [highlightedStudent, setHighlightedStudent] = useState<number | null>(null)

  useEffect(() => {
    loadStudents()
    generateAttendanceData()
  }, [])

  const loadStudents = () => {
    if (typeof window !== "undefined") {
      const savedStudents = JSON.parse(localStorage.getItem("students") || "[]")
      setStudents(savedStudents)
    }
  }

  const generateAttendanceData = () => {
    if (typeof window === "undefined") return

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

      const overallTotalClasses = totalBmClasses + totalBiClasses + totalMathClasses + totalRoboticClasses
      const overallAttendedClasses =
        attendedBmClasses + attendedBiClasses + attendedMathClasses + attendedRoboticClasses
      const averageAttendance = overallTotalClasses > 0 ? (overallAttendedClasses / overallTotalClasses) * 100 : 0

      return {
        studentId: student.id,
        studentName: student.nama,
        bm: Math.round(bmPercentage),
        bi: Math.round(biPercentage),
        math: Math.round(mathPercentage),
        robotic: Math.round(roboticPercentage),
        averageAttendance: Math.round(averageAttendance),
      }
    })

    setAttendanceData(calculatedAttendanceData)
  }

  const getOverallStats = () => {
    if (attendanceData.length === 0) return { avgOverall: 0, highPerformers: 0, needsAttention: 0 }

    const avgOverall = Math.round(
      attendanceData.reduce((sum, student) => sum + student.averageAttendance, 0) / attendanceData.length,
    )
    const highPerformers = attendanceData.filter((student) => student.averageAttendance >= 90).length
    const needsAttention = attendanceData.filter((student) => student.averageAttendance < 75).length

    return { avgOverall, highPerformers, needsAttention }
  }

  const stats = getOverallStats()

  return (
    <DashboardLayout>
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="h-5 w-5 text-gray-600" />
            <h1 className="text-lg font-semibold text-gray-900">Dashboard Overview</h1>
          </div>
          <div className="text-sm text-gray-600">
            Welcome back, <span className="font-medium text-gray-900">Admin</span>
          </div>
        </header>

        <div className="flex-1 space-y-6 p-6">
          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Pelajar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{students.length}</div>
                <p className="text-xs text-gray-500 mt-1">Active students</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Purata Kehadiran</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{stats.avgOverall}%</div>
                <p className="text-xs text-gray-500 mt-1">Overall attendance</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Prestasi Tinggi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">{stats.highPerformers}</div>
                <p className="text-xs text-gray-500 mt-1">≥90% attendance</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Perlu Perhatian</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600">{stats.needsAttention}</div>
                <p className="text-xs text-gray-500 mt-1">{"<75% attendance"}</p>
              </CardContent>
            </Card>
          </div>

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
          ) : (
            <>
              {/* Chart Controls */}
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <h3 className="font-semibold text-gray-900">Analisis Kehadiran Interaktif</h3>
                      <Select value={selectedSubjectComparison} onValueChange={setSelectedSubjectComparison}>
                        <SelectTrigger className="w-64">
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
                    <Button onClick={generateAttendanceData} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Connected Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Purata Kehadiran Mengikut Subjek
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <PieChart
                        data={attendanceData}
                        colors={COLORS}
                        onSegmentClick={(subject) => {
                          // This can be used to update the scatter plot or other components
                          // For now, it just logs the clicked subject
                          console.log(`Clicked on subject: ${subject}`)
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Scatter Plot */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Korelasi Kehadiran Subjek
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ScatterPlot
                        data={attendanceData}
                        comparison={selectedSubjectComparison}
                        onPointClick={(studentId) => setHighlightedStudent(studentId)}
                        highlightedStudent={highlightedStudent}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights Card */}
              <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Insight Analisis Kehadiran
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Prestasi Keseluruhan:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>
                          • Purata kehadiran keseluruhan: <strong>{stats.avgOverall}%</strong>
                        </li>
                        <li>• {stats.highPerformers} pelajar mencapai prestasi tinggi (≥90%)</li>
                        <li>
                          • {stats.needsAttention} pelajar memerlukan perhatian khusus ({"<75%"})
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-800 mb-2">Cara Menggunakan Graf:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>
                          • <strong>Graf Pai:</strong> Klik untuk lihat purata setiap subjek
                        </li>
                        <li>
                          • <strong>Graf Scatter:</strong> Klik titik untuk sorot pelajar
                        </li>
                        <li>
                          • <strong>Dropdown:</strong> Tukar perbandingan subjek
                        </li>
                        <li>• Titik di kuadran kanan atas menunjukkan prestasi terbaik</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </SidebarInset>
    </DashboardLayout>
  )
}
