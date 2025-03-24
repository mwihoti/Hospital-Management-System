"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { User, FileText, Calendar, Activity } from "lucide-react"

export default function NewMedicalRecordPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const patientId = searchParams.get("patient")

  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    patient: patientId || "",
    department: "",
    ///recordType: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    async function fetchPatient() {
      if (!patientId) return

      try {
        const response = await fetch(`/api/users/${patientId}`)
        if (!response.ok) throw new Error("Failed to fetch patient")

        const data = await response.json()
        setPatient(data.user)
        setFormData((prev) => ({ ...prev, patient: patientId }))
      } catch (err) {
        console.error("Error fetching patient:", err)
        setError("Failed to load patient data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (patientId) {
      fetchPatient()
    } else {
      setLoading(false)
    }
  }, [patientId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!session?.user?.id) {
      setError("You must be logged in to create a medical record")
      return
    }

    if (!formData.patient) {
      setError("Patient is required")
      return
    }

   

    if (!formData.diagnosis) {
      setError("Diagnosis is required")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      const response = await fetch("/api/medical-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          //type: formData.recordType,
          doctor: session.user.id,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create medical record")
      }

      router.push("/staff/appointments")
    } catch (err) {
      console.error("Error creating medical record:", err)
      setError(err.message || "Failed to create medical record. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Medical Record</h1>
        <p className="text-gray-600">Add a medical record for a patient</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="patient">
                Patient *
              </label>
              {patient ? (
                <div className="flex items-center p-3 border rounded-md bg-gray-50">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    <div className="text-sm text-gray-500">{patient.email}</div>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    id="patient"
                    name="patient"
                    value={formData.patient}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a patient</option>
                    {/* This would be populated with patients from an API call */}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recordType">
                  Record Type *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    id="recordType"
                    name="recordType"
                    value={formData.recordType}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select Record Type</option>
                    <option value="consultation">Consultation</option>
                    <option value="lab-result">Lab Result</option>
                    <option value="imaging">Imaging</option>
                    <option value="surgery">Surgery</option>
                    <option value="follow-up">Follow-up</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="diagnosis">
                Diagnosis *
              </label>
              <div className="relative">
                <Activity className="absolute left-3 top-3 text-gray-400" size={16} />
                <textarea
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  required
                ></textarea>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="treatment">
                Treatment
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                <textarea
                  id="treatment"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                ></textarea>
              </div>
            </div>
            <div className="mb-6">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
    Department *
  </label>
  <div className="relative">
    <select
      id="department"
      name="department"
      value={formData.department}
      onChange={handleChange}
      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      required
    >
      <option value="">Select Department</option>
      <option value="cardiology">Cardiology</option>
      <option value="neurology">Neurology</option>
      <option value="pediatrics">Pediatrics</option>
      <option value="orthopedics">Orthopedics</option>
      <option value="oncology">Oncology</option>
      <option value="other">Other</option>
    </select>
  </div>
</div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                Additional Notes
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.back()}
                className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Medical Record"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

