"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { FileText, Calendar, Search } from "lucide-react"
import Link from "next/link"

export default function MedicalRecordsPage() {
  const { data: session } = useSession()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchMedicalRecords() {
      try {
        if (!session?.user?.id) return

        const response = await fetch(`/api/medical-records?patient=${session.user.id}`)
        if (!response.ok) throw new Error("Failed to fetch medical records")

        const data = await response.json()
        setRecords(data.records || [])
      } catch (err) {
        console.error("Error fetching medical records:", err)
        setError("Failed to load medical records. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchMedicalRecords()
    }
  }, [session])

  // For now, let's create some mock data since we don't have the API yet
  useEffect(() => {
    if (loading && session?.user) {
      // Create mock data for demonstration
      const mockRecords = [
        {
          _id: "1",
          patient: session.user.id,
          doctor: {
            _id: "doc1",
            name: "Dr. John Smith",
            specialization: "Cardiology",
          },
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          diagnosis: "Hypertension",
          treatment: "Prescribed medication and lifestyle changes",
          notes: "Patient should monitor blood pressure daily and follow up in 2 weeks",
          attachments: [],
        },
        {
          _id: "2",
          patient: session.user.id,
          doctor: {
            _id: "doc2",
            name: "Dr. Sarah Johnson",
            specialization: "General Medicine",
          },
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          diagnosis: "Common Cold",
          treatment: "Rest and over-the-counter medication",
          notes: "Patient should drink plenty of fluids and rest",
          attachments: [],
        },
      ]

      setRecords(mockRecords)
      setLoading(false)
    }
  }, [loading, session])

  const filteredRecords = records.filter(
    (record) =>
      record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
        <h1 className="text-2xl font-bold">Medical Records</h1>
        <p className="text-gray-600">View your medical history and records</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by diagnosis or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {filteredRecords.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No medical records found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <div key={record._id} className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{record.diagnosis}</h3>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                      {record.doctor?.name ? record.doctor.name.charAt(0).toUpperCase() : "D"}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{record.doctor?.name}</div>
                      <div className="text-sm text-gray-500">{record.doctor?.specialization}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Treatment</h4>
                    <p className="mt-1 text-sm text-gray-900">{record.treatment}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                    <p className="mt-1 text-sm text-gray-900">{record.notes}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    href={`/patient/medical-records/${record._id}`}
                    className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    View Full Record
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

