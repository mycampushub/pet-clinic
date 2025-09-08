"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Building2, 
  Stethoscope, 
  Calendar, 
  Heart, 
  Package, 
  CreditCard,
  Users,
  BarChart3,
  Shield,
  ArrowLeft,
  CheckCircle,
  UserPlus
} from "lucide-react"

type UserRole = "CLINIC_OWNER" | "VETERINARIAN" | "RECEPTIONIST" | "VET_TECH" | "PHARMACIST" | "MANAGER"

interface Clinic {
  id: string
  name: string
  address: string
  role: UserRole
}

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin")
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [clinicName, setClinicName] = useState("")
  const [selectedClinic, setSelectedClinic] = useState<string>("")

  // Sample clinics data
  const clinics: Clinic[] = [
    { id: "1", name: "Happy Paws Veterinary Clinic", address: "123 Main St, Anytown", role: "CLINIC_OWNER" },
    { id: "2", name: "City Animal Hospital", address: "456 Oak Ave, Somewhere", role: "VETERINARIAN" },
    { id: "3", name: "Pet Care Center", address: "789 Pine Rd, Nowhere", role: "RECEPTIONIST" },
    { id: "4", name: "Emergency Vet Services", address: "321 Elm St, Everywhere", role: "VET_TECH" }
  ]

  const roleDescriptions = {
    CLINIC_OWNER: {
      title: "Clinic Owner",
      description: "Manage your entire veterinary practice with full access to all features",
      icon: Building2,
      color: "bg-blue-100 text-blue-800",
      features: ["Full practice management", "Financial reporting", "Staff management", "Multi-location support"]
    },
    VETERINARIAN: {
      title: "Veterinarian",
      description: "Access clinical tools, patient records, and treatment workflows",
      icon: Stethoscope,
      color: "bg-green-100 text-green-800",
      features: ["Patient records", "Clinical workflows", "Prescriptions", "Lab orders"]
    },
    RECEPTIONIST: {
      title: "Receptionist",
      description: "Handle appointments, check-ins, and client communications",
      icon: Calendar,
      color: "bg-purple-100 text-purple-800",
      features: ["Appointment scheduling", "Client communication", "Check-in/out", "Billing"]
    },
    VET_TECH: {
      title: "Veterinary Technician",
      description: "Assist with patient care, documentation, and lab work",
      icon: Heart,
      color: "bg-orange-100 text-orange-800",
      features: ["Patient care", "Medical records", "Lab procedures", "Inventory management"]
    },
    PHARMACIST: {
      title: "Pharmacist",
      description: "Manage medications, prescriptions, and inventory",
      icon: Package,
      color: "bg-red-100 text-red-800",
      features: ["Prescription management", "Inventory control", "Dispensing", "Compliance"]
    },
    MANAGER: {
      title: "Practice Manager",
      description: "Oversee operations, staff, and business performance",
      icon: BarChart3,
      color: "bg-indigo-100 text-indigo-800",
      features: ["Staff management", "Performance metrics", "Operations", "Reporting"]
    }
  }

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)
    setStep(2)
  }

  const handleClinicSelect = (clinicId: string) => {
    setSelectedClinic(clinicId)
    setStep(3)
  }

  const handleAuth = () => {
    console.log("Authentication:", { authMode, email, selectedRole, selectedClinic, clinicName })
    // Here you would implement actual authentication logic
  }

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What's your role?</h2>
        <p className="text-gray-600">Select your role to get started with PetClinic Pro</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(roleDescriptions).map(([role, desc]) => (
          <Card 
            key={role} 
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
            onClick={() => handleRoleSelect(role as UserRole)}
          >
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-full ${desc.color} flex items-center justify-center mx-auto mb-4`}>
                <desc.icon className="h-8 w-8" />
              </div>
              <CardTitle className="text-lg">{desc.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mb-4">
                {desc.description}
              </CardDescription>
              <div className="space-y-2">
                {desc.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderClinicSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Select Your Clinic</h2>
        <p className="text-gray-600">Choose your clinic to continue</p>
      </div>
      
      {authMode === "signup" ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Clinic</CardTitle>
            <CardDescription>Set up your veterinary practice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input
                id="clinicName"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="Enter clinic name"
              />
            </div>
            <Button 
              className="w-full" 
              onClick={() => setStep(3)}
              disabled={!clinicName}
            >
              Create Clinic
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {clinics.map((clinic) => (
            <Card 
              key={clinic.id} 
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => handleClinicSelect(clinic.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{clinic.name}</h3>
                    <p className="text-sm text-gray-600">{clinic.address}</p>
                    <Badge className={`mt-2 ${roleDescriptions[clinic.role].color}`}>
                      {roleDescriptions[clinic.role].title}
                    </Badge>
                  </div>
                  <ArrowLeft className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => setStep(1)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Role Selection
      </Button>
    </div>
  )

  const renderAuthForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {authMode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <p className="text-gray-600">
          {selectedRole && roleDescriptions[selectedRole].title} • {clinicName || clinics.find(c => c.id === selectedClinic)?.name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{authMode === "signin" ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>
            {authMode === "signin" 
              ? "Sign in to access your dashboard" 
              : "Create your account to get started"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          {authMode === "signup" && (
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
              />
            </div>
          )}
          
          <Button 
            className="w-full" 
            onClick={handleAuth}
            disabled={!email || !password}
          >
            {authMode === "signin" ? "Sign In" : "Create Account"}
          </Button>
        </CardContent>
      </Card>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}
          <button
            className="text-blue-600 hover:underline ml-1"
            onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}
          >
            {authMode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => setStep(authMode === "signup" ? 1 : 2)}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">PetClinic Pro</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {authMode === "signin" ? "Welcome Back" : "Get Started"}
          </h1>
          <p className="text-gray-600">
            {authMode === "signin" 
              ? "Sign in to manage your veterinary practice" 
              : "Join thousands of veterinary professionals"
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Auth Mode Toggle */}
        <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "signin" | "signup")} className="mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Main Content */}
        <Card className="p-8">
          {step === 1 && renderRoleSelection()}
          {step === 2 && renderClinicSelection()}
          {step === 3 && renderAuthForm()}
        </Card>

        {/* Security Badge */}
        <div className="text-center mt-6">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Your data is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  )
}