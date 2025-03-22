"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles = [] }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/login")
      return
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
      router.push("/")
    }
  }, [session, status, router, allowedRoles])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
    return null
  }

  return <>{children}</>
}

