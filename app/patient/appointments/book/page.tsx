"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"

interface Doctor {
  _id: string
  name: string
  email: string
  specialization: string
  schedule?: {
    days: string[]
    startTime: string
    endTime: string
  }
}

export default function BookAppointment() {
  const { data: session } = useSession()
  const router = useRouter()
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState<string>("")
  const [doctor, setDoctor] = useState<string>("")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchingDoctors, setFetchingDoctors] = useState(true)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

  // Fetch doctors from the database
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setFetchingDoctors(true)
        const response = await fetch("/api/users/role/doctor")
        if (!response.ok) {
          throw new Error("Failed to fetch doctors")
        }
        const data = await response.json()
        console.log("Fetched doctors:", data) // Debug log

        // Check if data is an array or if it has a users property
        const doctorsList = Array.isArray(data) ? data : data.users || []
        setDoctors(doctorsList)
      } catch (error) {
        console.error("Error fetching doctors:", error)
        toast.error("Failed to load doctors. Please try again.")
      } finally {
        setFetchingDoctors(false)
      }
    }

    fetchDoctors()
  }, [])

  // Generate available time slots based on selected doctor's schedule
  useEffect(() => {
    if (doctor && date) {
      const selectedDoctor = doctors.find((d) => d._id === doctor)
      if (selectedDoctor?.schedule) {
        const dayOfWeek = format(date, "EEEE").toLowerCase()

        // Check if the selected day is in the doctor's schedule
        if (selectedDoctor.schedule.days.includes(dayOfWeek)) {
          const { startTime, endTime } = selectedDoctor.schedule
          const times = generateTimeSlots(startTime, endTime)
          setAvailableTimes(times)
        } else {
          setAvailableTimes([])
          toast.error(`Selected doctor is not available on ${format(date, "EEEE")}s`)
        }
      } else {
        // Default time slots if no schedule is set
        const times = generateTimeSlots("09:00", "17:00")
        setAvailableTimes(times)
      }
    } else {
      setAvailableTimes([])
    }
  }, [doctor, date, doctors])

  const generateTimeSlots = (start: string, end: string) => {
    const times: string[] = []
    const [startHour, startMinute] = start.split(":").map(Number)
    const [endHour, endMinute] = end.split(":").map(Number)

    let currentHour = startHour
    let currentMinute = startMinute

    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      times.push(`${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`)

      currentMinute += 30
      if (currentMinute >= 60) {
        currentHour += 1
        currentMinute = 0
      }
    }

    return times
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !time || !doctor) {
      toast.error("Please fill in all fields")
      return
    }

    try {
      setLoading(true)

      // Format the date and time for the appointment
      const appointmentDateTime = new Date(date)
      const [hours, minutes] = time.split(":").map(Number)
      appointmentDateTime.setHours(hours, minutes)

      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId: session?.user.id,
          doctorId: doctor,
          dateTime: appointmentDateTime.toISOString(),
          status: "scheduled",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to book appointment")
      }

      toast.success("Appointment booked successfully!")
      router.push("/patient/appointments")
    } catch (error) {
      console.error("Error booking appointment:", error)
      toast.error("Failed to book appointment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Book an Appointment</CardTitle>
          <CardDescription>Schedule an appointment with one of our doctors</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
           

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Date</label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(date) => {
                  // Disable dates in the past
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  return date < today
                }}
                className="rounded-md border"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Time</label>
              <Select value={time} onValueChange={setTime} disabled={!doctor || !date || availableTimes.length === 0}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a time slot" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimes.length > 0 ? (
                    availableTimes.map((timeSlot) => (
                      <SelectItem key={timeSlot} value={timeSlot}>
                        {timeSlot}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-times" disabled>
                      {doctor && date ? "No available times for selected date" : "Select a doctor and date first"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading || !doctor || !date || !time}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

