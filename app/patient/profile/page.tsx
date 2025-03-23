'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { User, Mail, Phone, Calendar, MapPin } from 'lucide-react'

export default function PatientProfile() {
    const {data: session }  = useSession()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchProfile() {
            if (!session?.user?.id) return

            try {
                const response = await fetch(`/api/users/${session.user.id}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch profile")
                }
                const data = await response.json()
                setProfile(data.user)
            } catch (err) {
                console.error("Error fetching profile:", err)
                setError("Failed to load profile data")
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [session])

    if (loading) {
        return (
            <div className='p-6 flex justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
                <p>{error}</p>
            </div>
        )
    }
    if (!profile) {
        return (
            <div className='p-6'>
                <div className='bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded'>
                    <p>Profile not found. Please complete your profile information.</p>
                </div>
            </div>
        )
    }

    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold mb-6'>Patient Profile</h1>

            <div className='bg-white rounded-lg shadow overflow-hidden'>
                <div className='p-6'>
                    <div className="flex items-center mb-6">
                        <div className='bg-blue-100 p-3 rounded-full mr-4'>
                            <User className='h-8 w-8 text-blue-500' />
                        </div>
                        <div>
                            <h2 className='text-xl font-semibold'>{profile.name}</h2>
                            <p className='text-gray-500'>Patient ID: {profile._id}</p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div className='flex items-start'>
                            <Mail className='h-5 w-5 text-gray-400 mr-2 mt-0.5' />

                            <div>
                                <p className='text-sm text-gray-500'>Email</p>
                                <p>{profile.email}</p>
                            </div>
                        </div>
                        <div className='flex items-start'>
                            <Phone className='h-5 w-5 text-gray-400 mr-2 mt-0.5' />

                            <div>
                                <p className='text-sm text-gray-500'>Phone</p>
                                <p>{profile.phone || "Not provided"}</p>
                            </div>
                        </div>

                        <div className='flex items-start'>
                            <Calendar className='h-5 w-5 text-gray-400 mr-2 mt-0.5' />
                            <div>
                                <p className='text-sm text-gray-500'>Date of Birth</p>
                                <p>{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleString() : "Not provided"}</p>
                            </div>
                        </div>

                        <div className='flex items-start'>
                            <MapPin className='h-5 w-5 text-gray-400 mr-2 mt-0.5' />

                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>Address</p>
                            <p>{profile.address || "Not provided"}</p>
                        </div>
                    </div>
                </div>
                <div className='mt-6 pt-6 border-t'>
                    <h3 className='text-lg font-semibold mb-4'>Medical Informatioon</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <p className="text-sm text-gray-500">Blood Type</p>
                            <p>{profile.bloodType || "Not provided"} </p>
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>Medical Conditions</p>
                            <p>{profile.medicalConditions || "None reported"}</p>
                        </div>
                        <div>
                            <p className='text-sm text-gray-500'>Emergency Contact</p>
                            <p>{profile.emergencyContact || "Not provided"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}