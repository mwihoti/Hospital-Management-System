"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateBill() {
  const router = useRouter()
  const [billData, setBillData] = useState({
    patientId: "",
    items: [{ description: "", amount: 0 }],
    totalAmount: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(billData),
    })
    if (res.ok) {
      router.push("/doctor/bills")
    }
  }

  const addItem = () => {
    setBillData({
      ...billData,
      items: [...billData.items, { description: "", amount: 0 }],
    })
  }

  const updateItem = (index: number, field: "description" | "amount", value: string | number) => {
    const newItems = [...billData.items]
    newItems[index][field] = value
    const totalAmount = newItems.reduce((sum, item) => sum + Number(item.amount), 0)
    setBillData({ ...billData, items: newItems, totalAmount })
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Bill</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Patient ID"
          value={billData.patientId}
          onChange={(e) => setBillData({ ...billData, patientId: e.target.value })}
          className="w-full p-2 border rounded"
        />
        {billData.items.map((item, index) => (
          <div key={index} className="flex space-x-2">
            <input
              type="text"
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(index, "description", e.target.value)}
              className="flex-grow p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Amount"
              value={item.amount}
              onChange={(e) => updateItem(index, "amount", e.target.value)}
              className="w-24 p-2 border rounded"
            />
          </div>
        ))}
        <button type="button" onClick={addItem} className="bg-green-500 text-white p-2 rounded">
          Add Item
        </button>
        <div>Total Amount: ${billData.totalAmount.toFixed(2)}</div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Create Bill
        </button>
      </form>
    </div>
  )
}

