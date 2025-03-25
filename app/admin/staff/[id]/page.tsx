"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Briefcase } from "lucide-react"

export default function StaffDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [staff, setStaff] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/users/${params.id}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch staff details: ${response.status}`)
        }

        const data = await response.json()
        setStaff(data)
      } catch (err) {
        console.error("Error fetching staff details:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchStaffDetails()
    }
  }, [params.id])

  const handleGoBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Button variant="outline" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6">
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

  if (!staff) {
    return (
      <div className="container mx-auto p-4">
        <Button variant="outline" onClick={handleGoBack} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">Staff Not Found</h2>
              <p className="mt-2">The staff member you are looking for does not exist or has been removed.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  const getInitials = (name) => {
    // If name is undefined, null, or an empty string, return an empty string or a default value
    if (!name) return "NA";
  
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="container mx-auto p-4">
      <Button variant="outline" onClick={handleGoBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-lg">{getInitials(staff.name)}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{staff.name}</h2>
              <Badge className="mt-2" variant={staff.role === "doctor" ? "default" : "outline"}>
                {staff.role === "doctor" ? "Doctor" : "Admin Staff"}
              </Badge>

              {staff.department && (
                <div className="mt-2 text-sm text-muted-foreground flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  {staff.department}
                </div>
              )}

              {staff.specialty && (
                <div className="mt-1 text-sm text-muted-foreground">Specialty: {staff.specialty}</div>
              )}
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{staff.email}</span>
              </div>

              {staff.phone && (
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{staff.phone}</span>
                </div>
              )}

              {staff.address && (
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{staff.address}</span>
                </div>
              )}

              {staff.dob && (
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{new Date(staff.dob).toLocaleDateString()}</span>
                </div>
              )}

              {staff.gender && (
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{staff.gender}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Staff Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                {staff.role === "doctor" && <TabsTrigger value="appointments">Appointments</TabsTrigger>}
              </TabsList>

              <TabsContent value="details">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Role</h3>
                    <p className="text-sm text-muted-foreground capitalize">{staff.role}</p>
                  </div>

                  {staff.department && (
                    <div>
                      <h3 className="font-medium">Department</h3>
                      <p className="text-sm text-muted-foreground">{staff.department}</p>
                    </div>
                  )}

                  {staff.specialty && (
                    <div>
                      <h3 className="font-medium">Specialty</h3>
                      <p className="text-sm text-muted-foreground">{staff.specialty}</p>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium">Account Created</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(staff.createdAt).toLocaleDateString()} at{" "}
                      {new Date(staff.createdAt).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      variant="destructive"
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this staff member? This action cannot be undone.")
                        ) {
                          // Implement delete functionality
                          fetch(`/api/users/${staff._id}`, {
                            method: "DELETE",
                          })
                            .then((response) => {
                              if (response.ok) {
                                router.push("/admin/staff")
                              } else {
                                alert("Failed to delete staff member")
                              }
                            })
                            .catch((err) => {
                              console.error("Error deleting staff:", err)
                              alert("An error occurred while deleting the staff member")
                            })
                        }
                      }}
                    >
                      Delete Staff Member
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {staff.role === "doctor" && (
                <TabsContent value="appointments">
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      To view this doctor's appointments, please go to the Appointments section.
                    </p>
                    <Button className="mt-4" onClick={() => router.push("/admin/appointments")}>
                      View Appointments
                    </Button>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

