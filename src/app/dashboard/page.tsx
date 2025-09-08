"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  Clock, 
  Users, 
  Package, 
  AlertTriangle, 
  Plus, 
  Search,
  Settings,
  LogOut,
  Bell,
  BarChart3,
  FileText,
  Heart,
  Shield,
  Building,
  User,
  Activity,
  TrendingUp,
  DollarSign,
  Stethoscope,
  Phone,
  Mail,
  Pill
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

interface Appointment {
  id: string
  startTime: string
  endTime: string
  pet: {
    name: string
    owner: {
      name: string
      email: string
      phone: string
    }
  }
  provider: {
    name: string
    role: string
  }
  serviceCode: string
  title: string
  status: "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "NO_SHOW"
}

interface Pet {
  id: string
  name: string
  species: string
  breed: string
  owner: {
    name: string
    email: string
    phone: string
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
}

interface InventoryItem {
  id: string
  name: string
  quantity: number
  reorderPoint: number
  expiryDate?: string
  category: string
  isControlled: boolean
}

interface DashboardStats {
  totalAppointments: number
  checkedInAppointments: number
  totalPets: number
  totalUsers: number
  lowStockItems: number
  expiringItems: number
  controlledSubstances: number
}

type UserRole = "RECEPTIONIST" | "VETERINARIAN" | "VET_TECH" | "PHARMACIST" | "MANAGER" | "ADMIN" | "OWNER"

export default function Dashboard() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    checkedInAppointments: 0,
    totalPets: 0,
    totalUsers: 0,
    lowStockItems: 0,
    expiringItems: 0,
    controlledSubstances: 0
  })
  const [loading, setLoading] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Fetch dashboard data
  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch appointments for today
      const today = new Date().toISOString().split('T')[0]
      const appointmentsResponse = await fetch(`/api/v1/appointments?date=${today}`)
      if (appointmentsResponse.ok) {
        const appointmentsData = await appointmentsResponse.json()
        setAppointments(appointmentsData)
      }

      // Fetch pets
      const petsResponse = await fetch('/api/v1/pets')
      if (petsResponse.ok) {
        const petsData = await petsResponse.json()
        setPets(petsData)
      }

      // Fetch users
      const usersResponse = await fetch('/api/v1/users')
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData)
      }

      // Fetch inventory
      const inventoryResponse = await fetch('/api/v1/inventory')
      if (inventoryResponse.ok) {
        const inventoryData = await inventoryResponse.json()
        setInventory(inventoryData)
      }

      // Calculate stats
      const checkedIn = appointments.filter(apt => apt.status === "CHECKED_IN").length
      const lowStock = inventory.filter(item => item.quantity <= item.reorderPoint).length
      const expiring = inventory.filter(item => 
        item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length
      const controlled = inventory.filter(item => item.isControlled).length

      setStats({
        totalAppointments: appointments.length,
        checkedInAppointments: checkedIn,
        totalPets: pets.length,
        totalUsers: users.length,
        lowStockItems: lowStock,
        expiringItems: expiring,
        controlledSubstances: controlled
      })

    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const userRole = user.role as UserRole
  const userName = user.name

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "bg-blue-100 text-blue-800"
      case "CHECKED_IN": return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS": return "bg-green-100 text-green-800"
      case "COMPLETED": return "bg-gray-100 text-gray-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      case "NO_SHOW": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "OWNER": return <Building className="h-5 w-5" />
      case "VETERINARIAN": return <Stethoscope className="h-5 w-5" />
      case "VET_TECH": return <Shield className="h-5 w-5" />
      case "RECEPTIONIST": return <Phone className="h-5 w-5" />
      case "PHARMACIST": return <Package className="h-5 w-5" />
      case "MANAGER": return <BarChart3 className="h-5 w-5" />
      case "ADMIN": return <Settings className="h-5 w-5" />
      default: return <User className="h-5 w-5" />
    }
  }

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case "OWNER": return "Clinic Owner"
      case "VETERINARIAN": return "Veterinarian"
      case "VET_TECH": return "Veterinary Technician"
      case "RECEPTIONIST": return "Receptionist"
      case "PHARMACIST": return "Pharmacist"
      case "MANAGER": return "Practice Manager"
      case "ADMIN": return "Administrator"
      default: return role
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleNewAppointment = () => {
    // For now, show an alert since the appointment creation page doesn't exist yet
    alert("Appointment creation feature would be implemented here. This would navigate to /appointments/new")
  }

  const handleViewAppointment = (appointmentId: string) => {
    // For now, show an alert since the appointment detail page doesn't exist yet
    alert(`Viewing appointment ${appointmentId}. This would navigate to /appointments/${appointmentId}`)
  }

  const handleNewSoapNote = () => {
    // For now, show an alert since the SOAP note page doesn't exist yet
    alert("SOAP note creation feature would be implemented here. This would navigate to /medical/soap/new")
  }

  const handlePrescribeMedication = () => {
    // For now, show an alert since the prescription page doesn't exist yet
    alert("Medication prescription feature would be implemented here. This would navigate to /pharmacy/prescribe")
  }

  const handleOrderLabTest = () => {
    // For now, show an alert since the lab order page doesn't exist yet
    alert("Lab test ordering feature would be implemented here. This would navigate to /laboratory/orders/new")
  }

  const handleViewNotifications = () => {
    // For now, show an alert since the notifications page doesn't exist yet
    alert("Notifications center would be implemented here. This would navigate to /notifications")
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const renderDashboardHeader = () => (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userName}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${getRoleIcon(userRole).props.className.includes('text-') ? 'bg-blue-100 text-blue-600' : 'bg-blue-100 text-blue-600'}`}>
            {getRoleIcon(userRole)}
          </div>
          <div>
            <div className="font-medium">{userName}</div>
            <div className="text-sm text-muted-foreground">{getRoleDisplayName(userRole)}</div>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleViewNotifications}>
          <Bell className="h-4 w-4 mr-2" />
          Notifications
        </Button>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  )

  const renderOverviewDashboard = () => (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.checkedInAppointments} checked in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPets}</div>
            <p className="text-xs text-muted-foreground">Registered pets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems + stats.expiringItems}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockItems} low stock, {stats.expiringItems} expiring
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Schedule</CardTitle>
              <CardDescription>Upcoming appointments and check-ins</CardDescription>
            </div>
            <Button onClick={handleNewAppointment}>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No appointments scheduled for today
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium">{formatTime(appointment.startTime)}</div>
                    <div>
                      <div className="font-medium">{appointment.pet.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.pet.owner.name} • {appointment.serviceCode}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.replace('_', ' ')}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {appointment.provider.name}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleViewAppointment(appointment.id)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderVeterinarianDashboard = () => (
    <div className="space-y-6">
      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>Your appointments and patient visits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium">{formatTime(appointment.startTime)}</div>
                  <div>
                    <div className="font-medium">{appointment.pet.name}</div>
                    <div className="text-sm text-muted-foreground">{appointment.pet.owner.name}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status.replace('_', ' ')}
                  </Badge>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" onClick={handleNewSoapNote}>
              <FileText className="h-4 w-4 mr-2" />
              New SOAP Note
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handlePrescribeMedication}>
              <Pill className="h-4 w-4 mr-2" />
              Prescribe Medication
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleOrderLabTest}>
              <Package className="h-4 w-4 mr-2" />
              Order Lab Test
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Completed: Rex - Annual Exam</div>
                <div className="text-muted-foreground">2 hours ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Prescribed: Luna - Antibiotics</div>
                <div className="text-muted-foreground">3 hours ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Reviewed: Max - Blood Work</div>
                <div className="text-muted-foreground">5 hours ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Patients Seen</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Procedures</span>
                <span className="text-sm font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Revenue Generated</span>
                <span className="text-sm font-medium">$1,240</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderReceptionistDashboard = () => (
    <div className="space-y-6">
      {/* Main Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {stats.checkedInAppointments} checked in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPets}</div>
            <p className="text-xs text-muted-foreground">Registered pets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active staff</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems + stats.expiringItems}</div>
            <p className="text-xs text-muted-foreground">
              {stats.lowStockItems} low stock, {stats.expiringItems} expiring
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>Manage your clinic's schedule</CardDescription>
            </div>
            <Button onClick={handleNewAppointment}>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No appointments scheduled for today
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium">{formatTime(appointment.startTime)}</div>
                    <div>
                      <div className="font-medium">{appointment.pet.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {appointment.pet.owner.name} • {appointment.serviceCode}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status.replace('_', ' ')}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {appointment.provider.name}
                    </div>
                    <Button size="sm" variant="outline">
                      Check In
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderPharmacistDashboard = () => (
    <div className="space-y-6">
      {/* Inventory Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Require reordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.expiringItems}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Controlled Substances</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.controlledSubstances}</div>
            <p className="text-xs text-muted-foreground">Require special handling</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">In inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {inventory.filter(item => item.quantity <= item.reorderPoint || 
            (item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
          ).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No inventory alerts at this time
            </div>
          ) : (
            <div className="space-y-4">
              {inventory
                .filter(item => item.quantity <= item.reorderPoint || 
                  (item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
                )
                .map((item) => {
                  const isLowStock = item.quantity <= item.reorderPoint
                  const isExpiring = item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.category} • {item.quantity} in stock
                        </div>
                        {item.expiryDate && (
                          <div className="text-xs text-muted-foreground">
                            Expires: {new Date(item.expiryDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {isLowStock && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Low Stock
                          </Badge>
                        )}
                        {isExpiring && (
                          <Badge className="bg-orange-100 text-orange-800">
                            Expiring Soon
                          </Badge>
                        )}
                        {item.isControlled && (
                          <Badge className="bg-red-100 text-red-800">
                            Controlled
                          </Badge>
                        )}
                        <Button size="sm" variant="outline">
                          Order More
                        </Button>
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  const renderManagerDashboard = () => (
    <div className="space-y-6">
      {/* Business Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$15,450</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPets}</div>
            <p className="text-xs text-muted-foreground">+8% growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">Today's schedule</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active staff members</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Monthly revenue overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-gray-400" />
              <span className="ml-2 text-gray-500">Revenue Chart Placeholder</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clinic Performance</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Patient Satisfaction</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  <span className="text-sm">92%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Appointment Fill Rate</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                  <span className="text-sm">87%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Revenue Growth</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm">78%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAdminDashboard = () => (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Active tenants</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clinics</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Registered clinics</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">System-wide</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pets</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPets}</div>
            <p className="text-xs text-muted-foreground">Registered patients</p>
          </CardContent>
        </Card>
      </div>

      {/* System Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>System-wide user activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">User Login: reception@petclinic.com</div>
                <div className="text-muted-foreground">2 minutes ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Appointment Created: Rex - Annual Checkup</div>
                <div className="text-muted-foreground">15 minutes ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">New User Registered: Emily Davis</div>
                <div className="text-muted-foreground">1 hour ago</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>System status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Database Status</span>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>API Response Time</span>
                <span className="text-sm font-medium">45ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Active Sessions</span>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Storage Usage</span>
                <span className="text-sm font-medium">2.3 GB / 10 GB</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderDashboardContent = () => {
    switch (userRole) {
      case "VETERINARIAN":
        return renderVeterinarianDashboard()
      case "RECEPTIONIST":
        return renderReceptionistDashboard()
      case "PHARMACIST":
        return renderPharmacistDashboard()
      case "MANAGER":
        return renderManagerDashboard()
      case "ADMIN":
        return renderAdminDashboard()
      case "OWNER":
        return renderManagerDashboard() // Owner sees same as manager for now
      default:
        return renderOverviewDashboard()
    }
  }

  return (
    <div className="container mx-auto py-8">
      {renderDashboardHeader()}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {renderDashboardContent()}
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Management</CardTitle>
              <CardDescription>Manage all appointments and scheduling</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Appointment management interface would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>Manage patient records and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Patient management interface would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Manage medications, supplies, and stock levels</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Inventory management interface would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Invoicing</CardTitle>
              <CardDescription>Manage invoices, payments, and billing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Billing management interface would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports & Analytics</CardTitle>
              <CardDescription>View reports and business analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Reports and analytics would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}