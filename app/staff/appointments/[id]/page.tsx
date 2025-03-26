"use client"

import { useState, useEffect, use } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, FileText, Activity, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
    const { id } = use(params)
  
    const { data: session } = useSession()
    const router = useRouter()
    const [appointment, setAppointment] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [updating, setUpdating] = useState(false)
  
    useEffect(() => {
      async function fetchAppointment() {
        try {
          const response = await fetch(`/api/appointments/${id}`)
          if (!response.ok) throw new Error("Failed to fetch appointment")
  
          const data = await response.json()
          setAppointment(data.appointment)
        } catch (err) {
          console.error("Error fetching appointment:", err)
          setError("Failed to load appointment. Please try again later.")
        } finally {
          setLoading(false)
        }
      }
  
      if (session?.user) {
        fetchAppointment()
      }
    }, [session, id])
  
    const updateStatus = async (status: string) => {
      try {
        setUpdating(true)
  
        const response = await fetch(`/api/appointments/${id}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        })
  
        if (!response.ok) throw new Error("Failed to update appointment")
  
        const data = await response.json()
        setAppointment(data.appointment)
      } catch (err) {
        console.error("Error updating appointment:", err)
        setError("Failed to update appointment. Please try again later.")
      } finally {
        setUpdating(false)
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

  if (!appointment) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Appointment not found.</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    if (typeof status !== 'string') {
        return 'bg-gray-100 text-gray-800'
    }
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Appointment Details</h1>
            <p className="text-gray-600">View and manage appointment information</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Appointment #{appointment._id.substring(appointment._id.length - 6)}
              </h2>
              <div className="flex items-center mb-2">
                <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                <span>{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-gray-500 mr-2" />
                <span>{appointment.time}</span>
              </div>
              <div className="flex items-center mb-2">
                <Activity className="h-5 w-5 text-gray-500 mr-2" />
                <span className="capitalize">{appointment.department}</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-2" />
                <span className="capitalize">{appointment.type}</span>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status)}`}
              >
                {appointment.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Patient Information</h3>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                  {appointment.patient?.name ? appointment.patient.name.charAt(0).toUpperCase() : "P"}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{appointment.patient?.name || "Unknown"}</p>
                  <p className="text-sm text-gray-500">{appointment.patient?.email || "No email"}</p>
                  <p className="text-sm text-gray-500">{appointment.patient?.phone || "No phone"}</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-gray-700 mb-2">Doctor Information</h3>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                  {appointment.doctor?.name ? appointment.doctor.name.charAt(0).toUpperCase() : "D"}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{appointment.doctor?.name || "Not assigned"}</p>
                  <p className="text-sm text-gray-500">{appointment.doctor?.specialization || "No specialization"}</p>
                  <p className="text-sm text-gray-500">{appointment.doctor?.email || "No email"}</p>
                </div>
              </div>
            </div>
          </div>

          {appointment.notes && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{appointment.notes}</p>
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <h3 className="font-medium text-gray-700 mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              {appointment.status !== "confirmed" && (
                <button
                  onClick={() => updateStatus("confirmed")}
                  disabled={updating}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm
                </button>
              )}

              {appointment.status !== "completed" && appointment.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus("completed")}
                  disabled={updating}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Completed
                </button>
              )}

              {appointment.status !== "cancelled" && (
                <button
                  onClick={() => updateStatus("cancelled")}
                  disabled={updating}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              )}

              {appointment.status !== "cancelled" && (
                <Link
                  href={`/staff/prescriptions/new?patient=${appointment.patient?._id}&appointment=${appointment._id}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Write Prescription
                </Link>
              )}

              <Link
                href={`/staff/medical-records/new?patient=${appointment.patient?._id}`}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FileText className="h-4 w-4 mr-2" />
                Add Medical Record
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

