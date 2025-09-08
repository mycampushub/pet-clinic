"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Eye, EyeOff, Mail, Lock, Building, User } from "lucide-react"
import Link from "next/link"

interface SignInFormData {
  email: string
  password: string
  rememberMe: boolean
}

interface SignUpFormData {
  clinicName: string
  email: string
  password: string
  confirmPassword: string
  clinicType: string
  userRole: string
  agreeToTerms: boolean
}

export default function AuthPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signInData, setSignInData] = useState<SignInFormData>({
    email: "",
    password: "",
    rememberMe: false
  })
  const [signUpData, setSignUpData] = useState<SignUpFormData>({
    clinicName: "",
    email: "",
    password: "",
    confirmPassword: "",
    clinicType: "",
    userRole: "",
    agreeToTerms: false
  })

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sign in:", signInData)
    // TODO: Implement authentication logic
    // For demo purposes, redirect to dashboard
    router.push("/")
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Sign up:", signUpData)
    // TODO: Implement registration logic
    // For demo purposes, redirect to dashboard
    router.push("/")
  }

  const clinicTypes = [
    { value: "small-animal", label: "Small Animal Clinic" },
    { value: "mixed-practice", label: "Mixed Practice" },
    { value: "emergency", label: "Emergency Hospital" },
    { value: "specialty", label: "Specialty Practice" },
    { value: "mobile", label: "Mobile Veterinary" },
    { value: "multi-location", label: "Multi-Location Group" }
  ]

  const userRoles = [
    { value: "owner", label: "Clinic Owner", description: "Full access to all features" },
    { value: "manager", label: "Practice Manager", description: "Manage operations and staff" },
    { value: "veterinarian", label: "Veterinarian", description: "Clinical access and patient care" },
    { value: "receptionist", label: "Receptionist", description: "Appointments and front desk" },
    { value: "vet-tech", label: "Veterinary Technician", description: "Assist with patient care" },
    { value: "pharmacist", label: "Pharmacist", description: "Medication management" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <Heart className="h-12 w-12 text-blue-600" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">PetClinic Pro</h1>
              <p className="text-gray-600">Enterprise Veterinary Practice Management</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">
              Transform Your Veterinary Practice
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Comprehensive Practice Management</h3>
                  <p className="text-gray-600">All-in-one platform for appointments, patient records, billing, and inventory</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Role-Based Access Control</h3>
                  <p className="text-gray-600">Granular permissions for different staff roles and responsibilities</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Multi-Location Support</h3>
                  <p className="text-gray-600">Manage multiple clinics from a single dashboard</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Compliance & Security</h3>
                  <p className="text-gray-600">HIPAA compliant with enterprise-grade security and audit trails</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Need a Demo?</h3>
                <p className="text-sm text-gray-600">See how PetClinic Pro can help your practice</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Schedule a Demo
            </Button>
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full max-w-md">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Sign In Form */}
            <TabsContent value="signin" className="space-y-4">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
                  <CardDescription className="text-center">
                    Sign in to your PetClinic Pro account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          value={signInData.email}
                          onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={signInData.password}
                          onChange={(e) => setSignInData({...signInData, password: e.target.value})}
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

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember-me"
                          checked={signInData.rememberMe}
                          onCheckedChange={(checked) => setSignInData({...signInData, rememberMe: checked as boolean})}
                        />
                        <Label htmlFor="remember-me" className="text-sm">Remember me</Label>
                      </div>
                      <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button type="submit" className="w-full">
                      Sign In
                    </Button>
                  </form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="w-full">
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-5.37 0-4.33-3.67-7.28-8.14z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                    <Button variant="outline" className="w-full">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439l2.462-.105s.209.315.209.315c.42 1.377 1.473 2.579 2.679 3.295.843.645 1.678 1.025 2.678 1.025 3.215 0 6.0-2.136 6.822-5.078.098-.316.047-.632.047-.948 0-.209 0-.42-.015-.63-.961 1.016-2.317 1.614-3.915 1.614-3.052 0-5.525-2.473-5.525-5.525 0-1.093.39-2.088 1.029-2.887-.1-.251-.451-1.265.1-2.64 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.8 1.028 1.795 1.028 2.887 0 3.052-2.473 5.525-5.525 5.525-.358 0-.708-.034-1.05-.098l-1.447 5.265c1.065.343 2.2.528 3.386.528 6.607 0 11.985-5.365 11.985-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                      Facebook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="signup" className="space-y-4">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl text-center">Create Account</CardTitle>
                  <CardDescription className="text-center">
                    Start your 14-day free trial. No credit card required.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="clinic-name">Clinic Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="clinic-name"
                          type="text"
                          placeholder="Enter your clinic name"
                          value={signUpData.clinicName}
                          onChange={(e) => setSignUpData({...signUpData, clinicName: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          value={signUpData.email}
                          onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clinic-type">Clinic Type</Label>
                      <Select value={signUpData.clinicType} onValueChange={(value) => setSignUpData({...signUpData, clinicType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your clinic type" />
                        </SelectTrigger>
                        <SelectContent>
                          {clinicTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="user-role">Your Role</Label>
                      <Select value={signUpData.userRole} onValueChange={(value) => setSignUpData({...signUpData, userRole: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          {userRoles.map((role) => (
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

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
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
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agree-terms"
                        checked={signUpData.agreeToTerms}
                        onCheckedChange={(checked) => setSignUpData({...signUpData, agreeToTerms: checked as boolean})}
                        required
                      />
                      <Label htmlFor="agree-terms" className="text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  </form>

                  <div className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-blue-600 hover:underline">
                      Sign in
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}