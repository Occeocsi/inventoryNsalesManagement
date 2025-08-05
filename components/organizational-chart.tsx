"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, User, Settings, ArrowLeft, Building } from "lucide-react"

interface Secretariat {
  id: number
  nama: string
  jawatan: string
  bahagian: string
  secretariatId: string
  createdAt: string
}

interface OrganizationalChartProps {
  onBack: () => void
}

export function OrganizationalChart({ onBack }: OrganizationalChartProps) {
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

  const getBahagianColor = (bahagian: string) => {
    switch (bahagian) {
      case "pengarah":
        return "bg-red-100 text-red-800 border-red-200"
      case "kajian-strategik":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "komuniti":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
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

  const formatBahagian = (bahagian: string) => {
    switch (bahagian) {
      case "pengarah":
        return "Pengarah"
      case "kajian-strategik":
        return "Bahagian Kajian Strategik"
      case "komuniti":
        return "Bahagian Komuniti"
      default:
        return bahagian
    }
  }

  // Organize secretariat by hierarchy
  const organizeSecretariat = () => {
    const pengarah = secretariat.filter((member) => member.bahagian === "pengarah")
    const kajianStrategik = secretariat.filter((member) => member.bahagian === "kajian-strategik")
    const komuniti = secretariat.filter((member) => member.bahagian === "komuniti")

    // Sort by jawatan hierarchy within each group
    const sortByJawatan = (members: Secretariat[]) => {
      return members.sort((a, b) => {
        const aLower = a.jawatan.toLowerCase()
        const bLower = b.jawatan.toLowerCase()

        // Define hierarchy order
        const getJawatanOrder = (jawatan: string) => {
          if (jawatan.includes("pengarah")) return 1
          if (jawatan.includes("timbalan")) return 2
          if (jawatan.includes("ketua")) return 3
          return 4
        }

        return getJawatanOrder(aLower) - getJawatanOrder(bLower)
      })
    }

    return {
      pengarah: sortByJawatan(pengarah),
      kajianStrategik: sortByJawatan(kajianStrategik),
      komuniti: sortByJawatan(komuniti),
    }
  }

  const organizedData = organizeSecretariat()

  const MemberCard = ({ member }: { member: Secretariat }) => (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="text-center">
        {/* Profile Picture Placeholder */}
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="h-8 w-8 text-gray-400" />
        </div>

        {/* Member Info */}
        <h3 className="font-semibold text-gray-900 mb-2">{member.nama}</h3>
        <Badge className={`${getJawatanColor(member.jawatan)} mb-2 text-xs`}>{member.jawatan}</Badge>
        <p className="text-xs text-gray-600">ID: {member.secretariatId}</p>
      </div>
    </div>
  )

  if (secretariat.length === 0) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Carta Organisasi Sekretariat</CardTitle>
                <p className="text-gray-600 mt-1">Struktur organisasi ahli sekretariat</p>
              </div>
              <Button onClick={onBack} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiada Ahli Sekretariat Didaftarkan</h3>
            <p className="text-gray-600">Pentadbir belum mendaftarkan sebarang ahli sekretariat.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building className="h-6 w-6" />
                Carta Organisasi Sekretariat
              </CardTitle>
              <p className="text-gray-600 mt-1">Struktur organisasi ahli sekretariat mengikut jawatan dan bahagian</p>
            </div>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {/* Organizational Chart */}
          <div className="space-y-8">
            {/* Pengarah Level (Top Level) */}
            {organizedData.pengarah.length > 0 && (
              <div className="text-center">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-red-800 mb-2">PENGARAH</h2>
                  <div className="w-24 h-1 bg-red-500 mx-auto rounded"></div>
                </div>
                <div className="flex justify-center gap-6">
                  {organizedData.pengarah.map((member) => (
                    <MemberCard key={member.id} member={member} />
                  ))}
                </div>

                {/* Connection Line */}
                {(organizedData.kajianStrategik.length > 0 || organizedData.komuniti.length > 0) && (
                  <div className="flex justify-center mt-6">
                    <div className="w-1 h-12 bg-gray-300"></div>
                  </div>
                )}
              </div>
            )}

            {/* Department Level */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bahagian Kajian Strategik */}
              {organizedData.kajianStrategik.length > 0 && (
                <Card className={`${getBahagianColor("kajian-strategik")} border-2`}>
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg font-bold text-blue-800 flex items-center justify-center gap-2">
                      <Settings className="h-5 w-5" />
                      BAHAGIAN KAJIAN STRATEGIK
                    </CardTitle>
                    <div className="w-16 h-1 bg-blue-500 mx-auto rounded"></div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {organizedData.kajianStrategik.map((member) => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Bahagian Komuniti */}
              {organizedData.komuniti.length > 0 && (
                <Card className={`${getBahagianColor("komuniti")} border-2`}>
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-lg font-bold text-green-800 flex items-center justify-center gap-2">
                      <Users className="h-5 w-5" />
                      BAHAGIAN KOMUNITI
                    </CardTitle>
                    <div className="w-16 h-1 bg-green-500 mx-auto rounded"></div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {organizedData.komuniti.map((member) => (
                        <MemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Legend */}
          <Card className="mt-8 bg-gray-50 border-gray-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Panduan Carta Organisasi:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Struktur Hierarki:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>
                      • <span className="font-medium">Pengarah</span> - Tahap tertinggi organisasi
                    </li>
                    <li>
                      • <span className="font-medium">Timbalan Pengarah</span> - Tahap kedua
                    </li>
                    <li>
                      • <span className="font-medium">Ketua Bahagian</span> - Mengetuai bahagian masing-masing
                    </li>
                    <li>
                      • <span className="font-medium">Ahli Bahagian</span> - Ahli dalam bahagian
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Kod Warna Bahagian:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-200 border border-red-300 rounded"></div>
                      <span>Pengarah (Tidak dalam bahagian khusus)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-200 border border-blue-300 rounded"></div>
                      <span>Bahagian Kajian Strategik</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
                      <span>Bahagian Komuniti</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="border-0 shadow-sm bg-red-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{organizedData.pengarah.length}</div>
                <div className="text-sm text-red-800">Pengarah</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-blue-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{organizedData.kajianStrategik.length}</div>
                <div className="text-sm text-blue-800">Kajian Strategik</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{organizedData.komuniti.length}</div>
                <div className="text-sm text-green-800">Komuniti</div>
              </CardContent>
            </Card>
          </div>

          {/* Info for Staff */}
          <Card className="mt-6 bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Maklumat untuk Staff:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Carta organisasi menunjukkan struktur hierarki sekretariat</li>
                <li>• Ahli disusun mengikut jawatan dan bahagian masing-masing</li>
                <li>• Pengarah berada di tahap tertinggi organisasi</li>
                <li>• Setiap bahagian mempunyai kod warna yang berbeza</li>
                <li>• Maklumat ini dikemaskini berdasarkan data yang didaftarkan oleh pentadbir</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
