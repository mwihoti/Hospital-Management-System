"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Filter, MoreHorizontal, FileText, Calendar } from "lucide-react"

interface Patient {
  id: string
  name: string
  age: number
  gender: string
  phone: string
  email: string
  address: string
  lastVisit: string
  status: "Active" | "Inactive"
  insurance: string
}

export default function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [insuranceFilter, setInsuranceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const patientsData: Patient[] = [
        {
          id: "P001",
          name: "John Doe",
          age: 45,
          gender: "Male",
          phone: "(555) 123-4567",
          email: "john.doe@example.com",
          address: "123 Main St, Anytown, USA",
          lastVisit: "2023-10-15",
          status: "Active",
          insurance: "BlueCross",
        },
        {
          id: "P002",
          name: "Jane Smith",
          age: 32,
          gender: "Female",
          phone: "(555) 234-5678",
          email: "jane.smith@example.com",
          address: "456 Oak Ave, Somewhere, USA",
          lastVisit: "2023-11-02",
          status: "Active",
          insurance: "Medicare",
        },
        {
          id: "P003",
          name: "Robert Chen",
          age: 58,
          gender: "Male",
          phone: "(555) 345-6789",
          email: "robert.chen@example.com",
          address: "789 Pine Rd, Nowhere, USA",
          lastVisit: "2023-09-28",
          status: "Inactive",
          insurance: "Aetna",
        },
        {
          id: "P004",
          name: "Maria Garcia",
          age: 29,
          gender: "Female",
          phone: "(555) 456-7890",
          email: "maria.garcia@example.com",
          address: "101 Elm St, Anytown, USA",
          lastVisit: "2023-11-10",
          status: "Active",
          insurance: "UnitedHealth",
        },
        {
          id: "P005",
          name: "James Wilson",
          age: 67,
          gender: "Male",
          phone: "(555) 567-8901",
          email: "james.wilson@example.com",
          address: "202 Maple Dr, Somewhere, USA",
          lastVisit: "2023-10-05",
          status: "Active",
          insurance: "Medicare",
        },
        {
          id: "P006",
          name: "Emily Davis",
          age: 41,
          gender: "Female",
          phone: "(555) 678-9012",
          email: "emily.davis@example.com",
          address: "303 Birch Ln, Nowhere, USA",
          lastVisit: "2023-11-15",
          status: "Inactive",
          insurance: "Cigna",
        },
      ]
      setPatients(patientsData)
      setFilteredPatients(patientsData)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Apply filters
    let result = [...patients]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (patient) =>
          patient.name.toLowerCase().includes(query) ||
          patient.email.toLowerCase().includes(query) ||
          patient.id.toLowerCase().includes(query),
      )
    }

    // Insurance filter
    if (insuranceFilter !== "all") {
      result = result.filter((patient) => patient.insurance.toLowerCase() === insuranceFilter.toLowerCase())
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((patient) => patient.status.toLowerCase() === statusFilter.toLowerCase())
    }

    setFilteredPatients(result)
  }, [searchQuery, insuranceFilter, statusFilter, patients])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patient Management</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add New Patient
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={insuranceFilter}
          onChange={(e) => setInsuranceFilter(e.target.value)}
        >
          <option value="all">All Insurance</option>
          <option value="medicare">Medicare</option>
          <option value="bluecross">BlueCross</option>
          <option value="aetna">Aetna</option>
          <option value="unitedhealth">UnitedHealth</option>
          <option value="cigna">Cigna</option>
        </select>
        <select
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          More Filters
        </button>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age/Gender
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Visit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Insurance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              // Loading skeletons
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-8 w-20 bg-gray-200 rounded animate-pulse ml-auto"></div>
                    </td>
                  </tr>
                ))
            ) : filteredPatients.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No patients found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {patient.age} / {patient.gender}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>{patient.phone}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(patient.lastVisit).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{patient.insurance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FileText className="h-5 w-5" />
                        <span className="sr-only">Records</span>
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Calendar className="h-5 w-5" />
                        <span className="sr-only">Appointments</span>
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="sr-only">More</span>
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
  )
}

