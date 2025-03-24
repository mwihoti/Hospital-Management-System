# Medicare Hospital Management System

## Overview

Hospital Management System is a comprehensive web application designed to streamline healthcare facility operations. This platform integrates patient management, appointment scheduling, medical records, prescriptions and staff management in a secure and user-friendly interface.

![Medicare Dashboard](https://raw.githubusercontent.com/mwihoti/Hospital-Management-System/main/public/dashboard-preview.png)

##### Video Demo links: https://drive.google.com/file/d/11g3KO-zDtjW8OD8aXbTJbnz2RGWu7gPM/view?usp=sharing 

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
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local instance or MongoDB Atlas)
- Git
- NPM or Yarn package manager

### Step 1: Clone the Repository
```bash
# Clone the repository
git clone https://github.com/mwihoti/Hospital-Management-System.git

# Navigate to the project directory
cd Hospital-Management-System
```

### Step 2: Install Dependencies
```bash
# Using npm
npm install

# OR using Yarn
yarn install
```

### Step 3: Environment Configuration
Create a `.env.local` file in the root directory of the project with the following variables:

```
# MongoDB Connection String (required)
# Example for local MongoDB: mongodb://localhost:27017/hospital-management
# Example for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/hospital-management
MONGODB_URI=your_mongodb_connection_string

# JWT Secret for token generation (required)
# Generate a strong random string, e.g., using: openssl rand -base64 32
JWT_SECRET=your_jwt_secret_key

# NextAuth Secret (required)
# Generate a strong random string, e.g., using: openssl rand -base64 32
NEXTAUTH_SECRET=your_nextauth_secret

# NextAuth URL (required) - your application URL
NEXTAUTH_URL=http://localhost:3000
```

### Step 4: Database Setup
The application will automatically create the necessary collections in MongoDB when it first runs. However, you may want to create an initial admin user:

```bash
# You can use the provided seed script (if available)
npm run seed

# OR manually create an admin user in your MongoDB database
```

### Step 5: Run the Development Server
```bash
# Using npm
npm run dev

# OR using Yarn
yarn dev
```

The application will be available at `http://localhost:3000`.

### Step 6: Build for Production (Optional)
```bash
# Build the application
npm run build
# OR
yarn build

# Start the production server
npm start
# OR
yarn start
```

### Troubleshooting Common Issues

#### MongoDB Connection Issues
- Ensure your MongoDB instance is running
- Check that your connection string is correct
- If using MongoDB Atlas, ensure your IP address is whitelisted

#### Package Installation Errors
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

#### Port Already in Use
If port 3000 is already in use, you can specify a different port:
```bash
# Using npm
npm run dev -- -p 3001

# Using Yarn
yarn dev -p 3001
```

### Development vs Production
- Development mode includes hot reloading and detailed error messages
- Production build is optimized for performance
- Use environment variables to configure different database connections for development and production

