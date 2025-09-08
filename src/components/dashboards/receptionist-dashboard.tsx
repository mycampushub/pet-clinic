"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Package, AlertTriangle, Plus, Search, Phone, Mail } from "lucide-react"

interface Appointment {
  id: string
  time: string
  petName: string
  ownerName: string
  provider: string
  service: string
  status: "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED"
  phone: string
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

interface QuickAction {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  action: () => void
}

export function ReceptionistDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data specific to receptionist needs
  const todayAppointments: Appointment[] = [
    { id: "1", time: "09:00", petName: "Rex", ownerName: "John Doe", provider: "Dr. Smith", service: "Annual Checkup", status: "SCHEDULED", phone: "(555) 123-4567" },
    { id: "2", time: "09:30", petName: "Luna", ownerName: "Jane Smith", provider: "Dr. Johnson", service: "Vaccination", status: "CHECKED_IN", phone: "(555) 234-5678" },
    { id: "3", time: "10:00", petName: "Max", ownerName: "Bob Wilson", provider: "Dr. Smith", service: "Dental Cleaning", status: "IN_PROGRESS", phone: "(555) 345-6789" },
    { id: "4", time: "10:30", petName: "Bella", ownerName: "Alice Brown", provider: "Dr. Johnson", service: "Follow-up", status: "SCHEDULED", phone: "(555) 456-7890" },
    { id: "5", time: "11:00", petName: "Charlie", ownerName: "Mike Davis", provider: "Dr. Smith", service: "Surgery Consult", status: "SCHEDULED", phone: "(555) 567-8901" },
    { id: "6", time: "11:30", petName: "Lucy", ownerName: "Sarah Johnson", provider: "Dr. Johnson", service: "Grooming", status: "CANCELLED", phone: "(555) 678-9012" },
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

  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "New Appointment",
      description: "Schedule a new appointment",
      icon: <Plus className="h-5 w-5" />,
      action: () => console.log("New appointment")
    },
    {
      id: "2",
      title: "Check-in Patient",
      description: "Check-in arrived patient",
      icon: <Clock className="h-5 w-5" />,
      action: () => console.log("Check-in patient")
    },
    {
      id: "3",
      title: "Register New Client",
      description: "Add new pet owner",
      icon: <Users className="h-5 w-5" />,
      action: () => console.log("Register client")
    },
    {
      id: "4",
      title: "Process Payment",
      description: "Handle invoice payment",
      icon: <Package className="h-5 w-5" />,
      action: () => console.log("Process payment")
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "bg-blue-100 text-blue-800"
      case "CHECKED_IN": return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS": return "bg-green-100 text-green-800"
      case "COMPLETED": return "bg-gray-100 text-gray-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "PAID": return "bg-green-100 text-green-800"
      case "OVERDUE": return "bg-red-100 text-red-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
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

  const filteredAppointments = todayAppointments.filter(apt =>
    apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header with quick stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Receptionist Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your front desk overview for today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Full Calendar
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Book
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayAppointments.filter(a => a.status === "SCHEDULED").length} scheduled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Room</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.filter(a => a.status === "CHECKED_IN").length}</div>
            <p className="text-xs text-muted-foreground">
              Patients waiting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {pendingInvoices.length} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No-shows</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.filter(a => a.status === "CANCELLED").length}</div>
            <p className="text-xs text-muted-foreground">
              Today's cancellations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Open today
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>Manage your daily schedule</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search appointments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium min-w-16">{appointment.time}</div>
                    <div className="flex-1">
                      <div className="font-medium">{appointment.petName}</div>
                      <div className="text-sm text-muted-foreground">{appointment.ownerName}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {appointment.phone}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground">{appointment.provider}</div>
                    <div className="flex gap-1">
                      {appointment.status === "SCHEDULED" && (
                        <Button size="sm" variant="outline">
                          Check-in
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Mail className="h-3 w-3" />
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
            <CardDescription>Common front desk tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={action.action}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-primary">{action.icon}</div>
                    <div className="text-left">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="font-medium mb-3">Recent Activity</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rex checked in</span>
                  <span>2 min ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment received</span>
                  <span>15 min ago</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New client registered</span>
                  <span>1 hour ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Alerts and Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Items that need attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {inventoryAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  {getAlertIcon(alert.alertType)}
                  <div className="flex-1">
                    <div className="font-medium">{alert.itemName}</div>
                    <div className="text-sm text-muted-foreground">{alert.details}</div>
                    <div className="text-sm font-medium">Qty: {alert.quantity}</div>
                  </div>
                  <Button size="sm" variant="outline">
                    Notify
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Invoices</CardTitle>
            <CardDescription>Invoices awaiting payment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {pendingInvoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-muted-foreground">{invoice.petName} - {invoice.ownerName}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-bold">${invoice.amount.toFixed(2)}</div>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                    <Button size="sm">
                      Pay
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}