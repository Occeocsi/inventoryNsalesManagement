"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, School, Phone, Trash2, Edit } from "lucide-react"

interface Student {
  id: number
  nama: string
  icNo: string
  sekolah: string
  tahun: string
  jantina: string
  namaWaris: string
  noTelWaris: string
  noMatrik: string
  kelas: string
  createdAt: string
}

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    loadStudents()
  }, [])

  const loadStudents = () => {
    if (typeof window !== "undefined") {
      // Guard localStorage access
      const savedStudents = JSON.parse(localStorage.getItem("students") || "[]")
      setStudents(savedStudents)
    }
  }

  const deleteStudent = (id: number) => {
    if (typeof window !== "undefined" && confirm("Adakah anda pasti untuk memadam pelajar ini?")) {
      // Guard localStorage access
      const updatedStudents = students.filter((student) => student.id !== id)
      localStorage.setItem("students", JSON.stringify(updatedStudents))
      setStudents(updatedStudents)
    }
  }

  if (students.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-8 text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiada Pelajar Didaftarkan</h3>
          <p className="text-gray-600">Pelajar yang didaftarkan akan dipaparkan di sini.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Senarai Pelajar Didaftarkan ({students.length})</span>
          <Button onClick={loadStudents} variant="outline" size="sm">
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{student.nama}</h3>
                    <Badge variant="outline">{student.noMatrik}</Badge>
                    <Badge variant="secondary">{student.kelas}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>IC: {student.icNo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <School className="h-4 w-4" />
                      <span>{student.sekolah}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>
                        Waris: {student.namaWaris} ({student.noTelWaris})
                      </span>
                    </div>
                    <div>
                      <span>
                        Tahun: {student.tahun} | Jantina: {student.jantina}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => alert("Edit functionality coming soon!")}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteStudent(student.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
