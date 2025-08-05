"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Building2, CreditCard, Trash2, Edit } from "lucide-react"

interface Facilitator {
  id: number
  nama: string
  noMatrik: string
  fakulti: string
  noTelefon: string
  createdAt: string
}

type FacilitatorListProps = {}

export function FacilitatorList({}: FacilitatorListProps) {
  const [facilitators, setFacilitators] = useState<Facilitator[]>([])

  useEffect(() => {
    loadFacilitators()
  }, [])

  const loadFacilitators = () => {
    if (typeof window !== "undefined") {
      // Guard localStorage access
      const savedFacilitators = JSON.parse(localStorage.getItem("facilitators") || "[]")
      setFacilitators(savedFacilitators)
    }
  }

  const deleteFacilitator = (id: number) => {
    if (typeof window !== "undefined" && confirm("Adakah anda pasti untuk memadam fasilitator ini?")) {
      // Guard localStorage access
      const updatedFacilitators = facilitators.filter((facilitator) => facilitator.id !== id)
      localStorage.setItem("facilitators", JSON.stringify(updatedFacilitators))
      setFacilitators(updatedFacilitators)
    }
  }

  if (facilitators.length === 0) {
    return (
      <Card className="mt-6">
        <CardContent className="p-8 text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiada Fasilitator Didaftarkan</h3>
          <p className="text-gray-600">Fasilitator yang didaftarkan akan dipaparkan di sini.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Senarai Fasilitator Didaftarkan ({facilitators.length})</span>
          <Button onClick={loadFacilitators} variant="outline" size="sm">
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {facilitators.map((facilitator) => (
            <div key={facilitator.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{facilitator.nama}</h3>
                    <Badge variant="outline">{facilitator.noMatrik}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      <span>Matrik: {facilitator.noMatrik}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>Fakulti: {facilitator.fakulti}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Tel: {facilitator.noTelefon}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Didaftarkan: {new Date(facilitator.createdAt).toLocaleDateString("ms-MY")}
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
                    onClick={() => deleteFacilitator(facilitator.id)}
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
