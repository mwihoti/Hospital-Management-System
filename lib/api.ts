// To simulate API calls to a backend server

import { resolve } from "path"

// ToDO To call from backend database

// Types 


export type Patient = {
    id: string
    name: string
    age: number
    gender: string
    phone: string
    email: string
    lastVisit: string
    status: "Active" | "Inactive"
    insurance: string
}

export type Appointment = {
    id: string
    patient: string
    patientId: string
    doctor: string
    department: string
    date: string
    time: string
    status: "Confirmed" | "Checked In" | "Completed"  | "Rescheduled" | "Pending" | "Cancelled"
    type: string
    duration: string
}

export type PatientStat = {
    title: string
    value: string
    icon: string
    color: string
}

export type CalendarDay = {
    date: string
    day: string
    isToday: boolean
}

const patientsData: Patient[] = [
    {
        id: "P-1001",
        name: "John Smith",
        age: 45,
        gender: "Male",
        phone: "(555) 123-4567",
        email: "john.smith@example.com",
        lastVisit: "2023-10-15",
        status: "Active",
        insurance: "BlueCross",
      },
      {
        id: "P-1002",
        name: "Sarah Johnson",
        age: 32,
        gender: "Female",
        phone: "(555) 987-6543",
        email: "sarah.j@example.com",
        lastVisit: "2023-11-02",
        status: "Active",
        insurance: "Medicare",
      },
      {
        id: "P-1003",
        name: "Robert Chen",
        age: 58,
        gender: "Male",
        phone: "(555) 456-7890",
        email: "robert.chen@example.com",
        lastVisit: "2023-09-28",
        status: "Inactive",
        insurance: "Aetna",
      },
      {
        id: "P-1004",
        name: "Maria Garcia",
        age: 29,
        gender: "Female",
        phone: "(555) 234-5678",
        email: "maria.g@example.com",
        lastVisit: "2023-11-10",
        status: "Active",
        insurance: "UnitedHealth",
      },
      {
        id: "P-1005",
        name: "James Wilson",
        age: 67,
        gender: "Male",
        phone: "(555) 876-5432",
        email: "j.wilson@example.com",
        lastVisit: "2023-10-05",
        status: "Active",
        insurance: "Medicare",
      },
      {
        id: "P-1006",
        name: "Emily Davis",
        age: 41,
        gender: "Female",
        phone: "(555) 345-6789",
        email: "emily.davis@example.com",
        lastVisit: "2023-11-15",
        status: "Active",
        insurance: "Cigna",
      },
      {
        id: "P-1007",
        name: "Michael Brown",
        age: 53,
        gender: "Male",
        phone: "(555) 654-3210",
        email: "m.brown@example.com",
        lastVisit: "2023-08-20",
        status: "Inactive",
        insurance: "Humana",
      },
    ]
    

    const appointmentsData: Appointment[] = [
    
        {
            id: "A-1001",
            patient: "John Smith",
            patientId: "P-1001",
            doctor: "Dr. Emily Wilson",
            department: "Cardiology",
            date: "2023-11-20",
            time: "09:30 AM",
            status: "Confirmed",
            type: "Check-up",
            duration: "30 min",
          },
          {
            id: "A-1002",
            patient: "Sarah Johnson",
            patientId: "P-1002",
            doctor: "Dr. Michael Chen",
            department: "Neurology",
            date: "2023-11-20",
            time: "10:15 AM",
            status: "Checked In",
            type: "Follow-up",
            duration: "45 min",
          },
          {
            id: "A-1003",
            patient: "Robert Chen",
            patientId: "P-1003",
            doctor: "Dr. Lisa Adams",
            department: "Orthopedics",
            date: "2023-11-20",
            time: "11:00 AM",
            status: "Completed",
            type: "Consultation",
            duration: "60 min",
          },
          {
            id: "A-1004",
            patient: "Maria Garcia",
            patientId: "P-1004",
            doctor: "Dr. James Wilson",
            department: "Dermatology",
            date: "2023-11-20",
            time: "01:30 PM",
            status: "Confirmed",
            type: "New Patient",
            duration: "45 min",
          },
          {
            id: "A-1005",
            patient: "James Wilson",
            patientId: "P-1005",
            doctor: "Dr. Sarah Johnson",
            department: "Cardiology",
            date: "2023-11-20",
            time: "02:45 PM",
            status: "Rescheduled",
            type: "Follow-up",
            duration: "30 min",
          },
          {
            id: "A-1006",
            patient: "Emily Davis",
            patientId: "P-1006",
            doctor: "Dr. Robert Brown",
            department: "Pulmonology",
            date: "2023-11-21",
            time: "09:00 AM",
            status: "Confirmed",
            type: "Check-up",
            duration: "30 min",
          },
          {
            id: "A-1007",
            patient: "Michael Brown",
            patientId: "P-1007",
            doctor: "Dr. Maria Lopez",
            department: "Endocrinology",
            date: "2023-11-21",
            time: "10:30 AM",
            status: "Pending",
            type: "New Patient",
            duration: "60 min",
          },
          ]
          const PatientStatData = [ 
            {
                title: "Total Patients",
                value: "2,547",
                icon: "User",
                color: "bg-blue-100 text-blue-600",
              },
              {
                title: "New This Month",
                value: "128",
                icon: "Plus",
                color: "bg-green-100 text-green-600",
              },
              {
                title: "Appointments Today",
                value: "42",
                icon: "Calendar",
                color: "bg-purple-100 text-purple-600",
              },
              {
                title: "Avg. Wait Time",
                value: "18 min",
                icon: "Clock",
                color: "bg-amber-100 text-amber-600",
              },
          ]
          const calendarDaysData = [
            { date: "20", day: "Mon", isToday: true },
            { date: "21", day: "Tue", isToday: false },
            { date: "22", day: "Wed", isToday: false },
            { date: "23", day: "Thu", isToday: false },
            { date: "24", day: "Fri", isToday: false },
            { date: "25", day: "Sat", isToday: false },
            { date: "26", day: "Sun", isToday: false },
          ]
    

    // Simulated API function

    export async function getPatients(filter?: string): Promise<Patient[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (filter === "active") {
                    resolve(patientsData.filter((patient) => patient.status === "Active"))
                } else if (filter === 'inactive') {
                    resolve(patientsData.filter((patient) => patient.status === "Inactive")) 
                
                } else {
                    resolve(patientsData)
                }
                },  800)
            })
        
        }

    
    export  async function getPatientById(id: string): Promise<Patient | undefined > {
        return new Promise((resolve) => {
            setTimeout(() => {
                    resolve(patientsData.find((patient) => patient.id === id))
                
            }, 500)
        })
    }

    export async function getAppointments(filter? : string): Promise<Appointment[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (filter) {
                    resolve(appointmentsData.filter((appointment) => appointment.status.toLowerCase() === filter.toLowerCase()))

                } else {
                    resolve(appointmentsData)
                }
            }, 800)
        })
    }

    export async function getPatientStats(): Promise<PatientStat[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(PatientStatData)
            }, 600)
        })
    }

    export async function getCalendarDays(): Promise<CalendarDay[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(calendarDaysData)
            }, 600)
        })
    }



    // Simulated mutations functions 
export async function addPatient(patient: Omit<Patient, "id">): Promise<Patient> {
    return new Promise((resolve, ) => {
        setTimeout(() => {
            const newPatient = {
                ...patient,
                id: `P-${1000 + patientsData.length + 1}`
            }
            resolve(newPatient)
        }, 1000)
    })
}

export async function updatePatientStatus(id: string, status: "Active" | "Inactive"):
Promise<Patient> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const patient = patientsData.find((p) => p.id === id)
            if (patient) {
                const updatedPatient = { ...patient, status }
                resolve(updatedPatient)
            } else {
                reject (new Error("Patient not found"))
            }
        }, 800)
    })
}


export async function scheduleAppointment(appointment: Omit<Appointment, "id">):
    Promise<Appointment> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newAppointment = {
                    ...appointment,
                    id: `A-${1000 + appointmentsData.length + 1}`,
                }
                resolve(newAppointment)
            }, 1000)
        })
    }


    export async function updateAppointmentStatus(id: string, status: Appointment["status"]):
    Promise<Appointment>{
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const appointment = appointmentsData.find((a) => a.id === id)
                if (appointment) {
                    const updatedAppointment = { ...appointment, status }
                    resolve(updatedAppointment)
                } else {
                    reject(new Error("Appointment not found"))
                }
            }, 800)
        })
    }