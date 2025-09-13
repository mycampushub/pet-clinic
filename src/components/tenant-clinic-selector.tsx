"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { 
  Building2, 
  ChevronDown, 
  Globe, 
  MapPin,
  Check,
  Plus,
  Settings,
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  settings?: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface Clinic {
  id: string
  tenantId: string
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
  settings?: any
  createdAt: Date
  updatedAt: Date
}

interface TenantClinicSelectorProps {
  className?: string
}

export function TenantClinicSelector({ className }: TenantClinicSelectorProps) {
  const { data: session } = useSession()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [selectedTenant, setSelectedTenant] = useState<string>("")
  const [selectedClinic, setSelectedClinic] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [showTenantDialog, setShowTenantDialog] = useState(false)
  const [showClinicDialog, setShowClinicDialog] = useState(false)

  useEffect(() => {
    if (session?.user?.tenantId) {
      setSelectedTenant(session.user.tenantId)
    }
    if (session?.user?.clinicId) {
      setSelectedClinic(session.user.clinicId)
    }
    fetchTenants()
    fetchClinics()
  }, [session])

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/tenants')
      if (response.ok) {
        const data = await response.json()
        setTenants(data.tenants || [])
      }
    } catch (error) {
      console.error('Error fetching tenants:', error)
    }
  }

  const fetchClinics = async () => {
    try {
      const response = await fetch('/api/clinics')
      if (response.ok) {
        const data = await response.json()
        setClinics(data.clinics || [])
      }
    } catch (error) {
      console.error('Error fetching clinics:', error)
    }
  }

  const handleTenantChange = async (tenantId: string) => {
    setLoading(true)
    try {
      // Update session with new tenant
      const response = await fetch('/api/auth/update-tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId }),
      })

      if (response.ok) {
        setSelectedTenant(tenantId)
        // Refresh clinics for the new tenant
        const clinicsResponse = await fetch(`/api/clinics?tenantId=${tenantId}`)
        if (clinicsResponse.ok) {
          const clinicsData = await clinicsResponse.json()
          setClinics(clinicsData.clinics || [])
        }
        // Reset clinic selection
        setSelectedClinic("")
        // Reload page to update session
        window.location.reload()
      }
    } catch (error) {
      console.error('Error switching tenant:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClinicChange = async (clinicId: string) => {
    setLoading(true)
    try {
      // Update session with new clinic
      const response = await fetch('/api/auth/update-clinic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clinicId }),
      })

      if (response.ok) {
        setSelectedClinic(clinicId)
        // Reload page to update session
        window.location.reload()
      }
    } catch (error) {
      console.error('Error switching clinic:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentTenant = tenants.find(t => t.id === selectedTenant)
  const currentClinic = clinics.find(c => c.id === selectedClinic)
  const tenantClinics = clinics.filter(c => c.tenantId === selectedTenant)

  // Only show tenant selector for admin and clinic admin users
  const canSwitchTenants = session?.user?.role === 'ADMIN' || session?.user?.role === 'CLINIC_ADMIN'
  // All users can switch clinics they have access to
  const canSwitchClinics = true

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Tenant Selector */}
      {canSwitchTenants && (
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Select value={selectedTenant} onValueChange={handleTenantChange} disabled={loading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select organization">
                    {currentTenant ? (
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 mr-2" />
                        <span className="truncate">{currentTenant.name}</span>
                      </div>
                    ) : (
                      "Select organization"
                    )}
                  </SelectValue>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectTrigger>
                <SelectContent className="w-full max-w-md">
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      <div className="flex items-center w-full">
                        <Building2 className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{tenant.name}</div>
                          {tenant.domain && (
                            <div className="text-xs text-gray-500 truncate">{tenant.domain}</div>
                          )}
                        </div>
                        {tenant.id === selectedTenant && (
                          <Check className="h-4 w-4 ml-2 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {currentTenant && (
                <div className="text-xs text-gray-500 space-y-1">
                  {currentTenant.domain && (
                    <div className="truncate">Domain: {currentTenant.domain}</div>
                  )}
                  <div>Slug: {currentTenant.slug}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Clinic Selector */}
      {canSwitchClinics && (
        <Card className="w-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2">
              <Select value={selectedClinic} onValueChange={handleClinicChange} disabled={loading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location">
                    {currentClinic ? (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="truncate">{currentClinic.name}</span>
                      </div>
                    ) : (
                      "Select location"
                    )}
                  </SelectValue>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </SelectTrigger>
                <SelectContent className="w-full max-w-md max-h-60 overflow-y-auto">
                  {tenantClinics.map((clinic) => (
                    <SelectItem key={clinic.id} value={clinic.id}>
                      <div className="flex items-center w-full">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="truncate">{clinic.name}</div>
                          <div className="text-xs text-gray-500 truncate">{clinic.city}, {clinic.state}</div>
                        </div>
                        {clinic.id === selectedClinic && (
                          <Check className="h-4 w-4 ml-2 text-green-600 flex-shrink-0" />
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {currentClinic && (
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="truncate">{currentClinic.address}</div>
                  <div className="truncate">{currentClinic.city}, {currentClinic.state} {currentClinic.zipCode}</div>
                  <div>{currentClinic.phone}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Multi-Branch Management */}
      {(canSwitchTenants || canSwitchClinics) && (
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="space-y-2">
              {canSwitchTenants && (
                <Dialog open={showTenantDialog} onOpenChange={setShowTenantDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Manage Organizations
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Organization Management</DialogTitle>
                      <DialogDescription>
                        Create and manage organizations for your veterinary practice.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <p>Organization management features:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Create new organizations</li>
                          <li>Update organization settings</li>
                          <li>Manage organization domains</li>
                          <li>Configure organization preferences</li>
                        </ul>
                      </div>
                      <Button 
                        onClick={() => {
                          setShowTenantDialog(false)
                          window.location.href = '/settings/tenants'
                        }}
                        className="w-full"
                      >
                        Go to Organization Management
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              
              {canSwitchClinics && (
                <Dialog open={showClinicDialog} onOpenChange={setShowClinicDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Manage Locations
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Location Management</DialogTitle>
                      <DialogDescription>
                        Create and manage clinic locations for your organization.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="text-sm text-gray-600">
                        <p>Location management features:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Add new clinic locations</li>
                          <li>Update location information</li>
                          <li>Set operating hours</li>
                          <li>Manage location-specific settings</li>
                        </ul>
                      </div>
                      <Button 
                        onClick={() => {
                          setShowClinicDialog(false)
                          window.location.href = '/settings/clinics'
                        }}
                        className="w-full"
                      >
                        Go to Location Management
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              {/* Quick Actions */}
              <div className="pt-2 border-t">
                <p className="text-xs font-medium text-gray-700 mb-2">Quick Actions</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => window.location.href = '/tenant-admin'}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Admin Panel
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Status */}
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Status</span>
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            </div>
            {currentTenant && (
              <div className="text-xs text-gray-600">
                <div className="truncate">Organization: {currentTenant.name}</div>
              </div>
            )}
            {currentClinic && (
              <div className="text-xs text-gray-600">
                <div className="truncate">Location: {currentClinic.name}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}