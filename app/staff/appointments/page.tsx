"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Calendar, Search, Filter, ChevronDown, CheckCircle, XCircle } from "lucide-react"

export default function DoctorAppointmentsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState(searchParams.get("filter") || "all")
  const [selectedDate, setSelectedDate] = useState(searchParams.get("date") || "")
  const [updatingStatus, setUpdatingStatus] = useState(null)

  useEffect(() => {
    async function loadAppointments() {
      if (!session?.user?.id) return

      try {
        setLoading(true)

        let url = `/api/appointments?doctor=${session.user.id}`

        if (filter === "upcoming") {
          url += "&status=scheduled"
        } else if (filter === "completed") {
          url += "&status=completed"
        } else if (filter === "cancelled") {
          url += "&status=cancelled"
        }

        if (selectedDate) {
          url += `&date=${selectedDate}`
        }

        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch appointments")

        const data = await response.json()
        setAppointments(data.appointments || [])
        setError("")
      } catch (err) {
        console.error("Error loading appointments:", err)
        setError("Failed to load appointments. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "doctor") {
      loadAppointments()
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated" && session?.user?.role !== "doctor") {
      router.push(`/${session.user.role}/dashboard`)
    }
  }, [session, status, router, filter, selectedDate])

  const handleSearch = (e) => {
    e.preventDefault()
    // Filter appointments locally based on patient name or email
    // This is a client-side search since we already have the appointments
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    // Update URL without refreshing the page
    const params = new URLSearchParams(searchParams)
    if (newFilter === "all") {
      params.delete("filter")
    } else {
      params.set("filter", newFilter)
    }
    router.push(`/staff/appointments?${params.toString()}`)
  }

  const handleDateChange = (e) => {
    const date = e.target.value
    setSelectedDate(date)
    // Update URL without refreshing the page
    const params = new URLSearchParams(searchParams)
    if (date) {
      params.set("date", date)
    } else {
      params.delete("date")
    }
    router.push(`/staff/appointments?${params.toString()}`)
  }

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    if (!session?.user?.id) return

    try {
      setUpdatingStatus(appointmentId)

      const response = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update appointment status")

      // Update the appointment in the local state
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status: newStatus } : appointment,
        ),
      )
    } catch (err) {
      console.error("Error updating appointment status:", err)
      setError("Failed to update appointment status. Please try again.")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Filter appointments by search term (client-side)
  const filteredAppointments = searchTerm
    ? appointments.filter(
        (appointment) =>
          appointment.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : appointments

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-center space-x-5">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <p className="text-gray-600">View and manage your appointments</p>
        <Link href='/staff/dashboard'>
        <button className="p-4 border rounded-md ">Back</button>

        </Link>
       
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search patients by name or email..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>

          <div className="relative">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                className="flex items-center px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
                onClick={() => document.getElementById("filterDropdown").classList.toggle("hidden")}
              >
                <Filter className="h-4 w-4 mr-2 text-gray-500" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
              </button>
            </div>

            <div id="filterDropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
              <div className="py-1">
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === "all" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => handleFilterChange("all")}
                >
                  All Appointments
                </button>
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === "upcoming" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => handleFilterChange("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === "completed" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => handleFilterChange("completed")}
                >
                  Completed
                </button>
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === "cancelled" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => handleFilterChange("cancelled")}
                >
                  Cancelled
                </button>
              </div>
            </div>
          </div>

          <Link
            href="/staff/appointments/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            New Appointment
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mx-auto mb-4">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments found</h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try a different search term"
                : selectedDate
                  ? `No appointments on ${new Date(selectedDate).toLocaleDateString()}`
                  : filter !== "all"
                    ? `No ${filter} appointments`
                    : "You don't have any appointments yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          {appointment.patient.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{appointment.patient.name}</div>
                          <div className="text-sm text-gray-500">{appointment.patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(appointment.status)}`}
                      >
{appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : "Unknown"}
</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{appointment.notes || "No notes"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <Link
                          href={`/staff/patients/${appointment.patient._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Patient
                        </Link>

                        {appointment.status === "scheduled" && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(appointment._id, "completed")}
                              disabled={updatingStatus === appointment._id}
                              className="text-green-600 hover:text-green-900 flex items-center"
                            >
                              {updatingStatus === appointment._id ? (
                                <span className="animate-pulse">Updating...</span>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  <span>Complete</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => updateAppointmentStatus(appointment._id, "cancelled")}
                              disabled={updatingStatus === appointment._id}
                              className="text-red-600 hover:text-red-900 flex items-center"
                            >
                              {updatingStatus === appointment._id ? (
                                <span className="animate-pulse">Updating...</span>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  <span>Cancel</span>
                                </>
                              )}
                            </button>
                          </>
                        )}

                        <Link
                          href={`/staff/prescriptions/new?patient=${appointment.patient._id}&appointment=${appointment._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Add Prescription
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

