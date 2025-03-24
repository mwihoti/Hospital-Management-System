"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, Calendar, User, Activity, Search, Filter, Download } from "lucide-react"

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

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [expandedRecords, setExpandedRecords] = useState<{ [key: string]: boolean }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
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
          setFilteredRecords(data)
          if (data.length > 0) {
            setSelectedRecord(data[0])
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
        {
          id: "MR004",
          date: "2023-03-15",
          type: "Surgery",
          doctor: "Dr. Michael Chen",
          department: "Orthopedics",
          diagnosis: "Meniscus Tear",
          notes: "Arthroscopic surgery performed successfully. Patient to begin physical therapy in 2 weeks.",
          attachments: [
            {
              id: "A005",
              name: "Surgery Report",
              type: "PDF",
              url: "#",
            },
            {
              id: "A006",
              name: "Post-Op Instructions",
              type: "PDF",
              url: "#",
            },
            {
              id: "A007",
              name: "X-Ray Images",
              type: "DICOM",
              url: "#",
            },
          ],
        },
      ]

      setRecords(mockRecords)
      setFilteredRecords(mockRecords)
      if (mockRecords.length > 0) {
        setSelectedRecord(mockRecords[0])
      }
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Apply filters
    let result = [...records]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (record) =>
          record.doctor.toLowerCase().includes(query) ||
          record.diagnosis.toLowerCase().includes(query) ||
          record.department.toLowerCase().includes(query),
      )
    }

    // Type filter
    if (typeFilter !== "all") {
      result = result.filter((record) => record.type.toLowerCase() === typeFilter.toLowerCase())
    }

    setFilteredRecords(result)
  }, [searchQuery, typeFilter, records])

  const toggleRecordExpansion = (recordId: string) => {
    setExpandedRecords((prev) => ({
      ...prev,
      [recordId]: !prev[recordId],
    }))
  }

  const selectRecord = (record: MedicalRecord) => {
    setSelectedRecord(record)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Check-up":
        return "bg-blue-100 text-blue-800"
      case "Consultation":
        return "bg-purple-100 text-purple-800"
      case "Follow-up":
        return "bg-green-100 text-green-800"
      case "Surgery":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-[#4A90E2]" />
            <h1 className="text-2xl font-light text-[#333333]">MediCare</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
              Dashboard
            </Link>
            <Link href="/appointments" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
              Appointments
            </Link>
            <Link href="/medical-records" className="text-[#4A90E2] font-medium transition-colors">
              Medical Records
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">JD</div>
              <span className="text-[#333333]">John Doe</span>
            </div>
          </nav>
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-light text-[#333333]">Medical Records</h1>
            <p className="text-[#666666]">View and manage your medical history</p>
          </div>
          <button className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white px-4 py-2 rounded-md flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Download All Records
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search records..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="check-up">Check-up</option>
            <option value="consultation">Consultation</option>
            <option value="follow-up">Follow-up</option>
            <option value="surgery">Surgery</option>
          </select>
          <button className="bg-white border border-gray-200 rounded-md px-4 py-2 flex items-center hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>
        </div>

        {/* Records List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Records List */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="font-medium">Records</h2>
            </div>
            <div className="divide-y max-h-[600px] overflow-y-auto">
              {loading ? (
                // Loading skeletons
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="p-4 animate-pulse">
                      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                    </div>
                  ))
              ) : filteredRecords.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No records found matching your criteria.</div>
              ) : (
                filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedRecord?.id === record.id ? "bg-blue-50" : ""}`}
                    onClick={() => selectRecord(record)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-[#333333]">{record.diagnosis}</h3>
                        <p className="text-sm text-[#666666]">
                          {record.doctor} - {record.department}
                        </p>
                        <p className="text-xs text-[#666666] mt-1">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${getTypeColor(record.type)}`}>
                        {record.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Record Details */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
            {loading ? (
              <div className="p-6 animate-pulse">
                <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                </div>
                <div className="h-5 w-1/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-full bg-gray-200 rounded mb-1"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-4"></div>
                <div className="h-5 w-1/4 bg-gray-200 rounded mb-2"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-gray-200 rounded"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : !selectedRecord ? (
              <div className="p-6 text-center text-gray-500">Select a record to view details.</div>
            ) : (
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-xl font-semibold">{selectedRecord.diagnosis}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm ${getTypeColor(selectedRecord.type)}`}>
                    {selectedRecord.type}
                  </span>
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
                    <Calendar className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{new Date(selectedRecord.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Activity className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Record ID</p>
                      <p className="font-medium">{selectedRecord.id}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Notes</h3>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-md">{selectedRecord.notes}</p>
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

                <div className="flex justify-end mt-6">
                  <button className="flex items-center text-[#4A90E2] hover:text-[#3A80D2]">
                    <Download className="h-4 w-4 mr-1" />
                    Download Record
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

