"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Edit, CheckCircle, XCircle } from "lucide-react"
import { format } from "date-fns"

interface AppointmentListProps {
  doctorId?: string
}

export function AppointmentList({ doctorId }: AppointmentListProps) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchAppointments() {
      if (!doctorId) return

      try {
        setLoading(true)
        const response = await fetch(`/api/appointments?doctorId=${doctorId}&role=doctor`)

        if (!response.ok) {
          throw new Error("Failed to fetch appointments")
        }

        const data = await response.json()
        setAppointments(data)
      } catch (err: any) {
        console.error("Error fetching appointments:", err)
        setError(err.message || "Failed to load appointment data")
      } finally {
        setLoading(false)
      }
    }

    if (doctorId) {
      fetchAppointments()
    }
  }, [doctorId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update appointment")
      }

      // Update the local state
      setAppointments(appointments.map((apt: any) => (apt._id === id ? { ...apt, status } : apt)))
    } catch (err: any) {
      console.error("Error updating appointment:", err)
      alert("Failed to update appointment: " + err.message)
    }
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Appointments</h2>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No appointments found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment: any) => (
                <TableRow key={appointment._id}>
                  <TableCell className="font-medium">{appointment.patientId?.name || "Unknown"}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {appointment.date ? format(new Date(appointment.date), "MMM dd, yyyy") : "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      {appointment.time || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>{appointment.reason || "N/A"}</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="text-right">
                    {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateAppointmentStatus(appointment._id, "completed")}
                          title="Mark as Completed"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateAppointmentStatus(appointment._id, "cancelled")}
                          title="Cancel Appointment"
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" title="Edit Appointment">
                      <Edit className="h-4 w-4" />
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

