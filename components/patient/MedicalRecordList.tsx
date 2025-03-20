"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, User } from "lucide-react"
import { format } from "date-fns"

interface MedicalRecordListProps {
  patientId?: string
}

export function MedicalRecordList({ patientId }: MedicalRecordListProps) {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchMedicalRecords() {
      if (!patientId) return

      try {
        setLoading(true)
        const response = await fetch(`/api/medical-records?patientId=${patientId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch medical records")
        }

        const data = await response.json()
        setRecords(data)
      } catch (err: any) {
        console.error("Error fetching medical records:", err)
        setError(err.message || "Failed to load medical record data")
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchMedicalRecords()
    }
  }, [patientId])

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Medical Records</h2>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No medical records found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Diagnosis</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record: any) => (
                <TableRow key={record._id}>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {record.date ? format(new Date(record.date), "MMM dd, yyyy") : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-muted-foreground" />
                      {record.doctorId?.name || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>{record.treatment}</TableCell>
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

