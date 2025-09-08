"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Clock, 
  Users, 
  Phone, 
  Plus, 
  Search,
  CheckCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  UserCheck,
  CalendarDays
} from "lucide-react"

interface Appointment {
  id: string
  time: string
  petName: string
  ownerName: string
  phone: string
  service: string
  status: "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED" | "NO_SHOW"
  provider: string
}

interface TodayStats {
  totalAppointments: number
  checkedIn: number
  inProgress: number
  completed: number
  noShows: number
  newPatients: number
  pendingInvoices: number
  phoneCalls: number
}

export function ReceptionistDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("today")

  // Sample data
  const todayStats: TodayStats = {
    totalAppointments: 24,
    checkedIn: 8,
    inProgress: 3,
    completed: 12,
    noShows: 1,
    newPatients: 4,
    pendingInvoices: 15,
    phoneCalls: 23
  }

  const todayAppointments: Appointment[] = [
    { id: "1", time: "09:00", petName: "Max", ownerName: "John Smith", phone: "(555) 123-4567", service: "Annual Checkup", status: "CHECKED_IN", provider: "Dr. Johnson" },
    { id: "2", time: "09:30", petName: "Luna", ownerName: "Sarah Davis", phone: "(555) 234-5678", service: "Vaccination", status: "SCHEDULED", provider: "Dr. Smith" },
    { id: "3", time: "10:00", petName: "Charlie", ownerName: "Mike Wilson", phone: "(555) 345-6789", service: "Dental Cleaning", status: "IN_PROGRESS", provider: "Dr. Johnson" },
    { id: "4", time: "10:30", petName: "Bella", ownerName: "Emily Brown", phone: "(555) 456-7890", service: "Follow-up", status: "SCHEDULED", provider: "Dr. Smith" },
    { id: "5", time: "11:00", petName: "Rocky", ownerName: "David Lee", phone: "(555) 567-8901", service: "Sick Visit", status: "SCHEDULED", provider: "Dr. Johnson" },
    { id: "6", time: "11:30", petName: "Daisy", ownerName: "Lisa Garcia", phone: "(555) 678-9012", service: "Grooming", status: "NO_SHOW", provider: "Dr. Smith" },
  ]

  const recentCalls = [
    { id: "1", time: "5 min ago", name: "Jennifer Martinez", phone: "(555) 111-2222", reason: "Appointment inquiry", status: "CALL_BACK" },
    { id: "2", time: "12 min ago", name: "Robert Taylor", phone: "(555) 222-3333", reason: "Prescription refill", status: "COMPLETED" },
    { id: "3", time: "25 min ago", name: "Mary Anderson", phone: "(555) 333-4444", reason: "Emergency inquiry", status: "URGENT" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "bg-blue-100 text-blue-800"
      case "CHECKED_IN": return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS": return "bg-green-100 text-green-800"
      case "COMPLETED": return "bg-gray-100 text-gray-800"
      case "NO_SHOW": return "bg-red-100 text-red-800"
      case "CALL_BACK": return "bg-orange-100 text-orange-800"
      case "COMPLETED": return "bg-green-100 text-green-800"
      case "URGENT": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredAppointments = todayAppointments.filter(apt =>
    apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Receptionist Dashboard</h1>
          <p className="text-muted-foreground">
            Manage appointments, check-ins, and front desk operations
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <CalendarDays className="h-4 w-4 mr-2" />
            View Schedule
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Book
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {todayStats.checkedIn} checked in
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Check-ins</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{todayStats.checkedIn}</div>
            <p className="text-xs text-muted-foreground">
              Waiting for providers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phone Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.phoneCalls}</div>
            <p className="text-xs text-muted-foreground">
              Today's call volume
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayStats.newPatients}</div>
            <p className="text-xs text-muted-foreground">
              Registered today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today's Schedule</TabsTrigger>
          <TabsTrigger value="calls">Phone Calls</TabsTrigger>
          <TabsTrigger value="checkins">Check-ins</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Time View
              </Button>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Provider View
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {/* Appointments List */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>
                    {filteredAppointments.length} appointments scheduled
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium min-w-16">{appointment.time}</div>
                          <div>
                            <div className="font-medium">{appointment.petName}</div>
                            <div className="text-sm text-muted-foreground">{appointment.ownerName}</div>
                            <div className="text-xs text-muted-foreground">{appointment.phone}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status.replace("_", " ")}
                          </Badge>
                          <div className="text-sm text-muted-foreground">{appointment.provider}</div>
                          <div className="flex gap-1">
                            {appointment.status === "SCHEDULED" && (
                              <Button size="sm" variant="outline">
                                Check In
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col">
                      <Plus className="h-6 w-6 mb-2" />
                      <span className="text-sm">New Appointment</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      <span className="text-sm">Register Patient</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Phone className="h-6 w-6 mb-2" />
                      <span className="text-sm">Log Call</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <DollarSign className="h-6 w-6 mb-2" />
                      <span className="text-sm">Create Invoice</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Status Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Status Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scheduled</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {todayStats.totalAppointments - todayStats.checkedIn - todayStats.inProgress - todayStats.completed - todayStats.noShows}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Checked In</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {todayStats.checkedIn}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">In Progress</span>
                    <Badge className="bg-green-100 text-green-800">
                      {todayStats.inProgress}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed</span>
                    <Badge className="bg-gray-100 text-gray-800">
                      {todayStats.completed}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">No Shows</span>
                    <Badge className="bg-red-100 text-red-800">
                      {todayStats.noShows}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Max checked in</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">New patient registered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Incoming call from Jennifer</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm">No show: Daisy appointment</span>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Completion Rate:</span>
                    <span className="font-medium">
                      {Math.round((todayStats.completed / todayStats.totalAppointments) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>No-show Rate:</span>
                    <span className="font-medium text-red-600">
                      {Math.round((todayStats.noShows / todayStats.totalAppointments) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Wait Time:</span>
                    <span className="font-medium">12 min</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Phone Calls</CardTitle>
              <CardDescription>Track and manage incoming and outgoing calls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm text-muted-foreground">{call.time}</div>
                      <div>
                        <div className="font-medium">{call.name}</div>
                        <div className="text-sm text-muted-foreground">{call.phone}</div>
                        <div className="text-sm text-muted-foreground">{call.reason}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(call.status)}>
                      {call.status.replace("_", " ")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Check-ins</CardTitle>
              <CardDescription>Manage patient check-ins and waitlist</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Check-in interface would be implemented here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}