"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Calendar, Pill, ArrowLeft } from "lucide-react"

export default function PrescriptionDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [prescription, setPrescription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPrescription() {
      try {
        const response = await fetch(`/api/prescriptions/${params.id}`)
        if (!response.ok) throw new Error("Failed to fetch prescription")

        const data = await response.json()
        setPrescription(data.prescription)
      } catch (err) {
        console.error("Error fetching prescription:", err)
        setError("Failed to load prescription. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchPrescription()
    }
  }, [session, params.id])

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

  if (!prescription) {
    return (
      <div className="p-6">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Prescription not found.</p>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Prescription Details</h1>
            <p className="text-gray-600">View your prescription information</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Calendar className="h-5 w-5 text-gray-500 mr-2" />
              <span className="text-gray-700">Prescribed on: {formatDate(prescription.createdAt)}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2">Doctor Information</h3>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    {prescription.doctor?.name ? prescription.doctor.name.charAt(0).toUpperCase() : "D"}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Dr. {prescription.doctor?.name || "Unknown"}</p>
                    <p className="text-sm text-gray-500">
                      {prescription.doctor?.specialization || "No specialization"}
                    </p>
                    <p className="text-sm text-gray-500">{prescription.doctor?.email || "No email"}</p>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-gray-700 mb-2">Patient Information</h3>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    {prescription.patient?.name ? prescription.patient.name.charAt(0).toUpperCase() : "P"}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{prescription.patient?.name || "Unknown"}</p>
                    <p className="text-sm text-gray-500">{prescription.patient?.email || "No email"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-700 mb-4">Medications</h3>
              <div className="space-y-4">
                {prescription.medications.map((medication, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center mb-2">
                      <Pill className="h-5 w-5 text-blue-500 mr-2" />
                      <h4 className="font-medium text-gray-900">{medication.name}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                      <div>
                        <p className="text-sm text-gray-500">Dosage</p>
                        <p className="text-sm font-medium">{medication.dosage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Frequency</p>
                        <p className="text-sm font-medium">{medication.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="text-sm font-medium">{medication.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Route</p>
                        <p className="text-sm font-medium">{medication.route}</p>
                      </div>
                      {medication.instructions && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500">Instructions</p>
                          <p className="text-sm font-medium">{medication.instructions}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {prescription.notes && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Additional Notes</h3>
                <div className="border rounded-lg p-4 bg-gray-50">
                  <p className="text-gray-700 whitespace-pre-line">{prescription.notes}</p>
                </div>
              </div>
            )}

            <div className="flex justify-center mt-8">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Prescription
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

