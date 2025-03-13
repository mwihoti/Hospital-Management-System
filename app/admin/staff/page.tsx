"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Staff {
  id: string
  name: string
  role: string
  department: string
  email: string
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([])

  useEffect(() => {
    // In a real application, this would be an API call
    setStaff([
      { id: "1", name: "Dr. John Doe", role: "Doctor", department: "Cardiology", email: "john.doe@example.com" },
      { id: "2", name: "Nurse Jane Smith", role: "Nurse", department: "Emergency", email: "jane.smith@example.com" },
      {
        id: "3",
        name: "Admin Alice Johnson",
        role: "Admin",
        department: "Management",
        email: "alice.johnson@example.com",
      },
    ])
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Staff Management</h1>
      <Link href="/admin/staff/add" className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block">
        Add New Staff
      </Link>
      <table className="w-full mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Role</th>
            <th className="p-2 text-left">Department</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id} className="border-b">
              <td className="p-2">{member.name}</td>
              <td className="p-2">{member.role}</td>
              <td className="p-2">{member.department}</td>
              <td className="p-2">{member.email}</td>
              <td className="p-2">
                <Link href={`/admin/staff/${member.id}`} className="text-blue-500 hover:underline mr-2">
                  Edit
                </Link>
                <button className="text-red-500 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

