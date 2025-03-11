"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Plus, Filter, ChevronLeft, ChevronRight, User, FileText, Calendar, Clock, Activity } from 'lucide-react';
import { getPatients, getPatientStats, type Patient, type PatientStat } from "@/lib/api";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [patientStats, setPatientStats] = useState<PatientStat[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [insuranceFilter, setInsuranceFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [isInsuranceOpen, setIsInsuranceOpen] = useState(false);

useEffect(() => {
    const fetchPatients = async () => {
        setLoading(true);
        try {
            const data =  await getPatients();
            setPatients(data);
            setFilteredPatients(data);
        } catch (error) {
            console.error("Error fetching patients:", error)
        } finally {
            setLoading(false);
        }
    };
    fetchPatients();
}, []);

// Fetch patients stats
useEffect(() => {
    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const data = await getPatientStats();
            setPatientStats(data);

        } catch (error) {
            console.error("Error fetching patients stats:", error);
        } finally {
            setStatsLoading(false);
        }
    };
    fetchStats();
}, []);



// Handle tab changes
useEffect(() => {
    const fetchFilteredPatients = async () => {
        setLoading(true);
        try {
            let data;
            if (activeTab === "active") {
                data = await getPatients("active");

            } else if (activeTab === "inactive") {
                data = await getPatients("inactive")
            } else {
                data = await getPatients();
            }
            setPatients(data);
            applyFilters(data);
    } catch (error) {
        console.error("Error fetching filtered patients:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchFilteredPatients();
}, [activeTab]);

// Apply search aand insurance fillteres

const applyFilters = (data: Patient[]) => {
    let filtered = [...data];

    // Apply search filter
    if (searchQuery) {
        const query = searchQuery.toLocaleLowerCase();
        filtered = filtered.filter(
            patient => 
                patient.name.toLowerCase().includes(query) ||
            patient.id.toLowerCase().includes(query) ||
            patient.email.toLowerCase().includes(query)
        );
    }
    // Apply insurance filter
    if (insuranceFilter !== "all") {
        filtered = filtered.filter(
            patient => patient.insurance.toLowerCase() === insuranceFilter.toLowerCase()
        );
    }
    setFilteredPatients(filtered);
};

// Handle search input chnage
const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(patients);

};

// Handle insurance filter change

const handleInsuranceChange = (value: string) => {
    setInsuranceFilter(value);
    setIsInsuranceOpen(false);
    applyFilters(patients)
};

// Render stat cards with loading state
const renderStatCards = () => {
    if (statsLoading) {
        return Array(4).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        ));
    }


return patientStats.map((stat, index) => {
    // Map icon string to component

    const IconComponent = 
        stat.icon === "User" ? User :
        stat.icon === "Plus" ? Plus :
        stat.icon === "Calendar" ? Calendar : Clock;


        return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-4">
            <div className={`p-3 rounded-full ${stat.color}`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-[#666666]">{stat.title}</p>
              <p className="text-2xl font-medium text-[#333333]">{stat.value}</p>
            </div>
          </div>
        )
})
}


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
            <Link href="/dashboard" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
              Dashboard
            </Link>
            <Link href="/patients" className="text-[#4A90E2] font-medium transition-colors">
              Patients
            </Link>
            <Link href="/appointments" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
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
            <h1 className="text-3xl font-light text-[#333333]">Patient Management</h1>
            <p className="text-[#666666]">View and manage patient information</p>
          </div>
          <button className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white px-4 py-2 rounded-md flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add New Patient
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {renderStatCards()}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white border rounded-md flex">
            <button 
              onClick={() => setActiveTab("all")} 
              className={`px-4 py-2 text-sm font-medium ${activeTab === "all" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} rounded-l-md transition-colors`}
            >
              All Patients
            </button>
            <button 
              onClick={() => setActiveTab("active")} 
              className={`px-4 py-2 text-sm font-medium ${activeTab === "active" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} transition-colors`}
            >
              Active
            </button>
            <button 
              onClick={() => setActiveTab("inactive")} 
              className={`px-4 py-2 text-sm font-medium ${activeTab === "inactive" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} transition-colors`}
            >
              Inactive
            </button>
            <button 
              onClick={() => setActiveTab("recent")} 
              className={`px-4 py-2 text-sm font-medium ${activeTab === "recent" ? "bg-[#4A90E2] text-white" : "text-gray-700 hover:text-[#4A90E2]"} rounded-r-md transition-colors`}
            >
              Recently Added
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
                      placeholder="Search patients..." 
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <button 
                        onClick={() => setIsInsuranceOpen(!isInsuranceOpen)}
                        className="w-[180px] bg-white border border-gray-200 rounded-md px-4 py-2 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                      >
                        <span>{insuranceFilter === "all" ? "All Insurance" : insuranceFilter}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${isInsuranceOpen ? 'rotate-180' : ''}`}>
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>
                      
                      {isInsuranceOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg">
                          <div className="py-1">
                            <button 
                              onClick={() => handleInsuranceChange("all")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              All Insurance
                            </button>
                            <button 
                              onClick={() => handleInsuranceChange("medicare")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Medicare
                            </button>
                            <button 
                              onClick={() => handleInsuranceChange("bluecross")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              BlueCross
                            </button>
                            <button 
                              onClick={() => handleInsuranceChange("aetna")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Aetna
                            </button>
                            <button 
                              onClick={() => handleInsuranceChange("unitedhealth")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              UnitedHealth
                            </button>
                            <button 
                              onClick={() => handleInsuranceChange("cigna")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Cigna
                            </button>
                            <button 
                              onClick={() => handleInsuranceChange("humana")}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                              Humana
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

                {/* Patients Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Patient ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Age</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gender</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Visit</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Insurance</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {loading ? (
                          // Loading skeleton
                          Array(5).fill(0).map((_, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div></td>
                              <td className="px-4 py-3"><div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div></td>
                              <td className="px-4 py-3"><div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div></td>
                              <td className="px-4 py-3"><div className="h-4 w-16 bg-gray-200 animate-pulse rounded"></div></td>
                              <td className="px-4 py-3">
                                <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mb-1"></div>
                                <div className="h-3 w-32 bg-gray-200 animate-pulse rounded"></div>
                              </td>
                              <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></td>
                              <td className="px-4 py-3"><div className="h-6 w-16 bg-gray-200 animate-pulse rounded-full"></div></td>
                              <td className="px-4 py-3"><div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div></td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-md"></div>
                                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-md"></div>
                                  <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-md"></div>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : filteredPatients.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                              No patients found matching your criteria.
                            </td>
                          </tr>
                        ) : (
                          filteredPatients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-gray-900">{patient.id}</td>
                              <td className="px-4 py-3 text-gray-900">{patient.name}</td>
                              <td className="px-4 py-3 text-gray-900">{patient.age}</td>
                              <td className="px-4 py-3 text-gray-900">{patient.gender}</td>
                              <td className="px-4 py-3">
                                <div className="text-gray-900">{patient.phone}</div>
                                <div className="text-sm text-gray-500">{patient.email}</div>
                              </td>
                              <td className="px-4 py-3 text-gray-900">{patient.lastVisit}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  patient.status === "Active" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {patient.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-gray-900">{patient.insurance}</td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <button className="p-1 rounded-md hover:bg-gray-100">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="sr-only">View Records</span>
                                  </button>
                                  <button className="p-1 rounded-md hover:bg-gray-100">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <span className="sr-only">Schedule Appointment</span>
                                  </button>
                                  <button className="p-1 rounded-md hover:bg-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>
                                    <span className="sr-only">More Options</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-500">
                    {loading 
                      ? "Loading patients..." 
                      : `Showing ${filteredPatients.length > 0 ? "1" : "0"}-${filteredPatients.length} of ${filteredPatients.length} patients`
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
                    {filteredPatients.length > 7 && (
                      <button 
                        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        2
                      </button>
                    )}
                    {filteredPatients.length > 14 && (
                      <button 
                        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        3
                      </button>
                    )}
                    {filteredPatients.length > 21 && <span>...</span>}
                    {filteredPatients.length > 21 && (
                      <button 
                        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                      >
                        {Math.ceil(filteredPatients.length / 7)}
                      </button>
                    )}
                    <button 
                      className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || filteredPatients.length <= 7}
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next Page</span>
                    </button>
                  </div>
                </div>
              </>
            )}
            
            {activeTab === "active" && (
              <>
                {loading ? (
                  <div className="p-8 flex flex-col items-center justify-center">
                    <div className="flex gap-2 items-center mb-4">
                      <div className="h-5 w-5 rounded-full bg-blue-200 animate-pulse"></div>
                      <div className="h-5 w-5 rounded-full bg-blue-300 animate-pulse"></div>
                      <div className="h-5 w-5 rounded-full bg-blue-400 animate-pulse"></div>
                    </div>
                    <p className="text-gray-500">Loading active patients...</p>
                  </div>
                ) : (
                  <div>
                    {/* Search */}
                    <div className="relative mb-6">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input 
                        type="text"
                        placeholder="Search active patients..." 
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
                        value={searchQuery}
                        onChange={handleSearchChange}
                      />
                    </div>
                    
                    {/* Active Patients Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Patient ID</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Age</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gender</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Visit</th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Insurance</th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {filteredPatients.length === 0 ? (
                              <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                  No active patients found matching your criteria.
                                </td>
                              </tr>
                            ) : (
                              filteredPatients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 font-medium text-gray-900">{patient.id}</td>
                                  <td className="px-4 py-3 text-gray-900">{patient.name}</td>
                                  <td className="px-4 py-3 text-gray-900">{patient.age}</td>
                                  <td className="px-4 py-3 text-gray-900">{patient.gender}</td>
                                  <td className="px-4 py-3">
                                    <div className="text-gray-900">{patient.phone}</div>
                                    <div className="text-sm text-gray-500">{patient.email}</div>
                                  </td>
                                  <td className="px-4 py-3 text-gray-900">{patient.lastVisit}</td>
                                  <td className="px-4 py-3 text-gray-900">{patient.insurance}</td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                      <button className="p-1 rounded-md hover:bg-gray-100">
                                        <FileText className="h-4 w-4 text-gray-500" />
                                        <span className="sr-only">View Records</span>
                                      </button>
                                      <button className="p-1 rounded-md hover:bg-gray-100">
                                        <Calendar className="h-4 w-4 text-gray-500" />
                                        <span className="sr-only">Schedule Appointment</span>
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {activeTab === "inactive" && (
              <>
                {loading ? (
                  <div className="p-8 flex flex-col items-center justify-center">
                    <div className="flex gap-2 items-center mb-4">
                      <div className="h-5 w-5 rounded-full bg-blue-200 animate-pulse"></div>
                      <div className="h-5 w-5 rounded-full bg-blue-300 animate-pulse"></div>
                      <div className="h-5 w-5 rounded-full bg-blue-400 animate-pulse"></div>
                    </div>
                    <p className="text-gray-500">Loading inactive patients...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Patient ID</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Age</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gender</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Contact</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Last Visit</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Insurance</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredPatients.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                No inactive patients found.
                              </td>
                            </tr>
                          ) : (
                            filteredPatients.map((patient) => (
                              <tr key={patient.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-gray-900">{patient.id}</td>
                                <td className="px-4 py-3 text-gray-900">{patient.name}</td>
                                <td className="px-4 py-3 text-gray-900">{patient.age}</td>
                                <td className="px-4 py-3 text-gray-900">{patient.gender}</td>
                                <td className="px-4 py-3">
                                  <div className="text-gray-900">{patient.phone}</div>
                                  <div className="text-sm text-gray-500">{patient.email}</div>
                                </td>
                                <td className="px-4 py-3 text-gray-900">{patient.lastVisit}</td>
                                <td className="px-4 py-3 text-gray-900">{patient.insurance}</td>
                                <td className="px-4 py-3 text-right">
                                  <button className="px-3 py-1 text-sm rounded-md text-green-600 border border-green-600 hover:bg-green-50">
                                    Reactivate
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {activeTab === "recent" && (
              <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
                <p>Recently added patients view will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

