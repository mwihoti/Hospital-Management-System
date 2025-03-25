"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  User, 
  Calendar, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Edit, 
  ArrowLeft 
} from "lucide-react"
import React from "react"

// TypeScript interfaces for type safety
interface Patient {
  _id: string
  name: string
  email: string
  contactNumber?: string
  address?: string
  gender?: string
  dateOfBirth?: string
}

interface Appointment {
  _id: string
  doctor?: {
    name: string
  }
  date: string
  time: string
  status: string
}

interface Prescription {
  _id: string
  doctor?: {
    name: string
  }
  date: string
  medications: {
    name: string
    dosage: string
    frequency: string
  }[]
  notes?: string
}

export default function PatientProfile({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Ensure patientId is properly resolved
  const patientId = params.id

  useEffect(() => {
    async function loadPatientData() {
      try {
        setLoading(true)

        // Validate user authentication and authorization
        if (status !== "authenticated" || session?.user?.role !== "admin") {
          router.push(status === "unauthenticated" 
            ? "/auth/login" 
            : `/${session?.user?.role}/dashboard`
          )
          return
        }

        // Fetch patient details
        const patientResponse = await fetch(`/api/users/${patientId}`)
        if (!patientResponse.ok) throw new Error("Failed to fetch patient details")
        const patientData = await patientResponse.json()
        setPatient(patientData.user)

        // Fetch patient appointments
        const appointmentsResponse = await fetch(`/api/appointments?patient=${patientId}`)
        if (!appointmentsResponse.ok) throw new Error("Failed to fetch appointments")
        const appointmentsData = await appointmentsResponse.json()
        setAppointments(appointmentsData.appointments || [])

        // Fetch patient prescriptions
        const prescriptionsResponse = await fetch(`/api/prescriptions?patient=${patientId}`)
        if (!prescriptionsResponse.ok) throw new Error("Failed to fetch prescriptions")
        const prescriptionsData = await prescriptionsResponse.json()
        setPrescriptions(prescriptionsData.prescriptions || [])

        setError("")
      } catch (err: any) {
        console.error("Error loading patient data:", err)
        setError(err.message || "Failed to load patient data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    // Call data loading function
    loadPatientData()
  }, [patientId, session, status, router])

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  // Not found state
  if (!patient) {
    return (
      <div className="p-6 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Patient not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link href="/admin/patients" className="flex items-center text-blue-500 hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Patients
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Patient Profile</h1>
          <Link
            href={`/admin/patients/${patientId}/edit`}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <div className="bg-white p-6 rounded-lg shadow lg:col-span-1">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-3xl mb-4">
              {patient.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <h2 className="text-xl font-semibold">{patient.name}</h2>
            <p className="text-gray-500">Patient ID: {patient._id.substring(0, 8)}</p>
          </div>

          <div className="space-y-4">
            <ContactInfoItem 
              icon={<Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />} 
              label="Email" 
              value={patient.email} 
            />
            <ContactInfoItem 
              icon={<Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />} 
              label="Phone" 
              value={patient.contactNumber || "Not provided"} 
            />
            <ContactInfoItem 
              icon={<MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />} 
              label="Address" 
              value={patient.address || "Not provided"} 
            />
            <ContactInfoItem 
              icon={<User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />} 
              label="Gender" 
              value={patient.gender || "Not provided"} 
            />
            <ContactInfoItem 
              icon={<Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />} 
              label="Date of Birth" 
              value={patient.dateOfBirth 
                ? new Date(patient.dateOfBirth).toLocaleDateString() 
                : "Not provided"
              } 
            />
          </div>

          <QuickActions patientId={patientId} />
        </div>

        {/* Appointments and Medical History */}
        <div className="lg:col-span-2 space-y-6">
          <AppointmentsSection 
            appointments={appointments} 
            patientId={patientId} 
          />
          <PrescriptionsSection prescriptions={prescriptions} />
        </div>
      </div>
    </div>
  )
}

// Subcomponents for better code organization

function ContactInfoItem({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode, 
  label: string, 
  value: string 
}) {
  return (
    <div className="flex items-start">
      {icon}
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p>{value}</p>
      </div>
    </div>
  )
}

function QuickActions({ patientId }: { patientId: string }) {
  return (
    <div className="mt-6 pt-6 border-t">
      <h3 className="font-medium mb-3">Quick Actions</h3>
      <div className="space-y-2">
        <Link
          href={`/admin/appointments/new?patient=${patientId}`}
          className="flex items-center p-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Appointment
        </Link>

        <Link
          href={`/admin/medical-records/new?patient=${patientId}`}
          className="flex items-center p-2 bg-green-50 text-green-700 rounded hover:bg-green-100"
        >
          <FileText className="h-4 w-4 mr-2" />
          Add Medical Record
        </Link>
      </div>
    </div>
  )
}

function AppointmentsSection({ 
  appointments, 
  patientId 
}: { 
  appointments: Appointment[], 
  patientId: string 
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Appointments</h2>
        <Link
          href={`/admin/appointments/new?patient=${patientId}`}
          className="text-blue-500 text-sm hover:underline"
        >
          Schedule New
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded">
          <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No appointments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
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
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                        {appointment.doctor?.name
                          ? appointment.doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "D"}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {appointment.doctor?.name || "Unknown"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(appointment.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">{appointment.time}</div>
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
                      {appointment.status ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1): "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/appointments/${appointment._id}`}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/appointments/${appointment._id}/edit`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function PrescriptionsSection({ 
  prescriptions 
}: { 
  prescriptions: Prescription[] 
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Prescriptions</h2>
      </div>

      {prescriptions.length === 0 ? (
        <div className="text-center py-6 bg-gray-50 rounded">
          <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No prescriptions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">
                    Prescribed by Dr. {prescription.doctor?.name || "Unknown"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(prescription.date).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  href={`/admin/prescriptions/${prescription._id}`}
                  className="text-blue-500 text-sm hover:underline"
                >
                  View Details
                </Link>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Medications</h4>
                <ul className="list-disc list-inside text-sm">
                  {prescription.medications.map((med, index) => (
                    <li key={index}>
                      {med.name} - {med.dosage} - {med.frequency}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Notes</h4>
                <p className="text-sm">{prescription.notes || "No notes provided"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}