"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, User, Briefcase, Settings, Trash2, Edit } from "lucide-react"

interface Secretariat {
  id: number
  nama: string
  jawatan: string
  bahagian: string
  secretariatId: string
  createdAt: string
}

export function SecretariatList() {
  const [secretariat, setSecretariat] = useState<Secretariat[]>([])

  useEffect(() => {
    loadSecretariat()
  }, [])

  const loadSecretariat = () => {
    if (typeof window !== "undefined") {
      // Guard localStorage access
      const savedSecretariat = JSON.parse(localStorage.getItem("secretariat") || "[]")
      setSecretariat(savedSecretariat)
    }
  }

  const deleteSecretariat = (id: number) => {
    if (typeof window !== "undefined" && confirm("Adakah anda pasti untuk memadam ahli sekretariat ini?")) {
      // Guard localStorage access
      const updatedSecretariat = secretariat.filter((member) => member.id !== id)
      localStorage.setItem("secretariat", JSON.stringify(updatedSecretariat))
      setSecretariat(updatedSecretariat)
    }
  }

  const getBahagianColor = (bahagian: string) => {
    switch (bahagian) {
      case "pengarah":
        return "bg-red-100 text-red-800"
      case "kajian-strategik":
        return "bg-blue-100 text-blue-800"
      case "komuniti":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatBahagian = (bahagian: string) => {
    switch (bahagian) {
      case "pengarah":
        return "Pengarah"
      case "kajian-strategik":
        return "Kajian Strategik"
      case "komuniti":
        return "Komuniti"
      default:
        return bahagian
    }
  }

  const getJawatanColor = (jawatan: string) => {
    const lowerJawatan = jawatan.toLowerCase()
    if (lowerJawatan.includes("pengarah")) {
      return "bg-purple-100 text-purple-800"
    } else if (lowerJawatan.includes("timbalan")) {
      return "bg-orange-100 text-orange-800"
    } else if (lowerJawatan.includes("ketua")) {
      return "bg-yellow-100 text-yellow-800"
    } else {
      return "bg-gray-100 text-gray-800"
    }
  }

  if (secretariat.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-8 text-center">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiada Ahli Sekretariat Didaftarkan</h3>
          <p className="text-gray-600">Ahli sekretariat yang didaftarkan akan dipaparkan di sini.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Senarai Ahli Sekretariat ({secretariat.length})</span>
          <Button onClick={loadSecretariat} variant="outline" size="sm">
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {secretariat.map((member) => (
            <div key={member.id} className="border rounded-lg p-6 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{member.nama}</h3>
                    <Badge variant="outline">{member.secretariatId}</Badge>
                    <Badge className={getJawatanColor(member.jawatan)}>{member.jawatan}</Badge>
                    <Badge className={getBahagianColor(member.bahagian)}>{formatBahagian(member.bahagian)}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>ID: {member.secretariatId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Jawatan: {member.jawatan}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Bahagian: {formatBahagian(member.bahagian)}</span>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Didaftarkan pada: {new Date(member.createdAt).toLocaleDateString("ms-MY")}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => alert("Edit functionality coming soon!")}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteSecretariat(member.id)}
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
