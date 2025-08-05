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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { FileText, Users, BarChart3, RefreshCw } from "lucide-react"
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

export default function MaklumatTerperinci() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>("")
  const [attendanceData, setAttendanceData] = useState<ProcessedAttendanceData[]>([])

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

  const getSelectedStudentData = () => {
    if (!selectedStudentId) return null
    return attendanceData.find((data) => data.studentId.toString() === selectedStudentId)
  }

  const getPieChartData = () => {
    const studentData = getSelectedStudentData()
    if (!studentData) return []

    return [
      { name: "Bahasa Malaysia", value: studentData.bm, color: COLORS[0] },
      { name: "Bahasa Inggeris", value: studentData.bi, color: COLORS[1] },
      { name: "Matematik", value: studentData.math, color: COLORS[2] },
      { name: "Robotik", value: studentData.robotic, color: COLORS[3] },
    ]
  }

  const getScatterData = () => {
    const studentData = getSelectedStudentData()
    if (!studentData) return []

    return [
      { subject: "BM", kehadiran: studentData.bm, fullName: "Bahasa Malaysia" },
      { subject: "BI", kehadiran: studentData.bi, fullName: "Bahasa Inggeris" },
      { subject: "Math", kehadiran: studentData.math, fullName: "Matematik" },
      { subject: "Robotik", kehadiran: studentData.robotic, fullName: "Robotik" },
    ]
  }

  const getOverallStats = () => {
    if (attendanceData.length === 0) return { avgBM: 0, avgBI: 0, avgMath: 0, avgRobotic: 0 }

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
    return {
      avgBM: Math.round(totals.bm / count),
      avgBI: Math.round(totals.bi / count),
      avgMath: Math.round(totals.math / count),
      avgRobotic: Math.round(totals.robotic / count),
    }
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{`${label}`}</p>
          <p className="text-blue-600">{`Kehadiran: ${payload[0].value}%`}</p>
        </div>
      )
    }
    return null
  }

  const stats = getOverallStats()

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
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
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
                <Button onClick={generateAttendanceData} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Overall Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Purata BM</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.avgBM}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Purata BI</p>
                    <p className="text-2xl font-bold text-green-600">{stats.avgBI}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Purata Math</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.avgMath}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Purata Robotik</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.avgRobotic}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {students.length === 0 ? (
            <Card className="shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-gray-500 mb-4">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">Tiada Data Pelajar</h3>
                  <p className="text-sm">Sila tambah pelajar melalui bahagian "Maklumat Pelajar" terlebih dahulu.</p>
                </div>
                <Button
                  onClick={() => (typeof window !== "undefined" ? (window.location.href = "/students") : null)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Tambah Pelajar
                </Button>
              </CardContent>
            </Card>
          ) : !selectedStudentId ? (
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
              {/* Pie Chart */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center">
                    Graf Pai Kehadiran - {getSelectedStudentData()?.studentName}
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
                        >
                          {getPieChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Kehadiran"]} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Pie Chart Summary */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Ringkasan Kehadiran:</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {getPieChartData().map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                          <span>
                            {item.name}: {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 pt-2 border-t">
                      <p className="font-medium">Purata Keseluruhan: {getSelectedStudentData()?.averageAttendance}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connected Scatter Graph (Line Chart) */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center">
                    Graf Garis Kehadiran - {getSelectedStudentData()?.studentName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={getScatterData()}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="subject" tick={{ fontSize: 12 }} interval={0} />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fontSize: 12 }}
                          label={{ value: "Kehadiran (%)", angle: -90, position: "insideLeft" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="kehadiran"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Line Chart Analysis */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Analisis Prestasi:</h4>
                    <div className="text-sm space-y-1">
                      {(() => {
                        const data = getScatterData()
                        if (data.length === 0) return <p>No data available for analysis.</p>
                        const highest = data.reduce((prev, current) =>
                          prev.kehadiran > current.kehadiran ? prev : current,
                        )
                        const lowest = data.reduce((prev, current) =>
                          prev.kehadiran < current.kehadiran ? prev : current,
                        )
                        return (
                          <>
                            <p>
                              <strong>Subjek Terbaik:</strong> {highest.fullName} ({highest.kehadiran}%)
                            </p>
                            <p>
                              <strong>Subjek Perlu Diperbaiki:</strong> {lowest.fullName} ({lowest.kehadiran}%)
                            </p>
                            <p>
                              <strong>Perbezaan:</strong> {highest.kehadiran - lowest.kehadiran}% antara tertinggi dan
                              terendah
                            </p>
                          </>
                        )
                      })()}
                    </div>
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
