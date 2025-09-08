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
  Mail
} from "lucide-react"
import Link from "next/link"

type UserRole = "CLINIC_OWNER" | "VETERINARIAN" | "VET_TECH" | "RECEPTIONIST" | "PHARMACIST" | "MANAGER" | "ADMIN"

interface Appointment {
  id: string
  time: string
  petName: string
  ownerName: string
  provider: string
  service: string
  status: "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED"
}

interface Invoice {
  id: string
  invoiceNumber: string
  petName: string
  ownerName: string
  amount: number
  status: "PENDING" | "PAID" | "OVERDUE"
}

interface InventoryAlert {
  id: string
  itemName: string
  alertType: "LOW_STOCK" | "EXPIRING" | "OUT_OF_STOCK"
  quantity: number
  details: string
}

interface DashboardStats {
  totalAppointments: number
  pendingInvoices: number
  inventoryAlerts: number
  checkIns: number
  totalRevenue: number
  activePatients: number
}

export default function Dashboard() {
  const [userRole, setUserRole] = useState<UserRole>("RECEPTIONIST")
  const [userName, setUserName] = useState("John Doe")
  const [clinicName, setClinicName] = useState("Happy Paws Veterinary Clinic")
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  useEffect(() => {
    // Get user role from localStorage (for demo purposes)
    const savedRole = localStorage.getItem('userRole')
    const savedClinicName = localStorage.getItem('clinicName')
    if (savedRole) {
      setUserRole(savedRole as UserRole)
    }
    if (savedClinicName) {
      setClinicName(savedClinicName)
    }
  }, [])

  // Sample data
  const todayAppointments: Appointment[] = [
    { id: "1", time: "09:00", petName: "Rex", ownerName: "John Doe", provider: "Dr. Smith", service: "Annual Checkup", status: "SCHEDULED" },
    { id: "2", time: "09:30", petName: "Luna", ownerName: "Jane Smith", provider: "Dr. Johnson", service: "Vaccination", status: "CHECKED_IN" },
    { id: "3", time: "10:00", petName: "Max", ownerName: "Bob Wilson", provider: "Dr. Smith", service: "Dental Cleaning", status: "IN_PROGRESS" },
    { id: "4", time: "10:30", petName: "Bella", ownerName: "Alice Brown", provider: "Dr. Johnson", service: "Follow-up", status: "SCHEDULED" },
  ]

  const pendingInvoices: Invoice[] = [
    { id: "1", invoiceNumber: "INV-001", petName: "Rex", ownerName: "John Doe", amount: 85.00, status: "PENDING" },
    { id: "2", invoiceNumber: "INV-002", petName: "Luna", ownerName: "Jane Smith", amount: 45.50, status: "PENDING" },
    { id: "3", invoiceNumber: "INV-003", petName: "Charlie", ownerName: "Mike Davis", amount: 120.00, status: "OVERDUE" },
  ]

  const inventoryAlerts: InventoryAlert[] = [
    { id: "1", itemName: "Amoxicillin 250mg", alertType: "LOW_STOCK", quantity: 5, details: "Reorder soon" },
    { id: "2", itemName: "Pain Relief Syrup", alertType: "EXPIRING", quantity: 12, details: "Expires in 7 days" },
    { id: "3", itemName: "Vaccine Kit", alertType: "OUT_OF_STOCK", quantity: 0, details: "Urgent reorder needed" },
  ]

  const stats: DashboardStats = {
    totalAppointments: todayAppointments.length,
    pendingInvoices: pendingInvoices.length,
    inventoryAlerts: inventoryAlerts.length,
    checkIns: todayAppointments.filter(a => a.status === "CHECKED_IN").length,
    totalRevenue: 15450.00,
    activePatients: 1247
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "bg-blue-100 text-blue-800"
      case "CHECKED_IN": return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS": return "bg-green-100 text-green-800"
      case "COMPLETED": return "bg-gray-100 text-gray-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "PAID": return "bg-green-100 text-green-800"
      case "OVERDUE": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "LOW_STOCK": return <Package className="h-4 w-4 text-yellow-500" />
      case "EXPIRING": return <Clock className="h-4 w-4 text-orange-500" />
      case "OUT_OF_STOCK": return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case "CLINIC_OWNER": return <Building className="h-5 w-5" />
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
      case "CLINIC_OWNER": return "Clinic Owner"
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
    localStorage.removeItem('userRole')
    localStorage.removeItem('clinicName')
    localStorage.removeItem('clinicId')
    router.push('/auth/login')
  }

  const renderOwnerDashboard = () => (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePatients}</div>
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
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{stats.pendingInvoices} outstanding</p>
          </CardContent>
        </Card>
      </div>

      {/* Business Analytics */}
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
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium">{appointment.time}</div>
                  <div>
                    <div className="font-medium">{appointment.petName}</div>
                    <div className="text-sm text-muted-foreground">{appointment.ownerName}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
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
            <Button className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              New SOAP Note
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Pill className="h-4 w-4 mr-2" />
              Prescribe Medication
            </Button>
            <Button variant="outline" className="w-full justify-start">
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
              {stats.checkIns} checked in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingInvoices} outstanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.checkIns}</div>
            <p className="text-xs text-muted-foreground">
              Waiting for provider
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              Today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Appointments List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Appointments</CardTitle>
              <CardDescription>Manage your clinic's schedule</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium">{appointment.time}</div>
                  <div>
                    <div className="font-medium">{appointment.petName}</div>
                    <div className="text-sm text-muted-foreground">{appointment.ownerName}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">{appointment.provider}</div>
                  <Button size="sm" variant="outline">
                    Check In
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Register New Patient
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">New patient registered</div>
                <div className="text-muted-foreground">Bella Smith - 10 min ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Appointment scheduled</div>
                <div className="text-muted-foreground">Max Wilson - 30 min ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Payment received</div>
                <div className="text-muted-foreground">Invoice #001 - 1 hour ago</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderDashboardContent = () => {
    switch (userRole) {
      case "CLINIC_OWNER":
        return renderOwnerDashboard()
      case "VETERINARIAN":
        return renderVeterinarianDashboard()
      case "RECEPTIONIST":
        return renderReceptionistDashboard()
      default:
        return renderReceptionistDashboard() // Fallback
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold">PetClinic Pro</span>
              </div>
              <div className="text-sm text-gray-600">
                {clinicName}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="relative">
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="font-medium">{userName}</div>
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(userRole)}
                    <span className="text-sm text-gray-600">{getRoleDisplayName(userRole)}</span>
                  </div>
                </div>
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-64 bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              <Link href="/dashboard" className="flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700">
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              
              <Link href="/appointments" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                <Calendar className="h-5 w-5" />
                <span>Appointments</span>
              </Link>
              
              <Link href="/patients" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                <Users className="h-5 w-5" />
                <span>Patients</span>
              </Link>
              
              <Link href="/visits" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                <Stethoscope className="h-5 w-5" />
                <span>Visits</span>
              </Link>
              
              <Link href="/billing" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                <FileText className="h-5 w-5" />
                <span>Billing</span>
              </Link>
              
              <Link href="/inventory" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                <Package className="h-5 w-5" />
                <span>Inventory</span>
              </Link>
              
              {(userRole === "CLINIC_OWNER" || userRole === "MANAGER") && (
                <>
                  <Link href="/reports" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                    <BarChart3 className="h-5 w-5" />
                    <span>Reports</span>
                  </Link>
                  
                  <Link href="/settings" className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Dashboard Content */}
          <div className="flex-1">
            {renderDashboardContent()}
          </div>
        </div>
      </div>
    </div>
  )
}