"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CheckCircle, 
  Users, 
  Calendar, 
  Heart, 
  Shield, 
  Smartphone, 
  BarChart3, 
  Clock,
  Star,
  ArrowRight,
  Building2,
  UserPlus,
  Stethoscope,
  Package,
  CreditCard
} from "lucide-react"

export default function LandingPage() {
  const [selectedPlan, setSelectedPlan] = useState("professional")

  const features = [
    {
      title: "Appointment Scheduling",
      description: "Multi-view calendar with real-time availability and resource management",
      icon: Calendar
    },
    {
      title: "Patient Records",
      description: "Comprehensive pet profiles with medical history and visit tracking",
      icon: Heart
    },
    {
      title: "Clinical Workflows",
      description: "SOAP notes, prescriptions, and treatment planning",
      icon: Stethoscope
    },
    {
      title: "Inventory Management",
      description: "Track medications, supplies, and controlled substances",
      icon: Package
    },
    {
      title: "Billing & Payments",
      description: "Integrated invoicing with multiple payment methods",
      icon: CreditCard
    },
    {
      title: "Multi-Location Support",
      description: "Manage multiple clinics from a single dashboard",
      icon: Building2
    }
  ]

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Veterinarian",
      clinic: "Happy Paws Veterinary Clinic",
      content: "PetClinic Pro has transformed how we manage our practice. The intuitive interface and comprehensive features have saved us countless hours each week.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Clinic Manager",
      clinic: "City Animal Hospital",
      content: "The multi-location support is fantastic. We can now manage three clinics seamlessly from one platform. Highly recommended!",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Veterinary Technician",
      clinic: "Pet Care Center",
      content: "As a vet tech, I love how easy it is to access patient records and document visits. The mobile app is a game-changer!",
      rating: 5
    }
  ]

  const pricingPlans = [
    {
      id: "starter",
      name: "Starter",
      price: 49,
      description: "Perfect for small clinics",
      features: [
        "Up to 2 veterinarians",
        "500 patient records",
        "Basic scheduling",
        "Simple invoicing",
        "Email support"
      ],
      popular: false
    },
    {
      id: "professional",
      name: "Professional",
      price: 99,
      description: "Ideal for growing practices",
      features: [
        "Up to 5 veterinarians",
        "Unlimited patient records",
        "Advanced scheduling",
        "Complete billing system",
        "Inventory management",
        "Priority support",
        "Mobile app access"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 299,
      description: "For large veterinary groups",
      features: [
        "Unlimited veterinarians",
        "Multi-location support",
        "Advanced reporting",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options",
        "24/7 phone support"
      ],
      popular: false
    }
  ]

  const roles = [
    {
      title: "Clinic Owner",
      description: "Manage your entire practice with comprehensive reporting and business insights",
      icon: Building2,
      color: "bg-blue-100 text-blue-800"
    },
    {
      title: "Veterinarian",
      description: "Access clinical tools, patient records, and treatment workflows",
      icon: Stethoscope,
      color: "bg-green-100 text-green-800"
    },
    {
      title: "Receptionist",
      description: "Handle appointments, check-ins, and client communications",
      icon: Calendar,
      color: "bg-purple-100 text-purple-800"
    },
    {
      title: "Vet Technician",
      description: "Assist with patient care, documentation, and lab work",
      icon: Heart,
      color: "bg-orange-100 text-orange-800"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PetClinic Pro</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#roles" className="text-gray-600 hover:text-gray-900">Roles</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-blue-100 text-blue-800">
            🚀 New: Multi-location support now available
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Veterinary Practice with
            <span className="text-blue-600"> PetClinic Pro</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The complete veterinary practice management platform designed for modern clinics. 
            Streamline appointments, patient care, billing, and inventory—all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Schedule Demo
            </Button>
          </div>
          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-500">
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
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Run Your Clinic
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive features designed specifically for veterinary practices of all sizes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section id="roles" className="bg-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Role-Based Access for Every Team Member
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tailored interfaces and permissions designed for each role in your veterinary practice
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${role.color} flex items-center justify-center mb-4`}>
                    <role.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {role.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your practice size and needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 shadow-xl' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-2">
                    Most Popular
                  </Badge>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-blue-600' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Veterinary Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what veterinarians and clinic managers are saying about PetClinic Pro
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                    <div className="text-sm text-gray-500">{testimonial.clinic}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of veterinary professionals who trust PetClinic Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">PetClinic Pro</span>
              </div>
              <p className="text-gray-400">
                The complete veterinary practice management platform
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
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
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
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