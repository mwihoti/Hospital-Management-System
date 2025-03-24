import type React from "react"
import Link from "next/link"
import { Activity, User, Calendar, FileText, CreditCard, Package, ChevronRight } from "lucide-react"

export default function Home() {
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
            
            <button className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white px-4 py-2 rounded-md transition-colors">
            <Link href="/auth/login" className="text-[#333333] hover:text-[#4A90E2] transition-colors">
              Login
            </Link>
            </button>
          </nav>
          <button className="md:hidden p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-menu"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#4A90E2] to-[#2CC4CB] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-light mb-4">Modern Healthcare Management Solution</h1>
            <p className="text-xl opacity-90 mb-8">
              Streamline your hospital operations with our comprehensive management system
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-[#4A90E2] hover:bg-gray-100 px-6 py-2 rounded-md transition-colors">
                Get Started
              </button>
              <button className="border border-white text-white hover:bg-white/10 px-6 py-2 rounded-md transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-light text-center mb-12 text-[#333333]">Core Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<User className="h-10 w-10 text-[#4A90E2]" />}
            title="Patient Management"
            description="Register and manage patient profiles, medical history, and contact information with ease."
            href="/patient/dashboard"
          />
          <FeatureCard
            icon={<Calendar className="h-10 w-10 text-[#4A90E2]" />}
            title="Appointment Scheduling"
            description="Intuitive calendar interface with drag-and-drop scheduling and automated reminders."
            href="/patient/appointments"
          />
          <FeatureCard
            icon={<User className="h-10 w-10 text-[#4A90E2]" />}
            title="Staff Management"
            description="Manage staff profiles, credentials, shifts, and department assignments."
            href="/admin/staff"
          />
          <FeatureCard
            icon={<FileText className="h-10 w-10 text-[#4A90E2]" />}
            title="Medical Records"
            description="Digital health records with test results, prescriptions, and treatment history."
            href="/patient/medical-records"
          />
          <FeatureCard
            icon={<CreditCard className="h-10 w-10 text-[#4A90E2]" />}
            title="Billing & Payments"
            description="Streamlined billing with insurance processing and multiple payment methods."
            href="patient/billing"
          />
          
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-[#E9ECEF] py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12 text-[#333333]">Trusted by Healthcare Professionals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="This system has transformed how we manage patient care. The intuitive interface has made our staff more efficient."
              author="Dr. Sarah Johnson"
              role="Chief Medical Officer"
            />
            <TestimonialCard
              quote="The appointment scheduling module alone has saved us countless hours and significantly reduced no-shows."
              author="Mark Williams"
              role="Hospital Administrator"
            />
            <TestimonialCard
              quote="Patient satisfaction has improved dramatically since implementing the patient portal and chatbot features."
              author="Lisa Chen"
              role="Patient Services Director"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4 text-center">
        <h2 className="text-3xl font-light mb-4 text-[#333333]">Ready to transform your healthcare management?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-[#666666]">
          Join thousands of healthcare providers who have streamlined their operations with our system.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="bg-[#4A90E2] hover:bg-[#3A80D2] text-white px-6 py-2 text-lg rounded-md transition-colors">
            Request Demo
          </button>
          <button className="border border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2]/10 px-6 py-2 text-lg rounded-md transition-colors">
            Contact Sales
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#333333] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-[#4A90E2]" />
                <h3 className="text-xl font-light">MediCare</h3>
              </div>
              <p className="text-gray-300">
                Modern healthcare management solution for hospitals and clinics of all sizes.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    HIPAA Compliance
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-white transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} MediCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-medium mb-2 text-[#333333]">{title}</h3>
        <p className="text-[#666666] mb-4">{description}</p>
        <Link href={href} className="text-[#4A90E2] hover:text-[#3A80D2] font-medium flex items-center">
          Learn more
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <svg
          className="h-8 w-8 text-[#4A90E2] mb-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5"></path>
          <path d="M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5"></path>
        </svg>
        <p className="text-[#666666] mb-4">{quote}</p>
        <div>
          <p className="font-medium text-[#333333]">{author}</p>
          <p className="text-[#666666]">{role}</p>
        </div>
      </div>
    </div>
  )
}

