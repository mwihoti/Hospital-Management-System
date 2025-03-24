"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Users, Calendar, CheckCircle, Clock } from "lucide-react"
import { dashboardAPI } from "@/lib/api"

export default function DoctorDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadStats() {
      if (session?.user?.id) {
        try {
          setLoading(true)
          const doctorStats = await dashboardAPI.getDoctorStats(session.user.id)
          setStats(doctorStats)
          setError("")
        } catch (err) {
          console.error("Error loading doctor stats:", err)
          setError("Failed to load dashboard data. Please try again later.")
        } finally {
          setLoading(false)
        }
      }
    }

    if (status === "authenticated" && session?.user?.id) {
      loadStats()
    } else if (status === "unauthenticated") {
      setError("You must be logged in to view this page")
      setLoading(false)
    }
  }, [session, status])

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor dashboard...</p>
        </div>
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
      <h1 className="text-2xl font-bold mb-6">Doctor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold">Patients</h2>
          </div>
          <p className="text-3xl font-bold">{stats.totalPatients}</p>
          <p className="text-sm text-gray-500">Total patients</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold">Appointments</h2>
          </div>
          <p className="text-3xl font-bold">{stats.totalAppointments}</p>
          <p className="text-sm text-gray-500">Total appointments</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-green-500 mr-2" />
            <h2 className="text-lg font-semibold">Upcoming</h2>
          </div>
          <p className="text-3xl font-bold">{stats.upcomingAppointments}</p>
          <p className="text-sm text-gray-500">Upcoming appointments</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <h2 className="text-lg font-semibold">Completed</h2>
          </div>
          <p className="text-3xl font-bold">{stats.completedAppointments}</p>
          <p className="text-sm text-gray-500">Completed appointments</p>
        </div>
      </div>

      {/* Additional dashboard content can go here */}
    </div>
  )
}

