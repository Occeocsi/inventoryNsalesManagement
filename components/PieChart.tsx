"use client"
import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

interface AttendanceData {
  studentId: number
  studentName: string
  bm: number
  bi: number
  math: number
  robotic: number
  averageAttendance: number
}

interface PieChartProps {
  data: AttendanceData[]
  colors: string[]
  onSegmentClick?: (subjectCode: string) => void
}

export function PieChart({ data, colors, onSegmentClick }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Tiada data kehadiran untuk dipaparkan.
      </div>
    )
  }

  // Calculate average attendance for each subject across all students
  const totalStudents = data.length
  const avgBM = data.reduce((sum, s) => sum + s.bm, 0) / totalStudents
  const avgBI = data.reduce((sum, s) => sum + s.bi, 0) / totalStudents
  const avgMath = data.reduce((sum, s) => sum + s.math, 0) / totalStudents
  const avgRobotic = data.reduce((sum, s) => sum + s.robotic, 0) / totalStudents

  const chartData = {
    labels: ["Bahasa Malaysia", "Bahasa Inggeris", "Matematik", "Robotik"],
    datasets: [
      {
        data: [avgBM, avgBI, avgMath, avgRobotic],
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace("hsl(", "hsl(var(--background) / 0.8)")), // Use background color for border
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed !== null) {
              label += `${context.parsed.toFixed(1)}%`
            }
            return label
          },
        },
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0 && onSegmentClick) {
        const index = elements[0].index
        const subjectCodes = ["bm", "bi", "math", "robotic"]
        onSegmentClick(subjectCodes[index])
      }
    },
  }

  return <Pie data={chartData} options={options} />
}
