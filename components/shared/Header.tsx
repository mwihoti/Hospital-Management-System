"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, Bell, Search, Menu, X, Calendar, FileText, CreditCard } from "lucide-react"

interface HeaderProps {
  userRole?: "admin" | "staff" | "patient"
  userName?: string
  userAvatar?: string
}

export default function Header({ userRole = "patient", userName = "John Doe", userAvatar }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const pathname = usePathname()

  const getNavLinks = () => {
    switch (userRole) {
      case "admin":
        return [
          { name: "Dashboard", href: "/admin/dashboard" },
          { name: "Staff", href: "/admin/staff-management" },
          { name: "Patients", href: "/admin/patient-management" },
          { name: "Settings", href: "/admin/settings" },
        ]
      case "staff":
        return [
          { name: "Dashboard", href: "/staff/dashboard" },
          { name: "Appointments", href: "/staff/appointments" },
          { name: "Patients", href: "/staff/patients" },
          { name: "Prescriptions", href: "/staff/prescriptions" },
          { name: "Billing", href: "/staff/billing" },
        ]
      case "patient":
      default:
        return [
          { name: "Dashboard", href: "/patient/dashboard" },
          { name: "Appointments", href: "/patient/appointments" },
          { name: "Medical Records", href: "/patient/medical-records" },
          { name: "Prescriptions", href: "/patient/prescriptions" },
          { name: "Billing", href: "/patient/billing" },
        ]
    }
  }

  const navLinks = getNavLinks()

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Activity className="h-8 w-8 text-blue-500 mr-2" />
              <span className="text-2xl font-light text-gray-800">MediCare</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`${
                  pathname === link.href ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-500"
                } transition-colors`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search */}
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                className="p-2 rounded-full hover:bg-gray-100 relative"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
                  <div className="p-4 border-b">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="p-4 border-b hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <Calendar className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Appointment Reminder</p>
                          <p className="text-sm text-gray-500">
                            Your appointment with Dr. Smith is tomorrow at 10:00 AM.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">5 minutes ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-b hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="bg-green-100 rounded-full p-2 mr-3">
                          <FileText className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Prescription Ready</p>
                          <p className="text-sm text-gray-500">
                            Your prescription has been approved and is ready for pickup.
                          </p>
                          <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 hover:bg-gray-50">
                      <div className="flex items-start">
                        <div className="bg-yellow-100 rounded-full p-2 mr-3">
                          <CreditCard className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div>
                          <p className="font-medium">Payment Received</p>
                          <p className="text-sm text-gray-500">We've received your payment of $150.00. Thank you!</p>
                          <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 text-center border-t">
                    <Link href="#" className="text-sm text-blue-500 hover:text-blue-700">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative">
              <button className="flex items-center" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-2">
                  {userAvatar ? (
                    <img
                      src={userAvatar || "/placeholder.svg"}
                      alt={userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    userName.charAt(0)
                  )}
                </div>
                <span className="text-gray-700">{userName}</span>
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  <div className="py-1">
                    <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Settings
                    </Link>
                    <div className="border-t my-1"></div>
                    <Link href="/auth/logout" className="block px-4 py-2 text-red-500 hover:bg-gray-100">
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`${
                    pathname === link.href ? "text-blue-600 font-medium" : "text-gray-700 hover:text-blue-500"
                  } transition-colors`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t pt-4 mt-2">
                <Link href="/profile" className="block py-2 text-gray-700 hover:text-blue-500">
                  Profile
                </Link>
                <Link href="/settings" className="block py-2 text-gray-700 hover:text-blue-500">
                  Settings
                </Link>
                <Link href="/auth/logout" className="block py-2 text-red-500 hover:text-red-700">
                  Logout
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

