"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, Pill, CreditCard } from "lucide-react"

interface PatientListProps {
  doctorId?: string
}

export function PatientList({ doctorId }: PatientListProps) {
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPatients() {
      if (!doctorId) return

      try {
        setLoading(true)

        // First get all appointments for this doctor
        const appointmentsRes = await fetch(`/api/appointments?doctorId=${doctorId}`)

        if (!appointmentsRes.ok) {
          throw new Error("Failed to fetch appointments")
        }

        const appointments = await appointmentsRes.json()

        // Extract unique patient IDs
        const patientIds = [...new Set(appointments.map((apt: any) => apt.patientId?._id))].filter(Boolean) // Remove any undefined or null values

        // Create a map to store patient data with appointment counts
        const patientMap = new Map()

        // Process appointments to count per patient
        appointments.forEach((apt: any) => {
          if (apt.patientId?._id) {
            const patientId = apt.patientId._id

            if (!patientMap.has(patientId)) {
              patientMap.set(patientId, {
                ...apt.patientId,
                appointmentCount: 1,
                lastVisit: apt.date,
              })
            } else {
              const patient = patientMap.get(patientId)
              patient.appointmentCount += 1

              // Update last visit if this appointment is more recent
              if (new Date(apt.date) > new Date(patient.lastVisit)) {
                patient.lastVisit = apt.date
              }
            }
          }
        })

        // Convert map to array
        setPatients(Array.from(patientMap.values()))
      } catch (err: any) {
        console.error("Error fetching patients:", err)
        setError(err.message || "Failed to load patient data")
      } finally {
        setLoading(false)
      }
    }

    if (doctorId) {
      fetchPatients()
    }
  }, [doctorId])

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">My Patients</h2>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No patients found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Total Visits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient: any) => (
                <TableRow key={patient._id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.email}</TableCell>
                  <TableCell>{patient.gender || "N/A"}</TableCell>
                  <TableCell>{patient.bloodGroup || "N/A"}</TableCell>
                  <TableCell>{patient.appointmentCount || 0}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="Medical Records">
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Prescriptions">
                      <Pill className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Billing">
                      <CreditCard className="h-4 w-4" />
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

