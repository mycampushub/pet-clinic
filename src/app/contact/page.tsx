"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, CheckCircle, Phone, Mail, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    clinicName: "",
    interest: "demo" as "demo" | "pricing" | "support" | "partnership",
    message: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, this would send the contact form data to your backend
      console.log("Contact form submitted:", formData)
      
      setIsSubmitted(true)
    } catch (err) {
      setError("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
            <p className="text-gray-600 mb-4">
              Thank you for contacting us. We'll get back to you within 24 hours.
            </p>
            <div className="space-y-2">
              <Button onClick={() => router.push("/")} className="w-full">
                Return to Home
              </Button>
              <Button variant="outline" onClick={() => router.push("/landing")} className="w-full">
                Back to Landing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/landing" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PetClinic Pro</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/login")}>Sign In</Button>
              <Button onClick={() => router.push("/register")}>Get Started</Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about PetClinic Pro? We'd love to hear from you. 
              Our team is here to help you find the perfect solution for your veterinary practice.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="Dr. John Doe"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@vetclinic.com"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="clinicName">Clinic Name</Label>
                        <Input
                          id="clinicName"
                          type="text"
                          placeholder="Happy Paws Veterinary Clinic"
                          value={formData.clinicName}
                          onChange={(e) => handleChange("clinicName", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest">I'm interested in...</Label>
                      <Select 
                        value={formData.interest} 
                        onValueChange={(value) => handleChange("interest", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="demo">Scheduling a Demo</SelectItem>
                          <SelectItem value="pricing">Pricing Information</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your needs and how we can help..."
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-gray-600">1-800-PET-CLINIC</div>
                      <div className="text-sm text-gray-500">Mon-Fri 9AM-6PM EST</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-gray-600">support@petclinicpro.com</div>
                      <div className="text-sm text-gray-500">Response within 24 hours</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-medium">Headquarters</div>
                      <div className="text-gray-600">
                        123 Veterinary Way<br />
                        Medical District, MD 12345
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-1" />
                    <div>
                      <div className="font-medium">Business Hours</div>
                      <div className="text-gray-600">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Saturday: 10:00 AM - 4:00 PM EST<br />
                        Sunday: Closed
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => router.push("/register")}
                  >
                    Start Free Trial
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => router.push("/landing#pricing")}
                  >
                    View Pricing Plans
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => window.open("https://docs.petclinicpro.com", "_blank")}
                  >
                    Documentation
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => window.open("https://status.petclinicpro.com", "_blank")}
                  >
                    System Status
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}