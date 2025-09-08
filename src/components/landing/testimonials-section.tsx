"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Owner, Happy Paws Veterinary Clinic",
    image: "",
    content: "PetClinic Pro has transformed how we run our practice. The appointment scheduling alone saves us hours each week, and the integrated billing has reduced our accounts receivable by 60%. Highly recommended!",
    rating: 5
  },
  {
    name: "Dr. Michael Chen",
    role: "Medical Director, City Animal Hospital",
    image: "",
    content: "The clinical workflow features are outstanding. Our vets love the SOAP note templates, and the inventory management has eliminated stock-outs completely. The ROI was evident within the first month.",
    rating: 5
  },
  {
    name: "Lisa Rodriguez",
    role: "Practice Manager, VetCare Group",
    image: "",
    content: "Managing multiple locations was chaotic before PetClinic Pro. Now we have real-time visibility across all clinics, standardized processes, and happier staff. The multi-location support is exactly what we needed.",
    rating: 5
  },
  {
    name: "Dr. James Wilson",
    role: "Owner, Compassionate Vet Clinic",
    image: "",
    content: "As a solo practitioner, I needed something comprehensive but affordable. PetClinic Pro delivers enterprise features at a price point that works for small practices. The mobile app lets me manage everything on the go.",
    rating: 5
  },
  {
    name: "Jennifer Park",
    role: "Head Nurse, Animal Medical Center",
    image: "",
    content: "From the nurses' perspective, this system is intuitive and saves so much time. The patient records are easily accessible, and the communication tools help us coordinate better with doctors and pet owners.",
    rating: 5
  },
  {
    name: "Dr. Robert Kim",
    role: "CEO, VetChain Partners",
    image: "",
    content: "We operate 15 clinics across three states. PetClinic Pro's enterprise features have given us the consistency and control we needed. The compliance tools alone are worth the investment.",
    rating: 5
  }
]

const stats = [
  { label: "Happy Clinics", value: "2,500+" },
  { label: "Veterinarians", value: "8,000+" },
  { label: "Pets Cared For", value: "2M+" },
  { label: "Countries", value: "15+" }
]

export function TestimonialsSection() {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} 
          />
        ))}
      </div>
    )
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Trusted by Veterinary Professionals
          </h2>
          <p className="text-xl text-gray-600">
            Hear from practices that have transformed their operations with PetClinic Pro
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Quote className="h-8 w-8 text-blue-200 mb-4" />
                
                <div className="mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-blue-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Join Them?
            </h3>
            <p className="text-gray-600 mb-6">
              Start your free 14-day trial today and see why thousands of veterinary professionals trust PetClinic Pro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Start Free Trial
              </button>
              <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}