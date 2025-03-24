"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, Save } from "lucide-react"

export default function DoctorSchedule() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ]

  useEffect(() => {
    async function loadSchedule() {
      if (!session?.user?.id) return

      try {
        setLoading(true)

        const response = await fetch(`/api/doctor/${session.user.id}/schedule`)
        if (!response.ok) throw new Error("Failed to fetch schedule")

        const data = await response.json()
        setSchedule(data.schedule || [])

        // If no schedule exists, initialize with empty slots
        if (!data.schedule || data.schedule.length === 0) {
          initializeEmptySchedule()
        }

        setError("")
      } catch (err) {
        console.error("Error loading schedule:", err)
        setError("Failed to load schedule. Please try again later.")
        initializeEmptySchedule()
      } finally {
        setLoading(false)
      }
    }

    function initializeEmptySchedule() {
      const emptySchedule = daysOfWeek.map((day) => ({
        day,
        available: false,
        timeSlots: [],
      }))
      setSchedule(emptySchedule)
    }

    if (status === "authenticated" && session?.user?.role === "doctor") {
      loadSchedule()
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    } else if (status === "authenticated" && session?.user?.role !== "doctor") {
      router.push(`/${session.user.role}/dashboard`)
    }
  }, [session, status, router])

  const toggleDayAvailability = (dayIndex) => {
    const updatedSchedule = [...schedule]
    updatedSchedule[dayIndex].available = !updatedSchedule[dayIndex].available

    // If day is marked as unavailable, clear all time slots
    if (!updatedSchedule[dayIndex].available) {
      updatedSchedule[dayIndex].timeSlots = []
    }

    setSchedule(updatedSchedule)
  }

  const toggleTimeSlot = (dayIndex, timeSlot) => {
    const updatedSchedule = [...schedule]
    const day = updatedSchedule[dayIndex]

    if (!day.available) return

    const timeSlotIndex = day.timeSlots.indexOf(timeSlot)

    if (timeSlotIndex === -1) {
      // Add time slot
      day.timeSlots.push(timeSlot)
      day.timeSlots.sort((a, b) => {
        return timeSlots.indexOf(a) - timeSlots.indexOf(b)
      })
    } else {
      // Remove time slot
      day.timeSlots.splice(timeSlotIndex, 1)
    }

    setSchedule(updatedSchedule)
  }

  const saveSchedule = async () => {
    if (!session?.user?.id) return

    try {
      setSaving(true)

      const response = await fetch(`/api/doctor/${session.user.id}/schedule`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schedule }),
      })

      if (!response.ok) throw new Error("Failed to save schedule")

      alert("Schedule saved successfully!")
    } catch (err) {
      console.error("Error saving schedule:", err)
      alert("Failed to save schedule. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Your Schedule</h1>
          <p className="text-gray-600">Set your availability for patient appointments</p>
        </div>
        <button
          onClick={saveSchedule}
          disabled={saving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Schedule"}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Slots
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {schedule.map((day, dayIndex) => (
                  <tr key={day.day}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{day.day}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={day.available}
                          onChange={() => toggleDayAvailability(dayIndex)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          {day.available ? "Available" : "Unavailable"}
                        </span>
                      </label>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex flex-wrap gap-2 ${!day.available ? "opacity-50" : ""}`}>
                        {timeSlots.map((timeSlot) => (
                          <button
                            key={timeSlot}
                            onClick={() => toggleTimeSlot(dayIndex, timeSlot)}
                            disabled={!day.available}
                            className={`px-3 py-1 text-xs rounded-full ${
                              day.timeSlots.includes(timeSlot)
                                ? "bg-blue-100 text-blue-800 border border-blue-300"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {timeSlot}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Schedule Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule
            .filter((day) => day.available)
            .map((day) => (
              <div key={day.day} className="border rounded-md p-4">
                <div className="flex items-center mb-3">
                  <Calendar className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="font-medium">{day.day}</h3>
                </div>
                {day.timeSlots.length === 0 ? (
                  <p className="text-sm text-gray-500">No time slots selected</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {day.timeSlots.map((timeSlot) => (
                      <div key={timeSlot} className="flex items-center text-sm bg-gray-100 px-2 py-1 rounded">
                        <Clock className="h-3 w-3 text-gray-500 mr-1" />
                        {timeSlot}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

