"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

interface Appointment {
  id: string
  date: string
  time: string
  patient: string
  patientId: string
  type: string
  status: "Confirmed" | "Checked In" | "Completed" | "Cancelled" | "No Show"
}

interface CalendarDay {
  date: Date
  isCurrentMonth: boolean
  isToday: boolean
  appointments: Appointment[]
}

export default function AppointmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  // Generate calendar days for the current month
  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      // First day of the month
      const firstDay = new Date(year, month, 1)
      // Last day of the month
      const lastDay = new Date(year, month + 1, 0)

      // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = firstDay.getDay()

      // Calculate days from previous month to show
      const daysFromPrevMonth = firstDayOfWeek

      // Calculate total days to show (previous month + current month + next month)
      const totalDays = 42 // 6 rows of 7 days

      const days: CalendarDay[] = []

      // Add days from previous month
      const prevMonth = new Date(year, month, 0)
      const prevMonthDays = prevMonth.getDate()

      for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
        const date = new Date(year, month - 1, i)
        days.push({
          date,
          isCurrentMonth: false,
          isToday: isSameDay(date, new Date()),
          appointments: getAppointmentsForDay(date),
        })
      }

      // Add days from current month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i)
        days.push({
          date,
          isCurrentMonth: true,
          isToday: isSameDay(date, new Date()),
          appointments: getAppointmentsForDay(date),
        })
      }

      // Add days from next month
      const remainingDays = totalDays - days.length
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i)
        days.push({
          date,
          isCurrentMonth: false,
          isToday: isSameDay(date, new Date()),
          appointments: getAppointmentsForDay(date),
        })
      }

      setCalendarDays(days)

      // Set selected day to today if it's in the current month, otherwise first day of month
      const today = new Date()
      if (today.getMonth() === month && today.getFullYear() === year) {
        setSelectedDay(today)
      } else {
        setSelectedDay(new Date(year, month, 1))
      }
    }

    generateCalendarDays()
  }, [currentDate, appointments])

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/appointments")
        if (response.ok) {
          const data = await response.json()
          setAppointments(data)
        } else {
          console.error("Failed to fetch appointments")
        }
      } catch (error) {
        console.error("Error fetching appointments:", error)
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, use mock data
    setTimeout(() => {
      const mockAppointments: Appointment[] = [
        {
          id: "A001",
          date: "2023-11-20",
          time: "09:00 AM",
          patient: "John Doe",
          patientId: "P001",
          type: "Check-up",
          status: "Confirmed",
        },
        {
          id: "A002",
          date: "2023-11-20",
          time: "10:30 AM",
          patient: "Jane Smith",
          patientId: "P002",
          type: "Follow-up",
          status: "Checked In",
        },
        {
          id: "A003",
          date: "2023-11-22",
          time: "11:45 AM",
          patient: "Robert Chen",
          patientId: "P003",
          type: "Consultation",
          status: "Confirmed",
        },
        {
          id: "A004",
          date: "2023-11-25",
          time: "02:15 PM",
          patient: "Maria Garcia",
          patientId: "P004",
          type: "New Patient",
          status: "Confirmed",
        },
      ]
      setAppointments(mockAppointments)
      setLoading(false)
    }, 1000)
  }, [])

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  // Helper function to get appointments for a specific day
  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date)
      return isSameDay(appointmentDate, date)
    })
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Get selected day's appointments
  const selectedDayAppointments = selectedDay ? getAppointmentsForDay(selectedDay) : []

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-md hover:bg-gray-100" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button className="px-3 py-1 rounded-md hover:bg-gray-100" onClick={goToToday}>
            Today
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100" onClick={goToNextMonth}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day names */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {loading
          ? // Loading skeleton
            Array(42)
              .fill(0)
              .map((_, index) => <div key={index} className="h-24 border rounded-md bg-gray-50 animate-pulse"></div>)
          : calendarDays.map((day, index) => (
              <div
                key={index}
                className={`h-24 border rounded-md p-1 ${
                  day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
                } ${day.isToday ? "border-blue-500" : ""} ${
                  selectedDay && isSameDay(day.date, selectedDay) ? "bg-blue-50" : ""
                } hover:bg-blue-50 cursor-pointer`}
                onClick={() => setSelectedDay(day.date)}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-sm font-medium ${day.isToday ? "bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center" : ""}`}
                  >
                    {day.date.getDate()}
                  </span>
                  {day.appointments.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-0.5">
                      {day.appointments.length}
                    </span>
                  )}
                </div>
                <div className="mt-1 space-y-1 overflow-hidden max-h-16">
                  {day.appointments.slice(0, 2).map((appointment) => (
                    <div
                      key={appointment.id}
                      className="text-xs truncate px-1 py-0.5 rounded bg-blue-50 text-blue-700"
                      title={`${appointment.time} - ${appointment.patient}`}
                    >
                      {appointment.time} - {appointment.patient}
                    </div>
                  ))}
                  {day.appointments.length > 2 && (
                    <div className="text-xs text-gray-500 px-1">+{day.appointments.length - 2} more</div>
                  )}
                </div>
              </div>
            ))}
      </div>

      {/* Selected Day Appointments */}
      {selectedDay && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Appointments for {selectedDay.toLocaleDateString()}</h3>
            <button className="flex items-center text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
              <Plus className="h-4 w-4 mr-1" />
              Add Appointment
            </button>
          </div>

          {selectedDayAppointments.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No appointments scheduled for this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedDayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50"
                >
                  <div>
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
                            : appointment.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
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
      )}
    </div>
  )
}

