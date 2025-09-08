"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/lib/auth"
import { UserRole } from "@/types/auth"
import { Eye, EyeOff, Building2, UserCheck, Lock, Mail, AlertCircle } from "lucide-react"

export function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<UserRole>("RECEPTIONIST")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const success = await login(email, password, selectedRole)
      if (!success) {
        setError("Invalid email or password. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const roleOptions = [
    {
      value: "RECEPTIONIST" as UserRole,
      label: "Receptionist",
      description: "Front desk staff, appointment management",
      icon: <Building2 className="h-4 w-4" />
    },
    {
      value: "VETERINARIAN" as UserRole,
      label: "Veterinarian",
      description: "Medical professionals, clinical work",
      icon: <UserCheck className="h-4 w-4" />
    },
    {
      value: "VET_TECH" as UserRole,
      label: "Veterinary Technician",
      description: "Technical staff, assistance",
      icon: <UserCheck className="h-4 w-4" />
    },
    {
      value: "PHARMACIST" as UserRole,
      label: "Pharmacist",
      description: "Medication management",
      icon: <Lock className="h-4 w-4" />
    },
    {
      value: "MANAGER" as UserRole,
      label: "Practice Manager",
      description: "Clinic administration",
      icon: <Building2 className="h-4 w-4" />
    },
    {
      value: "ADMIN" as UserRole,
      label: "System Administrator",
      description: "Full system access",
      icon: <Lock className="h-4 w-4" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4">
            <div className="text-white text-2xl font-bold">PC</div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PetClinic Pro</h1>
          <p className="text-gray-600 mt-2">Sign in to your practice dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your clinic dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@clinic.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Select Your Role</Label>
                <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div className="flex items-center gap-2">
                          {role.icon}
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-xs text-gray-500">{role.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <div className="h-4 w-4 mr-2 bg-blue-600 rounded" />
                  Google
                </Button>
                <Button variant="outline" className="w-full">
                  <div className="h-4 w-4 mr-2 bg-gray-800 rounded" />
                  Microsoft
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Demo Credentials</CardTitle>
            <CardDescription>
              Use any email and password (6+ characters) to test the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="receptionist" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="receptionist">Receptionist</TabsTrigger>
                <TabsTrigger value="veterinarian">Veterinarian</TabsTrigger>
                <TabsTrigger value="manager">Manager</TabsTrigger>
              </TabsList>
              
              <TabsContent value="receptionist" className="mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">receptionist@demo.com</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Password:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">password</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Access:</span>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">Appointments</Badge>
                      <Badge variant="outline" className="text-xs">Patients</Badge>
                      <Badge variant="outline" className="text-xs">Billing</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="veterinarian" className="mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">vet@demo.com</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Password:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">password</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Access:</span>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">Clinical</Badge>
                      <Badge variant="outline" className="text-xs">Prescriptions</Badge>
                      <Badge variant="outline" className="text-xs">Medical Records</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="manager" className="mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Email:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">manager@demo.com</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Password:</span>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">password</code>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Access:</span>
                    <div className="flex gap-1">
                      <Badge variant="outline" className="text-xs">Full Access</Badge>
                      <Badge variant="outline" className="text-xs">Reports</Badge>
                      <Badge variant="outline" className="text-xs">Settings</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign up for free trial
          </a>
        </div>
      </div>
    </div>
  )
}