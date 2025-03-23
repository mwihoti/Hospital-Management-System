"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Pill, Calendar, User, Clock, AlertCircle } from "lucide-react"

export default function PatientPrescriptions() {
  const { data: session } = useSession()
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchPrescriptions() {
      if (!session?.user?.id) return

      try {
        const response = await fetch(`/api/prescriptions?patient=${session.user.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch prescriptions")
        }
        const data = await response.json()
        setPrescriptions(data.prescriptions)
      } catch (err) {
        console.error("Error fetching prescriptions:", err)
        setError("Failed to load prescription data")
      } finally {
        setLoading(false)
      }
    }

    fetchPrescriptions()
  }, [session])

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Prescriptions</h1>

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Prescriptions Found</h2>
          <p className="text-gray-500">You don't have any prescriptions at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((prescription) => (
            <div key={prescription._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{prescription.medication?.name || "Medication"}</h2>
                    <p className="text-gray-600 mt-1">{prescription.dosage}</p>
                  </div>
                  <div
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      prescription.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {prescription.status}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Prescribed Date</p>
                      <p className="text-sm">{new Date(prescription.date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Prescribed By</p>
                      <p className="text-sm">{prescription.doctor?.name || "Doctor"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm">{prescription.duration || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-xs text-gray-500">Instructions</p>
                      <p className="text-sm">{prescription.instructions || "No special instructions"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

