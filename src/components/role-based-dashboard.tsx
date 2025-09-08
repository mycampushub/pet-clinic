"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { UserRole } from "@/types/auth"
import { 
  Calendar, 
  Users, 
  Package, 
  FileText, 
  CreditCard, 
  Stethoscope,
  Building2,
  UserCheck,
  Pill,
  BarChart3,
  Settings,
  Bell,
  Search,
  Plus,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Activity,
  Heart,
  Flask
} from "lucide-react"

interface DashboardWidget {
  title: string
  value: string | number
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

interface QuickAction {
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
  color: string
}

export function RoleBasedDashboard() {
  const { user, clinic, hasPermission, switchRole } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  if (!user || !clinic) {
    return null
  }

  // Role-specific dashboard widgets
  const getDashboardWidgets = (): DashboardWidget[] => {
    const baseWidgets: DashboardWidget[] = [
      {
        title: "Today's Appointments",
        value: "8",
        description: "2 checked in",
        icon: <Calendar className="h-5 w-5" />,
        trend: { value: 12, isPositive: true }
      }
    ]

    switch (user.role) {
      case "RECEPTIONIST":
        return [
          ...baseWidgets,
          {
            title: "Pending Check-ins",
            value: "3",
            description: "Waiting for provider",
            icon: <Users className="h-5 w-5" />
          },
          {
            title: "Today's Revenue",
            value: "$1,250",
            description: "5 invoices paid",
            icon: <DollarSign className="h-5 w-5" />,
            trend: { value: 8, isPositive: true }
          },
          {
            title: "Phone Calls",
            value: "12",
            description: "5 missed calls",
            icon: <Activity className="h-5 w-5" />
          }
        ]

      case "VETERINARIAN":
        return [
          ...baseWidgets,
          {
            title: "My Patients",
            value: "6",
            description: "2 new patients",
            icon: <Heart className="h-5 w-5" />
          },
          {
            title: "Pending Lab Results",
            value: "3",
            description: "1 critical result",
            icon: <Flask className="h-5 w-5" />
          },
          {
            title: "Prescriptions",
            value: "4",
            description: "2 refills requested",
            icon: <Pill className="h-5 w-5" />
          }
        ]

      case "VET_TECH":
        return [
          ...baseWidgets,
          {
            title: "Lab Orders",
            value: "5",
            description: "2 pending collection",
            icon: <Flask className="h-5 w-5" />
          },
          {
            title: "Inventory Alerts",
            value: "2",
            description: "1 expiring soon",
            icon: <Package className="h-5 w-5" />
          },
          {
            title: "Patient Monitoring",
            value: "8",
            description: "3 post-op patients",
            icon: <Activity className="h-5 w-5" />
          }
        ]

      case "PHARMACIST":
        return [
          {
            title: "Prescription Orders",
            value: "12",
            description: "3 urgent orders",
            icon: <Pill className="h-5 w-5" />
          },
          {
            title: "Inventory Status",
            value: "98%",
            description: "In stock items",
            icon: <Package className="h-5 w-5" />
          },
          {
            title: "Controlled Substances",
            value: "15",
            description: "Requires reconciliation",
            icon: <AlertTriangle className="h-5 w-5" />
          }
        ]

      case "MANAGER":
        return [
          ...baseWidgets,
          {
            title: "Monthly Revenue",
            value: "$45,230",
            description: "15% increase",
            icon: <DollarSign className="h-5 w-5" />,
            trend: { value: 15, isPositive: true }
          },
          {
            title: "Staff Utilization",
            value: "87%",
            description: "Optimal efficiency",
            icon: <BarChart3 className="h-5 w-5" />,
            trend: { value: 5, isPositive: true }
          },
          {
            title: "Patient Satisfaction",
            value: "4.8",
            description: "out of 5.0",
            icon: <TrendingUp className="h-5 w-5" />
          }
        ]

      case "ADMIN":
        return [
          {
            title: "Active Clinics",
            value: "24",
            description: "2 new this month",
            icon: <Building2 className="h-5 w-5" />
          },
          {
            title: "System Health",
            value: "99.9%",
            description: "All systems operational",
            icon: <Activity className="h-5 w-5" />
          },
          {
            title: "Total Users",
            value: "156",
            description: "12 active now",
            icon: <Users className="h-5 w-5" />
          }
        ]

      default:
        return baseWidgets
    }
  }

  // Role-specific quick actions
  const getQuickActions = (): QuickAction[] => {
    switch (user.role) {
      case "RECEPTIONIST":
        return [
          {
            title: "New Appointment",
            description: "Schedule a new patient visit",
            icon: <Plus className="h-5 w-5" />,
            action: () => console.log("New appointment"),
            color: "bg-blue-500 hover:bg-blue-600"
          },
          {
            title: "Check-in Patient",
            description: "Register arriving patient",
            icon: <UserCheck className="h-5 w-5" />,
            action: () => console.log("Check-in patient"),
            color: "bg-green-500 hover:bg-green-600"
          },
          {
            title: "Create Invoice",
            description: "Generate new invoice",
            icon: <CreditCard className="h-5 w-5" />,
            action: () => console.log("Create invoice"),
            color: "bg-purple-500 hover:bg-purple-600"
          }
        ]

      case "VETERINARIAN":
        return [
          {
            title: "Start Visit",
            description: "Begin patient consultation",
            icon: <Stethoscope className="h-5 w-5" />,
            action: () => console.log("Start visit"),
            color: "bg-blue-500 hover:bg-blue-600"
          },
          {
            title: "Write Prescription",
            description: "Prescribe medication",
            icon: <Pill className="h-5 w-5" />,
            action: () => console.log("Write prescription"),
            color: "bg-green-500 hover:bg-green-600"
          },
          {
            title: "Order Lab Test",
            description: "Request laboratory testing",
            icon: <Flask className="h-5 w-5" />,
            action: () => console.log("Order lab test"),
            color: "bg-orange-500 hover:bg-orange-600"
          }
        ]

      case "VET_TECH":
        return [
          {
            title: "Collect Samples",
            description: "Gather lab specimens",
            icon: <Flask className="h-5 w-5" />,
            action: () => console.log("Collect samples"),
            color: "bg-blue-500 hover:bg-blue-600"
          },
          {
            title: "Update Records",
            description: "Document patient vitals",
            icon: <FileText className="h-5 w-5" />,
            action: () => console.log("Update records"),
            color: "bg-green-500 hover:bg-green-600"
          },
          {
            title: "Manage Inventory",
            description: "Check stock levels",
            icon: <Package className="h-5 w-5" />,
            action: () => console.log("Manage inventory"),
            color: "bg-purple-500 hover:bg-purple-600"
          }
        ]

      case "PHARMACIST":
        return [
          {
            title: "Fill Prescription",
            description: "Dispense medication",
            icon: <Pill className="h-5 w-5" />,
            action: () => console.log("Fill prescription"),
            color: "bg-blue-500 hover:bg-blue-600"
          },
          {
            title: "Check Inventory",
            description: "Monitor stock levels",
            icon: <Package className="h-5 w-5" />,
            action: () => console.log("Check inventory"),
            color: "bg-green-500 hover:bg-green-600"
          },
          {
            title: "Order Supplies",
            description: "Reorder medications",
            icon: <Plus className="h-5 w-5" />,
            action: () => console.log("Order supplies"),
            color: "bg-orange-500 hover:bg-orange-600"
          }
        ]

      case "MANAGER":
        return [
          {
            title: "View Reports",
            description: "Analytics and insights",
            icon: <BarChart3 className="h-5 w-5" />,
            action: () => console.log("View reports"),
            color: "bg-blue-500 hover:bg-blue-600"
          },
          {
            title: "Manage Staff",
            description: "Team administration",
            icon: <Users className="h-5 w-5" />,
            action: () => console.log("Manage staff"),
            color: "bg-green-500 hover:bg-green-600"
          },
          {
            title: "Clinic Settings",
            description: "Configure practice preferences",
            icon: <Settings className="h-5 w-5" />,
            action: () => console.log("Clinic settings"),
            color: "bg-purple-500 hover:bg-purple-600"
          }
        ]

      case "ADMIN":
        return [
          {
            title: "Manage Clinics",
            description: "Clinic administration",
            icon: <Building2 className="h-5 w-5" />,
            action: () => console.log("Manage clinics"),
            color: "bg-blue-500 hover:bg-blue-600"
          },
          {
            title: "System Settings",
            description: "Platform configuration",
            icon: <Settings className="h-5 w-5" />,
            action: () => console.log("System settings"),
            color: "bg-green-500 hover:bg-green-600"
          },
          {
            title: "User Management",
            description: "Platform users",
            icon: <Users className="h-5 w-5" />,
            action: () => console.log("User management"),
            color: "bg-purple-500 hover:bg-purple-600"
          }
        ]

      default:
        return []
    }
  }

  // Role-specific navigation items
  const getNavigationItems = () => {
    const baseItems = [
      { label: "Dashboard", value: "overview", icon: <BarChart3 className="h-4 w-4" /> }
    ]

    switch (user.role) {
      case "RECEPTIONIST":
        return [
          ...baseItems,
          { label: "Appointments", value: "appointments", icon: <Calendar className="h-4 w-4" /> },
          { label: "Patients", value: "patients", icon: <Users className="h-4 w-4" /> },
          { label: "Billing", value: "billing", icon: <CreditCard className="h-4 w-4" /> }
        ]

      case "VETERINARIAN":
        return [
          ...baseItems,
          { label: "Schedule", value: "schedule", icon: <Calendar className="h-4 w-4" /> },
          { label: "Patients", value: "patients", icon: <Heart className="h-4 w-4" /> },
          { label: "Medical Records", value: "records", icon: <FileText className="h-4 w-4" /> },
          { label: "Prescriptions", value: "prescriptions", icon: <Pill className="h-4 w-4" /> }
        ]

      case "VET_TECH":
        return [
          ...baseItems,
          { label: "Today's Schedule", value: "schedule", icon: <Calendar className="h-4 w-4" /> },
          { label: "Patient Care", value: "patients", icon: <Heart className="h-4 w-4" /> },
          { label: "Lab Work", value: "lab", icon: <Flask className="h-4 w-4" /> },
          { label: "Inventory", value: "inventory", icon: <Package className="h-4 w-4" /> }
        ]

      case "PHARMACIST":
        return [
          ...baseItems,
          { label: "Prescriptions", value: "prescriptions", icon: <Pill className="h-4 w-4" /> },
          { label: "Inventory", value: "inventory", icon: <Package className="h-4 w-4" /> },
          { label: "Orders", value: "orders", icon: <Plus className="h-4 w-4" /> }
        ]

      case "MANAGER":
        return [
          ...baseItems,
          { label: "Appointments", value: "appointments", icon: <Calendar className="h-4 w-4" /> },
          { label: "Staff", value: "staff", icon: <Users className="h-4 w-4" /> },
          { label: "Financials", value: "financials", icon: <DollarSign className="h-4 w-4" /> },
          { label: "Reports", value: "reports", icon: <BarChart3 className="h-4 w-4" /> },
          { label: "Settings", value: "settings", icon: <Settings className="h-4 w-4" /> }
        ]

      case "ADMIN":
        return [
          ...baseItems,
          { label: "Clinics", value: "clinics", icon: <Building2 className="h-4 w-4" /> },
          { label: "Users", value: "users", icon: <Users className="h-4 w-4" /> },
          { label: "Analytics", value: "analytics", icon: <BarChart3 className="h-4 w-4" /> },
          { label: "System", value: "system", icon: <Settings className="h-4 w-4" /> }
        ]

      default:
        return baseItems
    }
  }

  const widgets = getDashboardWidgets()
  const quickActions = getQuickActions()
  const navigationItems = getNavigationItems()

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "RECEPTIONIST": return "bg-blue-100 text-blue-800"
      case "VETERINARIAN": return "bg-green-100 text-green-800"
      case "VET_TECH": return "bg-purple-100 text-purple-800"
      case "PHARMACIST": return "bg-orange-100 text-orange-800"
      case "MANAGER": return "bg-indigo-100 text-indigo-800"
      case "ADMIN": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PC</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">PetClinic Pro</h1>
              </div>
              <div className="text-sm text-gray-500">|</div>
              <div>
                <div className="font-medium text-gray-900">{clinic.name}</div>
                <div className="text-sm text-gray-500">{clinic.address}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <Badge className={`text-xs ${getRoleBadgeColor(user.role)}`}>
                    {user.role.replace("_", " ")}
                  </Badge>
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="w-full">
              <TabsList className="grid grid-cols-1 h-auto bg-transparent p-0 space-y-1">
                {navigationItems.map((item) => (
                  <TabsTrigger
                    key={item.value}
                    value={item.value}
                    className="w-full justify-start data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200 border border-transparent hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Role Switcher (Demo) */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Switch Role (Demo)</div>
            <select
              value={user.role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              className="w-full p-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="RECEPTIONIST">Receptionist</option>
              <option value="VETERINARIAN">Veterinarian</option>
              <option value="VET_TECH">Veterinary Technician</option>
              <option value="PHARMACIST">Pharmacist</option>
              <option value="MANAGER">Practice Manager</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} className="space-y-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h2>
                <p className="text-gray-600">Here's what's happening at {clinic.name} today.</p>
              </div>

              {/* Dashboard Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {widgets.map((widget, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{widget.title}</CardTitle>
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {widget.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{widget.value}</div>
                      <p className="text-xs text-muted-foreground">{widget.description}</p>
                      {widget.trend && (
                        <div className={`flex items-center text-xs mt-1 ${
                          widget.trend.isPositive ? "text-green-600" : "text-red-600"
                        }`}>
                          {widget.trend.isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : "↓"}
                          {widget.trend.isPositive ? "+" : ""}{widget.trend.value}%
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks for your role</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`p-4 rounded-lg text-left hover:shadow-md transition-shadow ${action.color} text-white`}
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          {action.icon}
                          <div className="font-medium">{action.title}</div>
                        </div>
                        <div className="text-sm opacity-90">{action.description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Today's Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Schedule</CardTitle>
                  <CardDescription>Your upcoming appointments and tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "09:00", patient: "Rex (Labrador)", type: "Annual Checkup", status: "Scheduled" },
                      { time: "09:30", patient: "Luna (Cat)", type: "Vaccination", status: "Checked In" },
                      { time: "10:00", patient: "Max (German Shepherd)", type: "Dental Cleaning", status: "In Progress" },
                      { time: "10:30", patient: "Bella (Siamese)", type: "Follow-up", status: "Scheduled" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium">{item.time}</div>
                          <div>
                            <div className="font-medium">{item.patient}</div>
                            <div className="text-sm text-gray-500">{item.type}</div>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            item.status === "Scheduled" ? "bg-blue-100 text-blue-800" :
                            item.status === "Checked In" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs would go here */}
            {navigationItems.slice(1).map((item) => (
              <TabsContent key={item.value} value={item.value}>
                <Card>
                  <CardHeader>
                    <CardTitle>{item.label}</CardTitle>
                    <CardDescription>
                      {item.label} management and features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This section would contain {item.label.toLowerCase()} specific features and functionality.</p>
                    <div className="mt-4">
                      <Button>Explore {item.label}</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  )
}