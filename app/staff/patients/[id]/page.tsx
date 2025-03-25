"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Calendar, FileText, Phone, Mail, MapPin, Clock, ArrowLeft, PlusCircle } from "lucide-react"
import { use } from "react"

export default function PatientProfilePage({ params }: { params: { id: string } }) {
  // Unwrap the params object using React.use()
  const unwrappedParams = use(params)
  const patientId = unwrappedParams.id
  
  const { data: session, status } = useSession()
  const router = useRouter()
  const [patient, setPatient] = useState<any>(null)
  const [appointments, setAppointments] = useState([])
  const [prescriptions, setPrescriptions] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadPatientData() {
      if (!session?.user?.id) return

      try {
        setLoading(true)

        // Fetch patient details
        const patientResponse = await fetch(`/api/users/${patientId}`)
        if (!patientResponse.ok) throw new Error("Failed to fetch patient details")
        const patientData = await patientResponse.json()
        setPatient(patientData.user)

        // Fetch patient appointments with this doctor
        const appointmentsResponse = await fetch(`/api/appointments?patient=${patientId}&doctor=${session.user.id}`)
        if (!appointmentsResponse.ok) throw new Error("Failed to fetch appointments")
        const appointmentsData = await appointmentsResponse.json()
        setAppointments(appointmentsData.appointments || [])

        // Fetch patient prescriptions from this doctor
        const prescriptionsResponse = await fetch(`/api/prescriptions?patient=${patientId}&doctor=${session.user.id}`)
        if (!prescriptionsResponse.ok) throw new Error("Failed to fetch prescriptions")
        const prescriptionsData = await prescriptionsResponse.json()
        setPrescriptions(prescriptionsData.prescriptions || [])

        // Fetch patient medical records from this doctor
        const recordsResponse = await fetch(`/api/medical-records?patient=${patientId}&doctor=${session.user.id}`)
        if (!recordsResponse.ok) throw new Error("Failed to fetch medical records")
        const recordsData = await recordsResponse.json()
        setMedicalRecords(recordsData.records || [])

        setError("")
      } catch (err) {
        console.error("Error loading patient data:", err)
        setError("Failed to load patient data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "doctor") {
      loadPatientData()
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated" && session?.user?.role !== "doctor") {
      router.push(`/${session.user.role}/dashboard`)
    }
  }, [patientId, session, status, router])

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
        <Link href="/staff/patients" className="flex items-center text-blue-500 hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Patients
        </Link>
        <h1 className="text-2xl font-bold">Patient Profile</h1>
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
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{patient.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p>{patient.contactNumber || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p>{patient.address || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p>{patient.gender || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : "Not provided"}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-medium mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/staff/appointments/new?patient=${patientId}`}
                className="flex items-center p-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Link>

              <Link
                href={`/staff/medical-records/new?patient=${patientId}`}
                className="flex items-center p-2 bg-green-50 text-green-700 rounded hover:bg-green-100"
              >
                <FileText className="h-4 w-4 mr-2" />
                Add Medical Record
              </Link>

              <Link
                href={`/staff/prescriptions/new?patient=${patientId}`}
                className="flex items-center p-2 bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Write Prescription
              </Link>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointments */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Appointments</h2>
              <Link
                href={`/staff/appointments/new?patient=${patientId}`}
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
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reason
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
                          <div className="text-sm text-gray-900">{new Date(appointment.date).toLocaleDateString()}</div>
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
                            {/* Add null check for appointment.status */}
                            {appointment.status 
                              ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) 
                              : "Unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{appointment.reason || "Not specified"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/staff/appointments/${appointment._id}`}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </Link>
                          {appointment.status === "scheduled" && (
                            <button
                              onClick={async () => {
                                try {
                                  const response = await fetch(`/api/appointments/${appointment._id}/status`, {
                                    method: "PATCH",
                                    headers: {
                                      "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ status: "completed" }),
                                  })

                                  if (!response.ok) throw new Error("Failed to update appointment status")

                                  // Update the appointment status in the UI
                                  setAppointments(
                                    appointments.map((apt) =>
                                      apt._id === appointment._id ? { ...apt, status: "completed" } : apt,
                                    ),
                                  )
                                } catch (err) {
                                  console.error("Error updating appointment status:", err)
                                  alert("Failed to update appointment status. Please try again.")
                                }
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Medical Records */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Medical Records</h2>
              <Link
                href={`/staff/medical-records/new?patient=${patientId}`}
                className="text-blue-500 text-sm hover:underline"
              >
                Add New
              </Link>
            </div>

            {medicalRecords.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded">
                <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No medical records found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medicalRecords.map((record) => (
                  <div key={record._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{record.title}</h3>
                        <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                      <Link
                        href={`/staff/medical-records/${record._id}`}
                        className="text-blue-500 text-sm hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">{record.description.substring(0, 150)}...</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Prescriptions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Prescriptions</h2>
              <Link
                href={`/staff/prescriptions/new?patient=${patientId}`}
                className="text-blue-500 text-sm hover:underline"
              >
                Write New
              </Link>
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
                        <h3 className="font-medium">Prescription</h3>
                        <p className="text-sm text-gray-500">{new Date(prescription.date).toLocaleDateString()}</p>
                      </div>
                      <Link
                        href={`/staff/prescriptions/${prescription._id}`}
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
        </div>
      </div>
    </div>
  )
}