"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Activity,
  Search,
  Filter,
  Pill,
  ShoppingCart,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface Medication {
  id: string
  name: string
  dosage: string
  quantity: number
  refillsRemaining: number
  prescribedBy: string
  prescribedDate: string
  status: "Ready" | "Processing" | "Refill Required" | "Expired"
  instructions: string
  price: number
}

export default function PharmacyPage() {
  const [medications, setMedications] = useState<Medication[]>([])
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>([])
  const [expandedMedications, setExpandedMedications] = useState<{ [key: string]: boolean }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([])
  const [showCart, setShowCart] = useState(false)

  useEffect(() => {
    // Fetch medications
    const fetchMedications = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/medications")
        if (response.ok) {
          const data = await response.json()
          setMedications(data)
          setFilteredMedications(data)
        } else {
          console.error("Failed to fetch medications")
        }
      } catch (error) {
        console.error("Error fetching medications:", error)
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, use mock data
    setTimeout(() => {
      const mockMedications: Medication[] = [
        {
          id: "M001",
          name: "Lisinopril",
          dosage: "10mg",
          quantity: 30,
          refillsRemaining: 2,
          prescribedBy: "Dr. John Smith",
          prescribedDate: "2023-10-15",
          status: "Ready",
          instructions: "Take one tablet by mouth once daily.",
          price: 15.99,
        },
        {
          id: "M002",
          name: "Amoxicillin",
          dosage: "500mg",
          quantity: 20,
          refillsRemaining: 0,
          prescribedBy: "Dr. Sarah Johnson",
          prescribedDate: "2023-11-05",
          status: "Processing",
          instructions: "Take one capsule by mouth three times daily until completed.",
          price: 12.5,
        },
        {
          id: "M003",
          name: "Atorvastatin",
          dosage: "20mg",
          quantity: 30,
          refillsRemaining: 3,
          prescribedBy: "Dr. John Smith",
          prescribedDate: "2023-10-15",
          status: "Ready",
          instructions: "Take one tablet by mouth at bedtime.",
          price: 22.75,
        },
        {
          id: "M004",
          name: "Metformin",
          dosage: "1000mg",
          quantity: 60,
          refillsRemaining: 0,
          prescribedBy: "Dr. Michael Chen",
          prescribedDate: "2023-09-20",
          status: "Refill Required",
          instructions: "Take one tablet by mouth twice daily with meals.",
          price: 18.25,
        },
        {
          id: "M005",
          name: "Ibuprofen",
          dosage: "800mg",
          quantity: 15,
          refillsRemaining: 0,
          prescribedBy: "Dr. Emily Brown",
          prescribedDate: "2023-08-10",
          status: "Expired",
          instructions: "Take one tablet by mouth every 8 hours as needed for pain.",
          price: 9.99,
        },
      ]

      setMedications(mockMedications)
      setFilteredMedications(mockMedications)
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Apply filters
    let result = [...medications]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (medication) =>
          medication.name.toLowerCase().includes(query) || medication.prescribedBy.toLowerCase().includes(query),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(
        (medication) => medication.status.toLowerCase().replace(" ", "-") === statusFilter.toLowerCase(),
      )
    }

    setFilteredMedications(result)
  }, [searchQuery, statusFilter, medications])

  const toggleMedicationExpansion = (medicationId: string) => {
    setExpandedMedications((prev) => ({
      ...prev,
      [medicationId]: !prev[medicationId],
    }))
  }

  const addToCart = (medicationId: string) => {
    const existingItem = cart.find((item) => item.id === medicationId)

    if (existingItem) {
      setCart(cart.map((item) => (item.id === medicationId ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { id: medicationId, quantity: 1 }])
    }
  }

  const removeFromCart = (medicationId: string) => {
    setCart(cart.filter((item) => item.id !== medicationId))
  }

  const updateCartQuantity = (medicationId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(medicationId)
    } else {
      setCart(cart.map((item) => (item.id === medicationId ? { ...item, quantity } : item)))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const medication = medications.find((med) => med.id === item.id)
      return total + (medication ? medication.price * item.quantity : 0)
    }, 0)
  }

  const getStatusColor = (status: Medication["status"]) => {
    switch (status) {
      case "Ready":
        return "bg-green-100 text-green-800"
      case "Processing":
        return "bg-blue-100 text-blue-800"
      case "Refill Required":
        return "bg-yellow-100 text-yellow-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: Medication["status"]) => {
    switch (status) {
      case "Ready":
        return <CheckCircle className="h-4 w-4" />
      case "Processing":
        return <Clock className="h-4 w-4" />
      case "Refill Required":
        return <AlertCircle className="h-4 w-4" />
      case "Expired":
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const requestRefill = (medicationId: string) => {
    // In a real app, you would call your API here
    // For demo purposes, just update the state
    setMedications((prevMedications) =>
      prevMedications.map((medication) =>
        medication.id === medicationId ? { ...medication, status: "Processing" as const } : medication,
      ),
    )

    alert("Refill request submitted successfully!")
  }

  const checkout = () => {
    // In a real app, you would call your API here
    alert("Checkout process initiated!")
    setCart([])
    setShowCart(false)
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
              Dashboard
            </Link>
            <Link href="/appointments" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
              Appointments
            </Link>
            <Link href="/medical-records" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
              Medical Records
            </Link>
            <Link href="/pharmacy" className="text-[#4A90E2] font-medium transition-colors">
              Pharmacy
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">JD</div>
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
              className="feather feather-menu"
            >
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
            <h1 className="text-3xl font-light text-[#333333]">Pharmacy</h1>
            <p className="text-[#666666]">Manage your prescriptions and medications</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="relative bg-white border border-gray-200 px-4 py-2 rounded-md flex items-center hover:bg-gray-50"
              onClick={() => setShowCart(!showCart)}
            >
              <ShoppingCart className="h-5 w-5 mr-2 text-[#4A90E2]" />
              Cart
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white px-4 py-2 rounded-md flex items-center">
              <Pill className="h-4 w-4 mr-2" />
              Request New Prescription
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search medications..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="border border-gray-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="ready">Ready</option>
            <option value="processing">Processing</option>
            <option value="refill-required">Refill Required</option>
            <option value="expired">Expired</option>
          </select>
          <button className="bg-white border border-gray-200 rounded-md px-4 py-2 flex items-center hover:bg-gray-50">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </button>
        </div>

        {/* Medications List */}
        <div className="space-y-4">
          {loading ? (
            // Loading skeletons
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="h-5 w-1/4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
          ) : filteredMedications.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">No medications found matching your criteria.</p>
            </div>
          ) : (
            filteredMedications.map((medication) => (
              <div key={medication.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h3 className="font-medium text-[#333333]">
                        {medication.name} {medication.dosage}
                      </h3>
                      <p className="text-sm text-[#666666]">
                        Prescribed by {medication.prescribedBy} on{" "}
                        {new Date(medication.prescribedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#666666]">Status</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(medication.status)}`}
                        >
                          {getStatusIcon(medication.status)}
                          {medication.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {medication.status === "Ready" && (
                          <button
                            className="h-9 px-4 py-2 bg-[#4A90E2] text-white border border-[#4A90E2] rounded-md hover:bg-[#3A80D2]"
                            onClick={() => addToCart(medication.id)}
                          >
                            Add to Cart
                          </button>
                        )}
                        {medication.status === "Refill Required" && (
                          <button
                            className="h-9 px-4 py-2 bg-[#4A90E2] text-white border border-[#4A90E2] rounded-md hover:bg-[#3A80D2]"
                            onClick={() => requestRefill(medication.id)}
                          >
                            Request Refill
                          </button>
                        )}
                        <button
                          className="h-9 px-4 py-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50 flex items-center"
                          onClick={() => toggleMedicationExpansion(medication.id)}
                        >
                          {expandedMedications[medication.id] ? (
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
                {expandedMedications[medication.id] && (
                  <div className="border-t px-4 py-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="font-medium">{medication.quantity} units</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Refills Remaining</p>
                        <p className="font-medium">{medication.refillsRemaining}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">${medication.price.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Prescription ID</p>
                        <p className="font-medium">{medication.id}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Instructions</p>
                      <p className="bg-gray-50 p-3 rounded-md">{medication.instructions}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Shopping Cart */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Shopping Cart</h2>
                  <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowCart(false)}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-6">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="divide-y max-h-80 overflow-y-auto">
                      {cart.map((item) => {
                        const medication = medications.find((med) => med.id === item.id)
                        if (!medication) return null

                        return (
                          <div key={item.id} className="py-3 flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {medication.name} {medication.dosage}
                              </p>
                              <p className="text-sm text-gray-500">${medication.price.toFixed(2)} each</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center border rounded-md">
                                <button
                                  className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                                >
                                  -
                                </button>
                                <span className="px-2">{item.quantity}</span>
                                <button
                                  className="px-2 py-1 text-gray-500 hover:text-gray-700"
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                className="text-red-500 hover:text-red-700"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="border-t mt-4 pt-4">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span>Shipping</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${getCartTotal().toFixed(2)}</span>
                      </div>
                    </div>

                    <button
                      className="w-full mt-6 bg-[#4A90E2] hover:bg-[#3A80D2] text-white py-2 rounded-md"
                      onClick={checkout}
                    >
                      Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

