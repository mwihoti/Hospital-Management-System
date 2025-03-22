export interface User {
    _id: string
    name: string
    email: string
    role: string
    createdAt?: string
    updatedAt?: string
  }
  
  export interface Appointment {
    _id: string
    patientId: string
    doctorId: string
    date: string
    time: string
    status: "scheduled" | "completed" | "cancelled"
    reason: string
    notes?: string
    createdAt?: string
    updatedAt?: string
  }
  
  export interface MedicalRecord {
    _id: string
    patientId: string
    doctorId: string
    date: string
    diagnosis: string
    treatment: string
    notes?: string
    createdAt?: string
    updatedAt?: string
  }
  
  export interface Prescription {
    _id: string
    patientId: string
    doctorId: string
    medicationId: string
    dosage: string
    frequency: string
    startDate: string
    endDate: string
    notes?: string
    createdAt?: string
    updatedAt?: string
  }
  
  export interface Bill {
    _id: string
    patientId: string
    amount: number
    date: string
    status: "paid" | "pending" | "overdue"
    description: string
    createdAt?: string
    updatedAt?: string
  }
  
  export interface Medication {
    _id: string
    name: string
    description: string
    dosageForm: string
    strength: string
    manufacturer: string
    createdAt?: string
    updatedAt?: string
  }
  
  