"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Filter, ChevronDown, User, UserPlus } from "lucide-react"

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    async function loadUsers() {
      if (!session?.user?.id) return

      try {
        setLoading(true)

        const queryParams = new URLSearchParams({
          page: currentPage.toString(),
          limit: "10",
          search: searchTerm,
        })

        const response = await fetch(`/api/users?${queryParams}`)
        if (!response.ok) throw new Error("Failed to fetch users")

        const data = await response.json()
        setUsers(data.users || [])
        setTotalPages(data.totalPages || 1)
        setError("")
      } catch (err) {
        console.error("Error loading users:", err)
        setError("Failed to load users. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      loadUsers()
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push(`/${session.user.role}/dashboard`)
    }
  }, [session, status, router, currentPage, searchTerm])

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    // The search will be triggered by the useEffect
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800"
      case "doctor":
        return "bg-blue-100 text-blue-800"
      case "patient":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Filter users by role if filter is set
  const filteredUsers = filter === "all" ? users : users.filter((user) => user.role === filter)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <p className="text-gray-600">View and manage all users in the system</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search users by name or email..."
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
              <span>Filter by Role</span>
              <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
            </button>

            <div id="filterDropdown" className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 hidden">
              <div className="py-1">
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === "all" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => setFilter("all")}
                >
                  All Users
                </button>
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === "admin" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => setFilter("admin")}
                >
                  Administrators
                </button>
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === "doctor" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => setFilter("doctor")}
                >
                  Doctors
                </button>
                <button
                  className={`block px-4 py-2 text-sm w-full text-left ${filter === "patient" ? "bg-blue-50 text-blue-700" : "hover:bg-gray-100"}`}
                  onClick={() => setFilter("patient")}
                >
                  Patients
                </button>
              </div>
            </div>
          </div>

          <Link
            href="/admin/users/new"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            <span>Add User</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Users List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mx-auto mb-4">
              <User className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-gray-500">
              {searchTerm ? "Try a different search term" : "No users match the selected filter"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.status || "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link href={`/admin/users/${user._id}`} className="text-blue-600 hover:text-blue-900 mr-3">
                        View
                      </Link>
                      <Link
                        href={`/admin/users/${user._id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        Edit
                      </Link>
                      {user._id !== session.user.id && (
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this user?")) {
                              // Delete user logic would go here
                            }
                          }}
                        >
                          Delete
                        </button>
                      )}
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

