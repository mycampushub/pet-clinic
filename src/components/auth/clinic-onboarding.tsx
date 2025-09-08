"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ClinicOnboardingData } from "@/types/auth"

interface ClinicOnboardingProps {
  onComplete: (data: ClinicOnboardingData) => void
  onBack?: () => void
}

export function ClinicOnboarding({ onComplete, onBack }: ClinicOnboardingProps) {
  const [step, setStep] = useState(1)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState<ClinicOnboardingData>({
    clinic: {
      name: "",
      address: "",
      phone: "",
      email: "",
      timezone: "America/New_York"
    },
    admin: {
      name: "",
      email: "",
      phone: ""
    },
    settings: {
      appointmentDuration: 30,
      currency: "USD",
      taxRate: 7.5
    }
  })

  const timezones = [
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Asia/Tokyo",
    "Australia/Sydney"
  ]

  const currencies = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "AUD", label: "Australian Dollar (A$)" }
  ]

  const updateClinicData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      clinic: { ...prev.clinic, [field]: value }
    }))
  }

  const updateAdminData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      admin: { ...prev.admin, [field]: value }
    }))
  }

  const updateSettings = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value }
    }))
  }

  const validateStep = () => {
    switch (step) {
      case 1:
        return formData.clinic.name && formData.clinic.address && formData.clinic.phone
      case 2:
        return formData.admin.name && formData.admin.email && formData.admin.phone
      case 3:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (!validateStep()) {
      setError("Please fill in all required fields")
      return
    }
    setError("")
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
    else onBack?.()
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      onComplete(formData)
    } catch (err) {
      setError("Failed to create clinic. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Set Up Your Clinic
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Let's get your clinic configured in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center space-x-4">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber <= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    stepNumber < step ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Clinic Information"}
              {step === 2 && "Administrator Details"}
              {step === 3 && "Clinic Settings"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Tell us about your clinic"}
              {step === 2 && "Who will be managing the clinic?"}
              {step === 3 && "Configure your clinic preferences"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Clinic Name *</Label>
                  <Input
                    id="clinicName"
                    value={formData.clinic.name}
                    onChange={(e) => updateClinicData("name", e.target.value)}
                    placeholder="Enter clinic name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="clinicAddress">Address *</Label>
                  <Textarea
                    id="clinicAddress"
                    value={formData.clinic.address}
                    onChange={(e) => updateClinicData("address", e.target.value)}
                    placeholder="Enter clinic address"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinicPhone">Phone *</Label>
                    <Input
                      id="clinicPhone"
                      value={formData.clinic.phone}
                      onChange={(e) => updateClinicData("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clinicEmail">Email</Label>
                    <Input
                      id="clinicEmail"
                      type="email"
                      value={formData.clinic.email}
                      onChange={(e) => updateClinicData("email", e.target.value)}
                      placeholder="clinic@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={formData.clinic.timezone} onValueChange={(value) => updateClinicData("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Full Name *</Label>
                  <Input
                    id="adminName"
                    value={formData.admin.name}
                    onChange={(e) => updateAdminData("name", e.target.value)}
                    placeholder="Enter administrator name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email Address *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.admin.email}
                    onChange={(e) => updateAdminData("email", e.target.value)}
                    placeholder="admin@clinic.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="adminPhone">Phone Number *</Label>
                  <Input
                    id="adminPhone"
                    value={formData.admin.phone}
                    onChange={(e) => updateAdminData("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="appointmentDuration">Appointment Duration (minutes)</Label>
                    <Select 
                      value={formData.settings.appointmentDuration.toString()} 
                      onValueChange={(value) => updateSettings("appointmentDuration", parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.settings.currency} onValueChange={(value) => updateSettings("currency", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="50"
                    value={formData.settings.taxRate}
                    onChange={(e) => updateSettings("taxRate", parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Features Included</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>✓ Appointment scheduling</li>
                    <li>✓ Patient management</li>
                    <li>✓ Medical records</li>
                    <li>✓ Billing and invoicing</li>
                    <li>✓ Inventory management</li>
                    <li>✓ Reporting and analytics</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack}>
                {step === 1 ? "Back" : "Previous"}
              </Button>
              
              {step < 3 ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? "Creating Clinic..." : "Complete Setup"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}