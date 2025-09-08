"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Plus, Search, Filter } from "lucide-react"

interface Appointment {
  id: string
  time: string
  petName: string
  ownerName: string
  provider: string
  service: string
  status: "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  phone: string
  notes?: string
}

export function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day")
  const [searchTerm, setSearchTerm] = useState("")

  // Sample appointments data
  const appointments: Appointment[] = [
    { id: "1", time: "09:00", petName: "Rex", ownerName: "John Doe", provider: "Dr. Smith", service: "Annual Checkup", status: "SCHEDULED", phone: "(555) 123-4567" },
    { id: "2", time: "09:30", petName: "Luna", ownerName: "Jane Smith", provider: "Dr. Johnson", service: "Vaccination", status: "CHECKED_IN", phone: "(555) 234-5678" },
    { id: "3", time: "10:00", petName: "Max", ownerName: "Bob Wilson", provider: "Dr. Smith", service: "Dental Cleaning", status: "IN_PROGRESS", phone: "(555) 345-6789" },
    { id: "4", time: "10:30", petName: "Bella", ownerName: "Alice Brown", provider: "Dr. Johnson", service: "Follow-up", status: "SCHEDULED", phone: "(555) 456-7890" },
    { id: "5", time: "11:00", petName: "Charlie", ownerName: "Mike Davis", provider: "Dr. Smith", service: "Surgery Consult", status: "SCHEDULED", phone: "(555) 567-8901" },
    { id: "6", time: "11:30", petName: "Lucy", ownerName: "Sarah Johnson", provider: "Dr. Johnson", service: "Grooming", status: "CANCELLED", phone: "(555) 678-9012" },
    { id: "7", time: "14:00", petName: "Cooper", ownerName: "Tom Wilson", provider: "Dr. Smith", service: "X-ray", status: "SCHEDULED", phone: "(555) 789-0123" },
    { id: "8", time: "14:30", petName: "Daisy", ownerName: "Lisa Anderson", provider: "Dr. Johnson", service: "Blood Test", status: "SCHEDULED", phone: "(555) 890-1234" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "bg-blue-100 text-blue-800"
      case "CHECKED_IN": return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS": return "bg-green-100 text-green-800"
      case "COMPLETED": return "bg-gray-100 text-gray-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredAppointments = appointments.filter(apt =>
    apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
  ]

  const getAppointmentsForTime = (time: string) => {
    return filteredAppointments.filter(apt => apt.time === time)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointment Calendar</h1>
          <p className="text-muted-foreground">
            Manage your clinic's schedule and appointments
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Appointment
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "day" ? "default" : "outline"} onClick={() => setViewMode("day")}>
              Day
            </Button>
            <Button variant={viewMode === "week" ? "default" : "outline"} onClick={() => setViewMode("week")}>
              Week
            </Button>
            <Button variant={viewMode === "month" ? "default" : "outline"} onClick={() => setViewMode("month")}>
              Month
            </Button>
          </div>
          <div className="text-lg font-semibold">
            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Schedule
            </CardTitle>
            <CardDescription>
              {filteredAppointments.length} appointments scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {timeSlots.map((time) => {
                const timeAppointments = getAppointmentsForTime(time)
                return (
                  <div key={time} className="flex gap-4">
                    <div className="w-20 text-sm font-medium text-muted-foreground pt-2">
                      {time}
                    </div>
                    <div className="flex-1 min-h-16 border-l-2 border-muted pl-4">
                      {timeAppointments.length > 0 ? (
                        timeAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="mb-2 p-3 border rounded-lg bg-card"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(appointment.status)}>
                                  {appointment.status}
                                </Badge>
                                <span className="font-medium">{appointment.time}</span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {appointment.provider}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Pet:</span> {appointment.petName}
                              </div>
                              <div>
                                <span className="font-medium">Owner:</span> {appointment.ownerName}
                              </div>
                              <div>
                                <span className="font-medium">Service:</span> {appointment.service}
                              </div>
                              <div>
                                <span className="font-medium">Phone:</span> {appointment.phone}
                              </div>
                            </div>
                            {appointment.notes && (
                              <div className="mt-2 text-sm text-muted-foreground">
                                <span className="font-medium">Notes:</span> {appointment.notes}
                              </div>
                            )}
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline">
                                Check In
                              </Button>
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button size="sm" variant="outline">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-muted-foreground py-2">
                          Available slot
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {appointments.filter(a => a.status === "SCHEDULED").length}
                </div>
                <div className="text-sm text-muted-foreground">Scheduled</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {appointments.filter(a => a.status === "CHECKED_IN").length}
                </div>
                <div className="text-sm text-muted-foreground">Checked In</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {appointments.filter(a => a.status === "IN_PROGRESS").length}
                </div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-2xl font-bold text-gray-600">
                  {appointments.filter(a => a.status === "COMPLETED").length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Providers</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Dr. Smith</span>
                  <span>{appointments.filter(a => a.provider === "Dr. Smith").length} appointments</span>
                </div>
                <div className="flex justify-between">
                  <span>Dr. Johnson</span>
                  <span>{appointments.filter(a => a.provider === "Dr. Johnson").length} appointments</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Quick Actions</h4>
              <div className="space-y-1">
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Walk-in
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Block Time
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Week
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}