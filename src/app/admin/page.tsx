"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Users, 
  Building2, 
  Activity, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  Settings,
  Shield,
  Database,
  BarChart3,
  UserPlus,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import { UserRole } from "@prisma/client"

interface Tenant {
  id: string
  name: string
  slug: string
  domain?: string
  isActive: boolean
  createdAt: string
  userCount: number
  clinicCount: number
  revenue: number
}

interface SystemStats {
  totalTenants: number
  activeTenants: number
  totalUsers: number
  totalClinics: number
  systemRevenue: number
  newTenantsThisMonth: number
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<SystemStats>({
    totalTenants: 0,
    activeTenants: 0,
    totalUsers: 0,
    totalClinics: 0,
    systemRevenue: 0,
    newTenantsThisMonth: 0
  })
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true)
      try {
        const [statsResponse, tenantsResponse] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/tenants')
        ])

        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }

        if (tenantsResponse.ok) {
          const tenantsData = await tenantsResponse.json()
          setTenants(tenantsData)
        }
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  // Only allow ADMIN users
  if (session?.user?.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              You don't have permission to access the admin dashboard.
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
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-purple-100 text-purple-700">
                Super Admin
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
            Welcome to Admin Panel
          </h2>
          <p className="text-gray-600">
            Manage all tenants, users, and system-wide settings
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tenants">Tenants</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalTenants}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.activeTenants} active
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    across all tenants
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clinics</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClinics}</div>
                  <p className="text-xs text-muted-foreground">
                    active locations
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.systemRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    this month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Tenant Signups</CardTitle>
                  <CardDescription>New tenants this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tenants.slice(0, 5).map((tenant) => (
                      <div key={tenant.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{tenant.name}</p>
                          <p className="text-sm text-gray-500">{tenant.slug}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={tenant.isActive ? "default" : "secondary"}>
                            {tenant.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(tenant.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Current system status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Database Status</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Healthy
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>API Response Time</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        45ms
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Storage Usage</span>
                      <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                        67%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active Connections</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        124
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tenants" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  All Tenants
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Tenant
                  </Button>
                </CardTitle>
                <CardDescription>
                  Manage all tenant accounts and their settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Domain</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Clinics</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants.map((tenant) => (
                      <TableRow key={tenant.id}>
                        <TableCell className="font-medium">{tenant.name}</TableCell>
                        <TableCell>{tenant.slug}</TableCell>
                        <TableCell>{tenant.domain || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={tenant.isActive ? "default" : "secondary"}>
                            {tenant.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>{tenant.userCount}</TableCell>
                        <TableCell>{tenant.clinicCount}</TableCell>
                        <TableCell>${tenant.revenue.toLocaleString()}</TableCell>
                        <TableCell>{new Date(tenant.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Users</CardTitle>
                <CardDescription>
                  Manage all users across all tenants
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User management interface will be implemented here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>User Registration</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tenant Creation</span>
                      <Badge variant="default">Auto</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Verification</span>
                      <Badge variant="default">Required</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Default User Role</span>
                      <Badge variant="default">STAFF</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Database Type</span>
                      <Badge variant="default">SQLite</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Connection Pool</span>
                      <Badge variant="default">10</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Backup Schedule</span>
                      <Badge variant="default">Daily</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Retention Period</span>
                      <Badge variant="default">30 days</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}