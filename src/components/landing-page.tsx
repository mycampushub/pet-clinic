"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Users, 
  Package, 
  FileText, 
  Heart, 
  Shield, 
  Zap, 
  Star,
  Check,
  ArrowRight,
  Stethoscope,
  Building2,
  UserCheck,
  Clock,
  CreditCard,
  BarChart3,
  Bell,
  Smartphone,
  Cloud,
  Lock
} from "lucide-react"

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
  category: string
}

interface Testimonial {
  name: string
  role: string
  clinic: string
  content: string
  rating: number
}

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular?: boolean
  cta: string
}

export function LandingPage() {
  const [email, setEmail] = useState("")
  const [selectedRole, setSelectedRole] = useState("")

  const features: Feature[] = [
    {
      title: "Appointment Scheduling",
      description: "Multi-provider calendar with real-time availability and automated reminders",
      icon: <Calendar className="h-6 w-6" />,
      category: "Scheduling"
    },
    {
      title: "Patient Management",
      description: "Comprehensive pet and owner records with medical history tracking",
      icon: <Users className="h-6 w-6" />,
      category: "Records"
    },
    {
      title: "Inventory Control",
      description: "Track medications, supplies, and controlled substances with expiry alerts",
      icon: <Package className="h-6 w-6" />,
      category: "Inventory"
    },
    {
      title: "Clinical Notes",
      description: "SOAP notes, treatment plans, and digital record keeping",
      icon: <FileText className="h-6 w-6" />,
      category: "Clinical"
    },
    {
      title: "Billing & Invoicing",
      description: "Automated invoicing, payment processing, and financial reporting",
      icon: <CreditCard className="h-6 w-6" />,
      category: "Billing"
    },
    {
      title: "Telemedicine",
      description: "Virtual consultations and remote patient monitoring",
      icon: <Smartphone className="h-6 w-6" />,
      category: "Telehealth"
    }
  ]

  const testimonials: Testimonial[] = [
    {
      name: "Dr. Sarah Johnson",
      role: "Veterinarian & Clinic Owner",
      clinic: "Happy Paws Veterinary Clinic",
      content: "PetClinic Pro has transformed our practice. The appointment scheduling alone saves us 10 hours per week, and the inventory management has eliminated stockouts completely.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Practice Manager",
      clinic: "City Animal Hospital",
      content: "The role-based access control is perfect for our multi-doctor clinic. Each staff member has exactly the access they need, and the audit trails give us peace of mind for compliance.",
      rating: 5
    },
    {
      name: "Lisa Rodriguez",
      role: "Head Receptionist",
      clinic: "Paws & Claws Veterinary Center",
      content: "As a receptionist, I love how intuitive the system is. Checking in patients, managing appointments, and processing payments has never been easier.",
      rating: 4
    }
  ]

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small practices just getting started",
      features: [
        "Up to 2 veterinarians",
        "Appointment scheduling",
        "Basic patient records",
        "Email support",
        "Mobile app access"
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for growing practices with multiple staff",
      features: [
        "Up to 5 veterinarians",
        "All Starter features",
        "Inventory management",
        "Billing & invoicing",
        "SMS reminders",
        "Priority support",
        "Advanced reporting"
      ],
      popular: true,
      cta: "Most Popular"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For multi-location clinics and hospital groups",
      features: [
        "Unlimited veterinarians",
        "All Professional features",
        "Multi-location support",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options",
        "API access",
        "On-premise deployment option"
      ],
      cta: "Contact Sales"
    }
  ]

  const roles = [
    { value: "receptionist", label: "Receptionist", description: "Front desk staff, appointment management" },
    { value: "veterinarian", label: "Veterinarian", description: "Medical professionals, clinical work" },
    { value: "vet-tech", label: "Vet Tech", description: "Technical staff, assistance" },
    { value: "pharmacist", label: "Pharmacist", description: "Medication management" },
    { value: "manager", label: "Practice Manager", description: "Clinic administration" },
    { value: "owner", label: "Clinic Owner", description: "Business owners, oversight" }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Star className="h-4 w-4 mr-1" />
                Trusted by 500+ Veterinary Clinics
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Streamline Your Veterinary Practice with 
                <span className="text-blue-600"> PetClinic Pro</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                The complete practice management solution designed specifically for veterinary clinics. 
                Manage appointments, patients, billing, and inventory—all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Schedule Demo
                </Button>
              </div>
              <div className="flex items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Get Started in Minutes</h3>
                  <p className="text-gray-600">Tell us about your role to see personalized features</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Role
                    </label>
                    <Select value={selectedRole} onValueChange={setSelectedRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            <div>
                              <div className="font-medium">{role.label}</div>
                              <div className="text-xs text-gray-500">{role.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="you@clinic.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button className="w-full" size="lg">
                    Create Your Account
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything Your Clinic Needs in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From appointment scheduling to inventory management, PetClinic Pro provides all the tools 
              you need to run your veterinary practice efficiently.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Scheduling">Scheduling</TabsTrigger>
              <TabsTrigger value="Records">Records</TabsTrigger>
              <TabsTrigger value="Clinical">Clinical</TabsTrigger>
              <TabsTrigger value="Billing">Billing</TabsTrigger>
              <TabsTrigger value="Telehealth">Telehealth</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-12">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                          {feature.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {feature.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Role-Based Access for Every Team Member
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each role gets exactly the access they need—no more, no less. 
              Maintain security while giving your team the tools to succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roles.map((role) => (
              <Card key={role.value} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{role.label}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {role.description}
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Role-specific dashboard</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Relevant tools and features</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Appropriate access levels</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Veterinary Professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what clinic owners, veterinarians, and staff are saying about PetClinic Pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 italic">
                    "{testimonial.content}"
                  </p>
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

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that fits your practice size. All plans include our core features 
              with no hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <Card key={index} className={`relative ${
                tier.popular ? "border-blue-500 shadow-xl scale-105" : ""
              }`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-gray-500">{tier.period}</span>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Button 
                    className={`w-full ${tier.popular ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                    variant={tier.popular ? "default" : "outline"}
                  >
                    {tier.cta}
                  </Button>
                  <ul className="space-y-3">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join hundreds of veterinary clinics that have streamlined their operations with PetClinic Pro.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Your Free Trial
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-blue-600">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PetClinic Pro</h3>
              <p className="text-gray-400">
                The complete practice management solution for modern veterinary clinics.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Training</a></li>
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