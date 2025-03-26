'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import { Toaster } from '@/components/ui/sonner'


export default function EditStaffPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = Toaster({ position: "top-right" })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        address: "",
        dob: "",
        gender: "",
        department: "",
        specialty: ""
    })

    useEffect(() => {
        const fetchStaffData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/users/${params.id}`)

                if (!response.ok) {
                    throw new Error(`Failed to fetch staff data: ${response.status}`)
                }

                const data = await response.json()
                // format date for input field
                let formattedDob = ""
                if (data.user.dob) {
                    const date = new Date(data.user.dob)
                    formattedDob = date.toISOString().split("T")[0]
                }

                setFormData({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    contactNumber: data.user.contactNumber || "",
                    address: data.user.address || "",
                    dob: formattedDob,
                    gender: data.user.gender || "",
                    department: data.user.department || "",
                    specialty: data.user.specialty || ""
                })
            } catch (err) {
                console.error("Error fetching staff data:", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchStaffData()
        }
    }, [params.id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSelectChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setSaving(true)

            const response = await fetch(`/api/users/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const errorData = await response.json
                throw new Error(errorData.error || "Failed to update staff member")
            }

            toast({
                title: "Success",
                description: "Staff information updated successfly",
                variant: "default",
            })

            // Navigate back to staff details page
            router.push(`/admin/staff/${params.id}`)
        } catch (err) {
            console.error("Error updating staff:", err)
            toast({
                title: "Error",
                description: err.message || "Failed to update staff information",
                variant: "destructive",
            })
        } finally {
            setSaving(false)
        }
    }

    const handleGoBack = () => {
        router.back()
    }

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <Button variant="outline" onClick={handleGoBack} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                <Card>
                    <CardContent className='pt-6'>
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-red-600">Error</h2>
                            <p className="mt-2">{error}</p>
                            <Button onClick={() => window.location.reload()} className="mt-4">
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <Button variant="outline" onClick={handleGoBack} className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Staff Information</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Personal Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />

                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactNumber">Phone Number</Label>
                                    <Input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select value={formData.gender} onValueChange={(value) =>
                                        handleSelectChange("gender", value)
                                    }>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>

                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} />
                            </div>

                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Professional Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Select
                                        value={formData.department}
                                        onValueChange={(value) => handleSelectChange("department", value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select department" />

                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Cardiology">Cardiology</SelectItem>
                                            <SelectItem value="Neurology">Neurology</SelectItem>
                                            <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                                            <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                                            <SelectItem value="Dermatology">Dermatology</SelectItem>
                                            <SelectItem value="Oncology">Oncology</SelectItem>
                                            <SelectItem value="Gynecology">Gynecology</SelectItem>
                                            <SelectItem value="Ophthalmology">Ophthalmology</SelectItem>
                                            <SelectItem value="Psychiatry">Psychiatry</SelectItem>
                                            <SelectItem value="Radiology">Radiology</SelectItem>
                                            <SelectItem value="Anesthesiology">Anesthesiology</SelectItem>
                                            <SelectItem value="Emergency">Emergency</SelectItem>
                                            <SelectItem value="Administration">Administration</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="specialty">Specialty</Label>
                                    <Input
                                        id="specialty"
                                        name="specialty"
                                        value={formData.specialty}
                                        onChange={handleChange}
                                        placeholder="E.g., Cardiac Surgery, Pediatric Neurology"/>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={handleGoBack}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                <>
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                                Saving...
                                </>
                            ) : (
                                <>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                                </>
                            )}
                        </Button>

                    </CardFooter>
                </form>
            </Card>
        </div>
    )
} 