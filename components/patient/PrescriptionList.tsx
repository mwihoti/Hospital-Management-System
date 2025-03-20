"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, User, Pill } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface PrescriptionListProps {
  patientId?: string
}

export function PrescriptionList({ patientId }: PrescriptionListProps) {
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPrescriptions() {
      if (!patientId) return

      try {
        setLoading(true)
        const response = await fetch(`/api/prescriptions?patientId=${patientId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch prescriptions")
        }

        const data = await response.json()
        setPrescriptions(data)
      } catch (err: any) {
        console.error("Error fetching prescriptions:", err)
        setError(err.message || "Failed to load prescription data")
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchPrescriptions()
    }
  }, [patientId])

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Prescriptions</h2>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No prescriptions found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Medications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription: any) => (
                <TableRow key={prescription._id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {prescription.date ? format(new Date(prescription.date), "MMM dd, yyyy") : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      {prescription.doctorId?.name || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {prescription.medications?.map((med: any, index: number) => (
                        <div key={index} className="flex items-center">
                          <Pill className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{med.name || med}</span>
                          {index < prescription.medications.length - 1 && <span className="mx-1">,</span>}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {prescription.active || prescription.status === "active" ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : (
                      <Badge className="bg-gray-500">Completed</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}

