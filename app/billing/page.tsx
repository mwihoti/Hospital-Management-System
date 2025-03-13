"use client"


import { useState, useEffect } from "react"
import Link from "next/link"
import { CreditCard, Download, Filter, Search, ChevronDown, ChevronUp, Calendar, DollarSign } from "lucide-react"
import { Activity } from "lucide-react"

interface Bill {
    id: string
    date: string
    dueDate: string
    amount: number
    status: "Paid" | "Pending" | "Overdue"
    description: string
    items: {
        id: string
        description: string
        quantity: number
        unitPrice: number
        total: number
    }[]
}


export default function BillingPage() {
    const [bills, setBills] = useState<Bill[]>([])
    const [filteredBills, setFilteredBills] = useState<Bill[]>([])
    const [selectedBill, setSelectedBill] = useState<Bill | null>(null)
    const [expandedBills, setExpandedBills] = useState<{ [key: string]: boolean }>({})
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [loading, setLoading] = useState(true)
    const [paymentAmount, setPaymentAmount] = useState<number>(0)
    const [showPaymentModal, setShowPaymentModal] = useState(false)

    useEffect(() => {
        const fetchBills = async () => {
            try {
                setLoading(true)
                const response = await fetch("/api/bills")
                if (response.ok) {
                    const data = await response.json()
                    setBills(data)
                    setFilteredBills(data)
                } else {
                    console.error("Failed to fetch bills")
                }
            } catch (error) {
                console.error("Error fetching bills:", error)
            } finally {
                setLoading(false)
            }
        }

        // Mock data
        setTimeout(() => {
            const mockBills: Bill[] = [

        {
            id: "B001",
            date: "2023-10-15",
            dueDate: "2023-11-15",
            amount: 250.0,
            status: "Pending",
            description: "Cardiology Consultation",
            items: [
              {
                id: "I001",
                description: "Consultation Fee",
                quantity: 1,
                unitPrice: 150.0,
                total: 150.0,
              },
              {
                id: "I002",
                description: "ECG Test",
                quantity: 1,
                unitPrice: 75.0,
                total: 75.0,
              },
              {
                id: "I003",
                description: "Blood Pressure Check",
                quantity: 1,
                unitPrice: 25.0,
                total: 25.0,
              },
            ],
          },
          {
            id: "B002",
            date: "2023-09-22",
            dueDate: "2023-10-22",
            amount: 450.0,
            status: "Paid",
            description: "MRI Scan and Neurology Consultation",
            items: [
              {
                id: "I004",
                description: "MRI Scan",
                quantity: 1,
                unitPrice: 350.0,
                total: 350.0,
              },
              {
                id: "I005",
                description: "Neurology Consultation",
                quantity: 1,
                unitPrice: 100.0,
                total: 100.0,
              },
            ],
          },
          {
            id: "B003",
            date: "2023-08-10",
            dueDate: "2023-09-10",
            amount: 175.0,
            status: "Overdue",
            description: "Blood Tests and General Check-up",
            items: [
              {
                id: "I006",
                description: "Complete Blood Count",
                quantity: 1,
                unitPrice: 75.0,
                total: 75.0,
              },
              {
                id: "I007",
                description: "General Check-up",
                quantity: 1,
                unitPrice: 100.0,
                total: 100.0,
              },
            ],
          },
            ]

            setBills(mockBills)
            setFilteredBills(mockBills)
            setLoading(false)
        }, 1000)
    }, [])

    useEffect(() => {
        let result = [...bills]

        // search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            result =  result.filter(
                (bill) => bill.id.toLowerCase().includes(query) || bill.description.toLowerCase().includes(query))
        }

        // Status filter
        if (statusFilter !== "all") {
            result = result.filter((bill) => bill.status.toLowerCase() === statusFilter.toLowerCase())
        }
        setFilteredBills(result)
    }, [searchQuery, statusFilter, bills])

    const toggleBillExpansion = (billId: string) => {
        setExpandedBills((prev) => ({
            ...prev,
            [billId]: !prev[billId],
        }))
    }

    const selectBill = (bill: Bill) => {
        setSelectedBill(bill)
        setPaymentAmount(bill.amount)
        setShowPaymentModal(true)
    }

    const handlePayment = async () => {
        if (!selectedBill) return

        try {
            // Todo Add payment api

            setBills((prevBills) => 
                prevBills.map((bill) => (bill.id === selectedBill.id  ? { ...bill, status: "Paid" as const} : bill)),    
            )
            setShowPaymentModal(false)
            alert("Payment successful!")

        } catch (error) {
            console.error("Error processing payment:", error)
            alert("Payment failed. Please try again.")
        }
    }

    const getTotalDue = () => {
        return bills.filter((bill) => bill.status !== "Paid").reduce((total, bill) => total + bill.amount, 0)
    }

    const getStatusColor = (ststus: Bill["status"]) => {
        switch (status) {
            case "Paid":
                return "bg-green-100 text-green-800"
            case "Pending":
                return "bg-yellow-100 text-yellow-800"
            case "Overdue":
                return "bg-red-100 text-red-800"
            default:
                return "bg-gray-100 text-gray-800"
        }
    }


return (
    <div className="min-h-screen bg-[#F8F9FA]">
        {/* Header */}
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Activity className="h-8 w-8 text-[#4A90E2]" />
                    <h1 className="text-2xl font-light text-[#333333]">MediCare</h1>
                </div>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="/dashboard" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
                    Dashboard</Link>
                    <Link href="/patients" className="text-[#333333] hover:text-[#4A90E2] transition-colors">Patients</Link>
                    <Link href="/patients" className="text-[#333333] hover:text-[#4A90E2] transition-colors">Appointments</Link>
                    <Link href="/patients" className="text-[#333333] hover:text-[#4A90E2] transition-colors">Billing</Link>  
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#4A90E2] flex items-center jsutify-center text-white">JD</div>
                        <span className="text-[#333333]">John Doe</span>
                    </div>
  
                </nav>
                <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-menu">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>

                            <line x1="3" y1="18" x2="21" y2="18"></line>

                        </svg>
                </button>
            </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-light text-[#333333]">Billing & Payments</h1>
                    <p className="text-[#666666]">Manage your bills and payment history</p>
                </div>
                <button
                    className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white px-4 py-2 rounded-md flex items-center"
                    onClick={() => {
                        const pendingBill = bills.find((bill) => bill.status !== "Paid")
                        if (pendingBill) {
                            selectBill(pendingBill)
                        } else {
                            alert("No pending bills to pay.")
                        }
                    }}
                    > 
                    <CreditCard className="w-4 h-4 mr-2" />
                    Make a payment
                    </button>
            </div>

            {/* Billing summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-[#666666]">Total Due</p>
                            <p className="text-2xl font-medium text-[#333333]">${getTotalDue().toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <div >
                            <p className="text-sm text-[#666666]">Next Due Date</p>
                            <p className="text-2xl font-medium text-[#333333]">
                                {bills.filter((bill) => bill.status === "Pending").length > 0
                                ? new Date(bills.filter((bill) => bill.status === "Pending")[0].dueDate).toLocaleDateString() : "No pending bills"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm text-[#666666]">Payment Methods</p>
                            <p className="text-2xl font-medium text-[#333333]"> 2 Cards</p>
                        </div>
                    </div>
                </div>

            </div>
            
            {/* filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                        type="text"
                        placeholder="Search bills..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-[#4A90E2] focus:border-transparent" value={statusFilter}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        />


                </div>
                <select
                    className="border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none
                    focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent" value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="paid">Paid</option>
                        <option value="pending">Pending</option>
                        <option value="overdue">Overdue</option>
                    </select>
                    <button className="bg-whitw border border-gray-200 rounded-md px-4 py-2 flex items-center hover:bg-gray-50">
                        <Filter className="h-4 w-4 mr-2" />
                        More Filters
                    </button>
                    </div>

                    {/* Bills list */}
                    <div className="space-y-4">
                        {loading ? (
                            // Loading skeletons
                            Array(3)
                                .fill(0)
                                .map((_, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                                                <div className="h-8 w-24 bg-gray-200 rounded"></div>

                                                </div>
                                            </div>
                                        </div>
                                ))
                        ): filteredBills.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <p className="text-gray-500">No bills found matching your criteria.</p>
                                </div>
                        ): (
                            filteredBills.map((bill) => (
                                <div key={bill.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                            <div>
                                                <h3 className="font-medium text-[#333333]">{bill.description}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-[#666666]">
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1"/>
                                                        {new Date(bill.date).toLocaleDateString()}
                                                </div>
                                                <div>Bill #{bill.id}</div>
                                    </div>
                                    </div>
                                    <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#666666]">Amount</span>
                        <span className="font-medium text-[#333333]">${bill.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#666666]">Status</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(bill.status)}`}>
                          {bill.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {bill.status !== "Paid" && (
                          <button
                            className="h-9 px-4 py-2 bg-[#4A90E2] text-white border border-[#4A90E2] rounded-md hover:bg-[#3A80D2]"
                            onClick={() => selectBill(bill)}
                          >
                            Pay Now
                          </button>
                        )}
                        <button
                          className="h-9 px-4 py-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 flex items-center"
                          onClick={() => toggleBillExpansion(bill.id)}
                        >
                          {expandedBills[bill.id] ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Hide Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              View Details
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedBills[bill.id] && (
                  <div className="border-t px-4 py-3">
                    <h4 className="font-medium mb-2">Bill Items</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="text-xs text-[#666666] border-b">
                          <tr>
                            <th className="py-2 text-left">Description</th>
                            <th className="py-2 text-right">Quantity</th>
                            <th className="py-2 text-right">Unit Price</th>
                            <th className="py-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {bill.items.map((item) => (
                            <tr key={item.id}>
                              <td className="py-2">{item.description}</td>
                              <td className="py-2 text-right">{item.quantity}</td>
                              <td className="py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                              <td className="py-2 text-right">${item.total.toFixed(2)}</td>
                            </tr>
                          ))}
                          <tr className="font-medium">
                            <td colSpan={3} className="py-2 text-right">
                              Total
                            </td>
                            <td className="py-2 text-right">${bill.amount.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button className="flex items-center text-[#4A90E2] hover:text-[#3A80D2]">
                        <Download className="h-4 w-4 mr-1" />
                        Download Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Make a Payment</h2>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Bill</p>
                <p className="font-medium">{selectedBill.description}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Amount Due</p>
                <p className="text-2xl font-medium">${selectedBill.amount.toFixed(2)}</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  min={0}
                  max={selectedBill.amount}
                  step={0.01}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <select className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="card1">Visa ending in 4242</option>
                  <option value="card2">Mastercard ending in 5555</option>
                  <option value="new">Add new payment method</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={handlePayment}
                >
                  Pay ${paymentAmount.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    
  )
}

