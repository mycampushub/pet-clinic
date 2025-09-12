"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Heart, 
  Calendar, 
  FileText, 
  CreditCard, 
  Package, 
  Bell, 
  Video, 
  BarChart3, 
  Users, 
  Building2,
  Stethoscope,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Star
} from "lucide-react"

export default function Home() {
  const [email, setEmail] = useState("")

  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Multi-calendar view with real-time availability, online booking, and resource management."
    },
    {
      icon: Heart,
      title: "Patient Records",
      description: "Comprehensive pet profiles with medical history, vaccinations, and document attachments."
    },
    {
      icon: Stethoscope,
      title: "Clinical Workflow",
      description: "SOAP notes, treatment plans, prescriptions with interaction alerts, and lab orders."
    },
    {
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Integrated payments, insurance claims, and accounting exports."
    },
    {
      icon: Package,
      title: "Inventory Management",
      description: "Track medications, supplies, expiry dates, and controlled substances."
    },
    {
      icon: Bell,
      title: "Client Communication",
      description: "Automated reminders, two-way messaging, and client portal."
    },
    {
      icon: Video,
      title: "Telemedicine",
      description: "Secure video consultations and virtual visit management."
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Comprehensive reporting for operations, revenue, and compliance."
    }
  ]

  const roles = [
    {
      title: "Veterinarian",
      icon: Stethoscope,
      description: "Streamlined clinical workflows with SOAP notes, prescriptions, and treatment plans.",
      features: ["Patient exam templates", "Drug interaction alerts", "Lab order integration", "Telemedicine support"]
    },
    {
      title: "Receptionist",
      icon: Calendar,
      description: "Efficient appointment management and client communication.",
      features: ["Online booking widget", "Check-in/out flow", "Invoice management", "Client messaging"]
    },
    {
      title: "Clinic Manager",
      icon: Building2,
      description: "Complete oversight of operations, staff, and finances.",
      features: ["Multi-location support", "Staff scheduling", "Revenue analytics", "Inventory control"]
    },
    {
      title: "Pet Owner",
      icon: Users,
      description: "Easy access to pet records and services.",
      features: ["Online appointments", "Medical records access", "Payment processing", "Reminder notifications"]
    }
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Veterinarian",
      clinic: "Happy Paws Veterinary Clinic",
      content: "This platform has transformed how we manage our practice. The intuitive interface saves us hours each day.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Clinic Manager",
      clinic: "City Animal Hospital",
      content: "The multi-location support and comprehensive reporting have been game-changers for our growing practice.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Receptionist",
      clinic: "Family Vet Center",
      content: "Booking appointments and managing client communications has never been easier. Our clients love the online portal!",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PetClinic Pro</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#roles" className="text-gray-600 hover:text-gray-900">Roles</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.location.href = '/login'}>
                Sign In
              </Button>
              <Button onClick={() => window.location.href = '/signup'}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Enterprise-Grade Veterinary Practice Management
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Streamline Your Veterinary Practice with
            <span className="text-blue-600"> Smart Technology</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comprehensive clinic management platform designed for modern veterinary practices. 
            From single clinics to multi-location chains, manage everything with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8 py-3" onClick={() => window.location.href = '/signup'}>
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Schedule Demo
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              No credit card required
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              14-day free trial
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Your Practice Needs in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built by veterinarians and technology experts to streamline every aspect of your practice.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Designed for Every Role in Your Practice
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Role-specific interfaces and workflows tailored to optimize productivity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <role.icon className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {role.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Features for Growing Practices
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Scale from single clinic to multi-location chains with confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Building2 className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Multi-Location Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Manage multiple clinics from a single dashboard with centralized reporting and resource allocation.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Shield className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Compliance & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  HIPAA-compliant data handling, audit trails, and controlled substance tracking with full regulatory compliance.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Connect with payment gateways, lab systems, SMS providers, and accounting software seamlessly.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Veterinary Practices Nationwide
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join hundreds of veterinary practices that have transformed their operations.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.clinic}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of veterinary practices using PetClinic Pro to streamline their operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" onClick={() => window.location.href = '/signup'}>
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold">PetClinic Pro</span>
              </div>
              <p className="text-gray-400">
                Enterprise-grade veterinary practice management software.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PetClinic Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}