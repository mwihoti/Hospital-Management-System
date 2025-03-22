"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const { data: session } = useSession()

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      const role = session.user.role
      if (role === "admin") {
        router.push("/admin/dashboard")
      } else if (role === "doctor") {
        router.push("/staff/dashboard")
      } else if (role === "patient") {
        router.push("/patient/dashboard")
      } else {
        router.push("/")
      }
    }
  }, [session, router])

  // Check for error in URL
  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      if (errorParam === "CredentialsSignin") {
        setError("Invalid email or password")
      } else {
        setError(`Authentication error: ${errorParam}`)
      }
    }

    // Check if user just registered
    const registered = searchParams.get("registered")
    if (registered === "true") {
      setError("Registration successful! You can now log in.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        if (result.error === "CredentialsSignin") {
          throw new Error("Invalid email or password")
        } else {
          throw new Error(result.error)
        }
      }

      if (result?.ok && session) {
        // NextAuth will handle the session update
        // The useEffect above will handle the redirect
      }
    } catch (error) {
      console.error("Login error", error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An error occurred during login")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTestUser = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/seed")
      if (response.ok) {
        setEmail("test@example.com")
        setPassword("password123")
        setError("Test user created. You can now log in with the provided credentials.")
      } else {
        const data = await response.json()
        setError(data.error || "Failed to create test user")
      }
    } catch (error) {
      setError("Failed to create test user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-gray-600">Enter your credentials to access your account</p>
        </div>

        {error && (
          <div
            className={`p-4 mb-4 rounded-md ${error.includes("successful") || error.includes("Test user created") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleCreateTestUser}
            disabled={loading}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            Create Test User
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

