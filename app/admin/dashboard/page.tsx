"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Users,
  UserPlus,
  Calendar,
  DollarSign,
  PlusCircle,
  FileText,
  Activity,
  ChevronRight,
  Search,
} from "lucide-react"

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
  })
  const [recentPatients, setRecentPatients] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const handleLogout = async () => {
    await signOut({callbackUrl: "/auth/login"})
  }

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)

        // Fetch admin stats
        const statsResponse = await fetch("/api/dashboard/admin")
        if (!statsResponse.ok) throw new Error("Failed to fetch dashboard stats")
        const statsData = await statsResponse.json()
        setStats(statsData)

        // Fetch recent patients
        const patientsResponse = await fetch("/api/users/role/patient?limit=5")
        if (!patientsResponse.ok) throw new Error("Failed to fetch recent patients")
        const patientsData = await patientsResponse.json()
        setRecentPatients(patientsData.users || [])

        // Fetch recent appointments
        const appointmentsResponse = await fetch("/api/appointments?limit=5")
        if (!appointmentsResponse.ok) throw new Error("Failed to fetch recent appointments")
        const appointmentsData = await appointmentsResponse.json()
        setRecentAppointments(appointmentsData.appointments || [])

        setError("")
      } catch (err) {
        console.error("Error loading admin dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      loadDashboardData()
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push(`/${session.user.role}/dashboard`)
    }
  }, [session, status, router])

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
      <div className="mb-6 flex items-center justify-center space-x-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {session?.user?.name}. Here's what's happening in your hospital.</p>
        <button className="border p-4 rounded" onClick={handleLogout}>Signout</button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/patients" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Patients</h2>
              <p className="text-3xl font-bold">{stats.totalPatients}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">View all patients</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>

        <Link href="/admin/staff" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <UserPlus className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Doctors</h2>
              <p className="text-3xl font-bold">{stats.totalDoctors}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Manage staff</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>

        <Link href="/admin/appointments" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
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

        <Link href="/admin/billing" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-500" />
            </div>
         
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">View financial reports</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/patients/new" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
            <PlusCircle className="h-5 w-5 text-blue-500 mr-2" />
            <span>Add New Patient</span>
          </Link>

          <Link href="/admin/staff/new" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
            <UserPlus className="h-5 w-5 text-green-500 mr-2" />
            <span>Add New Staff</span>
          </Link>

        
          <Link href="/admin/medical-records" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
            <FileText className="h-5 w-5 text-red-500 mr-2" />
            <span>View Medical Records</span>
          </Link>
        </div>
      </div>

      {/* Recent Patients and Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Patients</h2>
            <Link href="/admin/patients" className="text-blue-500 text-sm hover:underline">
              View All
            </Link>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search patients..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {recentPatients.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No patients found</p>
          ) : (
            <ul className="divide-y">
              {recentPatients.map((patient) => (
                <li key={patient._id} className="py-3">
                  <Link
                    href={`/admin/patients/${patient._id}`}
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

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Appointments</h2>
            <Link href="/admin/appointments" className="text-blue-500 text-sm hover:underline">
              View All
            </Link>
          </div>

          {recentAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No appointments found</p>
          ) : (
            <ul className="divide-y">
              {recentAppointments.map((appointment) => (
                <li key={appointment._id} className="py-3">
                  <Link
                    href={`/admin/appointments/${appointment._id}`}
                    className="flex items-center hover:bg-gray-50 p-2 rounded"
                  >
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 mr-3">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {appointment.patient?.name || "Unknown Patient"} with Dr.{" "}
                        {appointment.doctor?.name || "Unknown Doctor"}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{appointment.time}</span>
                        <span className="mx-2">•</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            appointment.status === "scheduled"
                              ? "bg-blue-100 text-blue-800"
                              : appointment.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
{appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) : "Unknown"}
</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center mb-4">
          <Activity className="h-5 w-5 text-green-500 mr-2" />
          <h2 className="text-lg font-semibold">System Status</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Database Status</h3>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="font-medium">Connected</span>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Server Load</h3>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="font-medium">Normal (23%)</span>
            </div>
          </div>

          <div className="border rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Last Backup</h3>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="font-medium">Today, 03:45 AM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

