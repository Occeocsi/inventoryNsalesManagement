"use client"
import { Scatter } from "react-chartjs-2"
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from "chart.js"

ChartJS.register(LinearScale, PointElement, Tooltip, Legend)

interface AttendanceData {
  studentId: number
  studentName: string
  bm: number
  bi: number
  math: number
  robotic: number
  averageAttendance: number
}

interface ScatterPlotProps {
  data: AttendanceData[]
  comparison: string // e.g., "bm-bi", "math-robotic"
  onPointClick?: (studentId: number) => void
  highlightedStudent?: number | null
}

export function ScatterPlot({ data, comparison, onPointClick, highlightedStudent }: ScatterPlotProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Tiada data kehadiran untuk dipaparkan.
      </div>
    )
  }

  let xAxisLabel = ""
  let yAxisLabel = ""
  let xKey: keyof AttendanceData = "bm"
  let yKey: keyof AttendanceData = "bi"

  switch (comparison) {
    case "bm-bi":
      xAxisLabel = "Bahasa Malaysia (%)"
      yAxisLabel = "Bahasa Inggeris (%)"
      xKey = "bm"
      yKey = "bi"
      break
    case "math-robotic":
      xAxisLabel = "Matematik (%)"
      yAxisLabel = "Robotik (%)"
      xKey = "math"
      yKey = "robotic"
      break
    case "bm-math":
      xAxisLabel = "Bahasa Malaysia (%)"
      yAxisLabel = "Matematik (%)"
      xKey = "bm"
      yKey = "math"
      break
    case "bi-robotic":
      xAxisLabel = "Bahasa Inggeris (%)"
      yAxisLabel = "Robotik (%)"
      xKey = "bi"
      yKey = "robotic"
      break
    default: // Default to BM vs BI
      xAxisLabel = "Bahasa Malaysia (%)"
      yAxisLabel = "Bahasa Inggeris (%)"
      xKey = "bm"
      yKey = "bi"
      break
  }

  const chartData = {
    datasets: [
      {
        label: "Student Performance",
        data: data.map((student) => ({
          x: student[xKey],
          y: student[yKey],
          studentId: student.studentId,
          studentName: student.studentName,
        })),
        backgroundColor: data.map((student) =>
          student.studentId === highlightedStudent ? "rgba(255, 99, 132, 0.8)" : "rgba(59, 130, 246, 0.6)",
        ),
        borderColor: data.map((student) =>
          student.studentId === highlightedStudent ? "rgba(255, 99, 132, 1)" : "rgba(59, 130, 246, 1)",
        ),
        borderWidth: 1,
        pointRadius: data.map((student) => (student.studentId === highlightedStudent ? 8 : 5)),
        pointHoverRadius: 10,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: "linear" as const,
        position: "bottom" as const,
        title: {
          display: true,
          text: xAxisLabel,
        },
        min: 0,
        max: 100,
      },
      y: {
        type: "linear" as const,
        position: "left" as const,
        title: {
          display: true,
          text: yAxisLabel,
        },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const studentName = context.raw.studentName
            const xValue = context.raw.x
            const yValue = context.raw.y
            return `${studentName}: ${xAxisLabel.split(" ")[0]}: ${xValue}%, ${yAxisLabel.split(" ")[0]}: ${yValue}%`
          },
        },
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0 && onPointClick) {
        const index = elements[0].index
        const studentId = data[index].studentId
        onPointClick(studentId)
      }
    },
  }

  return <Scatter data={chartData} options={options} />
}
