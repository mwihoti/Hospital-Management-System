"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Activity } from "lucide-react"

export default function Register() {


    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "patienr",
        // Doctor specific fields
        specialization: "",
        department: "",
        // Common fields
        contactNumber: "",
        address: "",
        // Patient specific fields
        dateOfBirth: "",
        gender: "",
        bloodGroup: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }
        // validate required fields based on role
        if (formData.role === "doctor" && (!formData.specialization || !formData.department)) {
            setError("Doctors must provide specialization and department")
            return
        }

        try {
            setLoading(true)

            const { confirmPassword, ...dataToSend } = formData
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(dataToSend),
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error || "Registration failed")
            }
            //Redirect to login page on success
            router.push("/auth/login?registered=true")
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8f9FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Activity className="h-12 w-12 text-[#4A90E2]" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your acccount</h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    or{" "}
                    <Link href="/auth/login" className="font-medium text-[#4A90E2] hover:text-[#3A80d2]">
                        Sign in to your account</Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error} </div>}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Role Selection */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Register as
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none 
                                focus:ring-[#4A90E2] focus:border-[#4A90E2]">
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        {/* Common fields */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium texxt-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none
                                 focus:ring-[#4A90E2] focus:border-[#4A90E2]" />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm 
                                focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                            />
                        </div>

                        <div>
                            <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                                Contact Number
                            </label>
                            <input
                                id="contactNumber"
                                name="contactNumber"
                                type="tel"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                            />
                        </div>

                        <div>
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                rows={3}
                                value={formData.address}
                                onChange={handleChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm
                                 focus:outline-none focus:ring-[#4A90E2]" />
                        </div>

                        {/* Doctor specific Fields */}
                        {formData.role === "doctor" && (
                            <>
                            <div>
                                <label htmlFor="spacialization" className="block text-sm font-medium text-gray-700">
                                    Specialization
                                </label>
                                <input
                                    id="specialization"
                                    name="specialization"
                                    type="text"
                                    required
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                  />
                            </div>
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                                    Department
                                </label>
                                <select
                                    id="department"
                                    name="department"
                                    required
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                  >

<option value="">Select Department</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Gynecology">Gynecology</option>
                    <option value="Urology">Urology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Oncology">Oncology</option>
                  </select>
                            </div>
                            </>
                        )}

                        {/* Patient specific fields */}
                        {formData.role === "patient" && (
                            <>
                            <div>
                                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                                    Date of Birth
                                </label>
                                <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                  />
                                
                                </div>
                                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700">
                    Blood Group
                  </label>
                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                                </>
                        )}
                        <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A90E2] hover:bg-[#3A80D2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] disabled:opacity-50"
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </div>

                    </form>
                </div>
            </div>
        </div>
    )
}