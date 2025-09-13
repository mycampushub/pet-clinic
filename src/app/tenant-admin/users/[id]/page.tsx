"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Building2,
  Calendar,
  Activity,
  User,
  AlertCircle
} from "lucide-react"
import { UserRole } from "@prisma/client"
import Link from "next/link"

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  clinicId?: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  clinic?: {
    id: string
    name: string
    city: string
    state: string
    phone: string
  }
}

export default function ViewUser() {
  const { data: session } = useSession()
  const params = useParams()
  const userId = params.id as string
  
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/tenant-admin/users/${userId}`)
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          setError('Failed to fetch user data')
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setError('Error fetching user data')
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [userId])

  // Only allow ADMIN and CLINIC_ADMIN users
  if (!session || (session.user.role !== UserRole.ADMIN && session.user.role !== UserRole.CLINIC_ADMIN)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You don't have permission to access user management.
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              User Not Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              The requested user could not be found.
            </p>
            <Link href="/tenant-admin/users">
              <Button>Back to Users</Button>
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
              <Link href="/tenant-admin/users">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Users
                </Button>
              </Link>
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
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
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-600">
                User account details and information
              </p>
            </div>
            <Link href={`/tenant-admin/users/${user.id}/edit`}>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit User
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
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold">{user.firstName} {user.lastName}</h3>
                  <p className="text-gray-500">{user.email}</p>
                  <div className="mt-2">
                    <Badge variant={
                      user.role === UserRole.ADMIN ? 'destructive' :
                      user.role === UserRole.VETERINARIAN ? 'default' :
                      user.role === UserRole.CLINIC_ADMIN ? 'secondary' :
                      'outline'
                    }>
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Last Login</p>
                      <p className="text-sm">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Details Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  User's contact and assignment details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Clinic Assignment</p>
                        <p className="font-medium">
                          {user.clinic ? user.clinic.name : 'Unassigned'}
                        </p>
                        {user.clinic && (
                          <p className="text-sm text-gray-500">
                            {user.clinic.city}, {user.clinic.state}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <Badge variant={
                        user.role === UserRole.ADMIN ? 'destructive' :
                        user.role === UserRole.VETERINARIAN ? 'default' :
                        user.role === UserRole.CLINIC_ADMIN ? 'secondary' :
                        'outline'
                      }>
                        {user.role.replace('_', ' ')}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Account Status</p>
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Technical details about the user account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">User ID</p>
                      <p className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {user.id}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Account Created</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()} at {new Date(user.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Last Updated</p>
                      <p className="font-medium">
                        {new Date(user.updatedAt).toLocaleDateString()} at {new Date(user.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>

                    {user.lastLoginAt && (
                      <div>
                        <p className="text-sm text-gray-500">Last Login Details</p>
                        <p className="font-medium">
                          {new Date(user.lastLoginAt).toLocaleDateString()} at {new Date(user.lastLoginAt).toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {user.clinic && (
              <Card>
                <CardHeader>
                  <CardTitle>Clinic Information</CardTitle>
                  <CardDescription>
                    Details about the assigned clinic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Clinic Name</p>
                        <p className="font-medium">{user.clinic.name}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium">
                          {user.clinic.city}, {user.clinic.state}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium">{user.clinic.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}