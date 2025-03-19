"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2 } from "lucide-react"


export function PatientList() {
    const [patients, setPatients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        async function fetchPatients() {
            try {
                setLoading(true)
                const response = await fetch("/api/users?role=patient")

                if (!response.ok) {
                    throw new Error("Failed to fetch patients")
                }
                const data = await response.json()
                setPatients(data)
            } catch (err: any) {
                console.error("Error fetching patients:", err)
                setError(err.message || "Failed to load patient data")
            } finally {
                setLoading(false)
            }
        }
        fetchPatients()
    }, [])

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold ">Patient List</h2>

                    <Button>
                        <Plus className="mr-2 h-4 w-4"/> Add new Patient
                    </Button>
                </div>

                {loading ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"> </div>
                        ))}
                    </div>
                ): patients.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No patients found</div>
                    
                ): (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Blood group</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients.map((patient: any) => (
                                <TableRow key={patient._id}>
                                    <TableCell className="font-medium">{patient.name}</TableCell>
                                    <TableCell>{patient.email}</TableCell>
                                    <TableCell>{patient.gender}</TableCell>
                                    <TableCell>{patient.bloodGroup || "N/A"}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4"/>
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4"/>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    )
}