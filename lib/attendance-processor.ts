import type { DailyAttendanceEntry } from "@/app/attendance/page"

export interface ProcessedAttendanceData {
  studentId: number
  studentName: string
  bm: number
  bi: number
  math: number
  robotic: number
  averageAttendance: number
  totalDaysRecorded: number // To know how many days were considered for this student
}

interface StudentRawCounts {
  bm: number
  bi: number
  math: number
  robotic: number
  days: number
}

export function processAttendanceHistory(
  dailyHistory: DailyAttendanceEntry[],
  allStudents: { id: number; nama: string }[],
): ProcessedAttendanceData[] {
  const studentAttendanceCounts: Map<number, StudentRawCounts> = new Map()

  // Initialize counts for all students
  allStudents.forEach((student) => {
    studentAttendanceCounts.set(student.id, { bm: 0, bi: 0, math: 0, robotic: 0, days: 0 })
  })

  // Aggregate attendance from all daily entries
  dailyHistory.forEach((dailyEntry) => {
    dailyEntry.records.forEach((record) => {
      const counts = studentAttendanceCounts.get(record.studentId)
      if (counts) {
        counts.bm += record.bm ? 1 : 0
        counts.bi += record.bi ? 1 : 0
        counts.math += record.math ? 1 : 0
        counts.robotic += record.robotic ? 1 : 0
        counts.days += 1 // Increment day count for this student
      }
    })
  })

  const processedData: ProcessedAttendanceData[] = []
  allStudents.forEach((student) => {
    const counts = studentAttendanceCounts.get(student.id)
    if (counts && counts.days > 0) {
      const bm = Math.round((counts.bm / counts.days) * 100)
      const bi = Math.round((counts.bi / counts.days) * 100)
      const math = Math.round((counts.math / counts.days) * 100)
      const robotic = Math.round((counts.robotic / counts.days) * 100)
      const averageAttendance = Math.round((bm + bi + math + robotic) / 4)

      processedData.push({
        studentId: student.id,
        studentName: student.nama,
        bm,
        bi,
        math,
        robotic,
        averageAttendance,
        totalDaysRecorded: counts.days,
      })
    } else {
      // If no attendance recorded for a student, default to 0%
      processedData.push({
        studentId: student.id,
        studentName: student.nama,
        bm: 0,
        bi: 0,
        math: 0,
        robotic: 0,
        averageAttendance: 0,
        totalDaysRecorded: 0,
      })
    }
  })

  return processedData
}
