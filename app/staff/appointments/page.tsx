"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, Search, Filter, Plus, Check, X, ArrowRight } from "lucide-react"

interface Appointment {
  id: string
  date: string
  time: string
  patient: string
  patientId: string
  doctor: string
  department: string
  status: "Confirmed" | "Checked In" | "Completed" | "Cancelled" | "No Show"
  type: string
}

export default function StaffAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const appointmentsData: Appointment[] = [
        {
          id: "A001",
          date: "2023-11-20",
          time: "09:00 AM",
          patient: "John Doe",
          patientId: "P001",
          doctor: "Dr. John Smith",
          department: "Cardiology",
          status: "Confirmed",
          type: "Check-up",
        },
        {
          id: "A002",
          date: "2023-11-20",
          time: "10:30 AM",
          patient: "Jane Smith",
          patientId: "P002",
          doctor: "Dr. Sarah Johnson",
          department: "Neurology",
          status: "Checked In",
          type: "Follow-up",
        },
        {
          id: "A003",
          date: "2023-11-20",
          time: "11:45 AM",
          patient: "Robert Chen",
          patientId: "P003",
          doctor: "Dr. Michael Chen",
          department: "Orthopedics",
          status: "Completed",
          type: "Consultation",
        },
        {
          id: "A004",
          date: "2023-11-20",
          time: "02:15 PM",
          patient: "Maria Garcia",
          patientId: "P004",
          doctor: "Dr. Emily Brown",
          department: "Dermatology",
          status: "Confirmed",
          type: "New Patient",
        },
        {
          id: "A005",
          date: "2023-11-21",
          time: "09:30 AM",
          patient: "James Wilson",
          patientId: "P005",
          doctor: "Dr. John Smith",
          department: "Cardiology",
          status: "Confirmed",
          type: "Follow-up",
        },
        {
          id: "A006",
          date: "2023-11-21",
          time: "11:00 AM",
          patient: "Emily Davis",
          patientId: "P006",
          doctor: "Dr. Sarah Johnson",
          department: "Neurology",
          status: "Cancelled",
          type: "Check-up",
        },
      ]
      setAppointments(appointmentsData)
      setFilteredAppointments(appointmentsData)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Apply filters
    let result = [...appointments]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (appointment) =>
          appointment.patient.toLowerCase().includes(query) ||
          appointment.doctor.toLowerCase().includes(query) ||
          appointment.patientId.toLowerCase().includes(query),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((appointment) => appointment.status.toLowerCase() === statusFilter.toLowerCase())
    }

    // Date filter
    if (dateFilter) {
      result = result.filter((appointment) => appointment.date === dateFilter)
    }

    setFilteredAppointments(result)
  }, [searchQuery, statusFilter, dateFilter, appointments])

  const updateAppointmentStatus = (id: string, newStatus: Appointment["status"]) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.id === id ? { ...appointment, status: newStatus } : appointment,
      ),
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search appointments..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="checked in">Checked In</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no show">No Show</option>
        </select>
        <input
          type="date"
          className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          More Filters
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {loading ? (
          // Loading skeletons
          Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))
        ) : filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">No appointments found matching your criteria.</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-lg p-3 text-blue-500">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {appointment.patient} <span className="text-sm text-gray-500">({appointment.patientId})</span>
                    </h3>
                    <p className="text-sm text-gray-500">
                      {appointment.type} with {appointment.doctor}
                    </p>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(appointment.date).toLocaleDateString()}
                      <Clock className="h-4 w-4 ml-3 mr-1" />
                      {appointment.time}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      appointment.status === "Confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : appointment.status === "Checked In"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "Completed"
                            ? "bg-gray-100 text-gray-800"
                            : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {appointment.status}
                  </span>
                  <div className="ml-4 flex">
                    {appointment.status === "Confirmed" && (
                      <button
                        className="text-green-500 hover:text-green-700 p-1"
                        onClick={() => updateAppointmentStatus(appointment.id, "Checked In")}
                      >
                        <Check className="h-5 w-5" />
                        <span className="sr-only">Check In</span>
                      </button>
                    )}
                    {appointment.status === "Checked In" && (
                      <button
                        className="text-blue-500 hover:text-blue-700 p-1"
                        onClick={() => updateAppointmentStatus(appointment.id, "Completed")}
                      >
                        <ArrowRight className="h-5 w-5" />
                        <span className="sr-only">Complete</span>
                      </button>
                    )}
                    {(appointment.status === "Confirmed" || appointment.status === "Checked In") && (
                      <button
                        className="text-red-500 hover:text-red-700 p-1 ml-2"
                        onClick={() => updateAppointmentStatus(appointment.id, "Cancelled")}
                      >
                        <X className="h-5 w-5" />
                        <span className="sr-only">Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

