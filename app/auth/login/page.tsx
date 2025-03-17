"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Activity } from "lucide-react"
import { signIn } from "next-auth/react"

export default function Login() {
   
    const router = useRouter()
    const searchParams = useSearchParams()
    const [formData, setFormData] = useState({
        email : "",
        password : "",
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")


    useEffect(() => {
        const registered = searchParams.get("registered")
        if (registered) {
            setSuccessMessage("Registration successful! please log in.")
        }
    }, [searchParams])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({...prev, [name]: value}))
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")
        // Todo add api call to authenticate
        try {
            setLoading(true)

            console.log("Login attempt with NextAuth:", {email: formData.email});

            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error || "Login failed")
            }

            console.log("Login Successful")

           // Fetch user data to determine role
            const response = await fetch("/api/users");
            const userData = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login failed")
            }
            // Store token in localStorage or cookies
            localStorage.setItem("token", data.token)

            // Store user info
            localStorage.setItem("user", JSON.stringify(data.user))

            // Redirect based on role
            switch (userData.role) {
                case "admin":
                    console.log("Redirecting to admin dashboard");
                    router.push('/admin/dashboard')
                    break
                case "doctor":
                    console.log("Redirecting to doctor dashboard");

                    router.push('/admin/doctor')
                    break
                case "patient":
                    console.log("Redirecting to patient dashboard");

                    router.push('/patient')
                    break
                default:
                    router.push('/')
            }


        } catch (err: any) {
            console.error("Login error", err)
            setError(err.message)
        } finally {
            setLoading(false)
        }

        // Redirect to dashboard after successfull login
        router.push("/")
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-6">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link href="/auth/register" className="font-medium text-[#4A90E2] hover:text-[#3A80D2]">
            create a new account
          </Link>
        </p>
                </div>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              {successMessage}
            </div>
          )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" value="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none 
                                  focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}/>


                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md 
                                shadow-sm focus:outline-none focus:ring-[#4A90E2] focus:border-[#4A90E2]"                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                              />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#4A90E2] focus:ring-[#4A90E2] border-gray-300 rounded" />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                        Remember me
                                    </label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-[#4A90E2] hover:text=[#380D2]">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 boder border-transparent rounded-md shadow-sm
                                text-sm font-medium text-white bg-[#4A90E2] hover:bg-[#3A80D2] focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-[#4A90E2] disabled:opacity-50"
                                >
                                    {loading ? "Signing in..." : "Sign in"}
                                </button>
                        </div>
                    </div> 


                </form>
                </div>
            </div>
          </div>
        </div>
    )
}