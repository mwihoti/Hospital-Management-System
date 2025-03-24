"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { FileText, Calendar } from "lucide-react"

export default function PatientPrescriptionsPage() {
  const { data: session } = useSession()
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPrescriptions() {
      try {
        const response = await fetch("/api/prescriptions")
        if (!response.ok) throw new Error("Failed to fetch prescriptions")

        const data = await response.json()
        setPrescriptions(data.prescriptions || [])
      } catch (err) {
        console.error("Error fetching prescriptions:", err)
        setError("Failed to load prescriptions. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchPrescriptions()
    }
  }, [session])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Prescriptions</h1>
        <p className="text-gray-600">View your medication prescriptions</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <FileText className="h-8 w-8 text-gray-500" />
          </div>
          <p className="text-gray-500">No prescriptions found.</p>
          <p className="text-gray-500 text-sm mt-1">Your doctor hasn't prescribed any medications yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-medium text-blue-800">Prescription</h2>
                </div>
                <div className="text-sm text-blue-600">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  {formatDate(prescription.date)}
                </div>
              </div>

              <div className="p-4 border-b">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    {prescription.doctor?.name ? prescription.doctor.name.charAt(0).toUpperCase() : "D"}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium">Prescribed By</div>
                    <div className="text-lg">{prescription.doctor?.name || "Unknown Doctor"}</div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium text-gray-700 mb-3">Medications</h3>
                <div className="space-y-4">
                  {prescription.medications.map((medication, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{medication.name}</h4>
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {medication.status || "Active"}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Dosage:</span> {medication.dosage}
                        </div>
                        <div>
                          <span className="text-gray-500">Frequency:</span> {medication.frequency}
                        </div>
                        {medication.route && (
                          <div>
                            <span className="text-gray-500">Route:</span> {medication.route}
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Duration:</span> {medication.duration || "Not specified"}
                        </div>
                      </div>

                      {medication.instructions && (
                        <div className="mt-3 pt-3 border-t">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Instructions</h5>
                          <p className="text-sm text-gray-600">{medication.instructions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

