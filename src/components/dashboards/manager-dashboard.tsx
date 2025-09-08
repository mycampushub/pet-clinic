"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, DollarSign, Users, TrendingUp, TrendingDown, AlertTriangle, Plus, Search, BarChart3, PieChart, Activity } from "lucide-react"

interface FinancialMetric {
  period: string
  revenue: number
  expenses: number
  profit: number
  appointments: number
  newClients: number
}

interface StaffPerformance {
  id: string
  name: string
  role: string
  appointments: number
  revenue: number
  satisfaction: number
}

interface InventorySummary {
  category: string
  totalItems: number
  lowStock: number
  expiring: number
  value: number
}

interface ClinicMetric {
  name: string
  value: number
  change: number
  trend: "up" | "down"
  icon: React.ReactNode
}

export function ManagerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  // Sample data for manager dashboard
  const financialData: FinancialMetric[] = [
    { period: "Jan", revenue: 45000, expenses: 32000, profit: 13000, appointments: 180, newClients: 25 },
    { period: "Feb", revenue: 48000, expenses: 33000, profit: 15000, appointments: 195, newClients: 28 },
    { period: "Mar", revenue: 52000, expenses: 35000, profit: 17000, appointments: 210, newClients: 32 },
    { period: "Apr", revenue: 49000, expenses: 34000, profit: 15000, appointments: 200, newClients: 30 },
    { period: "May", revenue: 55000, expenses: 36000, profit: 19000, appointments: 220, newClients: 35 },
    { period: "Jun", revenue: 58000, expenses: 37000, profit: 21000, appointments: 235, newClients: 38 },
  ]

  const staffPerformance: StaffPerformance[] = [
    { id: "1", name: "Dr. Smith", role: "Veterinarian", appointments: 45, revenue: 12500, satisfaction: 4.8 },
    { id: "2", name: "Dr. Johnson", role: "Veterinarian", appointments: 42, revenue: 11800, satisfaction: 4.9 },
    { id: "3", name: "Sarah Wilson", role: "Receptionist", appointments: 180, revenue: 0, satisfaction: 4.7 },
    { id: "4", name: "Mike Davis", role: "Vet Tech", appointments: 85, revenue: 0, satisfaction: 4.6 },
  ]

  const inventorySummary: InventorySummary[] = [
    { category: "Medications", totalItems: 156, lowStock: 12, expiring: 8, value: 25000 },
    { category: "Vaccines", totalItems: 45, lowStock: 5, expiring: 3, value: 8500 },
    { category: "Supplies", totalItems: 234, lowStock: 18, expiring: 2, value: 12000 },
    { category: "Equipment", totalItems: 67, lowStock: 3, expiring: 0, value: 45000 },
  ]

  const clinicMetrics: ClinicMetric[] = [
    { name: "Monthly Revenue", value: 58000, change: 12.5, trend: "up", icon: <DollarSign className="h-4 w-4" /> },
    { name: "Appointments", value: 235, change: 8.2, trend: "up", icon: <Calendar className="h-4 w-4" /> },
    { name: "New Clients", value: 38, change: 15.2, trend: "up", icon: <Users className="h-4 w-4" /> },
    { name: "Profit Margin", value: 36.2, change: 3.1, trend: "up", icon: <TrendingUp className="h-4 w-4" /> },
  ]

  const getTrendIcon = (trend: "up" | "down") => {
    return trend === "up" ? <TrendingUp className="h-3 w-3 text-green-600" /> : <TrendingDown className="h-3 w-3 text-red-600" />
  }

  const getTrendColor = (trend: "up" | "down") => {
    return trend === "up" ? "text-green-600" : "text-red-600"
  }

  const currentPeriod = financialData[financialData.length - 1]
  const previousPeriod = financialData[financialData.length - 2]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <p className="text-muted-foreground">
            Clinic performance overview and management insights.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {clinicMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              <div className="text-muted-foreground">{metric.icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.name.includes("Margin") ? `${metric.value}%` : 
                 metric.name.includes("Revenue") ? `$${metric.value.toLocaleString()}` : 
                 metric.value}
              </div>
              <div className={`flex items-center text-xs ${getTrendColor(metric.trend)}`}>
                {getTrendIcon(metric.trend)}
                <span className="ml-1">{metric.change}% from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="staff">Staff Performance</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue and profit overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.slice(-6).map((data) => (
                    <div key={data.period} className="flex items-center justify-between">
                      <div className="font-medium">{data.period}</div>
                      <div className="flex items-center space-x-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Revenue:</span>
                          <span className="ml-1 font-medium">${data.revenue.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Profit:</span>
                          <span className="ml-1 font-medium text-green-600">${data.profit.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Performance Indicators */}
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Critical business metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{currentPeriod.appointments}</div>
                      <div className="text-sm text-muted-foreground">Appointments</div>
                      <div className="text-xs text-green-600">+{((currentPeriod.appointments - previousPeriod.appointments) / previousPeriod.appointments * 100).toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{currentPeriod.newClients}</div>
                      <div className="text-sm text-muted-foreground">New Clients</div>
                      <div className="text-xs text-green-600">+{((currentPeriod.newClients - previousPeriod.newClients) / previousPeriod.newClients * 100).toFixed(1)}%</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">${(currentPeriod.revenue / currentPeriod.appointments).toFixed(0)}</div>
                      <div className="text-sm text-muted-foreground">Avg. Revenue per Visit</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{((currentPeriod.profit / currentPeriod.revenue) * 100).toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Profit Margin</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts and Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Inventory Alerts</span>
                  </div>
                  <div className="text-2xl font-bold">{inventorySummary.reduce((sum, cat) => sum + cat.lowStock, 0)}</div>
                  <div className="text-sm text-muted-foreground">Low stock items</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Expiring Items</span>
                  </div>
                  <div className="text-2xl font-bold">{inventorySummary.reduce((sum, cat) => sum + cat.expiring, 0)}</div>
                  <div className="text-sm text-muted-foreground">Within 30 days</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Staff Utilization</span>
                  </div>
                  <div className="text-2xl font-bold">87%</div>
                  <div className="text-sm text-muted-foreground">Average efficiency</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Current period performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-medium">Total Revenue</div>
                      <div className="text-sm text-muted-foreground">June 2024</div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">${currentPeriod.revenue.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-medium">Total Expenses</div>
                      <div className="text-sm text-muted-foreground">June 2024</div>
                    </div>
                    <div className="text-2xl font-bold text-red-600">${currentPeriod.expenses.toLocaleString()}</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium">Net Profit</div>
                      <div className="text-sm text-muted-foreground">June 2024</div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">${currentPeriod.profit.toLocaleString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Revenue by service category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Consultations</span>
                    <span className="font-medium">$18,500 (32%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Surgery</span>
                    <span className="font-medium">$15,200 (26%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Vaccinations</span>
                    <span className="font-medium">$8,700 (15%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Diagnostics</span>
                    <span className="font-medium">$7,800 (13%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pharmacy</span>
                    <span className="font-medium">$4,600 (8%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Other</span>
                    <span className="font-medium">$3,200 (6%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Staff Performance</CardTitle>
              <CardDescription>Individual performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffPerformance.map((staff) => (
                  <div key={staff.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{staff.name}</div>
                        <div className="text-sm text-muted-foreground">{staff.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="font-medium">{staff.appointments}</div>
                        <div className="text-xs text-muted-foreground">Appointments</div>
                      </div>
                      {staff.role === "Veterinarian" && (
                        <div className="text-center">
                          <div className="font-medium">${staff.revenue.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Revenue</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="font-medium">{staff.satisfaction}/5</div>
                        <div className="text-xs text-muted-foreground">Satisfaction</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Summary</CardTitle>
              <CardDescription>Inventory status by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventorySummary.map((category) => (
                  <div key={category.category} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{category.category}</div>
                      <div className="text-sm text-muted-foreground">{category.totalItems} total items</div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="font-medium text-yellow-600">{category.lowStock}</div>
                        <div className="text-xs text-muted-foreground">Low Stock</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-orange-600">{category.expiring}</div>
                        <div className="text-xs text-muted-foreground">Expiring</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">${category.value.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Total Value</div>
                      </div>
                      <Button size="sm" variant="outline">
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}