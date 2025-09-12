"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Eye, EyeOff, Mail, Lock, Building2, Users, Stethoscope, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [accountType, setAccountType] = useState("clinic")
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    
    // Clinic specific
    clinicName: "",
    clinicAddress: "",
    clinicCity: "",
    clinicState: "",
    clinicZip: "",
    clinicPhone: "",
    clinicType: "general",
    
    // Staff specific
    clinicCode: "",
    role: "",
    licenseNumber: ""
  })

  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log("Signup attempt:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">PetClinic Pro</h1>
          <p className="text-gray-600 mt-2">Create your account</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Get Started</CardTitle>
            <CardDescription className="text-center">
              Join hundreds of veterinary practices using PetClinic Pro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={accountType} onValueChange={setAccountType} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="clinic" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  New Clinic
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Join Existing Clinic
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="clinic" className="space-y-6">
                <form onSubmit={handleSignup} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Clinic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Clinic Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="clinicName">Clinic Name</Label>
                      <Input
                        id="clinicName"
                        placeholder="Enter your clinic name"
                        value={formData.clinicName}
                        onChange={(e) => handleInputChange("clinicName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinicAddress">Clinic Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="clinicAddress"
                          placeholder="Enter clinic address"
                          value={formData.clinicAddress}
                          onChange={(e) => handleInputChange("clinicAddress", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clinicCity">City</Label>
                        <Input
                          id="clinicCity"
                          placeholder="City"
                          value={formData.clinicCity}
                          onChange={(e) => handleInputChange("clinicCity", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clinicState">State</Label>
                        <Input
                          id="clinicState"
                          placeholder="State"
                          value={formData.clinicState}
                          onChange={(e) => handleInputChange("clinicState", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clinicZip">ZIP Code</Label>
                        <Input
                          id="clinicZip"
                          placeholder="ZIP"
                          value={formData.clinicZip}
                          onChange={(e) => handleInputChange("clinicZip", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clinicPhone">Clinic Phone</Label>
                        <Input
                          id="clinicPhone"
                          placeholder="Phone"
                          value={formData.clinicPhone}
                          onChange={(e) => handleInputChange("clinicPhone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="clinicType">Clinic Type</Label>
                      <Select value={formData.clinicType} onValueChange={(value) => handleInputChange("clinicType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select clinic type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Practice</SelectItem>
                          <SelectItem value="emergency">Emergency Clinic</SelectItem>
                          <SelectItem value="specialty">Specialty Clinic</SelectItem>
                          <SelectItem value="mobile">Mobile Practice</SelectItem>
                          <SelectItem value="referral">Referral Hospital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={agreeTerms}
                        onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                      />
                      <Label htmlFor="agreeTerms" className="text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreePrivacy"
                        checked={agreePrivacy}
                        onCheckedChange={(checked) => setAgreePrivacy(checked as boolean)}
                      />
                      <Label htmlFor="agreePrivacy" className="text-sm">
                        I agree to the{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={!agreeTerms || !agreePrivacy}>
                    Create Clinic Account
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="staff" className="space-y-6">
                <form onSubmit={handleSignup} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="staffFirstName">First Name</Label>
                        <Input
                          id="staffFirstName"
                          placeholder="Enter your first name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffLastName">Last Name</Label>
                        <Input
                          id="staffLastName"
                          placeholder="Enter your last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="staffEmail">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="staffEmail"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffPhone">Phone Number</Label>
                        <Input
                          id="staffPhone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Professional Information</h3>
                    <div className="space-y-2">
                      <Label htmlFor="clinicCode">Clinic Access Code</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="clinicCode"
                          placeholder="Enter your clinic's access code"
                          value={formData.clinicCode}
                          onChange={(e) => handleInputChange("clinicCode", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        This code was provided to your clinic administrator
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="veterinarian">Veterinarian</SelectItem>
                            <SelectItem value="vet_tech">Veterinary Technician</SelectItem>
                            <SelectItem value="receptionist">Receptionist</SelectItem>
                            <SelectItem value="manager">Clinic Manager</SelectItem>
                            <SelectItem value="pharmacist">Pharmacist</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="licenseNumber">License Number (Optional)</Label>
                        <Input
                          id="licenseNumber"
                          placeholder="Enter your license number"
                          value={formData.licenseNumber}
                          onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="staffPassword">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="staffPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="staffConfirmPassword">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="staffConfirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            className="pl-10 pr-10"
                            required
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="staffAgreeTerms"
                        checked={agreeTerms}
                        onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                      />
                      <Label htmlFor="staffAgreeTerms" className="text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-blue-600 hover:underline">
                          Terms of Service
                        </Link>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="staffAgreePrivacy"
                        checked={agreePrivacy}
                        onCheckedChange={(checked) => setAgreePrivacy(checked as boolean)}
                      />
                      <Label htmlFor="staffAgreePrivacy" className="text-sm">
                        I agree to the{" "}
                        <Link href="/privacy" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={!agreeTerms || !agreePrivacy}>
                    Join Clinic
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}