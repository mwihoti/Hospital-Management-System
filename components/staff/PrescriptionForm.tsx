"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Plus, Trash2 } from "lucide-react"

interface Patient {
  id: string
  name: string
}

interface Medication {
  id: string
  name: string
  dosages: string[]
  frequencies: string[]
  routes: string[]
}

interface PrescriptionItem {
  medicationId: string
  medicationName: string
  dosage: string
  frequency: string
  route: string
  duration: string
  instructions: string
}

export default function PrescriptionForm() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [medications, setMedications] = useState<Medication[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [showPatientDropdown, setShowPatientDropdown] = useState<boolean>(false)
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([])
  const [notes, setNotes] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  // Fetch patients and medications data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch patients
        const patientsResponse = await fetch("/api/patients")
        if (patientsResponse.ok) {
          const patientsData = await patientsResponse.json()
          setPatients(patientsData)
          setFilteredPatients(patientsData)
        }

        // Fetch medications
        const medicationsResponse = await fetch("/api/medications")
        if (medicationsResponse.ok) {
          const medicationsData = await medicationsResponse.json()
          setMedications(medicationsData)
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setLoading(false)
      }
    }

    // For demo purposes, use mock data
    setTimeout(() => {
      const mockPatients: Patient[] = [
        { id: "P001", name: "John Doe" },
        { id: "P002", name: "Jane Smith" },
        { id: "P003", name: "Robert Chen" },
        { id: "P004", name: "Maria Garcia" },
      ]

      const mockMedications: Medication[] = [
        {
          id: "M001",
          name: "Amoxicillin",
          dosages: ["250mg", "500mg", "875mg"],
          frequencies: ["Once daily", "Twice daily", "Three times daily"],
          routes: ["Oral", "Intravenous"],
        },
        {
          id: "M002",
          name: "Lisinopril",
          dosages: ["5mg", "10mg", "20mg", "40mg"],
          frequencies: ["Once daily", "Twice daily"],
          routes: ["Oral"],
        },
        {
          id: "M003",
          name: "Ibuprofen",
          dosages: ["200mg", "400mg", "600mg", "800mg"],
          frequencies: ["Every 4-6 hours as needed", "Three times daily", "Four times daily"],
          routes: ["Oral"],
        },
        {
          id: "M004",
          name: "Metformin",
          dosages: ["500mg", "850mg", "1000mg"],
          frequencies: ["Once daily", "Twice daily"],
          routes: ["Oral"],
        },
      ]

      setPatients(mockPatients)
      setFilteredPatients(mockPatients)
      setMedications(mockMedications)
      setLoading(false)
    }, 1000)
  }, [])

  // Filter patients based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredPatients(filtered)
    } else {
      setFilteredPatients(patients)
    }
  }, [searchQuery, patients])

  // Add a new prescription item
  const addPrescriptionItem = () => {
    if (medications.length === 0) return

    const defaultMedication = medications[0]
    const newItem: PrescriptionItem = {
      medicationId: defaultMedication.id,
      medicationName: defaultMedication.name,
      dosage: defaultMedication.dosages[0] || "",
      frequency: defaultMedication.frequencies[0] || "",
      route: defaultMedication.routes[0] || "",
      duration: "7 days",
      instructions: "",
    }

    setPrescriptionItems([...prescriptionItems, newItem])
  }

  // Remove a prescription item
  const removePrescriptionItem = (index: number) => {
    const updatedItems = [...prescriptionItems]
    updatedItems.splice(index, 1)
    setPrescriptionItems(updatedItems)
  }

  // Update a prescription item
  const updatePrescriptionItem = (index: number, field: keyof PrescriptionItem, value: string) => {
    const updatedItems = [...prescriptionItems]
    updatedItems[index] = { ...updatedItems[index], [field]: value }

    // If medication changed, update medication name and reset dosage, frequency, and route
    if (field === "medicationId") {
      const medication = medications.find((med) => med.id === value)
      if (medication) {
        updatedItems[index].medicationName = medication.name
        updatedItems[index].dosage = medication.dosages[0] || ""
        updatedItems[index].frequency = medication.frequencies[0] || ""
        updatedItems[index].route = medication.routes[0] || ""
      }
    }

    setPrescriptionItems(updatedItems)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPatient || prescriptionItems.length === 0) {
      alert("Please select a patient and add at least one medication.")
      return
    }

    setLoading(true)

    try {
      // In a real app, you would send this data to your API
      const prescriptionData = {
        patientId: selectedPatient,
        items: prescriptionItems,
        notes,
        date: new Date().toISOString(),
        doctorId: "D001", // This would come from authentication in a real app
      }

      console.log("Prescription data:", prescriptionData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Reset form
      setPrescriptionItems([])
      setNotes("")
      setSelectedPatient("")
      setSearchQuery("")

      alert("Prescription created successfully!")
    } catch (error) {
      console.error("Error creating prescription:", error)
      alert("Failed to create prescription. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Create Prescription</h2>

      <form onSubmit={handleSubmit}>
        {/* Patient Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search patient by name or ID..."
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowPatientDropdown(true)
              }}
              onFocus={() => setShowPatientDropdown(true)}
            />
            {showPatientDropdown && filteredPatients.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedPatient(patient.id)
                      setSearchQuery(patient.name)
                      setShowPatientDropdown(false)
                    }}
                  >
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-gray-500">ID: {patient.id}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedPatient && <div className="mt-2 text-sm text-blue-600">Selected Patient ID: {selectedPatient}</div>}
        </div>

        {/* Medications */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Medications</label>
            <button
              type="button"
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 flex items-center"
              onClick={addPrescriptionItem}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Medication
            </button>
          </div>

          {prescriptionItems.length === 0 ? (
            <div className="text-center py-4 border rounded-md bg-gray-50">
              <p className="text-gray-500">No medications added yet. Click "Add Medication" to start.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptionItems.map((item, index) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium">Medication #{index + 1}</h3>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removePrescriptionItem(index)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medication</label>
                      <select
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.medicationId}
                        onChange={(e) => updatePrescriptionItem(index, "medicationId", e.target.value)}
                      >
                        {medications.map((medication) => (
                          <option key={medication.id} value={medication.id}>
                            {medication.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                      <select
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.dosage}
                        onChange={(e) => updatePrescriptionItem(index, "dosage", e.target.value)}
                      >
                        {medications
                          .find((med) => med.id === item.medicationId)
                          ?.dosages.map((dosage) => (
                            <option key={dosage} value={dosage}>
                              {dosage}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                      <select
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.frequency}
                        onChange={(e) => updatePrescriptionItem(index, "frequency", e.target.value)}
                      >
                        {medications
                          .find((med) => med.id === item.medicationId)
                          ?.frequencies.map((frequency) => (
                            <option key={frequency} value={frequency}>
                              {frequency}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                      <select
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.route}
                        onChange={(e) => updatePrescriptionItem(index, "route", e.target.value)}
                      >
                        {medications
                          .find((med) => med.id === item.medicationId)
                          ?.routes.map((route) => (
                            <option key={route} value={route}>
                              {route}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.duration}
                        onChange={(e) => updatePrescriptionItem(index, "duration", e.target.value)}
                        placeholder="e.g., 7 days, 2 weeks"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                      <textarea
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.instructions}
                        onChange={(e) => updatePrescriptionItem(index, "instructions", e.target.value)}
                        placeholder="e.g., Take with food, Avoid alcohol"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes for the patient or pharmacy"
            rows={3}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={loading || !selectedPatient || prescriptionItems.length === 0}
          >
            {loading ? "Creating..." : "Create Prescription"}
          </button>
        </div>
      </form>
    </div>
  )
}

