"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Mail, Phone, Calendar, Search, Plus, ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"

export default function PatientsPage() {
  const { data: session } = useSession()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)


  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("/api/users/role/patient")
        if (!response.ok) throw new Error("Failed to fetch patients")

        const data = await response.json()
        console.log(data)
        setPatients(data || [])
      } catch (err) {
        console.error("Error fetching patients:", err)
        setError("Failed to load patients. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchPatients()
    }
  }, [session])

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      setDeleteLoading(userId)

      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      // Remove the deleted user from the state
      setPatients(patients.filter((patient) => patient._id !== userId))
    } catch (err) {
      console.error("Error deleting user:", err)
      alert("Failed to delete user. Please try again.")
    } finally {
      setDeleteLoading(null)
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-gray-600">View and manage all patients</p>
        </div>
        <div className="mt-4 flex justify-between space-x-6 items-center md:mt-0">
          <Link
            href="/admin/patients/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Patient
          </Link>
          <Link href="/admin/dashboard" className="flex items-center text-blue-500 hover:underline mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search patients by name or email..."
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

        {filteredPatients.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500">No patients found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date Registered
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          {patient.name ? patient.name.charAt(0).toUpperCase() : "P"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">Patient ID: {patient._id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-4 w-4 mr-1 text-gray-500" />
                          {patient.email}
                        </div>
                        {patient.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-1 text-gray-500" />
                            {patient.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        {new Date(patient.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/admin/patients/${patient._id}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        View
                      </Link>
                      <Link
                        href={`/admin/patients/${patient._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(patient._id)}
                        disabled={deleteLoading === patient._id}
                        className="text-red-600 hover:text-red-900"
                      >
                        {deleteLoading === patient._id ? (
                          <span className="inline-block animate-spin h-4 w-4 border-t-2 border-red-500 rounded-full"></span>
                        ) : (
                          <Trash2 className="h-4 w-4 inline" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

