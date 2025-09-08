"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Users, Building2 } from "lucide-react"

interface PricingTier {
  name: string
  price: string
  period: string
  description: string
  popular?: boolean
  icon: React.ReactNode
  features: string[]
  cta: string
  highlighted?: boolean
}

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly")

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: billingPeriod === "monthly" ? "$79" : "$790",
      period: billingPeriod === "monthly" ? "/month" : "/year",
      description: "Perfect for small clinics and solo practitioners",
      icon: <Users className="h-6 w-6" />,
      features: [
        "Up to 3 users",
        "Unlimited appointments",
        "Basic patient records",
        "Simple billing",
        "Email support",
        "Mobile app access"
      ],
      cta: "Get Started"
    },
    {
      name: "Professional",
      price: billingPeriod === "monthly" ? "$149" : "$1490",
      period: billingPeriod === "monthly" ? "/month" : "/year",
      description: "Ideal for growing veterinary practices",
      icon: <Building2 className="h-6 w-6" />,
      popular: true,
      highlighted: true,
      features: [
        "Up to 10 users",
        "Everything in Starter",
        "Advanced clinical workflows",
        "Inventory management",
        "Online booking portal",
        "Priority support",
        "Custom reports",
        "Integration capabilities"
      ],
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For multi-location clinics and hospital groups",
      icon: <Star className="h-6 w-6" />,
      features: [
        "Unlimited users",
        "Everything in Professional",
        "Multi-location support",
        "Advanced analytics",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options",
        "API access",
        "Advanced security",
        "Compliance tools"
      ],
      cta: "Contact Sales"
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Simple, Transparent Pricing
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Scale your practice with confidence. All plans include a 14-day free trial.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingPeriod === "monthly" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                billingPeriod === "yearly" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Yearly
              <Badge className="bg-green-100 text-green-800 text-xs">
                Save 17%
              </Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={index} 
              className={`relative overflow-hidden ${
                tier.highlighted 
                  ? "border-blue-500 shadow-2xl scale-105" 
                  : "border-gray-200 hover:shadow-lg"
              } transition-all duration-300`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute top-0 left-0 right-0 bg-blue-600 text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}

              <CardHeader className={`pb-8 ${tier.popular ? "pt-12" : "pt-8"}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    tier.highlighted ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                  }`}>
                    {tier.icon}
                  </div>
                  {tier.popular && <Star className="h-5 w-5 text-yellow-500" />}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {tier.name}
                </CardTitle>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                  <span className="text-gray-600">{tier.period}</span>
                </div>
                <CardDescription className="text-gray-600">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  className={`w-full py-3 text-lg font-medium ${
                    tier.highlighted 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : tier.name === "Enterprise"
                      ? "bg-gray-900 hover:bg-gray-800"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  {tier.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Everything You Need, Nothing You Don't
            </h3>
            <p className="text-gray-600 mb-6">
              All plans include core features with no hidden fees. Upgrade or downgrade anytime.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Always Included</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 14-day free trial</li>
                  <li>• No setup fees</li>
                  <li>• Cancel anytime</li>
                  <li>• SSL security</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Support & Training</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Video tutorials</li>
                  <li>• Knowledge base</li>
                  <li>• Email support</li>
                  <li>• Community forum</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Data & Security</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Daily backups</li>
                  <li>• HIPAA compliant</li>
                  <li>• Role-based access</li>
                  <li>• Audit trails</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}