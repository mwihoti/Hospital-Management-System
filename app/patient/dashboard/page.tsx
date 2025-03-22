"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Calendar, Clock, FileText, CreditCard } from "lucide-react"
import { dashboardAPI } from "@/lib/api"

export default function PatientDashboard() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    pendingBills: 0,
    activePrescriptions: 0,
    totalMedicalRecords: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadStats() {
      if (session?.user?.id) {
        try {
          setLoading(true)
          const patientStats = await dashboardAPI.getPatientStats(session.user.id)
          setStats(patientStats)
          setError("")
        } catch (err) {
          console.error("Error loading patient stats:", err)
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
          <p className="mt-4 text-gray-600">Loading patient dashboard...</p>
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
      <h1 className="text-2xl font-bold mb-6">Patient Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold">Appointments</h2>
          </div>
          <p className="text-3xl font-bold">{stats.upcomingAppointments}</p>
          <p className="text-sm text-gray-500">Upcoming appointments</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <CreditCard className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-semibold">Bills</h2>
          </div>
          <p className="text-3xl font-bold">{stats.pendingBills}</p>
          <p className="text-sm text-gray-500">Pending bills</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-green-500 mr-2" />
            <h2 className="text-lg font-semibold">Prescriptions</h2>
          </div>
          <p className="text-3xl font-bold">{stats.activePrescriptions}</p>
          <p className="text-sm text-gray-500">Active prescriptions</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <FileText className="h-5 w-5 text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold">Medical Records</h2>
          </div>
          <p className="text-3xl font-bold">{stats.totalMedicalRecords}</p>
          <p className="text-sm text-gray-500">Total records</p>
        </div>
      </div>

      {/* Additional dashboard content can go here */}
    </div>
  )
}

