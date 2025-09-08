"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Stethoscope, 
  Calendar, 
  Package, 
  FileText, 
  Settings,
  Shield,
  CheckCircle,
  ArrowRight
} from "lucide-react"

interface RoleCardProps {
  role: {
    title: string
    icon: any
    description: string
    features: string[]
    color: string
    accessLevel: string
  }
}

function RoleCard({ role }: RoleCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 ${role.color} rounded-xl flex items-center justify-center`}>
            <role.icon className="h-7 w-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg">{role.title}</CardTitle>
            <Badge variant="outline" className="text-xs mt-1">
              {role.accessLevel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600 text-sm">{role.description}</p>
        <div className="space-y-2">
          {role.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              {feature}
            </div>
          ))}
        </div>
        <Button variant="outline" className="w-full mt-4">
          Learn More
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export function RolesSection() {
  const roles = [
    {
      title: "Receptionist",
      icon: Calendar,
      description: "Front desk operations and client management",
      features: [
        "Appointment scheduling",
        "Client check-in/out",
        "Billing and payments",
        "Basic patient records"
      ],
      color: "bg-blue-600",
      accessLevel: "Standard Access"
    },
    {
      title: "Veterinarian",
      icon: Stethoscope,
      description: "Clinical care and medical decision making",
      features: [
        "Complete medical records",
        "SOAP notes and treatment plans",
        "Prescription management",
        "Lab orders and results"
      ],
      color: "bg-green-600",
      accessLevel: "Clinical Access"
    },
    {
      title: "Vet Technician",
      icon: User,
      description: "Support clinical staff and assist veterinarians",
      features: [
        "Patient vitals recording",
        "Assist with procedures",
        "Lab sample collection",
        "Medical record updates"
      ],
      color: "bg-purple-600",
      accessLevel: "Clinical Support"
    },
    {
      title: "Pharmacist",
      icon: Package,
      description: "Medication and inventory management",
      features: [
        "Inventory control",
        "Prescription dispensing",
        "Order management",
        "Expiry tracking"
      ],
      color: "bg-orange-600",
      accessLevel: "Inventory Access"
    },
    {
      title: "Clinic Manager",
      icon: Settings,
      description: "Practice administration and oversight",
      features: [
        "Staff management",
        "Financial reporting",
        "Clinic settings",
        "Compliance monitoring"
      ],
      color: "bg-red-600",
      accessLevel: "Administrative Access"
    },
    {
      title: "Practice Owner",
      icon: FileText,
      description: "Complete practice control and business insights",
      features: [
        "Full system access",
        "Business analytics",
        "Multi-location management",
        "Strategic planning tools"
      ],
      color: "bg-indigo-600",
      accessLevel: "Full Access"
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4">Role-Based Access</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Designed for Every Team Member
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tailored access levels ensure each team member has the tools they need 
            while maintaining security and compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {roles.map((role, index) => (
            <RoleCard key={index} role={role} />
          ))}
        </div>

        {/* Security Features */}
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Enterprise-Grade Security
                </h3>
                <p className="text-gray-600 mb-6">
                  Our role-based access control system ensures data security while 
                  providing the flexibility your practice needs.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">HIPAA compliant data protection</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Granular permission controls</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Complete audit trails</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-gray-700">Multi-factor authentication</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Access Control Features:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Custom role creation and permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Time-based access restrictions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    IP address whitelisting
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Session timeout controls
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Remote access revocation
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}