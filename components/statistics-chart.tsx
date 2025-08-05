"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatisticsChart() {
  const activePercentage = 75
  const inactivePercentage = 25

  // Calculate angles for the donut chart
  const activeAngle = (activePercentage / 100) * 360
  const inactiveAngle = (inactivePercentage / 100) * 360

  const radius = 60
  const strokeWidth = 20
  const center = 80

  // Calculate path for active segment
  const activeEndAngle = activeAngle * (Math.PI / 180)
  const activeX = center + radius * Math.cos(activeEndAngle - Math.PI / 2)
  const activeY = center + radius * Math.sin(activeEndAngle - Math.PI / 2)
  const largeArcFlag = activeAngle > 180 ? 1 : 0

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Statistik Ringkas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg width="160" height="160" className="transform -rotate-90">
              {/* Background circle */}
              <circle cx={center} cy={center} r={radius} fill="none" stroke="#f3f4f6" strokeWidth={strokeWidth} />

              {/* Active segment (green) */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#10b981"
                strokeWidth={strokeWidth}
                strokeDasharray={`${(activePercentage / 100) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
                strokeLinecap="round"
              />

              {/* Inactive segment (red) */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#ef4444"
                strokeWidth={strokeWidth}
                strokeDasharray={`${(inactivePercentage / 100) * 2 * Math.PI * radius} ${2 * Math.PI * radius}`}
                strokeDashoffset={`-${(activePercentage / 100) * 2 * Math.PI * radius}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">Inactive</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
