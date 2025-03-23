import type React from "react"
import ProtectedRoute from "@/components/ProtectedRoute"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>
}

