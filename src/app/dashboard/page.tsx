"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TenantSwitcher } from "@/components/tenant-switcher"
import { 
  Calendar, 
  Heart, 
  Users, 
  FileText, 
  CreditCard, 
  Package, 
  Bell, 
  Video, 
  BarChart3, 
  Building2,
  Stethoscope,
  Phone,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  UserPlus,
  Activity
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface DashboardStats {
  todayAppointments: number
  completedAppointments: number
  pendingInvoices: number
  lowInventoryItems: number
  upcomingReminders: number
  newPatients: number
  revenueToday: number
}

interface RecentAppointment {
  id: string
  petName: string
  ownerName: string
  time: string
  type: string
  status: string
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    completedAppointments: 0,
    pendingInvoices: 0,
    lowInventoryItems: 0,
    upcomingReminders: 0,
    newPatients: 0,
    revenueToday: 0
  })
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/dashboard')
        if (response.ok) {
          const data = await response.json()
          setStats(data.stats)
          setRecentAppointments(data.recentAppointments)
        } else {
          throw new Error('Failed to fetch dashboard data')
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // Set default empty values on error
        setStats({
          todayAppointments: 0,
          completedAppointments: 0,
          pendingInvoices: 0,
          lowInventoryItems: 0,
          upcomingReminders: 0,
          newPatients: 0,
          revenueToday: 0
        })
        setRecentAppointments([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getRoleSpecificContent = () => {
    switch (session?.user?.role) {
      case UserRole.VETERINARIAN:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayAppointments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(stats.completedAppointments || 0)} completed
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Patients Today</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayAppointments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {(stats.newPatients || 0)} new patients
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lab Orders</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  2 pending results
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  3 need refill
                </p>
              </CardContent>
            </Card>
          </div>
        )
      
      case UserRole.RECEPTIONIST:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayAppointments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  2 walk-ins waiting
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.completedAppointments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  4 pending check-in
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Phone Calls</CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  3 messages
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Clients</CardTitle>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.newPatients || 0}</div>
                <p className="text-xs text-muted-foreground">
                  registered today
                </p>
              </CardContent>
            </Card>
          </div>
        )
      
      case UserRole.CLINIC_ADMIN:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(stats.revenueToday || 0).toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from yesterday
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayAppointments || 0}</div>
                <p className="text-xs text-muted-foreground">
                  85% utilization
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingInvoices || 0}</div>
                <p className="text-xs text-muted-foreground">
                  ${850.00} outstanding
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Staff Performance</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">
                  satisfaction rate
                </p>
              </CardContent>
            </Card>
          </div>
        )
      
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Welcome</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">PetClinic</div>
                <p className="text-xs text-muted-foreground">
                  Management System
                </p>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  const getQuickActions = () => {
    switch (session?.user?.role) {
      case UserRole.VETERINARIAN:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col" onClick={() => window.location.href = '/clinical'}>
              <Stethoscope className="h-6 w-6 mb-2" />
              New Consultation
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/clinical/procedures'}>
              <FileText className="h-6 w-6 mb-2" />
              Lab Orders
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/clinical/prescriptions'}>
              <Activity className="h-6 w-6 mb-2" />
              Prescriptions
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/integrations'}>
              <Video className="h-6 w-6 mb-2" />
              Telemedicine
            </Button>
          </div>
        )
      
      case UserRole.RECEPTIONIST:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col" onClick={() => window.location.href = '/appointments'}>
              <Calendar className="h-6 w-6 mb-2" />
              Book Appointment
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/patients'}>
              <Users className="h-6 w-6 mb-2" />
              Check-in Patient
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/billing'}>
              <CreditCard className="h-6 w-6 mb-2" />
              Create Invoice
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/appointments'}>
              <Phone className="h-6 w-6 mb-2" />
              Call Client
            </Button>
          </div>
        )
      
      case UserRole.CLINIC_ADMIN:
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col" onClick={() => window.location.href = '/reports'}>
              <BarChart3 className="h-6 w-6 mb-2" />
              View Reports
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/tenant-admin/users'}>
              <Users className="h-6 w-6 mb-2" />
              Manage Staff
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/inventory'}>
              <Package className="h-6 w-6 mb-2" />
              Inventory
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => window.location.href = '/tenant-admin/clinics'}>
              <Building2 className="h-6 w-6 mb-2" />
              Clinic Settings
            </Button>
          </div>
        )
      
      default:
        return null
    }
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
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">PetClinic Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <TenantSwitcher />
              <Badge variant="outline">
                {session?.user?.role?.replace('_', ' ')}
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
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {session?.user?.name?.split(' ')[0]}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening at your clinic today.
          </p>
        </div>

        {/* Role-specific stats */}
        {getRoleSpecificContent()}

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          {getQuickActions()}
        </div>

        {/* Tabs for different sections */}
        <div className="mt-8">
          <Tabs defaultValue="appointments" className="space-y-4">
            <TabsList>
              <TabsTrigger value="appointments">Today's Appointments</TabsTrigger>
              <TabsTrigger value="alerts">Alerts & Reminders</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>
                    Your appointments for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <Clock className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">{appointment.petName}</p>
                            <p className="text-sm text-gray-500">{appointment.ownerName}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-medium">{appointment.time}</p>
                            <p className="text-xs text-gray-500">{appointment.type}</p>
                          </div>
                          <Badge 
                            variant={
                              appointment.status === 'completed' ? 'default' :
                              appointment.status === 'in-progress' ? 'secondary' :
                              'outline'
                            }
                          >
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alerts">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
                      Inventory Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Amoxicillin 250mg</span>
                        <Badge variant="destructive">2 left</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Pain Relief Syrup</span>
                        <Badge variant="outline">Expiring soon</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Vaccine Kit</span>
                        <Badge variant="outline">Low stock</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-blue-600" />
                      Upcoming Reminders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Max - Vaccination</p>
                          <p className="text-xs text-gray-500">Due tomorrow</p>
                        </div>
                        <Badge variant="outline">Vaccine</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Luna - Medication</p>
                          <p className="text-xs text-gray-500">Refill needed</p>
                        </div>
                        <Badge variant="outline">Meds</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates from your clinic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm">John Smith completed payment for Max's consultation</p>
                        <p className="text-xs text-gray-500">2 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm">Lab results received for Luna's blood test</p>
                        <p className="text-xs text-gray-500">15 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                      <UserPlus className="h-5 w-5 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm">New patient Charlie registered</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}