"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts"
import { TrendingUp, BarChart3, RefreshCw } from "lucide-react"
import { processAttendanceHistory, type ProcessedAttendanceData } from "@/lib/attendance-processor"
import type { DailyAttendanceEntry } from "@/app/attendance/page"

interface Student {
  id: number
  nama: string
  noMatrik: string
  kelas: string
}

const subjects = [
  { code: "bm", name: "Bahasa Malaysia", color: "#3b82f6" },
  { code: "bi", name: "Bahasa Inggeris", color: "#10b981" },
  { code: "math", name: "Matematik", color: "#8b5cf6" },
  { code: "robotic", name: "Robotik", color: "#f59e0b" },
]

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [attendanceData, setAttendanceData] = useState<ProcessedAttendanceData[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>("bm-bi") // Default to BM vs BI
  const [highlightedStudent, setHighlightedStudent] = useState<number | null>(null)

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    if (students.length > 0) {
      generateAttendanceData()
    }
  }, [students])

  const loadStudents = () => {
    if (typeof window !== "undefined") {
      const savedStudents = JSON.parse(localStorage.getItem("students") || "[]")
      setStudents(savedStudents)
    }
  }

  const generateAttendanceData = () => {
    if (typeof window === "undefined") {
      return
    }
    const dailyHistory: DailyAttendanceEntry[] = JSON.parse(localStorage.getItem("dailyAttendanceHistory") || "[]")
    const processed = processAttendanceHistory(dailyHistory, students)
    setAttendanceData(processed)
  }

  // Prepare pie chart data
  const getPieChartData = () => {
    if (attendanceData.length === 0) return []

    const totals = attendanceData.reduce(
      (acc, student) => ({
        bm: acc.bm + student.bm,
        bi: acc.bi + student.bi,
        math: acc.math + student.math,
        robotic: acc.robotic + student.robotic,
      }),
      { bm: 0, bi: 0, math: 0, robotic: 0 },
    )

    const count = attendanceData.length
    return [
      { name: "Bahasa Malaysia", value: Math.round(totals.bm / count), color: COLORS[0] },
      { name: "Bahasa Inggeris", value: Math.round(totals.bi / count), color: COLORS[1] },
      { name: "Matematik", value: Math.round(totals.math / count), color: COLORS[2] },
      { name: "Robotik", value: Math.round(totals.robotic / count), color: COLORS[3] },
    ]
  }

  // Get correlation data for different subject pairs
  const getCorrelationData = (subjectX: keyof ProcessedAttendanceData, subjectY: keyof ProcessedAttendanceData) => {
    return attendanceData.map((student) => ({
      x: student[subjectX] as number,
      y: student[subjectY] as number,
      math: student.math, // Include other subjects for tooltip if needed
      robotic: student.robotic,
      name: student.studentName,
      id: student.studentId,
      average: student.averageAttendance,
    }))
  }

  const getCurrentScatterData = () => {
    switch (selectedSubject) {
      case "bm-bi":
        return getCorrelationData("bm", "bi")
      case "math-robotic":
        return getCorrelationData("math", "robotic")
      case "bm-math":
        return getCorrelationData("bm", "math")
      case "bi-robotic":
        return getCorrelationData("bi", "robotic")
      default:
        return getCorrelationData("bm", "bi") // Default
    }
  }

  const getScatterLabels = () => {
    switch (selectedSubject) {
      case "bm-bi":
        return { x: "Bahasa Malaysia (%)", y: "Bahasa Inggeris (%)" }
      case "math-robotic":
        return { x: "Matematik (%)", y: "Robotik (%)" }
      case "bm-math":
        return { x: "Bahasa Malaysia (%)", y: "Matematik (%)" }
      case "bi-robotic":
        return { x: "Bahasa Inggeris (%)", y: "Robotik (%)" }
      default:
        return { x: "Bahasa Malaysia (%)", y: "Bahasa Inggeris (%)" }
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-blue-600">{`${getScatterLabels().x}: ${data.x}%`}</p>
          <p className="text-green-600">{`${getScatterLabels().y}: ${data.y}%`}</p>
          <p className="text-gray-600">{`Purata: ${data.average}%`}</p>
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-blue-600">{`Purata Kehadiran: ${payload[0].value}%`}</p>
        </div>
      )
    }
    return null
  }

  const handlePieClick = (data: any) => {
    // When pie chart is clicked, highlight related data in scatter plot
    console.log("Pie clicked:", data.name)
  }

  const handleScatterClick = (data: any) => {
    // When scatter plot point is clicked, highlight the student
    setHighlightedStudent(data.id)
    setTimeout(() => setHighlightedStudent(null), 3000) // Clear highlight after 3 seconds
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
            /* No Data State */
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
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
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
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            onClick={handlePieClick}
                          >
                            {getPieChartData().map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                                style={{ cursor: "pointer" }}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<PieTooltip />} />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Pie Chart Summary */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Ringkasan Prestasi:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {getPieChartData().map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                            <span className="text-xs">
                              {item.name}: {item.value}%
                            </span>
                          </div>
                        ))}
                      </div>
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
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart
                          data={getCurrentScatterData()}
                          margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            type="number"
                            dataKey="x"
                            domain={[0, 100]} // Adjusted domain to 0-100
                            label={{ value: getScatterLabels().x, position: "insideBottom", offset: -10 }}
                          />
                          <YAxis
                            type="number"
                            dataKey="y"
                            domain={[0, 100]} // Adjusted domain to 0-100
                            label={{ value: getScatterLabels().y, angle: -90, position: "insideLeft" }}
                          />
                          <Tooltip content={<CustomTooltip />} />

                          {/* Reference lines for performance thresholds */}
                          <ReferenceLine x={75} stroke="#ef4444" strokeDasharray="5 5" />
                          <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="5 5" />
                          <ReferenceLine x={90} stroke="#10b981" strokeDasharray="5 5" />
                          <ReferenceLine y={90} stroke="#10b981" strokeDasharray="5 5" />

                          <Scatter
                            name="Pelajar"
                            data={getCurrentScatterData()}
                            fill="#3b82f6"
                            onClick={handleScatterClick}
                          >
                            {getCurrentScatterData().map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  highlightedStudent === entry.id
                                    ? "#ef4444"
                                    : entry.average >= 90
                                      ? "#10b981"
                                      : entry.average < 75
                                        ? "#f59e0b"
                                        : "#3b82f6"
                                }
                                style={{ cursor: "pointer" }}
                              />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Scatter Plot Legend */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Panduan Graf:</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span>Prestasi Tinggi (≥90%)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span>Prestasi Sederhana</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                          <span>Perlu Perhatian ({"<75%"})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500"></div>
                          <span>Dipilih/Disorot</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        Garis rujukan: Merah (75%) dan Hijau (90%) menunjukkan ambang prestasi
                      </p>
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

              {/* Navigation Guide */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Navigation Guide</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
                  <div>
                    <p className="font-medium mb-2">Student Management:</p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • <strong>Maklumat Pelajar</strong> - View and manage student information
                      </li>
                      <li>
                        • <strong>Kehadiran</strong> - Track student attendance
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">System Management:</p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • <strong>Maklumat Fasi</strong> - Manage facilitator information
                      </li>
                      <li>
                        • <strong>Pengurusan</strong> - System administration
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Reports & Analysis:</p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • <strong>Maklumat Terperinci</strong> - Detailed student analysis
                      </li>
                      <li>
                        • <strong>Laporan</strong> - Generate comprehensive reports
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Communication:</p>
                    <ul className="space-y-1 ml-4">
                      <li>
                        • <strong>Notifikasi</strong> - View student registration alerts
                      </li>
                      <li>
                        • <strong>Logout</strong> - Sign out of system
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </DashboardLayout>
  )
}
