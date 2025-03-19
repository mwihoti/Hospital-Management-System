"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Calendar, Clock, Users, FileText, CreditCard } from "lucide-react"

export default function StaffDashboard() {
  const [todayAppointments, setTodayAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTodayAppointments([
        {
          id: "A001",
          time: "09:00 AM",
          patient: "John Doe",
          type: "Check-up",
          status: "Confirmed",
        },
        {
          id: "A002",
          time: "10:30 AM",
          patient: "Jane Smith",
          type: "Follow-up",
          status: "Checked In",
        },
        {
          id: "A003",
          time: "11:45 AM",
          patient: "Robert Chen",
          type: "Consultation",
          status: "Completed",
        },
        {
          id: "A004",
          time: "02:15 PM",
          patient: "Maria Garcia",
          type: "New Patient",
          status: "Confirmed",
        },
        {
          id: "A005",
          time: "03:30 PM",
          patient: "James Wilson",
          type: "Follow-up",
          status: "Confirmed",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard title="Today's Appointments" value="5" icon={<Calendar className="h-8 w-8 text-blue-500" />} />
        <StatsCard title="Patients Seen Today" value="3" icon={<Users className="h-8 w-8 text-green-500" />} />
        <StatsCard title="Prescriptions Written" value="7" icon={<FileText className="h-8 w-8 text-purple-500" />} />
        <StatsCard title="Bills Generated" value="4" icon={<CreditCard className="h-8 w-8 text-yellow-500" />} />
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Today's Schedule</h2>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {new Date().toLocaleDateString()}
          </div>
        </div>

        {loading ? (
          // Loading skeletons
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="flex items-center p-3 border rounded-md animate-pulse">
                  <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-1/3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-4">
            {todayAppointments.map((appointment: any) => (
              <div key={appointment.id} className="flex items-center p-3 border rounded-md hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {appointment.time} - {appointment.patient}
                  </p>
                  <p className="text-sm text-gray-500">{appointment.type}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    appointment.status === "Confirmed"
                      ? "bg-blue-100 text-blue-800"
                      : appointment.status === "Checked In"
                        ? "bg-green-100 text-green-800"
                        : appointment.status === "Completed"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
              Schedule Appointment
            </button>
            <button className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
              Register New Patient
            </button>
            <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors">
              Write Prescription
            </button>
            <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors">
              Generate Bill
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Patients</h2>
          {loading ? (
            // Loading skeletons
            <div className="space-y-4">
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex items-center animate-pulse">
                    <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 w-1/3 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
                  <span className="sr-only">Patient Avatar</span>
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500">Last visit: Today</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
                  <span className="sr-only">Patient Avatar</span>
                </div>
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-500">Last visit: Today</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
                  <span className="sr-only">Patient Avatar</span>
                </div>
                <div>
                  <p className="font-medium">Robert Chen</p>
                  <p className="text-sm text-gray-500">Last visit: Today</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3">
                  <span className="sr-only">Patient Avatar</span>
                </div>
                <div>
                  <p className="font-medium">Maria Garcia</p>
                  <p className="text-sm text-gray-500">Last visit: Yesterday</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatsCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="mb-4">{icon}</div>
      <h3 className="text-gray-500 font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

