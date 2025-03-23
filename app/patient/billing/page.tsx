"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { CreditCard, Calendar, DollarSign, CheckCircle, XCircle } from "lucide-react"

export default function PatientBilling() {
  const { data: session } = useSession()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchBills() {
      if (!session?.user?.id) return

      try {
        const response = await fetch(`/api/bills?patient=${session.user.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch bills")
        }
        const data = await response.json()
        setBills(Array.isArray(data) ? data : [])
    } catch (err) {
        console.error("Error fetching bills:", err)
        setError("Failed to load billing data")
      } finally {
        setLoading(false)
      }
    }

    fetchBills()
  }, [session])

  const handlePayBill = async (billId) => {
    try {
      const response = await fetch(`/api/bills/${billId}/pay`, {
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Failed to process payment")
      }

      // Update the bill status in the UI
      setBills(bills.map((bill) => (bill._id === billId ? { ...bill, status: "paid" } : bill)))
    } catch (err) {
      console.error("Error paying bill:", err)
      alert("Failed to process payment. Please try again.")
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Billing & Payments</h1>

      {bills.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Bills Found</h2>
          <p className="text-gray-500">You don't have any bills at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bills.map((bill) => (
            <div key={bill._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold">{bill.description}</h2>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <p className="text-sm text-gray-500">{new Date(bill.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-xl font-bold">${bill.amount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm mr-2">Status:</span>
                    {bill.status === "paid" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="h-3 w-3 mr-1" />
                        Unpaid
                      </span>
                    )}
                  </div>

                  {bill.status !== "paid" && (
                    <button
                      onClick={() => handlePayBill(bill._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Pay Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

