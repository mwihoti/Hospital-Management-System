"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Users, Calendar, CheckCircle, Clock, FileText, PlusCircle, Edit, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DoctorDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
  })
  const [todayAppointments, setTodayAppointments] = useState([])
  const [recentPatients, setRecentPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const handleLogout = async () => {
      await signOut({ callbackUrl: "/auth/login" })
    }

  useEffect(() => {
    async function loadDashboardData() {
      if (!session?.user?.id) return

      try {
        setLoading(true)

        // Fetch doctor stats
        const statsResponse = await fetch(`/api/dashboard/doctor/${session.user.id}`)
        if (!statsResponse.ok) throw new Error("Failed to fetch dashboard stats")
        const statsData = await statsResponse.json()
        setStats(statsData)

        // Fetch today's appointments
        const today = new Date().toISOString().split("T")[0]
        const appointmentsResponse = await fetch(`/api/appointments?doctor=${session.user.id}&date=${today}`)
        if (!appointmentsResponse.ok) throw new Error("Failed to fetch appointments")
        const appointmentsData = await appointmentsResponse.json()
        setTodayAppointments(appointmentsData.appointments || [])

        // Fetch recent patients
        const patientsResponse = await fetch(`/api/doctor/${session.user.id}/patients?limit=5`)
        if (!patientsResponse.ok) throw new Error("Failed to fetch patients")
        const patientsData = await patientsResponse.json()
        setRecentPatients(patientsData.patients || [])

        setError("")
      } catch (err) {
        console.error("Error loading doctor dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "doctor") {
      loadDashboardData()
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated" && session?.user?.role !== "doctor") {
      router.push(`/${session.user.role}/dashboard`)
    }
  }, [session, status, router])

  const handleUpdateAppointmentStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) throw new Error("Failed to update appointment status")

      // Update the appointment status in the UI
      setTodayAppointments(
        todayAppointments.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status } : appointment,
        ),
      )
    } catch (err) {
      console.error("Error updating appointment status:", err)
      alert("Failed to update appointment status. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-center space-x-2">
        <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
        <p className="text-gray-600">Welcome back, Dr. {session?.user?.name}. Here's your schedule for today.</p>
        <Button  onClick={handleLogout}
              className="flex  mr-16 items-center text-red-500 hover:text-red-700">SignOut</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/staff/patients" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">My Patients</h2>
              <p className="text-3xl font-bold">{stats.totalPatients}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">View all patients</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>

        <Link href="/staff/appointments" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Appointments</h2>
              <p className="text-3xl font-bold">{stats.totalAppointments}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">View all appointments</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>

        <Link
          href="/staff/appointments?status=scheduled"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Upcoming</h2>
              <p className="text-3xl font-bold">{stats.upcomingAppointments}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">View upcoming appointments</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>

        <Link
          href="/staff/appointments?status=completed"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Completed</h2>
              <p className="text-3xl font-bold">{stats.completedAppointments}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">View completed appointments</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/staff/schedule" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
            <Calendar className="h-5 w-5 text-blue-500 mr-2" />
            <span>Manage Schedule</span>
          </Link>

          <Link href="/staff/medical-records/new" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
            <FileText className="h-5 w-5 text-green-500 mr-2" />
            <span>Create Medical Record</span>
          </Link>

          <Link href="/staff/prescriptions/new" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
            <PlusCircle className="h-5 w-5 text-purple-500 mr-2" />
            <span>Write Prescription</span>
          </Link>
        </div>
      </div>

      {/* Today's Appointments */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Today's Appointments</h2>
          <Link href="/staff/appointments" className="text-blue-500 text-sm hover:underline">
            View All
          </Link>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-500">No Appointments Today</h3>
            <p className="text-gray-400 mb-4">You don't have any appointments scheduled for today.</p>
            <Link
              href="/staff/schedule"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Manage Your Schedule
            </Link>
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
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {todayAppointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          {appointment.patient?.name
                            ? appointment.patient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                            : "P"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patient?.name || "Unknown Patient"}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.patient?.email || "No email"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : appointment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/staff/patients/${appointment.patient?._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        {appointment.status === "scheduled" && (
                          <>
                            <button
                              onClick={() => handleUpdateAppointmentStatus(appointment._id, "completed")}
                              className="text-green-600 hover:text-green-900"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleUpdateAppointmentStatus(appointment._id, "cancelled")}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Patients */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Patients</h2>
          <Link href="/staff/patients" className="text-blue-500 text-sm hover:underline">
            View All
          </Link>
        </div>

        {recentPatients.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No patients found</p>
        ) : (
          <ul className="divide-y">
            {recentPatients.map((patient) => (
              <li key={patient._id} className="py-3">
                <Link
                  href={`/staff/patients/${patient._id}`}
                  className="flex items-center hover:bg-gray-50 p-2 rounded"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{patient.name}</h3>
                    <p className="text-sm text-gray-500">{patient.email}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

