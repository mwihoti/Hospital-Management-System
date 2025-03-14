"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarIcon, Clock, ChevronLeft, ChevronRight, Plus, Search, Filter, Activity } from 'lucide-react';
import { getAppointments, getCalendarDays, updateAppointmentStatus, type Appointment, type CalendarDay } from "@/lib/api";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all-departments");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isDepartmentOpen, setIsDepartmentOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState("week");

  // Fetch appointments data
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const data = await getAppointments();
        setAppointments(data);
        setFilteredAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Fetch calendar days
  useEffect(() => {
    const fetchCalendarDays = async () => {
      setCalendarLoading(true);
      try {
        const data = await getCalendarDays();
        setCalendarDays(data);
        // Set today as selected day by default
        const today = data.find(day => day.isToday);
        if (today) {
          setSelectedDay(today.date);
        }
      } catch (error) {
        console.error("Error fetching calendar days:", error);
      } finally {
        setCalendarLoading(false);
      }
    };

    fetchCalendarDays();
  }, []);

  // Handle tab changes
  useEffect(() => {
    const fetchFilteredAppointments = async () => {
      setLoading(true);
      try {
        let data;
        if (activeTab !== "all") {
          data = await getAppointments(activeTab);
        } else {
          data = await getAppointments();
        }
        setAppointments(data);
        applyFilters(data);
      } catch (error) {
        console.error("Error fetching filtered appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredAppointments();
  }, [activeTab]);

  // Apply search and department filters
  const applyFilters = (data: Appointment[]) => {
    let filtered = [...data];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        appointment => 
          appointment.patient.toLowerCase().includes(query) ||
          appointment.doctor.toLowerCase().includes(query) ||
          appointment.id.toLowerCase().includes(query)
      );
    }
    
    // Apply department filter
    if (departmentFilter !== "all-departments") {
      filtered = filtered.filter(
        appointment => appointment.department.toLowerCase() === departmentFilter.toLowerCase()
      );
    }
    
    // Apply day filter
    if (selectedDay) {
      filtered = filtered.filter(
        appointment => {
          // Extract day from date (assuming format YYYY-MM-DD)
          const appointmentDay = appointment.date.split('-')[2];
          return appointmentDay === selectedDay;
        }
      );
    }
    
    setFilteredAppointments(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(appointments);
  };

  // Handle department filter change
  const handleDepartmentChange = (value: string) => {
    setDepartmentFilter(value);
    setIsDepartmentOpen(false);
    applyFilters(appointments);
  };

  // Handle view mode change
  const handleViewChange = (value: string) => {
    setViewMode(value);
    setIsViewOpen(false);
  };

  // Handle day selection
  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    applyFilters(appointments);
  };

  // Handle appointment status update
  const handleStatusUpdate = async (id: string, newStatus: Appointment['status']) => {
    try {
      const updatedAppointment = await updateAppointmentStatus(id, newStatus);
      
      // Update the appointments list
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment.id === id ? updatedAppointment : appointment
        )
      );
      
      // Update filtered appointments
      setFilteredAppointments(prevFiltered => 
        prevFiltered.map(appointment => 
          appointment.id === id ? updatedAppointment : appointment
        )
      );
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-[#4A90E2]" />
            <h1 className="text-2xl font-light text-[#333333]">MediCare</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
              Dashboard
            </Link>
            <Link href="/patients" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
              Patients
            </Link>
            <Link href="/appointments" className="text-[#4A90E2] font-medium transition-colors">
              Appointments
            </Link>
            <Link href="/staff" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
              Staff
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#4A90E2] flex items-center justify-center text-white">
                AD
              </div>
              <span className="text-[#333333]">Dr. Adams</span>
            </div>
          </nav>
          <button className="md:hidden p-2 rounded-md hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-light text-[#333333]">Appointment Scheduling</h1>
            <p className="text-[#666666]">Manage patient appointments and schedules</p>
          </div>
          <button className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </button>
        </div>

        {/* Calendar Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-md flex items-center bg-white hover:bg-gray-50">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </button>
            <h2 className="text-lg font-medium">March 2025</h2>
            <button className="px-3 py-2 text-sm border border-gray-200 rounded-md flex items-center bg-white hover:bg-gray-50">
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="px-3 py-2 text-sm border border-gray-200 rounded-md bg-white hover:bg-gray-50"
              onClick={() => {
                const today = calendarDays.find(day => day.isToday);
                if (today) {
                  setSelectedDay(today.date);
                  applyFilters(appointments);
                }
              }}
            >
              Today
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsViewOpen(!isViewOpen)}
                className="w-[120px] bg-white border border-gray-200 rounded-md px-3 py-2 text-sm text-left flex items-center justify-between"
              >
                <span>{viewMode === "day" ? "Day" : viewMode === "week" ? "Week" : "Month"}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isViewOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {isViewOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="py-1">
                    <button 
                      onClick={() => handleViewChange("day")}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Day
                    </button>
                    <button 
                      onClick={() => handleViewChange("week")}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Week
                    </button>
                    <button 
                      onClick={() => handleViewChange("month")}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Month
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2 mb-6">
          {calendarLoading ? (
            // Loading skeleton for calendar days
            Array(7).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="h-4 w-8 bg-gray-200 animate-pulse rounded mx-auto mb-2"></div>
                <div className="h-6 w-6 bg-gray-200 animate-pulse rounded mx-auto"></div>
              </div>
            ))
          ) : (
            calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`bg-white rounded-lg shadow-sm p-4 text-center cursor-pointer transition-colors ${
                  selectedDay === day.date 
                    ? 'bg-[#4A90E2] text-white' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleDaySelect(day.date)}
              >
                <p className="text-sm">{day.day}</p>
                <p className="text-xl font-medium">{day.date}</p>
              </div>
            ))
          )}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white border rounded-md flex">
            <button 
              onClick={() => setActiveTab("all")} 
              className={`px-4 py-2 text-sm font-medium ${activeTab === "all" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} rounded-l-md transition-colors`}
            >
              All Appointments
            </button>
            <button 
              onClick={() => setActiveTab("confirmed")} 
              className={`px-4 py-2 text-sm font-medium ${activeTab === "confirmed" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} transition-colors`}
            >
              Confirmed
            </button>
            <button 
              onClick={() => setActiveTab("checked-in")} 
              className={`px-4 py-2 text-sm font-medium ${activeTab === "checked-in" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} transition-colors`}
            >
              Checked In
            </button>
            <button 
              onClick={() => setActiveTab("completed")} 
              className={`px-4 py-2 text-sm font-medium ${activeTab === "completed" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} rounded-r-md transition-colors`}
            >
              Completed
            </button>
          </div>
          
          <div className="mt-4">
            {activeTab === "all" && (
              <>
                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input 
                      type="text"
                      placeholder="Search appointments..." 
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <button 
                        onClick={() => setIsDepartmentOpen(!isDepartmentOpen)}
                        className="w-[180px] bg-white border border-gray-200 rounded-md px-4 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      >
                        <span>
                          {departmentFilter === "all-departments" 
                            ? "All Departments" 
                            : departmentFilter.charAt(0).toUpperCase() + departmentFilter.slice(1)}
                        </span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isDepartmentOpen ? 'rotate-180' : ''}`}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      
                      {isDepartmentOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                          <div className="py-1">
                            <button 
                              onClick={() => handleDepartmentChange("all-departments")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              All Departments
                            </button>
                            <button 
                              onClick={() => handleDepartmentChange("cardiology")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Cardiology
                            </button>
                            <button 
                              onClick={() => handleDepartmentChange("neurology")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Neurology
                            </button>
                            <button 
                              onClick={() => handleDepartmentChange("orthopedics")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Orthopedics
                            </button>
                            <button 
                              onClick={() => handleDepartmentChange("dermatology")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Dermatology
                            </button>
                            <button 
                              onClick={() => handleDepartmentChange("pulmonology")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Pulmonology
                            </button>
                            <button 
                              onClick={() => handleDepartmentChange("endocrinology")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Endocrinology
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button className="bg-white border border-gray-200 rounded-md px-4 py-2 flex items-center hover:bg-gray-50">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </button>
                  </div>
                </div>

                {/* Appointments List */}
                <div className="space-y-4">
                  {loading ? (
                    // Loading skeleton for appointments
                    Array(3).fill(0).map((_, index) => (
                      <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="h-12 w-12 bg-gray-200 animate-pulse rounded-lg"></div>
                            <div>
                              <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-1"></div>
                              <div className="h-4 w-48 bg-gray-200 animate-pulse rounded mb-2"></div>
                              <div className="flex items-center gap-4">
                                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                            <div className="flex flex-col items-start">
                              <div className="h-3 w-16 bg-gray-200 animate-pulse rounded mb-1"></div>
                              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                            <div className="flex flex-col items-start">
                              <div className="h-3 w-12 bg-gray-200 animate-pulse rounded mb-1"></div>
                              <div className="h-6 w-20 bg-gray-200 animate-pulse rounded-full"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md"></div>
                              <div className="h-9 w-20 bg-gray-200 animate-pulse rounded-md"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : filteredAppointments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                      <p className="text-gray-500">No appointments found matching your criteria.</p>
                    </div>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))
                  )}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-500">
                    {loading 
                      ? "Loading appointments..." 
                      : `Showing ${filteredAppointments.length > 0 ? "1" : "0"}-${filteredAppointments.length} of ${filteredAppointments.length} appointments`
                    }
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous Page</span>
                    </button>
                    <button 
                      className="h-8 w-8 flex items-center justify-center rounded-md bg-[#4A90E2] text-white border border-[#4A90E2] disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      1
                    </button>
                    {filteredAppointments.length > 5 && (
                      <button 
                        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        2
                      </button>
                    )}
                    {filteredAppointments.length > 10 && (
                      <button 
                        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        3
                      </button>
                    )}
                    <button 
                      className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || filteredAppointments.length <= 5}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next Page</span>
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {(activeTab === "confirmed" || activeTab === "checked-in" || activeTab === "completed") && (
              <>
                {loading ? (
                  <div className="p-8 flex flex-col items-center justify-center">
                    <div className="flex gap-2 items-center mb-4">
                      <div className="h-5 w-5 rounded-full bg-blue-200 animate-pulse"></div>
                      <div className="h-5 w-5 rounded-full bg-blue-300 animate-pulse"></div>
                      <div className="h-5 w-5 rounded-full bg-blue-400 animate-pulse"></div>
                    </div>
                    <p className="text-gray-500">Loading {activeTab} appointments...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredAppointments.length === 0 ? (
                      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <p className="text-gray-500">No {activeTab} appointments found.</p>
                      </div>
                    ) : (
                      filteredAppointments.map((appointment) => (
                        <AppointmentCard 
                          key={appointment.id} 
                          appointment={appointment} 
                          onStatusUpdate={handleStatusUpdate}
                        />
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function AppointmentCard({ 
  appointment, 
  onStatusUpdate 
}: { 
  appointment: Appointment;
  onStatusUpdate: (id: string, status: Appointment['status']) => void;
}) {
  // Status color mapping
  const statusColors: Record<string, string> = {
    "Confirmed": "bg-green-100 text-green-800",
    "Checked In": "bg-blue-100 text-blue-800",
    "Completed": "bg-gray-100 text-gray-800",
    "Rescheduled": "bg-amber-100 text-amber-800",
    "Pending": "bg-purple-100 text-purple-800",
    "Cancelled": "bg-red-100 text-red-800",
  };

  // Get appropriate action button based on status
  const getActionButton = () => {
    switch(appointment.status) {
      case "Confirmed":
        return (
          <button 
            className="h-9 px-4 py-2 bg-[#4A90E2] text-white border border-[#4A90E2] rounded-md hover:bg-[#3A80D2]"
            onClick={() => onStatusUpdate(appointment.id, "Checked In")}
          >
            Check In
          </button>
        );
      case "Checked In":
        return (
          <button 
            className="h-9 px-4 py-2 bg-gray-600 text-white border border-gray-600 rounded-md hover:bg-gray-700"
            onClick={() => onStatusUpdate(appointment.id, "Completed")}
          >
            Complete
          </button>
        );
      case "Completed":
        return null;
      case "Rescheduled":
        return (
          <button 
            className="h-9 px-4 py-2 bg-[#4A90E2] text-white border border-[#4A90E2] rounded-md hover:bg-[#3A80D2]"
            onClick={() => onStatusUpdate(appointment.id, "Confirmed")}
          >
            Confirm
          </button>
        );
      case "Pending":
        return (
          <button 
            className="h-9 px-4 py-2 bg-[#4A90E2] text-white border border-[#4A90E2] rounded-md hover:bg-[#3A80D2]"
            onClick={() => onStatusUpdate(appointment.id, "Confirmed")}
          >
            Confirm
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="bg-[#4A90E2]/10 rounded-lg p-3 text-[#4A90E2]">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium text-[#333333]">{appointment.patient}</h3>
              <p className="text-sm text-[#666666]">{appointment.type} with {appointment.doctor}</p>
              <div className="flex items-center gap-4 mt-1">
                <div className="flex items-center text-sm text-[#666666]">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {appointment.date}
                </div>
                <div className="flex items-center text-sm text-[#666666]">
                  <Clock className="h-4 w-4 mr-1" />
                  {appointment.time} ({appointment.duration})
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex flex-col items-start">
              <span className="text-sm text-[#666666]">Department</span>
              <span className="font-medium text-[#333333]">{appointment.department}</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm text-[#666666]">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs ${statusColors[appointment.status]}`}>
                {appointment.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {appointment.status !== "Completed" && appointment.status !== "Cancelled" && (
                <button 
                  className="h-9 px-4 py-2 border border-gray-200 rounded-md bg-white hover:bg-gray-50"
                  onClick={() => onStatusUpdate(appointment.id, "Rescheduled")}
                >
                  Reschedule
                </button>
              )}
              {getActionButton()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

