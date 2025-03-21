"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles?: string[]
}

export default function protectedRoute({ children, allowedRoles}: ProtectedRouteProps) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login")
        } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
            router.push("/")
        }
    }, [user, loading, router, allowedRoles])

    if (loading) {
        return <div>Loading</div>
    }
    if (!user) {
        return null
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return null
    }
    return <>{children}</>
}