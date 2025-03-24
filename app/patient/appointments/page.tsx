"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Calendar, Clock, User, MapPin, Plus } from "lucide-react"
import Link from "next/link"

export default function PatientAppointments() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchAppointments() {
      if (!session?.user?.id) return

      try {
        const response = await fetch(`/api/appointments?patient=${session.user.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch appointments")
        }
        const data = await response.json()
        setAppointments(data.appointments)
      } catch (err) {
        console.error("Error fetching appointments:", err)
        setError("Failed to load appointment data")
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [session])

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "cancelled" }),
      })

      if (!response.ok) {
        throw new Error("Failed to cancel appointment")
      }

      // Update the appointment status in the UI
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status: "cancelled" } : appointment,
        ),
      )
    } catch (err) {
      console.error("Error cancelling appointment:", err)
      alert("Failed to cancel appointment. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Appointments</h1>
        <Link
          href="/patient/appointments/new"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Book New Appointment
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Appointments Found</h2>
          <p className="text-gray-500">You don't have any appointments scheduled.</p>
          <Link
            href="/patient/appointments/new"
            className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Book Your First Appointment
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">
                      Appointment with Dr. {appointment.doctor?.name || "Doctor"}
                    </h2>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-500">{new Date(appointment.date).toLocaleDateString()}</p>
                      <Clock className="h-4 w-4 text-gray-400 ml-3 mr-1" />
                      <p className="text-sm text-gray-500">{appointment.time}</p>
                    </div>
                  </div>
                  
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Doctor</p>
                      <p className="text-sm">{appointment.doctor?.name || "Doctor"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm">Main Hospital, Room {Math.floor(Math.random() * 100) + 100}</p>
                    </div>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-sm">{appointment.notes}</p>
                  </div>
                )}

                {appointment.status === "scheduled" && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Cancel Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

