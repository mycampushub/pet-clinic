"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Edit, 
  ArrowLeft,
  Save,
  Building2,
  Mail,
  Lock,
  User,
  AlertCircle
} from "lucide-react"
import { UserRole } from "@prisma/client"
import Link from "next/link"

interface Clinic {
  id: string
  name: string
  city: string
  state: string
}

interface UserData {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  clinicId?: string
  isActive: boolean
  lastLoginAt?: string
  clinic?: {
    id: string
    name: string
  }
}

export default function EditUser() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [fetchingClinics, setFetchingClinics] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "" as UserRole,
    clinicId: "",
    isActive: true,
    password: ""
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/tenant-admin/users/${userId}`)
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setFormData({
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: userData.role,
            clinicId: userData.clinicId || "",
            isActive: userData.isActive,
            password: ""
          })
        } else {
          setError('Failed to fetch user data')
        }
      } catch (error) {
        console.error("Error fetching user:", error)
        setError('Error fetching user data')
      } finally {
        setFetching(false)
      }
    }

    const fetchClinics = async () => {
      try {
        const response = await fetch('/api/tenant-admin/clinics')
        if (response.ok) {
          const clinicsData = await response.json()
          setClinics(clinicsData)
        }
      } catch (error) {
        console.error("Error fetching clinics:", error)
      } finally {
        setFetchingClinics(false)
      }
    }

    fetchUserData()
    fetchClinics()
  }, [userId])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/tenant-admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess("User updated successfully!")
        // Update the user data in state
        const updatedUser = await response.json()
        setUser(prev => prev ? { ...prev, ...updatedUser } : null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update user')
      }
    } catch (error) {
      console.error('Error updating user:', error)
      setError('Error updating user')
    } finally {
      setLoading(false)
    }
  }

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

  if (fetching) {
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
                <Edit className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
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
          <h2 className="text-3xl font-bold text-gray-900">Edit User Account</h2>
          <p className="text-gray-600">
            Update the user's information and account settings.
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <p className="text-green-600">{success}</p>
              <div className="mt-4">
                <Link href="/tenant-admin/users">
                  <Button variant="outline" size="sm">
                    View All Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Update the user's personal and account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    required
                    placeholder="Enter first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    required
                    placeholder="Enter last name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Leave blank to keep current password"
                    minLength={8}
                  />
                  <p className="text-sm text-gray-500">Only fill if you want to change the password</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Role *
                  </Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UserRole.ADMIN}>Administrator</SelectItem>
                      <SelectItem value={UserRole.CLINIC_ADMIN}>Clinic Admin</SelectItem>
                      <SelectItem value={UserRole.VETERINARIAN}>Veterinarian</SelectItem>
                      <SelectItem value={UserRole.VET_TECH}>Veterinary Technician</SelectItem>
                      <SelectItem value={UserRole.RECEPTIONIST}>Receptionist</SelectItem>
                      <SelectItem value={UserRole.PHARMACIST}>Pharmacist</SelectItem>
                      <SelectItem value={UserRole.STAFF}>Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinic" className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    Clinic Assignment
                  </Label>
                  <Select value={formData.clinicId} onValueChange={(value) => handleInputChange('clinicId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select clinic (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {fetchingClinics ? (
                        <SelectItem value="" disabled>Loading clinics...</SelectItem>
                      ) : (
                        clinics.map((clinic) => (
                          <SelectItem key={clinic.id} value={clinic.id}>
                            {clinic.name} - {clinic.city}, {clinic.state}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Assign user to a specific clinic location</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Select 
                    value={formData.isActive.toString()} 
                    onValueChange={(value) => handleInputChange('isActive', value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">Inactive users cannot log in to the system</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">User ID:</span>
                    <span className="ml-2 font-mono text-xs">{user.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Login:</span>
                    <span className="ml-2">
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Link href="/tenant-admin/users">
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Updating User...' : 'Update User'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}