"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Student {
  id: number
  name: string
  grade: string
  totalClasses: number
  attended: number
  absent: number
  score: number
  status: string
}

interface StudentTableProps {
  students: Student[]
}

export function StudentTable({ students }: StudentTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "good":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "needs-attention":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "critical":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "Excellent"
      case "good":
        return "Good"
      case "needs-attention":
        return "Needs Attention"
      case "critical":
        return "Critical"
      default:
        return "Unknown"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Performance Overview</CardTitle>
        <CardDescription>Student scores correlated with attendance data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student) => {
            const attendanceRate = Math.round((student.attended / student.totalClasses) * 100)

            return (
              <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">Grade {student.grade}</p>
                    </div>
                    <Badge className={getStatusColor(student.status)}>{getStatusText(student.status)}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Score</p>
                      <p className="font-semibold text-lg">{student.score}/100</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Attendance</p>
                      <p className="font-semibold">{attendanceRate}%</p>
                      <Progress value={attendanceRate} className="h-2 mt-1" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Absent Days</p>
                      <p className="font-semibold text-red-600">{student.absent}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
