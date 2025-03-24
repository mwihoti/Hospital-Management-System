"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, FileText, CreditCard, PlusCircle, ChevronRight, User, Activity } from "lucide-react"

export default function PatientDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    pendingBills: 0,
    activePrescriptions: 0,
    totalMedicalRecords: 0,
  })
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [recentPrescriptions, setRecentPrescriptions] = useState([])
  const [recentBills, setRecentBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadDashboardData() {
      if (!session?.user?.id) return

      try {
        setLoading(true)

        // Fetch patient stats
        const statsResponse = await fetch(`/api/dashboard/patient/${session.user.id}`)
        if (!statsResponse.ok) throw new Error("Failed to fetch dashboard stats")
        const statsData = await statsResponse.json()
        setStats(statsData)

        // Fetch upcoming appointments
        const appointmentsResponse = await fetch(
          `/api/appointments?patient=${session.user.id}&status=scheduled&limit=3`,
        )
        if (!appointmentsResponse.ok) throw new Error("Failed to fetch appointments")
        const appointmentsData = await appointmentsResponse.json()
        setUpcomingAppointments(appointmentsData.appointments || [])

        // Fetch recent prescriptions
        const prescriptionsResponse = await fetch(`/api/prescriptions?patient=${session.user.id}&status=active&limit=3`)
        if (!prescriptionsResponse.ok) throw new Error("Failed to fetch prescriptions")
        const prescriptionsData = await prescriptionsResponse.json()
        setRecentPrescriptions(prescriptionsData.prescriptions || [])

        // Fetch recent bills
        const billsResponse = await fetch(`/api/bills?patient=${session.user.id}&status=pending&limit=3`)
        if (!billsResponse.ok) throw new Error("Failed to fetch bills")
        const billsData = await billsResponse.json()
        setRecentBills(billsData.bills || [])

        setError("")
      } catch (err) {
        console.error("Error loading patient dashboard data:", err)
        setError("Failed to load dashboard data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "patient") {
      loadDashboardData()
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated" && session?.user?.role !== "patient") {
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
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <p className="text-gray-600">Welcome, {session?.user?.name}. Here's an overview of your health information.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/patient/appointments" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Appointments</h2>
              <p className="text-3xl font-bold">{stats.upcomingAppointments}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Upcoming appointments</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>

        <Link href="/patient/billing" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <CreditCard className="h-6 w-6 text-red-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Bills</h2>
              <p className="text-3xl font-bold">{stats.pendingBills}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Pending bills</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>

        <Link
          href="/patient/prescriptions"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-green-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Prescriptions</h2>
              <p className="text-3xl font-bold">{stats.activePrescriptions}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Active prescriptions</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>

        <Link
          href="/patient/medical-records"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-purple-500" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">Medical Records</h2>
              <p className="text-3xl font-bold">{stats.totalMedicalRecords}</p>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Total records</span>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/patient/appointments/new" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
            <PlusCircle className="h-5 w-5 text-blue-500 mr-2" />
            <span>Book New Appointment</span>
          </Link>

          <Link href="/patient/profile" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
            <User className="h-5 w-5 text-green-500 mr-2" />
            <span>Update Profile</span>
          </Link>

          <Link href="/patient/billing" className="flex items-center p-3 border rounded-md hover:bg-gray-50">
            <CreditCard className="h-5 w-5 text-red-500 mr-2" />
            <span>Pay Bills</span>
          </Link>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
            <Link href="/patient/appointments" className="text-blue-500 text-sm hover:underline">
              View All
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-500">No Upcoming Appointments</h3>
              <p className="text-gray-400 mb-4">You don't have any appointments scheduled.</p>
              <Link
                href="/patient/appointments/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Book New Appointment
              </Link>
            </div>
          ) : (
            <ul className="divide-y">
              {upcomingAppointments.map((appointment) => (
                <li key={appointment._id} className="py-3">
                  <Link
                    href={`/patient/appointments/${appointment._id}`}
                    className="flex items-center hover:bg-gray-50 p-2 rounded"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">Dr. {appointment.doctor?.name || "Unknown"}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Active Prescriptions</h2>
            <Link href="/patient/prescriptions" className="text-blue-500 text-sm hover:underline">
              View All
            </Link>
          </div>

          {recentPrescriptions.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-500">No Active Prescriptions</h3>
              <p className="text-gray-400">You don't have any active prescriptions.</p>
            </div>
          ) : (
            <ul className="divide-y">
              {recentPrescriptions.map((prescription) => (
                <li key={prescription._id} className="py-3">
                  <Link
                    href={`/patient/prescriptions/${prescription._id}`}
                    className="flex items-center hover:bg-gray-50 p-2 rounded"
                  >
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-500 mr-3">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">
                        {prescription.medications[0]?.name || "Prescription"}
                        {prescription.medications.length > 1 && ` + ${prescription.medications.length - 1} more`}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>Dr. {prescription.doctor?.name || "Unknown"}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(prescription.date).toLocaleDateString()}</span>
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

      {/* Recent Bills */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Pending Bills</h2>
          <Link href="/patient/billing" className="text-blue-500 text-sm hover:underline">
            View All
          </Link>
        </div>

        {recentBills.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-500">No Pending Bills</h3>
            <p className="text-gray-400">You don't have any pending bills.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentBills.map((bill) => (
                  <tr key={bill._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{bill.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{new Date(bill.date).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">${bill.amount.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/patient/billing/${bill._id}`} className="text-blue-600 hover:text-blue-900">
                        Pay Now
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Health Tips */}
      <div className="bg-white p-6 rounded-lg shadow mt-8">
        <div className="flex items-center mb-4">
          <Activity className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-lg font-semibold">Health Tips</h2>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Stay Hydrated</h3>
          <p className="text-sm text-gray-600">
            Remember to drink at least 8 glasses of water daily to maintain proper hydration and support your body's
            functions.
          </p>
        </div>
      </div>
    </div>
  )
}

