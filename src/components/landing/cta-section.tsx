"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  CheckCircle, 
  Shield, 
  Headphones, 
  Zap,
  ArrowRight
} from "lucide-react"

export function CTASection() {
  const guarantees = [
    {
      icon: CheckCircle,
      title: "14-Day Free Trial",
      description: "Try all features risk-free with no credit card required"
    },
    {
      icon: Shield,
      title: "30-Day Money Back",
      description: "Not satisfied? Get a full refund within 30 days"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Get help whenever you need it from our expert team"
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get started in minutes with our intuitive onboarding"
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-white leading-tight">
                Ready to Transform Your Veterinary Practice?
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of veterinary professionals who have streamlined their operations, 
                improved patient care, and increased revenue with PetClinic Pro.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                Schedule Demo
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 pt-4">
              <div className="text-white text-sm">
                <div className="font-medium mb-1">Secure Payment</div>
                <div className="flex gap-2">
                  <div className="bg-white/20 px-2 py-1 rounded text-xs">Visa</div>
                  <div className="bg-white/20 px-2 py-1 rounded text-xs">Mastercard</div>
                  <div className="bg-white/20 px-2 py-1 rounded text-xs">Amex</div>
                </div>
              </div>
              <div className="text-white text-sm">
                <div className="font-medium mb-1">Compliant</div>
                <div className="bg-white/20 px-2 py-1 rounded text-xs">HIPAA Compliant</div>
              </div>
            </div>
          </div>

          {/* Right Content - Guarantees */}
          <div className="grid grid-cols-2 gap-4">
            {guarantees.map((guarantee, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <guarantee.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-white mb-2">{guarantee.title}</h3>
                  <p className="text-sm text-blue-100">{guarantee.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Trust Elements */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-8 bg-white/10 backdrop-blur-sm rounded-full px-8 py-4">
            <div className="text-white">
              <div className="text-sm font-medium mb-1">Trusted by leading veterinary associations</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold">
                AVMA
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold">
                AAHA
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xs font-bold">
                VHMA
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}