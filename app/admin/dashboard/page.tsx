"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Users, UserPlus, Calendar, DollarSign, Activity, TrendingUp, TrendingDown } from "lucide-react"


interface StatsCard {
    title: string
    value: string
    icon: React.ReactNode
    change: string
    trend: "up" | "down" | "neutral"
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<StatsCard[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setStats([
                {
                    title: "Total Patients",
                    value: "2,547",
                    icon: <UserPlus className="h-8 w-8 text-blue-500" />,
                    change: "+5.2%",
                    trend: "up",
                },
                {
                    title: "Total Staff",
                    value: "152",
                    icon: <Users className="h-8 w-8 text-green-500" />,
                    change: "+2.1%",
                    trend: "up",
                },
                {
                    title: "Appointments Today",
                    value: "48",
                    icon: <Calendar className="h-8 w-8 text-purple-500" />,
                    change: "-3.5%",
                    trend: "down",
                },
                {
                    title: "Revenue This Month",
                    value: "$125,400",
                    icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
                    change: "+8.3%",
                    trend: "up",
                },
            ])
            setLoading(false)
        }, 1000)
    }, [])

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {loading
                    ? //Loading skeletons
                    Array(4)
                        .fill(0)
                        .map((_, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                                <div className="h-8 w-8 bg-gray-200 rounded-full mb-4"></div>
                                <div className="h-5 w-24 bg-gray-200 rounded mb-2"></div>
                                <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
                                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            </div>
                        ))
                    : stats.map((stat, index) => (

                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="mb-4">{stat.icon} </div>
                            <h3 className="text-gray-500 font-medium mb-1">{stat.title}</h3>
                            <p className="text-3xl font-bold mb-2">{stat.value}</p>
                            <div className="flex items-center">
                                {stat.trend === "up" ? (
                                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                ) : stat.trend === "down" ? (
                                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                ) : (
                                    <Activity className="h-4 w-4 text-gray-500 mr-1" />
                                )}

                                <span
                                    className={`text-sm ${stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : "text-gray-500"}`}>
                                    {stat.change} from last month
                                </span>
                            </div>
                        </div>
                    ))
                }
            </div>
            {/* Recent Activity and Quick */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {loading ? (
                            // Loading skeletons
                            Array(5)
                                .fill(0)
                                .map((_, index) => (
                                    <div key={index} className="flex items-start animate-pulse">
                                        <div className="h-10 w-10 bg-gray-200 rounded-full mr-3"></div>
                                        <div className="flex-1">
                                            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"> </div>
                                            <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <>
                                <ActivityItem
                                    avatar="D"
                                    name="Dr. Smith"
                                    action="added a new patient"
                                    time="5 minutes ago"
                                    avatarColor="bg-blue-500"
                                />
                                <ActivityItem
                                    avatar="N"
                                    name="Nurse Johnson"
                                    action="updated a medical record"
                                    time="15 minutes ago"
                                    avatarColor="bg-green-500"
                                />
                                <ActivityItem
                                    avatar="A"
                                    name="Admin User"
                                    action="approved staff leave request"
                                    time="1 hour ago"
                                    avatarColor="bg-purple-500"
                                />
                                <ActivityItem
                                    avatar="D"
                                    name="Dr. Williams"
                                    action="completed an appointment"
                                    time="2 hours ago"
                                    avatarColor="bg-yellow-500"
                                />
                                <ActivityItem
                                    avatar="R"
                                    name="Receptionist Davis"
                                    action="scheduled a new appointment"
                                    time="3 hours ago"
                                    avatarColor="bg-red-500"
                                />
                            </>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                            Add New Staff
                        </button>
                        <button className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
                            Add New Patient
                        </button>
                        <button className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 transition-colors">
                            Schedule Appointment
                        </button>
                        <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors">
                            Generate Reports
                        </button>
                        <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                            System Settings
                        </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

function ActivityItem({
    avatar,
    name,
    action,
    time,
    avatarColor
}: {
    avatar: string
    name: string
    action: string
    time: string
    avatarColor: string
}) {
    return (
        <div className="flex items-start">
            <div className={`w-10 h-10 rounded-full ${avatarColor}
            flex items-center justify-center text-white mr-3`}>
                {avatar}
            </div>
            <div>
                <p>
                    <span
                    className="font-medium">
                        {name} </span>{action}

                </p>
                <p className="text-sm text-gray-500">{time}</p>
            </div>
        </div>
    )
}