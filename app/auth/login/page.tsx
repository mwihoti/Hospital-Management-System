"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")

  useEffect(() => {
    if (registered === "true") {
      setSuccess("Registration successful! You can now log in.")
    }
  }, [registered])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    console.log("Login attempt with:", { email, password })

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        throw new Error(result.error === "CredentialsSignin" ? "Invalid email or password" : result.error)
      }

      if (result?.ok) {
        // Fetch user data to determine role
        const userResponse = await fetch("/api/auth/me")
        if (userResponse.ok) {
          const userData = await userResponse.json()
          const role = userData.user.role

          // Redirect based on role
          if (role === "admin") {
            router.push("/admin/dashboard")
          } else if (role === "doctor") {
            router.push("/staff/dashboard")
          } else if (role === "patient") {
            router.push("/patient/dashboard")
          } else {
            router.push("/")
          }
        } else {
          router.push("/")
        }
      }
    } catch (error) {
      console.log("Login error", error)
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
      const data = await response.json()

      if (response.ok) {
        setEmail(data.email)
        setPassword(data.password)
        setSuccess("Test user created. You can now log in with the provided credentials.")
        setError(null)
      } else {
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleCreateTestUser}
              disabled={loading}
            >
              Create Test User
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

