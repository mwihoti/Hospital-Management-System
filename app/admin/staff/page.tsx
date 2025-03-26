"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UserPlus, Search, Filter, ChevronDown, Trash2, ChevronRight } from "lucide-react"

export default function StaffPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState("all")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)


  useEffect(() => {
    async function loadStaff() {
      try {
        setLoading(true)

        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
          search: searchTerm,
          filter: filter,
        })

        const response = await fetch(`/api/users/role/doctor?${queryParams}`)
        if (!response.ok) throw new Error("Failed to fetch staff")

        const data = await response.json()
        setStaff(data || [])
        setTotalPages(data.totalPages || 1)
        setError("")
      } catch (err) {
        console.error("Error loading staff:", err)
        setError("Failed to load staff. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      loadStaff()
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push(`/${session.user.role}/dashboard`)
    }
  }, [session, status, router, currentPage, searchTerm, filter])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    // The search will be triggered by the useEffect
  }

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }
    try {
      setDeleteLoading(userId)

      const response = await fetch(`/api/users/${userId}, {
        method: "DELETE}`)
    
    if (!response.ok) {
      throw new Error("Failed to delete user")
    }

    // remove the deleted doctor fromstate
    setStaff(staff.filter((staff) => staff._id !== userId))
  }catch (err) {
    console.error("Error deleting user:", err)
    alert("Failed to delete user. Please try again.")
  } finally {
    setDeleteLoading(null)
  }
}

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Staff</h1>
        <Link
          href="/admin/staff/new"
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Staff
        </Link>
        <Link href='/admin/dashboard'>
        <button className="p-4 border rounded-md ">Back</button>

        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>

          <div className="relative">
            <button
              className="flex items-center px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
              onClick={() => document.getElementById("filterDropdown").classList.toggle("hidden")}
            >
              <Filter className="h-4 w-4 mr-2 text-gray-500" />
              <span>Filter</span>
              <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
            </button>

            <div id="filterDropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
              <div className="py-1">
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === "all" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => handleFilterChange("all")}
                >
                  All Staff
                </button>
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === "doctors" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => handleFilterChange("doctors")}
                >
                  Doctors
                </button>
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === "nurses" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => handleFilterChange("nurses")}
                >
                  Nurses
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Staff List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {staff.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-500 mx-auto mb-4">
              <UserPlus className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No staff found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm ? "Try a different search term" : "Add your first staff member to get started"}
            </p>
            <Link
              href="/admin/staff/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add New Staff
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Added
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staff.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">Dr. {member.name}</div>
                            <div className="text-sm text-gray-500">ID: {member._id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.email}</div>
                        <div className="text-sm text-gray-500">{member.contactNumber || "No phone"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{member.specialty || "Not specified"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{new Date(member.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/admin/staff/${member._id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                          View
                        </Link>
                        <Link
                          href={`/admin/staff/${member._id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <button
                        onClick={() => handleDeleteUser(staff._id)}
                        disabled={deleteLoading === staff._id}
                        className="text-red-600 p-4 hover:text-red-900"
                      >
                        {deleteLoading === staff._id ? (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>

                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing page <span className="font-medium">{currentPage}</span> of{" "}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronRight className="h-5 w-5 transform rotate-180" />
                      </button>

                      {/* Page numbers */}
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`relative inline-flex items-center px-4 py-2 border ${
                            currentPage === i + 1
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          } text-sm font-medium`}
                        >
                          {i + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

