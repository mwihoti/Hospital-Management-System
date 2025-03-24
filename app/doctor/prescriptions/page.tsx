"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([])
  const [newPrescription, setNewPrescription] = useState({
    patientId: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
  })
  const router = useRouter()

  useEffect(() => {
    fetchPrescriptions()
  }, [])

  const fetchPrescriptions = async () => {
    const res = await fetch("/api/prescriptions")
    if (res.ok) {
      const data = await res.json()
      setPrescriptions(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/prescriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPrescription),
    })
    if (res.ok) {
      fetchPrescriptions()
      setNewPrescription({
        patientId: "",
        medication: "",
        dosage: "",
        frequency: "",
        duration: "",
      })
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Prescriptions</h1>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Patient ID"
          value={newPrescription.patientId}
          onChange={(e) => setNewPrescription({ ...newPrescription, patientId: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Medication"
          value={newPrescription.medication}
          onChange={(e) => setNewPrescription({ ...newPrescription, medication: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Dosage"
          value={newPrescription.dosage}
          onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Frequency"
          value={newPrescription.frequency}
          onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Duration"
          value={newPrescription.duration}
          onChange={(e) => setNewPrescription({ ...newPrescription, duration: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Add Prescription
        </button>
      </form>
      <table className="w-full">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Medication</th>
            <th>Dosage</th>
            <th>Frequency</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription: any) => (
            <tr key={prescription._id}>
              <td>{prescription.patientId}</td>
              <td>{prescription.medication}</td>
              <td>{prescription.dosage}</td>
              <td>{prescription.frequency}</td>
              <td>{prescription.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

