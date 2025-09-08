"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, Stethoscope, FileText, AlertTriangle, Plus, Search, Heart, Activity } from "lucide-react"

interface Appointment {
  id: string
  time: string
  petName: string
  ownerName: string
  service: string
  status: "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED"
  priority: "ROUTINE" | "URGENT" | "EMERGENCY"
  notes?: string
}

interface Patient {
  id: string
  name: string
  species: string
  breed: string
  age: number
  ownerName: string
  lastVisit: string
  nextAppointment?: string
  conditions: string[]
}

interface LabResult {
  id: string
  patientName: string
  test: string
  result: string
  status: "PENDING" | "COMPLETED" | "ABNORMAL"
  date: string
}

interface Prescription {
  id: string
  patientName: string
  medication: string
  dosage: string
  refills: number
  status: "ACTIVE" | "COMPLETED" | "EXPIRED"
}

export function VeterinarianDashboard() {
  const [activeTab, setActiveTab] = useState("schedule")
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data specific to veterinarian needs
  const todayAppointments: Appointment[] = [
    { id: "1", time: "09:00", petName: "Rex", ownerName: "John Doe", service: "Annual Checkup", status: "SCHEDULED", priority: "ROUTINE" },
    { id: "2", time: "09:30", petName: "Luna", ownerName: "Jane Smith", service: "Vaccination", status: "CHECKED_IN", priority: "ROUTINE", notes: "Anxious patient" },
    { id: "3", time: "10:00", petName: "Max", ownerName: "Bob Wilson", service: "Limp Examination", status: "IN_PROGRESS", priority: "URGENT", notes: "Right hind leg" },
    { id: "4", time: "10:30", petName: "Bella", ownerName: "Alice Brown", service: "Follow-up", status: "SCHEDULED", priority: "ROUTINE" },
    { id: "5", time: "11:00", petName: "Charlie", ownerName: "Mike Davis", service: "Emergency Visit", status: "SCHEDULED", priority: "EMERGENCY", notes: "Vomiting, lethargic" },
  ]

  const myPatients: Patient[] = [
    { id: "1", name: "Rex", species: "Dog", breed: "Labrador", age: 5, ownerName: "John Doe", lastVisit: "2024-12-10", conditions: ["Allergies", "Arthritis"] },
    { id: "2", name: "Luna", species: "Cat", breed: "Domestic Shorthair", age: 3, ownerName: "Jane Smith", lastVisit: "2024-12-08", conditions: ["Dental disease"] },
    { id: "3", name: "Max", species: "Dog", breed: "German Shepherd", age: 7, ownerName: "Bob Wilson", lastVisit: "2024-12-05", conditions: ["Hip dysplasia"] },
    { id: "4", name: "Bella", species: "Cat", breed: "Siamese", age: 2, ownerName: "Alice Brown", lastVisit: "2024-12-01", conditions: [] },
  ]

  const pendingLabResults: LabResult[] = [
    { id: "1", patientName: "Rex", test: "CBC", result: "Normal", status: "COMPLETED", date: "2024-12-15" },
    { id: "2", patientName: "Luna", test: "Blood Chemistry", result: "Elevated liver enzymes", status: "ABNORMAL", date: "2024-12-15" },
    { id: "3", patientName: "Max", test: "X-ray", result: "Pending", status: "PENDING", date: "2024-12-14" },
  ]

  const activePrescriptions: Prescription[] = [
    { id: "1", patientName: "Rex", medication: "Carprofen", dosage: "50mg twice daily", refills: 2, status: "ACTIVE" },
    { id: "2", patientName: "Luna", medication: "Amoxicillin", dosage: "250mg twice daily", refills: 0, status: "ACTIVE" },
    { id: "3", patientName: "Max", medication: "Gabapentin", dosage: "100mg three times daily", refills: 1, status: "ACTIVE" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "bg-blue-100 text-blue-800"
      case "CHECKED_IN": return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS": return "bg-green-100 text-green-800"
      case "COMPLETED": return "bg-gray-100 text-gray-800"
      case "ACTIVE": return "bg-green-100 text-green-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "ABNORMAL": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "ROUTINE": return "bg-gray-100 text-gray-800"
      case "URGENT": return "bg-orange-100 text-orange-800"
      case "EMERGENCY": return "bg-red-100 text-red-800"
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
      {/* Header with vitals */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dr. Smith's Dashboard</h1>
          <p className="text-muted-foreground">
            Your clinical overview and schedule for today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Medical Records
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayAppointments.length}</div>
            <p className="text-xs text-muted-foreground">
              {todayAppointments.filter(a => a.priority === "EMERGENCY").length} emergencies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myPatients.length}</div>
            <p className="text-xs text-muted-foreground">
              Under your care
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Results</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLabResults.filter(r => r.status === "PENDING").length}</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Scripts</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePrescriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              Require monitoring
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="patients">My Patients</TabsTrigger>
          <TabsTrigger value="labs">Lab Results</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Appointments</CardTitle>
                  <CardDescription>Your clinical schedule</CardDescription>
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
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{appointment.petName}</div>
                          <Badge className={getPriorityColor(appointment.priority)}>
                            {appointment.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{appointment.ownerName}</div>
                        <div className="text-sm">{appointment.service}</div>
                        {appointment.notes && (
                          <div className="text-xs text-orange-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {appointment.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                      <div className="flex gap-1">
                        {appointment.status === "CHECKED_IN" && (
                          <Button size="sm">
                            Start Visit
                          </Button>
                        )}
                        {appointment.status === "SCHEDULED" && (
                          <Button size="sm" variant="outline">
                            View Chart
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Patients</CardTitle>
              <CardDescription>Patients under your care</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myPatients.map((patient) => (
                  <Card key={patient.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{patient.name}</CardTitle>
                          <CardDescription>{patient.breed} • {patient.age} years</CardDescription>
                        </div>
                        <Badge variant="outline">{patient.species}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Owner:</span>
                          <span>{patient.ownerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Last Visit:</span>
                          <span>{patient.lastVisit}</span>
                        </div>
                        {patient.nextAppointment && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Next Visit:</span>
                            <span className="text-green-600">{patient.nextAppointment}</span>
                          </div>
                        )}
                        {patient.conditions.length > 0 && (
                          <div>
                            <span className="text-muted-foreground">Conditions:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {patient.conditions.map((condition, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {condition}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" className="flex-1">
                          <FileText className="h-3 w-3 mr-1" />
                          Chart
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lab Results</CardTitle>
              <CardDescription>Review pending and completed lab results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingLabResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{result.patientName}</div>
                        <div className="text-sm text-muted-foreground">{result.test}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">{result.date}</div>
                      {result.status !== "PENDING" && (
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prescriptions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Prescriptions</CardTitle>
              <CardDescription>Monitor and manage current prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activePrescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{prescription.patientName}</div>
                        <div className="text-sm text-muted-foreground">{prescription.medication}</div>
                        <div className="text-sm">{prescription.dosage}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(prescription.status)}>
                        {prescription.status}
                      </Badge>
                      <div className="text-sm text-muted-foreground">
                        {prescription.refills} refills
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