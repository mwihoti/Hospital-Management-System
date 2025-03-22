"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Clock, Building } from "lucide-react"

interface Doctor {
  id: string
  name: string
  department: string
  specialization: string
  image?: string
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export default function BookAppointment() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentType, setAppointmentType] = useState("")
  const [notes, setNotes] = useState("")
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Simulate API call to get doctors
    if (selectedDepartment) {
      setLoading(true)
      setTimeout(() => {
        const doctorsData: Doctor[] = [
          {
            id: "D001",
            name: "Dr. John Smith",
            department: "Cardiology",
            specialization: "Heart Diseases",
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: "D002",
            name: "Dr. Sarah Johnson",
            department: "Cardiology",
            specialization: "Cardiac Surgery",
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: "D003",
            name: "Dr. Michael Chen",
            department: "Neurology",
            specialization: "Brain Disorders",
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: "D004",
            name: "Dr. Emily Brown",
            department: "Dermatology",
            specialization: "Skin Conditions",
            image: "/placeholder.svg?height=100&width=100",
          },
        ].filter((doctor) => doctor.department === selectedDepartment)

        setDoctors(doctorsData)
        setLoading(false)
      }, 500)
    }
  }, [selectedDepartment])

  useEffect(() => {
    // Simulate API call to get available time slots
    if (selectedDoctor && selectedDate) {
      setLoading(true)
      setTimeout(() => {
        const timeSlotsData: TimeSlot[] = [
          { id: "T001", time: "09:00 AM", available: true },
          { id: "T002", time: "09:30 AM", available: false },
          { id: "T003", time: "10:00 AM", available: true },
          { id: "T004", time: "10:30 AM", available: true },
          { id: "T005", time: "11:00 AM", available: false },
          { id: "T006", time: "11:30 AM", available: true },
          { id: "T007", time: "01:00 PM", available: true },
          { id: "T008", time: "01:30 PM", available: true },
          { id: "T009", time: "02:00 PM", available: false },
          { id: "T010", time: "02:30 PM", available: true },
          { id: "T011", time: "03:00 PM", available: true },
          { id: "T012", time: "03:30 PM", available: false },
        ]

        setTimeSlots(timeSlotsData)
        setLoading(false)
      }, 500)
    }
  }, [selectedDoctor, selectedDate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call to book appointment
    setTimeout(() => {
      // In a real app, you would send this data to your backend
      console.log({
        department: selectedDepartment,
        doctor: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        type: appointmentType,
        notes,
      })

      setLoading(false)
      router.push("/patient/appointments")
    }, 1000)
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? "bg-blue-500" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            2
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? "bg-blue-500" : "bg-gray-200"}`}></div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          >
            3
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm">
          <div className="text-center">Select Department & Doctor</div>
          <div className="text-center">Choose Date & Time</div>
          <div className="text-center">Confirm Details</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Department & Doctor</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`p-4 border rounded-md flex items-center ${selectedDepartment === "Cardiology" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                  onClick={() => setSelectedDepartment("Cardiology")}
                >
                  <Building className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Cardiology</span>
                </button>
                <button
                  type="button"
                  className={`p-4 border rounded-md flex items-center ${selectedDepartment === "Neurology" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                  onClick={() => setSelectedDepartment("Neurology")}
                >
                  <Building className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Neurology</span>
                </button>
                <button
                  type="button"
                  className={`p-4 border rounded-md flex items-center ${selectedDepartment === "Orthopedics" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                  onClick={() => setSelectedDepartment("Orthopedics")}
                >
                  <Building className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Orthopedics</span>
                </button>
                <button
                  type="button"
                  className={`p-4 border rounded-md flex items-center ${selectedDepartment === "Dermatology" ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                  onClick={() => setSelectedDepartment("Dermatology")}
                >
                  <Building className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Dermatology</span>
                </button>
              </div>
            </div>

            {selectedDepartment && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Doctor</label>
                {loading ? (
                  <div className="space-y-4">
                    {Array(2)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="p-4 border rounded-md flex items-center animate-pulse">
                          <div className="h-12 w-12 bg-gray-200 rounded-full mr-3"></div>
                          <div>
                            <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                            <div className="h-3 w-24 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : doctors.length === 0 ? (
                  <p className="text-gray-500">No doctors available for this department.</p>
                ) : (
                  <div className="space-y-4">
                    {doctors.map((doctor) => (
                      <button
                        key={doctor.id}
                        type="button"
                        className={`w-full p-4 border rounded-md flex items-center ${selectedDoctor === doctor.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"}`}
                        onClick={() => setSelectedDoctor(doctor.id)}
                      >
                        <img
                          src={doctor.image || "/placeholder.svg?height=100&width=100"}
                          alt={doctor.name}
                          className="h-12 w-12 rounded-full mr-3 object-cover"
                        />
                        <div className="text-left">
                          <p className="font-medium">{doctor.name}</p>
                          <p className="text-sm text-gray-500">{doctor.specialization}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                onClick={nextStep}
                disabled={!selectedDepartment || !selectedDoctor}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Choose Date & Time</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
              <input
                type="date"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {selectedDate && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                {loading ? (
                  <div className="grid grid-cols-3 gap-3">
                    {Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="h-10 bg-gray-200 rounded animate-pulse"></div>
                      ))}
                  </div>
                ) : timeSlots.length === 0 ? (
                  <p className="text-gray-500">No time slots available for this date.</p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        className={`p-2 border rounded-md flex items-center justify-center ${
                          !slot.available
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : selectedTime === slot.time
                              ? "border-blue-500 bg-blue-50"
                              : "hover:bg-gray-50"
                        }`}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                onClick={nextStep}
                disabled={!selectedDate || !selectedTime}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold mb-4">Confirm Appointment Details</h2>

            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{selectedDepartment}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">{doctors.find((d) => d.id === selectedDoctor)?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{new Date(selectedDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{selectedTime}</p>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Type</label>
              <select
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                <option value="New Patient">New Patient</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Consultation">Consultation</option>
                <option value="Check-up">Check-up</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
              <textarea
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information you'd like to share with the doctor"
              ></textarea>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className="border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50"
                onClick={prevStep}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                disabled={loading || !appointmentType}
              >
                {loading ? "Booking..." : "Book Appointment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

