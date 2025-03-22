// API client for making requests to our backend
import type { User, Appointment, MedicalRecord, Prescription, Bill, Medication } from "@/types"

// Base API URL
const API_BASE_URL = "/api"

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "An error occurred while fetching data")
  }
  return response.json()
}

// Helper function to make API requests with proper headers
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, mergedOptions)
  return handleResponse<T>(response)
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return fetchAPI<{ user: User; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  },

  register: async (userData: Partial<User>) => {
    return fetchAPI<{ user: User; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  getCurrentUser: async () => {
    return fetchAPI<{ user: User }>("/auth/me")
  },

  logout: async () => {
    return fetchAPI<{ success: boolean }>("/auth/logout", {
      method: "POST",
    })
  },
}

// Users API
export const usersAPI = {
  getAllUsers: async () => {
    return fetchAPI<{ users: User[] }>("/users")
  },

  getUserById: async (id: string) => {
    return fetchAPI<{ user: User }>(`/users/${id}`)
  },

  createUser: async (userData: Partial<User>) => {
    return fetchAPI<{ user: User }>("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  updateUser: async (id: string, userData: Partial<User>) => {
    return fetchAPI<{ user: User }>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  },

  deleteUser: async (id: string) => {
    return fetchAPI<{ success: boolean }>(`/users/${id}`, {
      method: "DELETE",
    })
  },

  getUsersByRole: async (role: string) => {
    return fetchAPI<{ users: User[] }>(`/users/role/${role}`)
  },
}

// Appointments API
export const appointmentsAPI = {
  getAllAppointments: async () => {
    return fetchAPI<{ appointments: Appointment[] }>("/appointments")
  },

  getAppointmentById: async (id: string) => {
    return fetchAPI<{ appointment: Appointment }>(`/appointments/${id}`)
  },

  createAppointment: async (appointmentData: Partial<Appointment>) => {
    return fetchAPI<{ appointment: Appointment }>("/appointments", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    })
  },

  updateAppointment: async (id: string, appointmentData: Partial<Appointment>) => {
    return fetchAPI<{ appointment: Appointment }>(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(appointmentData),
    })
  },

  deleteAppointment: async (id: string) => {
    return fetchAPI<{ success: boolean }>(`/appointments/${id}`, {
      method: "DELETE",
    })
  },

  getAppointmentsByPatient: async (patientId: string) => {
    return fetchAPI<{ appointments: Appointment[] }>(`/appointments/patient/${patientId}`)
  },

  getAppointmentsByDoctor: async (doctorId: string) => {
    return fetchAPI<{ appointments: Appointment[] }>(`/appointments/doctor/${doctorId}`)
  },

  getUpcomingAppointments: async () => {
    return fetchAPI<{ appointments: Appointment[] }>("/appointments/upcoming")
  },
}

// Medical Records API
export const medicalRecordsAPI = {
  getAllMedicalRecords: async () => {
    return fetchAPI<{ medicalRecords: MedicalRecord[] }>("/medical-records")
  },

  getMedicalRecordById: async (id: string) => {
    return fetchAPI<{ medicalRecord: MedicalRecord }>(`/medical-records/${id}`)
  },

  createMedicalRecord: async (medicalRecordData: Partial<MedicalRecord>) => {
    return fetchAPI<{ medicalRecord: MedicalRecord }>("/medical-records", {
      method: "POST",
      body: JSON.stringify(medicalRecordData),
    })
  },

  updateMedicalRecord: async (id: string, medicalRecordData: Partial<MedicalRecord>) => {
    return fetchAPI<{ medicalRecord: MedicalRecord }>(`/medical-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(medicalRecordData),
    })
  },

  deleteMedicalRecord: async (id: string) => {
    return fetchAPI<{ success: boolean }>(`/medical-records/${id}`, {
      method: "DELETE",
    })
  },

  getMedicalRecordsByPatient: async (patientId: string) => {
    return fetchAPI<{ medicalRecords: MedicalRecord[] }>(`/medical-records/patient/${patientId}`)
  },
}

// Prescriptions API
export const prescriptionsAPI = {
  getAllPrescriptions: async () => {
    return fetchAPI<{ prescriptions: Prescription[] }>("/prescriptions")
  },

  getPrescriptionById: async (id: string) => {
    return fetchAPI<{ prescription: Prescription }>(`/prescriptions/${id}`)
  },

  createPrescription: async (prescriptionData: Partial<Prescription>) => {
    return fetchAPI<{ prescription: Prescription }>("/prescriptions", {
      method: "POST",
      body: JSON.stringify(prescriptionData),
    })
  },

  updatePrescription: async (id: string, prescriptionData: Partial<Prescription>) => {
    return fetchAPI<{ prescription: Prescription }>(`/prescriptions/${id}`, {
      method: "PUT",
      body: JSON.stringify(prescriptionData),
    })
  },

  deletePrescription: async (id: string) => {
    return fetchAPI<{ success: boolean }>(`/prescriptions/${id}`, {
      method: "DELETE",
    })
  },

  getPrescriptionsByPatient: async (patientId: string) => {
    return fetchAPI<{ prescriptions: Prescription[] }>(`/prescriptions/patient/${patientId}`)
  },

  getActivePrescriptions: async (patientId: string) => {
    return fetchAPI<{ prescriptions: Prescription[] }>(`/prescriptions/active/${patientId}`)
  },
}

// Bills API
export const billsAPI = {
  getAllBills: async () => {
    return fetchAPI<{ bills: Bill[] }>("/bills")
  },

  getBillById: async (id: string) => {
    return fetchAPI<{ bill: Bill }>(`/bills/${id}`)
  },

  createBill: async (billData: Partial<Bill>) => {
    return fetchAPI<{ bill: Bill }>("/bills", {
      method: "POST",
      body: JSON.stringify(billData),
    })
  },

  updateBill: async (id: string, billData: Partial<Bill>) => {
    return fetchAPI<{ bill: Bill }>(`/bills/${id}`, {
      method: "PUT",
      body: JSON.stringify(billData),
    })
  },

  deleteBill: async (id: string) => {
    return fetchAPI<{ success: boolean }>(`/bills/${id}`, {
      method: "DELETE",
    })
  },

  getBillsByPatient: async (patientId: string) => {
    return fetchAPI<{ bills: Bill[] }>(`/bills/patient/${patientId}`)
  },

  getPendingBills: async (patientId: string) => {
    return fetchAPI<{ bills: Bill[] }>(`/bills/pending/${patientId}`)
  },
}

// Medications API
export const medicationsAPI = {
  getAllMedications: async () => {
    return fetchAPI<{ medications: Medication[] }>("/medications")
  },

  getMedicationById: async (id: string) => {
    return fetchAPI<{ medication: Medication }>(`/medications/${id}`)
  },

  createMedication: async (medicationData: Partial<Medication>) => {
    return fetchAPI<{ medication: Medication }>("/medications", {
      method: "POST",
      body: JSON.stringify(medicationData),
    })
  },

  updateMedication: async (id: string, medicationData: Partial<Medication>) => {
    return fetchAPI<{ medication: Medication }>(`/medications/${id}`, {
      method: "PUT",
      body: JSON.stringify(medicationData),
    })
  },

  deleteMedication: async (id: string) => {
    return fetchAPI<{ success: boolean }>(`/medications/${id}`, {
      method: "DELETE",
    })
  },

  searchMedications: async (query: string) => {
    return fetchAPI<{ medications: Medication[] }>(`/medications/search?q=${encodeURIComponent(query)}`)
  },
}

// Dashboard API
export const dashboardAPI = {
  getAdminStats: async () => {
    return fetchAPI<{
      totalPatients: number
      totalDoctors: number
      totalAppointments: number
      totalRevenue: number
    }>("/dashboard/admin")
  },

  getDoctorStats: async (doctorId: string) => {
    return fetchAPI<{
      totalPatients: number
      totalAppointments: number
      upcomingAppointments: number
      completedAppointments: number
    }>(`/dashboard/doctor/${doctorId}`)
  },

  getPatientStats: async (patientId: string) => {
    return fetchAPI<{
      upcomingAppointments: number
      pendingBills: number
      activePrescriptions: number
      totalMedicalRecords: number
    }>(`/dashboard/patient/${patientId}`)
  },
}

// Add this type definition
export type PatientStat = {
  totalAppointments: number
  pendingBills: number
  activePrescriptions: number
  totalMedicalRecords: number
}

// Add this function to fetch patient statistics
export async function getPatientStats(patientId: string): Promise<PatientStat> {
  try {
    const response = await fetch(`/api/patients/${patientId}/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch patient statistics")
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching patient statistics:", error)
    // Return default values if the API call fails
    return {
      totalAppointments: 0,
      pendingBills: 0,
      activePrescriptions: 0,
      totalMedicalRecords: 0,
    }
  }
}

// Add these direct export functions at the end of the file, after the dashboardAPI object

// Direct export for getPatients function
export async function getPatients(status?: string): Promise<Patient[]> {
  try {
    let endpoint = "/users/role/patient"
    if (status) {
      endpoint += `?status=${status}`
    }
    const response = await fetchAPI<{ users: User[] }>(endpoint)
    return response.users as unknown as Patient[]
  } catch (error) {
    console.error("Error fetching patients:", error)
    return []
  }
}

// Make sure Patient type is exported
export type Patient = User & {
  age?: number
  gender?: string
  bloodType?: string
  allergies?: string[]
  medicalHistory?: string
  insurance?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  lastVisit?: string
}

// Export all APIs
const api = {
  auth: authAPI,
  users: usersAPI,
  appointments: appointmentsAPI,
  medicalRecords: medicalRecordsAPI,
  prescriptions: prescriptionsAPI,
  bills: billsAPI,
  medications: medicationsAPI,
  dashboard: dashboardAPI,
}

export default api

