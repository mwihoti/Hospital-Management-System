'use client'

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter} from "@/components/ui/card"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import { ArrowLeft, Save } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"


export default function EditPatientPage() {
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
        bloodType: "",
        medicalConditions: "",
        emergencyContact: {
            name: "",
            relationship: "",
            contactNumber: "",
        }
    })

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`/api/users/${params.id}`)

                if (!response.ok) {
                    throw new Error(`Failed to fetch patient data: ${response.status}`)
                }

                const data = await response.json()

                // Format date forinput field
                let formattedDob = ""
                if (data.user.dob) {
                    const date = new Date(data.user.dob)
                    formattedDob = date.toISOString().split("T")[0]
                }

                setFormData({
                    name: data.user.name || "",
                    email: data.user.email || "",
                    contactNumber: data.user.phone || "",
                    address: data.user.address || "",
                    dob: formattedDob,
                    gender: data.user.gender || "",
                    bloodType: data.user.bloodType || "",
                    medicalConditions: Array.isArray(data.user.medicalConditions)
                        ? data.user.medicalConditions.join(", ") : data.user.medicalConditions || "",
                    emergencyContact: {
                        name: data.user.emergencyContact?.name || "",
                        relationship: data.user.emergencyContact?.relationship || "",
                        contactNumber: data.user.emergencyContact?.contactNuber || "",
                    }


                })
            } catch (err) {
                console.error("Error fetching patient data:", err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        if (params.id) {
            fetchPatientData()
        }
    }, [params.id])

    const handleChange = (e) => {
        const { name, value} = e.target

        if (name.includes(".")) {
            const [patient, child] = name.split(".")
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
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

            // process medical conditions from string to array
            const processedData = {
                ...formData,
                medicalConditions: formData.medicalConditions ? formData.medicalConditions.split(",").map((condition) => condition.trim()) : [],
            }

            const response = await fetch(`/api/users/${params.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(processedData),

            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Failed to update patient")
            }

            toast({
                title: "Success",
                description: "Patient information updated successfully",
                variant: "default"
            })

            // Navigate back to patient details page
            router.push('/admin/patients/${params.id}')
        } catch (err) {
            console.error("Error updating patient", err)
            toast({
                title: "Error",
                description: err.message || "Failed to update patient information",
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <Button variant="outline" onClick={handleGoBack} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4"/> Back
                </Button>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold text-red-600">Error</h2>
                            <p className="mt-2"> {error}</p>
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
                    <CardTitle>Edit Patient Information</CardTitle>
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
                                    <Input id="email" name="email" value={formData.email} onChange={handleChange} required />

                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contactNumber">Phone Number </Label>
                                    <Input id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth</Label>
                                    <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender</Label>
                                    <Select value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bloodType">Blood Type</Label>
                                    <Select value={formData.bloodType} onValueChange={(value) => handleSelectChange("bloodType", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="select blood type"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A+">A+</SelectItem>
                                            <SelectItem value="A-">A-</SelectItem>
                                            <SelectItem value="B+">B+</SelectItem>
                                            <SelectItem value="B-">B-</SelectItem>
                                            <SelectItem value="AB+">AB+</SelectItem>
                                            <SelectItem value="AB-">AB-</SelectItem>
                                            <SelectItem value="O+">O+</SelectItem>
                                            <SelectItem value="O-">O-</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" name="address" value={formData.address} onChange={handleChange} rows={3} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="medicalConditions">Medical Conditions (comma separated)</Label>
                                <Textarea
                                    id="medicalConditions"
                                    name="medicalConditions"
                                    value={formData.medicalConditions}
                                    onChange={handleChange}
                                    rows={3}
                                    placeholder="Diabetes, Hypertension, Asthma, etc."
                                    />
                            </div>

                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Emergency Contact</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContact.name">Contact Name</Label>
                                    <Input
                                        id="emergencyContact.name"
                                        name="emergencyContact.name"
                                        value={formData.emergencyContact.name}
                                        onChange={handleChange}
                                        />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContact.relationship">Relationship</Label>
                                    <Input
                                        id="emergencyContact.relationship"
                                        name="emergencyContact.relationship"
                                        value={formData.emergencyContact.relationship}
                                        onChange={handleChange}
                                        />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="emergencyContact.contactNumber">Contact Phone</Label>
                                    <Input 
                                        id="emergencyContact.contactNumber"
                                        name="emergencyContact.contactNumber"
                                        value={formData.emergencyContact.contactNumber}
                                        onChange={handleChange}
                                        
                                        />

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
                                <div color="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                                Saving...
                                </>
                            ) : (
                                <>
                                <Save className="mr-2 h-4 w-4"/> Save Changes
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )

}