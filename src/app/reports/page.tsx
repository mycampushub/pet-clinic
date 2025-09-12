"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  revenue: {
    daily: Array<{ date: string; amount: number }>
    monthly: Array<{ month: string; amount: number }>
    total: number
    growth: number
  }
  appointments: {
    total: number
    completed: number
    noShows: number
    cancellations: number
    utilization: number
  }
  patients: {
    total: number
    new: number
    active: number
    species: Array<{ name: string; count: number }>
  }
  inventory: {
    totalValue: number
    lowStock: number
    expiring: number
    turnover: number
  }
  clinical: {
    procedures: Array<{ name: string; count: number }>
    vaccinations: Array<{ name: string; count: number }>
    labTests: Array<{ name: string; count: number }>
  }
}

export default function ReportsPage() {
  const { data: session } = useSession()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [selectedDateRange, setSelectedDateRange] = useState("30")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [selectedDateRange])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockData: ReportData = {
        revenue: {
          daily: [
            { date: "Sep 1", amount: 1250 },
            { date: "Sep 2", amount: 890 },
            { date: "Sep 3", amount: 1560 },
            { date: "Sep 4", amount: 2100 },
            { date: "Sep 5", amount: 980 },
            { date: "Sep 6", amount: 1750 },
            { date: "Sep 7", amount: 1320 },
            { date: "Sep 8", amount: 1680 },
            { date: "Sep 9", amount: 1450 },
            { date: "Sep 10", amount: 1920 },
            { date: "Sep 11", amount: 1180 },
            { date: "Sep 12", amount: 2250 },
            { date: "Sep 13", amount: 1590 },
            { date: "Sep 14", amount: 1870 },
            { date: "Sep 15", amount: 2100 }
          ],
          monthly: [
            { month: "Apr", amount: 45000 },
            { month: "May", amount: 52000 },
            { month: "Jun", amount: 48000 },
            { month: "Jul", amount: 55000 },
            { month: "Aug", amount: 58000 },
            { month: "Sep", amount: 62000 }
          ],
          total: 62000,
          growth: 12.5
        },
        appointments: {
          total: 245,
          completed: 218,
          noShows: 12,
          cancellations: 15,
          utilization: 78
        },
        patients: {
          total: 156,
          new: 23,
          active: 142,
          species: [
            { name: "Dogs", count: 98 },
            { name: "Cats", count: 45 },
            { name: "Birds", count: 8 },
            { name: "Rabbits", count: 5 }
          ]
        },
        inventory: {
          totalValue: 45600,
          lowStock: 12,
          expiring: 8,
          turnover: 3.2
        },
        clinical: {
          procedures: [
            { name: "Dental Cleaning", count: 45 },
            { name: "Vaccination", count: 89 },
            { name: "Spay/Neuter", count: 23 },
            { name: "Wound Repair", count: 12 },
            { name: "Biopsy", count: 8 }
          ],
          vaccinations: [
            { name: "DHPP", count: 67 },
            { name: "Rabies", count: 72 },
            { name: "Bordetella", count: 34 },
            { name: "FVRCP", count: 45 }
          ],
          labTests: [
            { name: "Blood Work", count: 89 },
            { name: "Urinalysis", count: 56 },
            { name: "Fecal Test", count: 34 },
            { name: "X-Ray", count: 23 }
          ]
        }
      }
      
      setReportData(mockData)
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

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Report Data</h2>
              <p className="text-gray-600 mb-4">Unable to load report data at this time.</p>
              <Button onClick={fetchReportData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
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
              <div className="text-2xl font-bold">{formatCurrency(reportData.revenue.total)}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {reportData.revenue.growth > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                    <span className="text-green-600">+{reportData.revenue.growth}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
                    <span className="text-red-600">{reportData.revenue.growth}%</span>
                  </>
                )}
                <span className="ml-1">from last period</span>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.appointments.total}</div>
              <p className="text-xs text-muted-foreground">
                {reportData.appointments.completed} completed • {reportData.appointments.utilization}% utilization
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.patients.active}</div>
              <p className="text-xs text-muted-foreground">
                {reportData.patients.new} new this period
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(reportData.inventory.totalValue)}</div>
              <p className="text-xs text-muted-foreground">
                {reportData.inventory.lowStock} low stock alerts
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
                    Daily revenue for the last 15 days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Simple bar chart representation */}
                    <div className="flex items-end justify-between h-40">
                      {reportData.revenue.daily.map((day, index) => {
                        const maxValue = Math.max(...reportData.revenue.daily.map(d => d.amount))
                        const height = (day.amount / maxValue) * 100
                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-full bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-700"
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-xs mt-2">{day.date.split(' ')[1]}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Daily Revenue</span>
                      <span>Average: {formatCurrency(reportData.revenue.total / reportData.revenue.daily.length)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                  <CardDescription>
                    Monthly revenue comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.revenue.monthly.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{month.month}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(month.amount / Math.max(...reportData.revenue.monthly.map(m => m.amount))) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{formatCurrency(month.amount)}</span>
                        </div>
                      </div>
                    ))}
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{reportData.appointments.total}</div>
                        <div className="text-sm text-blue-800">Total Appointments</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{reportData.appointments.completed}</div>
                        <div className="text-sm text-green-800">Completed</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{reportData.appointments.noShows}</div>
                        <div className="text-sm text-yellow-800">No Shows</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{reportData.appointments.cancellations}</div>
                        <div className="text-sm text-red-800">Cancelled</div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Utilization Rate</span>
                        <span className="text-sm font-bold">{reportData.appointments.utilization}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${reportData.appointments.utilization}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Completion Rate</CardTitle>
                  <CardDescription>
                    Success rate for scheduled appointments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        {Math.round((reportData.appointments.completed / reportData.appointments.total) * 100)}%
                      </div>
                      <p className="text-sm text-gray-600">Completion Rate</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm">Completed</span>
                        </div>
                        <span className="text-sm font-medium">
                          {reportData.appointments.completed} ({Math.round((reportData.appointments.completed / reportData.appointments.total) * 100)}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                          <span className="text-sm">No Shows</span>
                        </div>
                        <span className="text-sm font-medium">
                          {reportData.appointments.noShows} ({Math.round((reportData.appointments.noShows / reportData.appointments.total) * 100)}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                          <span className="text-sm">Cancelled</span>
                        </div>
                        <span className="text-sm font-medium">
                          {reportData.appointments.cancellations} ({Math.round((reportData.appointments.cancellations / reportData.appointments.total) * 100)}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="patients">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Demographics</CardTitle>
                  <CardDescription>
                    Overview of patient population
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{reportData.patients.total}</div>
                        <div className="text-sm text-purple-800">Total Patients</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{reportData.patients.new}</div>
                        <div className="text-sm text-green-800">New Patients</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Species Distribution</h4>
                      <div className="space-y-3">
                        {reportData.patients.species.map((species, index) => {
                          const total = reportData.patients.species.reduce((sum, s) => sum + s.count, 0)
                          const percentage = (species.count / total) * 100
                          return (
                            <div key={index}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm">{species.name}</span>
                                <span className="text-sm font-medium">{species.count} ({Math.round(percentage)}%)</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-purple-600 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Patient Growth</CardTitle>
                  <CardDescription>
                    New patient acquisition trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{reportData.patients.new}</div>
                      <p className="text-sm text-blue-800">New Patients This Period</p>
                      <div className="flex items-center justify-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600">15% increase from last period</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Patient Retention</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Active Patients</span>
                          <span className="text-sm font-medium">{reportData.patients.active}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Retention Rate</span>
                          <span className="text-sm font-medium">
                            {Math.round((reportData.patients.active / reportData.patients.total) * 100)}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Average Visits/Patient</span>
                          <span className="text-sm font-medium">2.4</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="clinical">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Procedures</CardTitle>
                  <CardDescription>
                    Most performed procedures
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.clinical.procedures.map((procedure, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{procedure.name}</span>
                        <Badge variant="outline">{procedure.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Vaccinations</CardTitle>
                  <CardDescription>
                    Vaccination statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.clinical.vaccinations.map((vaccination, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{vaccination.name}</span>
                        <Badge variant="outline">{vaccination.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Laboratory Tests</CardTitle>
                  <CardDescription>
                    Lab test frequencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportData.clinical.labTests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{test.name}</span>
                        <Badge variant="outline">{test.count}</Badge>
                      </div>
                    ))}
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
                    Stock levels and values
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(reportData.inventory.totalValue)}</div>
                        <div className="text-sm text-green-800">Total Value</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{reportData.inventory.lowStock}</div>
                        <div className="text-sm text-yellow-800">Low Stock Items</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">{reportData.inventory.expiring}</div>
                        <div className="text-sm text-orange-800">Expiring Soon</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{reportData.inventory.turnover}x</div>
                        <div className="text-sm text-blue-800">Turnover Rate</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Inventory Health</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                            <span className="text-sm">Well Stocked</span>
                          </div>
                          <span className="text-sm font-medium">85%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                            <span className="text-sm">Attention Needed</span>
                          </div>
                          <span className="text-sm font-medium">12%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-red-600 mr-2" />
                            <span className="text-sm">Critical</span>
                          </div>
                          <span className="text-sm font-medium">3%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Performance</CardTitle>
                  <CardDescription>
                    Key inventory metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-6 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{reportData.inventory.turnover}x</div>
                      <p className="text-sm text-blue-800">Inventory Turnover Rate</p>
                      <p className="text-xs text-gray-600 mt-1">Industry average: 2.5x</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Cost Analysis</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Carrying Cost</span>
                          <span className="text-sm font-medium">$2,340/month</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Stockout Cost</span>
                          <span className="text-sm font-medium">$1,200/month</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Ordering Cost</span>
                          <span className="text-sm font-medium">$890/month</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Optimization Opportunities</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                          <span>Reduce excess stock by 15%</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                          <span>Improve turnover rate to 3.5x</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                          <span>Reduce carrying costs by 20%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Export Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
            <CardDescription>
              Download detailed reports in various formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col">
                <FileText className="h-6 w-6 mb-2" />
                Financial Report
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Calendar className="h-6 w-6 mb-2" />
                Appointment Report
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Users className="h-6 w-6 mb-2" />
                Patient Report
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <Activity className="h-6 w-6 mb-2" />
                Clinical Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}