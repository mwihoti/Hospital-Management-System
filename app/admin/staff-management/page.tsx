"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Filter, Edit, Trash2, MoreHorizontal } from "lucide-react"


interface StaffMember {
    id: string
    name: string
    role: string
    department: string
    email: string
    phone: string
    statuus: "Active" | "On Leave" | "Inactive"
    joinDate: string
}

export default function StaffManagement() {
    const [staff, setStaff] = useState<StaffMember[]>([])
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [roleFilter, setRoleFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    setTimeout(() => {
        const staffData: StaffMember[] = [
          {
            id: "S001",
            name: "Dr. John Smith",
            role: "Doctor",
            department: "Cardiology",
            email: "john.smith@medicare.com",
            phone: "(555) 123-4567",
            status: "Active",
            joinDate: "2020-05-12",
          },
          {
            id: "S002",
            name: "Nurse Sarah Johnson",
            role: "Nurse",
            department: "Emergency",
            email: "sarah.johnson@medicare.com",
            phone: "(555) 234-5678",
            status: "Active",
            joinDate: "2021-02-15",
          },
          {
            id: "S003",
            name: "Dr. Michael Chen",
            role: "Doctor",
            department: "Neurology",
            email: "michael.chen@medicare.com",
            phone: "(555) 345-6789",
            status: "On Leave",
            joinDate: "2019-11-20",
          },
          {
            id: "S004",
            name: "Admin Lisa Davis",
            role: "Admin",
            department: "Administration",
            email: "lisa.davis@medicare.com",
            phone: "(555) 456-7890",
            status: "Active",
            joinDate: "2022-01-10",
          },
          {
            id: "S005",
            name: "Nurse Robert Wilson",
            role: "Nurse",
            department: "Pediatrics",
            email: "robert.wilson@medicare.com",
            phone: "(555) 567-8901",
            status: "Active",
            joinDate: "2021-07-05",
          },
          {
            id: "S006",
            name: "Dr. Emily Brown",
            role: "Doctor",
            department: "Dermatology",
            email: "emily.brown@medicare.com",
            phone: "(555) 678-9012",
            status: "Inactive",
            joinDate: "2020-09-18",
          },
        ]
        setStaff(staffData)
        setFilteredStaff(staffData)
        setLoading(false)
      }, 1000)
    }, [])

    useEffect(() => {
        // Apply filters
        let result = [...staff]

        // search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result = result.filter(
                (member) => 
                    member.name.toLowerCase().includes(query) ||
                member.email.toLowerCase().includes(query) ||
                member.id.toLowerCase().includes(query),
            )
        }

        //Department filter
        if (departmentFilter !== "all") {
            result = result.filter((member) => member.department.toLowerCase() === departmentFilter.toLowerCase())
        }

        // Role filter
        if (roleFilter !== "all") {
            result = result.filter((member) => member.role.toLowerCase() === roleFilter.toLowerCase())
        }
        setFilteredStaff(result)
    }, [searchQuery, departmentFilter, roleFilter, staff])
    return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Staff
            </button>
          </div>
    
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search staff..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="cardiology">Cardiology</option>
              <option value="emergency">Emergency</option>
              <option value="neurology">Neurology</option>
              <option value="administration">Administration</option>
              <option value="pediatrics">Pediatrics</option>
              <option value="dermatology">Dermatology</option>
            </select>
            <select
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Admin</option>
            </select>
            <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              More Filters
            </button>
          </div>
    
          {/* Staff Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Staff ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
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
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
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
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                      No staff members found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{member.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{member.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>{member.email}</div>
                        <div className="text-sm text-gray-500">{member.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : member.status === "On Leave"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(member.joinDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-5 w-5" />
                            <span className="sr-only">Edit</span>
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">Delete</span>
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
    
    