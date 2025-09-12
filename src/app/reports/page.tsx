"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Users,
  FileText,
  Activity,
  Heart,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Filter,
  RefreshCw
} from "lucide-react"

interface ReportData {
  appointments?: {
    total: number
    completed: number
    byStatus: Record<string, number>
    utilization: number
  }
  patients?: {
    total: number
    new: number
    bySpecies: Record<string, number>
  }
  revenue?: {
    totalInvoices: number
    totalRevenue: number
    daily?: Array<{ date: string; amount: number }>
  }
  inventory?: {
    totalItems: number
    totalValue: number
    lowStock: number
    expiring: number
    controlled: number
  }
}

export default function ReportsPage() {
  const { data: session } = useSession()
  const [reportData, setReportData] = useState<ReportData>({})
  const [selectedDateRange, setSelectedDateRange] = useState("30")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [selectedDateRange])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reports?dateRange=${selectedDateRange}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      } else {
        console.error("Failed to fetch report data")
      }
    } catch (error) {
      console.error("Error fetching report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
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
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <select 
                  value={selectedDateRange}
                  onChange={(e) => setSelectedDateRange(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm"
                >
                  <option value="7">Last 7 days</option>
                  <option value="30">Last 30 days</option>
                  <option value="90">Last 90 days</option>
                  <option value="365">Last year</option>
                </select>
                <Button variant="outline" size="sm" onClick={fetchReportData}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
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
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.revenue ? formatCurrency(reportData.revenue.totalRevenue) : '$0'}
              </div>
              <p className="text-xs text-muted-foreground">
                {reportData.revenue?.totalInvoices || 0} paid invoices
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.appointments?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {reportData.appointments?.completed || 0} completed • {Math.round(reportData.appointments?.utilization || 0)}% utilization
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.patients?.total || 0}</div>
              <p className="text-xs text-muted-foreground">
                {reportData.patients?.new || 0} new this period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {reportData.inventory ? formatCurrency(reportData.inventory.totalValue) : '$0'}
              </div>
              <p className="text-xs text-muted-foreground">
                {reportData.inventory?.lowStock || 0} low stock alerts
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="clinical">Clinical</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
          </TabsList>
          
          <TabsContent value="revenue">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>
                    Daily revenue for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.revenue?.daily && reportData.revenue.daily.length > 0 ? (
                      <div className="flex items-end justify-between h-40">
                        {reportData.revenue.daily.slice(-15).map((day, index) => {
                          const maxValue = Math.max(...reportData.revenue.daily!.map(d => d.amount))
                          const height = maxValue > 0 ? (day.amount / maxValue) * 100 : 0
                          return (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div 
                                className="w-full bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-700"
                                style={{ height: `${height}%` }}
                              />
                              <span className="text-xs mt-2">
                                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No revenue data available for the selected period
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Daily Revenue</span>
                      <span>
                        Average: {reportData.revenue ? formatCurrency(reportData.revenue.totalRevenue / (reportData.revenue.daily?.length || 1)) : '$0'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Summary</CardTitle>
                  <CardDescription>
                    Key revenue metrics for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Revenue</span>
                      <span className="text-lg font-bold">
                        {reportData.revenue ? formatCurrency(reportData.revenue.totalRevenue) : '$0'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Paid Invoices</span>
                      <span className="text-lg font-bold">{reportData.revenue?.totalInvoices || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Average Invoice Value</span>
                      <span className="text-lg font-bold">
                        {reportData.revenue && reportData.revenue.totalInvoices > 0 
                          ? formatCurrency(reportData.revenue.totalRevenue / reportData.revenue.totalInvoices)
                          : '$0'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="appointments">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Statistics</CardTitle>
                  <CardDescription>
                    Overview of appointment metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reportData.appointments ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{reportData.appointments.total}</div>
                            <div className="text-sm text-blue-800">Total Appointments</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{reportData.appointments.completed}</div>
                            <div className="text-sm text-green-800">Completed</div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Utilization Rate</span>
                            <span className="text-sm font-bold">{Math.round(reportData.appointments.utilization)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${Math.min(reportData.appointments.utilization, 100)}%` }}
                            />
                          </div>
                        </div>

                        {Object.entries(reportData.appointments.byStatus).map(([status, count]) => (
                          <div key={status} className="flex justify-between items-center">
                            <span className="text-sm font-medium capitalize">{status.replace('_', ' ')}</span>
                            <span className="text-sm font-bold">{count}</span>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No appointment data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="patients">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Statistics</CardTitle>
                  <CardDescription>
                    Patient demographics and growth
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reportData.patients ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{reportData.patients.total}</div>
                            <div className="text-sm text-blue-800">Total Patients</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">{reportData.patients.new}</div>
                            <div className="text-sm text-green-800">New Patients</div>
                          </div>
                        </div>

                        {Object.entries(reportData.patients.bySpecies).map(([species, count]) => (
                          <div key={species} className="flex justify-between items-center">
                            <span className="text-sm font-medium capitalize">{species}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${(count / reportData.patients.total) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold">{count}</span>
                            </div>
                          </div>
                        ))}
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No patient data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="clinical">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clinical Operations</CardTitle>
                  <CardDescription>
                    Clinical procedures and treatments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Clinical data tracking coming soon
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="inventory">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Overview</CardTitle>
                  <CardDescription>
                    Inventory status and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reportData.inventory ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">{reportData.inventory.totalItems}</div>
                            <div className="text-sm text-blue-800">Total Items</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                              {formatCurrency(reportData.inventory.totalValue)}
                            </div>
                            <div className="text-sm text-green-800">Total Value</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Low Stock Items</span>
                            <Badge variant={reportData.inventory.lowStock > 0 ? "destructive" : "secondary"}>
                              {reportData.inventory.lowStock}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Expiring Items</span>
                            <Badge variant={reportData.inventory.expiring > 0 ? "destructive" : "secondary"}>
                              {reportData.inventory.expiring}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Controlled Substances</span>
                            <Badge variant="outline">
                              {reportData.inventory.controlled}
                            </Badge>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No inventory data available
                      </div>
                    )}
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