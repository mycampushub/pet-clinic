"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Users,
  Activity,
  Calendar,
  AlertCircle
} from "lucide-react"
import { UserRole } from "@prisma/client"
import Link from "next/link"

interface ClinicData {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  email?: string
  website?: string
  timezone: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  userCount: number
}

export default function ViewClinic() {
  const { data: session } = useSession()
  const params = useParams()
  const clinicId = params.id as string
  
  const [clinic, setClinic] = useState<ClinicData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        const response = await fetch(`/api/clinics/${clinicId}`)
        if (response.ok) {
          const clinicData = await response.json()
          setClinic(clinicData)
        } else {
          setError('Failed to fetch clinic data')
        }
      } catch (error) {
        console.error("Error fetching clinic:", error)
        setError('Error fetching clinic data')
      } finally {
        setLoading(false)
      }
    }

    fetchClinicData()
  }, [clinicId])

  // Only allow ADMIN and CLINIC_ADMIN users
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.CLINIC_ADMIN)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You don't have permission to access clinic management.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!clinic) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Clinic Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              The requested clinic could not be found.
            </p>
            <Link href="/tenant-admin/clinics">
              <Button>Back to Clinics</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/tenant-admin/clinics">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Clinics
                </Button>
              </Link>
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Clinic Details</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-100 text-blue-700">
                {session.user.role === UserRole.ADMIN ? 'Super Admin' : 'Tenant Admin'}
              </Badge>
              <span className="text-sm text-gray-600">
                {session?.user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{clinic.name}</h2>
              <p className="text-gray-600">
                Clinic location details and information
              </p>
            </div>
            <Link href={`/tenant-admin/clinics/${clinic.id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit Clinic
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clinic Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Clinic Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">{clinic.name}</h3>
                  <div className="mt-2">
                    <Badge variant={clinic.isActive ? "default" : "secondary"}>
                      {clinic.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <Badge variant={clinic.isActive ? "default" : "secondary"}>
                      {clinic.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Active Users</p>
                      <p className="text-sm font-medium">{clinic.userCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Timezone</p>
                      <p className="text-sm font-medium">{clinic.timezone}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="text-sm">
                        {new Date(clinic.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Clinic Details Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Clinic's contact and location details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium">{clinic.phone}</p>
                      </div>
                    </div>

                    {clinic.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium">{clinic.email}</p>
                        </div>
                      </div>
                    )}

                    {clinic.website && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          <p className="font-medium">
                            <a 
                              href={clinic.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {clinic.website}
                            </a>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{clinic.address}</p>
                        <p className="text-sm text-gray-600">
                          {clinic.city}, {clinic.state} {clinic.zipCode}
                        </p>
                        <p className="text-sm text-gray-600">{clinic.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Timezone</p>
                        <p className="font-medium">{clinic.timezone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Clinic Information</CardTitle>
                <CardDescription>
                  Technical details about the clinic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Clinic ID</p>
                      <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {clinic.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Created</p>
                      <p className="font-medium">
                        {new Date(clinic.createdAt).toLocaleDateString()} at {new Date(clinic.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">
                        {new Date(clinic.updatedAt).toLocaleDateString()} at {new Date(clinic.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Active Users</p>
                      <p className="font-medium">{clinic.userCount}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks for this clinic
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href={`/tenant-admin/users`}>
                    <Button variant="outline" className="w-full">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </Link>
                  
                  <Link href={`/tenant-admin/clinics/${clinic.id}/edit`}>
                    <Button variant="outline" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Clinic
                    </Button>
                  </Link>
                  
                  <Link href={`/dashboard`}>
                    <Button variant="outline" className="w-full">
                      <Activity className="h-4 w-4 mr-2" />
                      View Dashboard
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}