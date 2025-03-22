"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, LayoutDashboard, Calendar, FileText, CreditCard, User, LogOut, Menu, X } from "lucide-react"

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white z-50 flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Activity className="h-6 w-6 text-blue-500 mr-2" />
          <span className="font-semibold text-lg">MediCare Patient</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-white border-r lg:static lg:inset-auto lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-4 border-b">
            <div className="flex items-center">
              <Activity className="h-6 w-6 text-blue-500 mr-2" />
              <span className="font-semibold text-lg">MediCare Patient</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/patient/dashboard"
                  className={`flex items-center p-2 rounded-md ${isActive("/patient/dashboard") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/patient/appointments"
                  className={`flex items-center p-2 rounded-md ${isActive("/patient/appointments") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Appointments
                </Link>
              </li>
              <li>
                <Link
                  href="/patient/medical-records"
                  className={`flex items-center p-2 rounded-md ${isActive("/patient/medical-records") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Medical Records
                </Link>
              </li>
              <li>
                <Link
                  href="/patient/prescriptions"
                  className={`flex items-center p-2 rounded-md ${isActive("/patient/prescriptions") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  Prescriptions
                </Link>
              </li>
              <li>
                <Link
                  href="/patient/billing"
                  className={`flex items-center p-2 rounded-md ${isActive("/patient/billing") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Billing
                </Link>
              </li>
              <li>
                <Link
                  href="/patient/profile"
                  className={`flex items-center p-2 rounded-md ${isActive("/patient/profile") ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  <User className="h-5 w-5 mr-3" />
                  Profile
                </Link>
              </li>
            </ul>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                JD
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-sm text-gray-500">Patient</p>
              </div>
            </div>
            <button className="flex items-center text-red-500 hover:text-red-700">
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

