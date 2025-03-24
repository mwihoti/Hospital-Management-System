# Hospital Management System

## Overview

Hospital Management System is a comprehensive web application designed to streamline healthcare facility operations. This platform integrates patient management, appointment scheduling, medical records, prescriptions and staff management in a secure and user-friendly interface.

![Medicare Dashboard](https://raw.githubusercontent.com/mwihoti/Hospital-Management-System/main/public/dashboard-preview.png)

## 🌟 Key Features

- **Multi-role Access Control**: Different dashboards and capabilities for patients, doctors, and administrators
- **Appointment Management**: Schedule, view, update, and cancel appointments
- **Patient Records**: Comprehensive patient profiles with medical history
- **Prescription Management**: Create and manage digital prescriptions
- **Staff Management**: Add, view, and manage healthcare staff
- **Medical Records**: Digital documentation of patient consultations and treatments
- **Authentication & Authorization**: Secure access with JWT-based authentication

## 👥 User Roles & Capabilities

### Patients Can:
- Register and manage their profile
- Book appointments with specific departments
- View and cancel upcoming appointments
- Access their medical records
- View their prescriptions

### Doctors Can:
- View their scheduled appointments
- View patient details and medical history
- Create new medical records for patients
- Issue and manage prescriptions
- Update appointment status (completed, no-show, etc.)

### Administrators Can:
- Manage all patient accounts
- Oversee all appointments across departments
- Add and manage healthcare staff
- Access system-wide reports and statistics
- Configure system settings

## 💾 Data Models

The system is built around these primary data models:

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String, // unique
  password: String, // hashed
  role: String, // "patient", "doctor", "admin"
  dob: Date,
  gender: String,
  phone: String,
  address: String,
  bloodType: String,
  medicalConditions: Array,
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  },
  department: String, // for doctors only
  specialty: String, // for doctors only
  createdAt: Date,
  updatedAt: Date
}
