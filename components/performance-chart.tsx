"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PerformanceChart() {
  // Sample data points for the line chart
  const dataPoints = [
    { month: "Jan", value: 300 },
    { month: "Feb", value: 380 },
    { month: "Mar", value: 320 },
    { month: "Apr", value: 480 },
    { month: "May", value: 420 },
  ]

  const maxValue = 500
  const minValue = 250

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Graf Prestasi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <svg viewBox="0 0 400 200" className="h-full w-full">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1="40" y1={40 + i * 32} x2="360" y2={40 + i * 32} stroke="#f3f4f6" strokeWidth="1" />
            ))}

            {/* Y-axis labels */}
            {[500, 450, 400, 350, 300, 250].map((value, i) => (
              <text key={value} x="30" y={45 + i * 32} textAnchor="end" className="fill-gray-500 text-xs">
                {value}
              </text>
            ))}

            {/* Line chart */}
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={dataPoints
                .map((point, i) => {
                  const x = 60 + i * 70
                  const y = 200 - ((point.value - minValue) / (maxValue - minValue)) * 160
                  return `${x},${y}`
                })
                .join(" ")}
            />

            {/* Data points */}
            {dataPoints.map((point, i) => {
              const x = 60 + i * 70
              const y = 200 - ((point.value - minValue) / (maxValue - minValue)) * 160
              return <circle key={i} cx={x} cy={y} r="4" fill="#3b82f6" />
            })}

            {/* X-axis labels */}
            {dataPoints.map((point, i) => (
              <text key={point.month} x={60 + i * 70} y="190" textAnchor="middle" className="fill-gray-500 text-xs">
                {point.month}
              </text>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
