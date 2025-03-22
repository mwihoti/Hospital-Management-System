"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  Calendar,
  Clock,
  Activity,
} from "lucide-react"
import { getPatients, getPatientStats, type Patient, type PatientStat } from "@/lib/api"

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [patientStats, setPatientStats] = useState<PatientStat[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [insuranceFilter, setInsuranceFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)
  const [isInsuranceOpen, setIsInsuranceOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const patientsPerPage = 10

  // Fetch patients data
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true)
      try {
        const data = await getPatients()
        setPatients(data)
        setFilteredPatients(data)
      } catch (error) {
        console.error("Error fetching patients:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [])

  // Fetch patient stats
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true)
      try {
        const data = await getPatientStats()
        setPatientStats(data)
      } catch (error) {
        console.error("Error fetching patient stats:", error)
      } finally {
        setStatsLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Handle tab changes
  useEffect(() => {
    const fetchFilteredPatients = async () => {
      setLoading(true)
      try {
        let data
        if (activeTab === "active") {
          data = await getPatients("active")
        } else if (activeTab === "inactive") {
          data = await getPatients("inactive")
        } else {
          data = await getPatients()
        }
        setPatients(data)
        applyFilters(data)
      } catch (error) {
        console.error("Error fetching filtered patients:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFilteredPatients()
  }, [activeTab])

  // Apply search and insurance filters
  const applyFilters = (data: Patient[]) => {
    let filtered = [...data]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          patient.id.toLowerCase().includes(query) ||
          patient.email.toLowerCase().includes(query),
      )
    }

    // Apply insurance filter
    if (insuranceFilter !== "all") {
      filtered = filtered.filter((patient) => patient.insurance.toLowerCase() === insuranceFilter.toLowerCase())
    }

    setFilteredPatients(filtered)
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    applyFilters(patients)
  }

  // Handle insurance filter change
  const handleInsuranceChange = (value: string) => {
    setInsuranceFilter(value)
    setIsInsuranceOpen(false)
    applyFilters(patients)
  }

  // Render stat cards with loading state
  const renderStatCards = () => {
    if (statsLoading) {
      return Array(4)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        ))
    }

    return patientStats.map((stat, index) => {
      // Map icon string to component
      const IconComponent =
        stat.icon === "User" ? User : stat.icon === "Plus" ? Plus : stat.icon === "Calendar" ? Calendar : Clock

      return (
        <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
          <div className={`p-3 rounded-full ${stat.color}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm text-[#666666]">{stat.title}</p>
            <p className="text-2xl font-medium text-[#333333]">{stat.value}</p>
          </div>
        </div>
      )
    })
  }

  // Filter patients based on search term
  const filteredPatientsList = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage
  const currentPatients = filteredPatientsList.slice(indexOfFirstPatient, indexOfLastPatient)
  const totalPages = Math.ceil(filteredPatientsList.length / patientsPerPage)

  if (loading) {
    return <div className="p-4">Loading patients...</div>
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
            <Link href="/patients" className="text-[#4A90E2] font-medium transition-colors">
              Patients
            </Link>
            <Link href="/appointments" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
              Appointments
            </Link>
            <Link href="/staff" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
              Staff
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">AD</div>
              <span className="text-[#333333]">Dr. Adams</span>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Patients</h1>
          <Link href="/patients/new" className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Patient
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">{renderStatCards()}</div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white border rounded-md flex">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "all" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} rounded-l-md transition-colors`}
            >
              All Patients
            </button>
            <button
              onClick={() => setActiveTab("active")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "active" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} transition-colors`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab("inactive")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "inactive" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} transition-colors`}
            >
              Inactive
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`px-4 py-2 text-sm font-medium ${activeTab === "recent" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} rounded-r-md transition-colors`}
            >
              Recently Added
            </button>
          </div>

          <div className="mt-4">
            {activeTab === "all" && (
              <>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="bg-white border border-gray-300 px-4 py-2 rounded-md flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </div>

                {/* Patients Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentPatients.length > 0 ? (
                        currentPatients.map((patient) => (
                          <tr key={patient._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5 text-gray-500" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {patient.phone || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Link
                                href={`/patients/${patient._id}`}
                                className="text-blue-600 hover:text-blue-900 mr-4"
                              >
                                View
                              </Link>
                              <Link
                                href={`/patients/${patient._id}/edit`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                            No patients found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredPatientsList.length > patientsPerPage && (
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-700">
                      Showing <span className="font-medium">{indexOfFirstPatient + 1}</span> to{" "}
                      <span className="font-medium">{Math.min(indexOfLastPatient, filteredPatientsList.length)}</span>{" "}
                      of <span className="font-medium">{filteredPatientsList.length}</span> patients
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "active" && (
              <>
                {loading ? (
                  <div className="p-8 flex flex-col items-center justify-center">
                    <div className="flex gap-2 items-center mb-4">
                      <div className="h-5 w-5 rounded-full bg-blue-200 animate-pulse"></div>
                      <div className="h-5 w-5 rounded-full bg-blue-300 animate-pulse"></div>
                      <div className="h-5 w-5 rounded-full bg-blue-400 animate-pulse"></div>
                    </div>
                    <p className="text-gray-500">Loading active patients...</p>
                  </div>
                ) : (
                  <div>
                    {/* Search */}
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search active patients..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>

                    {/* Active Patients Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Patient ID</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Age</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gender</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Visit</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Insurance</th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {filteredPatients.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                  No active patients found matching your criteria.
                                </td>
                              </tr>
                            ) : (
                              filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 font-medium text-gray-900">{patient.id}</td>
                                  <td className="px-4 py-3 text-gray-900">{patient.name}</td>
                                  <td className="px-4 py-3 text-gray-900">{patient.age}</td>
                                  <td className="px-4 py-3 text-gray-900">{patient.gender}</td>
                                  <td className="px-4 py-3">
                                    <div className="text-gray-900">{patient.phone}</div>
                                    <div className="text-sm text-gray-500">{patient.email}</div>
                                  </td>
                                  <td className="px-4 py-3 text-gray-900">{patient.lastVisit}</td>
                                  <td className="px-4 py-3 text-gray-900">{patient.insurance}</td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button className="p-1 rounded-md hover:bg-gray-100">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span className="sr-only">View Records</span>
                                      </button>
                                      <button className="p-1 rounded-md hover:bg-gray-100">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="sr-only">Schedule Appointment</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "inactive" && (
              <>
                {loading ? (
                  <div className="p-8 flex flex-col items-center justify-center">
                    <div className="flex gap-2 items-center mb-4">
                      <div className="h-5 w-5 rounded-full bg-blue-200 animate-pulse"></div>
                      <div className="h-5 w-5 rounded-full bg-blue-300 animate-pulse"></div>
                      <div className="h-5 w-5 rounded-full bg-blue-400 animate-pulse"></div>
                    </div>
                    <p className="text-gray-500">Loading inactive patients...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Patient ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Age</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gender</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Visit</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Insurance</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredPatients.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                No inactive patients found.
                              </td>
                            </tr>
                          ) : (
                            filteredPatients.map((patient) => (
                              <tr key={patient.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{patient.id}</td>
                                <td className="px-4 py-3 text-gray-900">{patient.name}</td>
                                <td className="px-4 py-3 text-gray-900">{patient.age}</td>
                                <td className="px-4 py-3 text-gray-900">{patient.gender}</td>
                                <td className="px-4 py-3">
                                  <div className="text-gray-900">{patient.phone}</div>
                                  <div className="text-sm text-gray-500">{patient.email}</div>
                                </td>
                                <td className="px-4 py-3 text-gray-900">{patient.lastVisit}</td>
                                <td className="px-4 py-3 text-gray-900">{patient.insurance}</td>
                                <td className="px-4 py-3 text-right">
                                  <button className="px-3 py-1 text-sm rounded-md text-green-600 border border-green-600 hover:bg-green-50">
                                    Reactivate
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === "recent" && (
              <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
                <p>Recently added patients view will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

