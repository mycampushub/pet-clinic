"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, ChevronDown, Globe } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  isActive: boolean
  settings?: any
}

interface Clinic {
  id: string
  tenantId: string
  name: string
  address: string
  city: string
  state: string
  phone: string
  isActive: boolean
}

interface TenantSwitcherProps {
  className?: string
}

export function TenantSwitcher({ className }: TenantSwitcherProps) {
  const { data: session } = useSession()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [selectedTenant, setSelectedTenant] = useState<string>(session?.user?.tenantId || "")
  const [selectedClinic, setSelectedClinic] = useState<string>(session?.user?.clinicId || "")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (session) {
      fetchTenants()
      fetchClinics()
    }
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
      const response = await fetch('/api/auth/switch-tenant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tenantId }),
      })

      if (response.ok) {
        setSelectedTenant(tenantId)
        // Reset clinic selection
        setSelectedClinic("")
        // Fetch clinics for new tenant
        const clinicsResponse = await fetch(`/api/clinics?tenantId=${tenantId}`)
        if (clinicsResponse.ok) {
          const clinicsData = await clinicsResponse.json()
          setClinics(clinicsData.clinics || [])
        }
        // Reload page to apply new tenant context
        window.location.reload()
      } else {
        console.error('Failed to switch tenant')
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
      const response = await fetch('/api/auth/switch-clinic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clinicId }),
      })

      if (response.ok) {
        setSelectedClinic(clinicId)
        // Reload page to apply new clinic context
        window.location.reload()
      } else {
        console.error('Failed to switch clinic')
      }
    } catch (error) {
      console.error('Error switching clinic:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentTenant = tenants.find(t => t.id === selectedTenant)
  const currentClinic = clinics.find(c => c.id === selectedClinic)

  if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'CLINIC_ADMIN')) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={`h-9 ${className}`}>
          <Globe className="h-4 w-4 mr-2" />
          {currentTenant ? currentTenant.name : 'Select Tenant'}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Switch Tenant & Clinic</DialogTitle>
          <DialogDescription>
            Select a different tenant or clinic to manage their data and settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* Tenant Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Current Tenant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Select Tenant:</span>
                  <Select value={selectedTenant} onValueChange={handleTenantChange} disabled={loading}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select a tenant" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map((tenant) => (
                        <SelectItem key={tenant.id} value={tenant.id}>
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2" />
                            {tenant.name}
                            {tenant.id === session.user.tenantId && (
                              <Badge variant="secondary" className="ml-2 text-xs">Current</Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {currentTenant && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{currentTenant.name}</h4>
                        <p className="text-xs text-gray-600">{currentTenant.slug}</p>
                        {currentTenant.domain && (
                          <p className="text-xs text-gray-500">{currentTenant.domain}</p>
                        )}
                      </div>
                      <Badge variant={currentTenant.isActive ? "default" : "secondary"}>
                        {currentTenant.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Clinic Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Current Clinic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Select Clinic:</span>
                  <Select value={selectedClinic} onValueChange={handleClinicChange} disabled={loading}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select a clinic" />
                    </SelectTrigger>
                    <SelectContent>
                      {clinics
                        .filter(clinic => clinic.tenantId === selectedTenant)
                        .map((clinic) => (
                          <SelectItem key={clinic.id} value={clinic.id}>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              {clinic.name}
                              {clinic.id === session.user.clinicId && (
                                <Badge variant="secondary" className="ml-2 text-xs">Current</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {currentClinic && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{currentClinic.name}</h4>
                        <p className="text-xs text-gray-600">{currentClinic.address}, {currentClinic.city}</p>
                        <p className="text-xs text-gray-500">{currentClinic.phone}</p>
                      </div>
                      <Badge variant={currentClinic.isActive ? "default" : "secondary"}>
                        {currentClinic.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Switching tenants will change your entire context to that tenant</li>
              <li>• You can only access data from your selected tenant and clinic</li>
              <li>• Some permissions may vary between tenants and clinics</li>
              <li>• All data will be filtered based on your current selection</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}