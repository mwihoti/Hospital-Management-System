import type React from "react"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute allowedRoles={["admin", "patient"]}>{children}</ProtectedRoute>
}

