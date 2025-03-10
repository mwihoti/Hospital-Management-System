// To simulate API calls to a backend server

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