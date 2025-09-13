"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Building2, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Users,
  Activity
} from "lucide-react"
import { UserRole } from "@prisma/client"
import Link from "next/link"

interface Clinic {
  id: string
  name: string
  address: string
  city: string
  state: string
  phone: string
  isActive: boolean
  userCount: number
}

export default function ClinicsManagement() {
  const { data: session } = useSession()
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const handleDeleteClinic = async (clinicId: string) => {
    if (!confirm('Are you sure you want to delete this clinic? This action cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/clinics/${clinicId}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        setClinics(clinics.filter(c => c.id !== clinicId))
        alert('Clinic deleted successfully')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete clinic')
      }
    } catch (error) {
      console.error('Error deleting clinic:', error)
      alert('Failed to delete clinic')
    }
  }

  useEffect(() => {
    const fetchClinics = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/tenant-admin/clinics')
        
        if (response.ok) {
          const clinicsData = await response.json()
          setClinics(clinicsData)
        } else {
          setError('Failed to fetch clinics')
        }
      } catch (error) {
        console.error("Error fetching clinics:", error)
        setError('Error fetching clinics')
      } finally {
        setLoading(false)
      }
    }

    fetchClinics()
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/tenant-admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-blue-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-900">Clinic Management</h1>
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
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Manage Clinics</h2>
              <p className="text-gray-600">
                Add, edit, and manage your clinic locations
              </p>
            </div>
            <Link href="/tenant-admin/clinics/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add New Clinic
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

        <Card>
          <CardHeader>
            <CardTitle>All Clinics</CardTitle>
            <CardDescription>
              View and manage all clinic locations in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clinics.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No clinics found</h3>
                <p className="text-gray-500 mb-4">Get started by creating your first clinic location.</p>
                <Link href="/tenant-admin/clinics/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Clinic
                  </Button>
                </Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Clinic Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clinics.map((clinic) => (
                    <TableRow key={clinic.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Building2 className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{clinic.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm">{clinic.address}</div>
                            <div className="text-xs text-gray-500">{clinic.city}, {clinic.state}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 text-gray-400 mr-2" />
                            {clinic.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={clinic.isActive ? "default" : "secondary"}>
                          {clinic.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{clinic.userCount}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link href={`/tenant-admin/clinics/${clinic.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/tenant-admin/clinics/${clinic.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteClinic(clinic.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={clinic.userCount > 0}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}