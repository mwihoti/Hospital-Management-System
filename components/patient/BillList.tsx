"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Calendar, CreditCard } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface BillListProps {
  patientId?: string
}


export function BillList({ patientId}: BillListProps) {
    const [bills, setBills] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")


    useEffect(() => {
        async function fetchBills() {
            if (!patientId) return

            try {
                setLoading(true)
                const response = await fetch(`/api/bills?patientId=${patientId}`)

                if (!response.ok) {
                    throw new Error("Failed to fetch bills")
                }

                const data = await response.json()
                setBills(data)
            } catch (err: any) {
                console.error("Error fetching bills:", err)
                setError(err.message || "Failed to load bill data")
            } finally {
                setLoading(false)
            }
        }
        if (patientId) {
            fetchBills()
        }
    }, [patientId])

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return <Badge className="bg-green-500">Paid</Badge>
            case "pending":
                return <Badge className="bg-yellow-500">Pending</Badge>
            case "overdue":
                return <Badge className="bg-red-500">Overdue</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>
    }

    return (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Bills</h2>
            </div>
    
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : bills.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No bills found</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bills.map((bill: any) => (
                    <TableRow key={bill._id}>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          {bill.createdAt ? format(new Date(bill.createdAt), "MMM dd, yyyy") : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>{bill.description}</TableCell>
                      <TableCell>${bill.amount.toFixed(2)}</TableCell>
                      <TableCell>{bill.dueDate ? format(new Date(bill.dueDate), "MMM dd, yyyy") : "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(bill.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {bill.status === "pending" && (
                          <Button variant="ghost" size="icon" title="Pay Bill">
                            <CreditCard className="h-4 w-4 text-green-500" />
                          </Button>
                        )}
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
    
    