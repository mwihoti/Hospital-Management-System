"use client"

import { useState, useEffect } from "react"
import { FileText, Calendar, User, Activity } from "lucide-react"

interface MedicalRecord {
  id: string
  date: string
  type: string
  doctor: string
  department: string
  diagnosis: string
  notes: string
  attachments?: {
    id: string
    name: string
    type: string
    url: string
  }[]
}

export default function MedicalRecordView() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [expandedRecords, setExpandedRecords] = useState<{ [key: string]: boolean }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch medical records
    const fetchRecords = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/medical-records")
        if (response.ok) {
          const data = await response.json()
          setRecords(data)
          if (data.length > 0) {
            setSelectedRecord(data[0])
            setExpandedRecords({ [data[0].id]: true })
          }
        } else {
          console.error("Failed to fetch medical records")
        }
      } catch (error) {
        console.error("Error fetching medical records:", error)
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, use mock data
    setTimeout(() => {
      const mockRecords: MedicalRecord[] = [
        {
          id: "MR001",
          date: "2023-10-15",
          type: "Check-up",
          doctor: "Dr. John Smith",
          department: "Cardiology",
          diagnosis: "Hypertension",
          notes: "Blood pressure slightly elevated. Recommended lifestyle changes and scheduled follow-up in 3 months.",
          attachments: [
            {
              id: "A001",
              name: "Blood Test Results",
              type: "PDF",
              url: "#",
            },
            {
              id: "A002",
              name: "ECG Report",
              type: "PDF",
              url: "#",
            },
          ],
        },
        {
          id: "MR002",
          date: "2023-08-22",
          type: "Consultation",
          doctor: "Dr. Sarah Johnson",
          department: "Neurology",
          diagnosis: "Migraine",
          notes: "Patient reports frequent headaches. Prescribed medication and recommended keeping a headache diary.",
          attachments: [
            {
              id: "A003",
              name: "MRI Report",
              type: "PDF",
              url: "#",
            },
          ],
        },
        {
          id: "MR003",
          date: "2023-05-10",
          type: "Follow-up",
          doctor: "Dr. John Smith",
          department: "Cardiology",
          diagnosis: "Hypertension - Controlled",
          notes: "Blood pressure within normal range. Continue current medication.",
          attachments: [
            {
              id: "A004",
              name: "Blood Test Results",
              type: "PDF",
              url: "#",
            },
          ],
        },
      ]
      setRecords(mockRecords)
      if (mockRecords.length > 0) {
        setSelectedRecord(mockRecords[0])
        setExpandedRecords({ [mockRecords[0].id]: true })
      }
      setLoading(false)
    }, 1000)
  }, [])

  const toggleRecordExpansion = (recordId: string) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }))
  }

  const selectRecord = (record: MedicalRecord) => {
    setSelectedRecord(record)
    setExpandedRecords((prev) => ({
      ...prev,
      [record.id]: true,
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3">
        {/* Records List */}
        <div className="border-r">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Medical Records</h2>
          </div>

          {loading ? (
            <div className="p-4 space-y-4">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                ))}
            </div>
          ) : records.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No medical records found.</div>
          ) : (
            <div className="divide-y">
              {records.map((record) => (
                <div
                  key={record.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedRecord?.id === record.id ? "bg-blue-50" : ""}`}
                  onClick={() => selectRecord(record)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{record.type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(record.date).toLocaleDateString()} - {record.department}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        record.type === "Check-up"
                          ? "bg-blue-100 text-blue-800"
                          : record.type === "Consultation"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {record.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Record Details */}
        <div className="md:col-span-2">
          {loading ? (
            <div className="p-6 animate-pulse">
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2 mb-6">
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-full bg-gray-200 rounded"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              </div>
              <div className="h-5 w-1/3 bg-gray-200 rounded mb-3"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : !selectedRecord ? (
            <div className="p-6 text-center text-gray-500">Select a record to view details.</div>
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">
                  {selectedRecord.type} - {new Date(selectedRecord.date).toLocaleDateString()}
                </h2>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedRecord.type === "Check-up"
                      ? "bg-blue-100 text-blue-800"
                      : selectedRecord.type === "Consultation"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                  }`}
                >
                  {selectedRecord.type}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-medium">{selectedRecord.doctor}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{selectedRecord.department}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Activity className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Diagnosis</p>
                    <p className="font-medium">{selectedRecord.diagnosis}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(selectedRecord.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Notes</h3>
                <p className="text-gray-700">{selectedRecord.notes}</p>
              </div>

              {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Attachments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRecord.attachments.map((attachment) => (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        className="flex items-center p-3 border rounded-md hover:bg-gray-50"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-xs text-gray-500">{attachment.type}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

