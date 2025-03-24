"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { User, FileText, Plus, Trash2 } from "lucide-react"

export default function NewPrescriptionPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()

  const patientId = searchParams.get("patient")
  const appointmentId = searchParams.get("appointment")

  const [patient, setPatient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    patient: patientId || "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "", route: "", instructions: "" }],
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

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications]
    updatedMedications[index][field] = value
    setFormData((prev) => ({ ...prev, medications: updatedMedications }))
  }

  const addMedication = () => {
    setFormData((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        { name: "", dosage: "", frequency: "", duration: "", route: "", instructions: "" },
      ],
    }))
  }

  const removeMedication = (index) => {
    if (formData.medications.length === 1) return

    const updatedMedications = [...formData.medications]
    updatedMedications.splice(index, 1)
    setFormData((prev) => ({ ...prev, medications: updatedMedications }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!session?.user?.id) {
      setError("You must be logged in to create a prescription")
      return
    }

    if (!formData.patient) {
      setError("Patient is required")
      return
    }

    // Validate medications
    const isValidMedications = formData.medications.every(
      (med) =>
        med.name.trim() !== "" &&
        med.dosage.trim() !== "" &&
        med.frequency.trim() !== "" &&
        med.duration.trim() !== "" &&
        med.route.trim() !== "" &&
        med.instructions.trim() !== "",
    )

    if (!isValidMedications) {
      setError("All medication fields are required (name, dosage, frequency, duration, and route)")
      return
    }

    try {
      setSubmitting(true)
      setError("")

      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          doctor: session.user.id,
          appointment: appointmentId || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create prescription")
      }

      router.push("/staff/appointments")
    } catch (err) {
      console.error("Error creating prescription:", err)
      setError(err.message || "Failed to create prescription. Please try again.")
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
        <h1 className="text-2xl font-bold">Create New Prescription</h1>
        <p className="text-gray-600">Prescribe medications for a patient</p>
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

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 text-sm font-bold">Medications *</label>
                <button
                  type="button"
                  onClick={addMedication}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Medication
                </button>
              </div>

              {formData.medications.map((medication, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md bg-gray-50">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Medication #{index + 1}</h4>
                    {formData.medications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedication(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={`med-name-${index}`}>
                        Medication Name *
                      </label>
                      <input
                        id={`med-name-${index}`}
                        type="text"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={`med-dosage-${index}`}>
                        Dosage *
                      </label>
                      <input
                        id={`med-dosage-${index}`}
                        type="text"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 500mg"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={`med-frequency-${index}`}>
                        Frequency *requency *
                      </label>
                      <input
                        id={`med-frequency-${index}`}
                        type="text"
                        value={medication.frequency}
                        onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Twice daily"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={`med-duration-${index}`}>
                        Duration *
                      </label>
                      <input
                        id={`med-duration-${index}`}
                        type="text"
                        value={medication.duration}
                        onChange={(e) => handleMedicationChange(index, "duration", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 7 days"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor={`med-route-${index}`}>
                        Route *
                      </label>
                      <input
                        id={`med-route-${index}`}
                        type="text"
                        value={medication.route}
                        onChange={(e) => handleMedicationChange(index, "route", e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Oral, Intravenous"
                        required
                      />
                    </div>
                    <div className="mb-6">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor={`med-instructions-${index}`}
                      >
                        Additional Instructions
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-400" size={16} />
                        <textarea
                          id={`med-instructions-${index}`}
                          name="instructions"
                          value={medication.instructions}
                          onChange={(e) => handleMedicationChange(index, "instructions", e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          placeholder="Any additional instructions for the patient..."
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                {submitting ? "Creating..." : "Create Prescription"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

