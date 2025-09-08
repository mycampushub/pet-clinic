"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Stethoscope, 
  Users, 
  Package, 
  CreditCard, 
  FileText,
  Bell,
  BarChart3,
  Shield,
  Smartphone,
  Database,
  Zap,
  CheckCircle
} from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      category: "Appointment Management",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      items: [
        "Smart scheduling with resource optimization",
        "Online booking for pet owners",
        "Automated reminders and notifications",
        "Multi-provider calendar management",
        "Waitlist and walk-in handling"
      ]
    },
    {
      category: "Clinical Workflow",
      icon: Stethoscope,
      color: "text-green-600",
      bgColor: "bg-green-100",
      items: [
        "Comprehensive SOAP notes",
        "Treatment plans and templates",
        "Vital signs tracking",
        "Medical history management",
        "Clinical decision support"
      ]
    },
    {
      category: "Patient Records",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      items: [
        "Digital patient profiles",
        "Owner management and communication",
        "Vaccination records and reminders",
        "Allergy and medication tracking",
        "Document attachment and imaging"
      ]
    },
    {
      category: "Inventory & Pharmacy",
      icon: Package,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      items: [
        "Real-time stock tracking",
        "Controlled substances compliance",
        "Expiry date management",
        "Purchase order automation",
        "Barcode scanning integration"
      ]
    },
    {
      category: "Billing & Payments",
      icon: CreditCard,
      color: "text-red-600",
      bgColor: "bg-red-100",
      items: [
        "Integrated payment processing",
        "Insurance claims management",
        "Automated invoicing",
        "Multi-payment methods support",
        "Financial reporting and analytics"
      ]
    },
    {
      category: "Communication",
      icon: Bell,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      items: [
        "Two-way messaging with clients",
        "Automated appointment reminders",
        "Email and SMS templates",
        "Client portal access",
        "Marketing campaign tools"
      ]
    }
  ]

  const platformFeatures = [
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and business intelligence for data-driven decisions"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "HIPAA-compliant data protection with role-based access control"
    },
    {
      icon: Smartphone,
      title: "Mobile Access",
      description: "Full functionality on any device with offline capability support"
    },
    {
      icon: Database,
      title: "Cloud Infrastructure",
      description: "Scalable, reliable cloud hosting with automatic backups"
    },
    {
      icon: Zap,
      title: "Integration Ready",
      description: "Connect with labs, pharmacies, payment gateways, and more"
    },
    {
      icon: FileText,
      title: "Regulatory Compliance",
      description: "Built-in compliance for controlled substances and medical records"
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Comprehensive Solution
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Everything Your Clinic Needs
          </h2>
          <p className="text-xl text-gray-600">
            From appointment scheduling to inventory management, PetClinic Pro provides all the tools 
            you need to run your veterinary practice efficiently and compliantly.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardHeader>
                <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feature.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Platform Features */}
        <div className="bg-gray-50 rounded-3xl p-12 mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Platform
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for modern veterinary practices with scalability, security, and compliance at its core
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Practice?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of veterinary practices already using PetClinic Pro
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}