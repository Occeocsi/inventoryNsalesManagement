"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Briefcase, GraduationCap, Trash2, Edit } from "lucide-react"

interface Staff {
  id: number
  nama: string
  jawatanGred: string
  kelayakanAkademik: string
  latarBelakangJawatan: string
  pengalamanKerja: string
  staffId: string
  createdAt: string
  icNo: string // Added icNo field
}

export function StaffList() {
  const [staff, setStaff] = useState<Staff[]>([])

  useEffect(() => {
    loadStaff()
  }, [])

  const loadStaff = () => {
    if (typeof window !== "undefined") {
      // Guard localStorage access
      const savedStaff = JSON.parse(localStorage.getItem("staff") || "[]")
      setStaff(savedStaff)
    }
  }

  const deleteStaff = (id: number) => {
    if (typeof window !== "undefined" && confirm("Adakah anda pasti untuk memadam kakitangan ini?")) {
      // Guard localStorage access
      const updatedStaff = staff.filter((member) => member.id !== id)
      localStorage.setItem("staff", JSON.stringify(updatedStaff))
      setStaff(updatedStaff)
    }
  }

  const getJawatanColor = (jawatan: string) => {
    const lowerJawatan = jawatan.toLowerCase()
    if (lowerJawatan.includes("cemerlang")) {
      return "bg-yellow-100 text-yellow-800"
    } else if (lowerJawatan.includes("kanan")) {
      return "bg-blue-100 text-blue-800"
    } else if (lowerJawatan.includes("besar") || lowerJawatan.includes("pengetua")) {
      return "bg-red-100 text-red-800"
    } else if (lowerJawatan.includes("penolong")) {
      return "bg-green-100 text-green-800"
    } else {
      return "bg-gray-100 text-gray-800"
    }
  }

  const formatJawatan = (jawatan: string) => {
    // Return the jawatan as entered by user
    return jawatan
  }

  if (staff.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-8 text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiada Tenaga Pengajar Didaftarkan</h3>
          <p className="text-gray-600">Tenaga pengajar yang didaftarkan akan dipaparkan di sini.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Senarai Tenaga Pengajar Didaftarkan ({staff.length})</span>
          <Button onClick={loadStaff} variant="outline" size="sm">
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {staff.map((member) => (
            <div key={member.id} className="border rounded-lg p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{member.nama}</h3>
                    <Badge variant="outline">{member.staffId}</Badge>
                    <Badge className={getJawatanColor(member.jawatanGred)}>{formatJawatan(member.jawatanGred)}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>IC: {member.icNo}</span>
                    </div>
                  </div>

                  {/* Kelayakan Akademik */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-gray-900">Kelayakan Akademik:</span>
                    </div>
                    <p className="text-sm text-gray-700 ml-6">{member.kelayakanAkademik}</p>
                  </div>

                  {/* Pengalaman Kerja */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-gray-900">Pengalaman Kerja:</span>
                    </div>
                    <p className="text-sm text-gray-700 ml-6 line-clamp-2">{member.pengalamanKerja}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => alert("Edit functionality coming soon!")}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteStaff(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Expandable Details */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                  Lihat Maklumat Terperinci
                </summary>
                <div className="mt-3 p-4 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Latar Belakang Jawatan:</h4>
                    <p className="text-sm text-gray-700">{member.latarBelakangJawatan}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Pengalaman Kerja Penuh:</h4>
                    <p className="text-sm text-gray-700">{member.pengalamanKerja}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    Didaftarkan pada: {new Date(member.createdAt).toLocaleDateString("ms-MY")}
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
