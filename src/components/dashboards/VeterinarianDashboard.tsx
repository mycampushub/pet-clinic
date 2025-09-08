"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Calendar, 
  Clock, 
  Users, 
  Stethoscope, 
  Plus, 
  Search,
  CheckCircle,
  AlertTriangle,
  Pill,
  FileText,
  Heart,
  Thermometer,
  Activity,
  TrendingUp,
  UserCheck,
  CalendarDays,
  ChevronRight
} from "lucide-react"

interface Patient {
  id: string
  name: string
  species: string
  breed: string
  age: number
  owner: string
  lastVisit: string
  nextAppointment?: string
  criticalNotes?: string
}

interface Appointment {
  id: string
  time: string
  petName: string
  ownerName: string
  service: string
  status: "SCHEDULED" | "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED"
  duration: number
  isUrgent: boolean
}

interface LabResult {
  id: string
  patientName: string
  test: string
  result: string
  status: "NORMAL" | "ABNORMAL" | "CRITICAL"
  date: string
}

interface Prescription {
  id: string
  patientName: string
  medication: string
  dosage: string
  refills: number
  lastFilled: string
}

export function VeterinarianDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("schedule")

  // Sample data
  const todayStats = {
    totalAppointments: 12,
    completed: 8,
    inProgress: 2,
    pendingResults: 5,
    criticalCases: 2,
    newPatients: 3
  }

  const todayAppointments: Appointment[] = [
    { id: "1", time: "09:00", petName: "Max", ownerName: "John Smith", service: "Annual Checkup", status: "CHECKED_IN", duration: 30, isUrgent: false },
    { id: "2", time: "09:30", petName: "Luna", ownerName: "Sarah Davis", service: "Vaccination", status: "SCHEDULED", duration: 15, isUrgent: false },
    { id: "3", time: "10:00", petName: "Charlie", ownerName: "Mike Wilson", service: "Lameness Exam", status: "IN_PROGRESS", duration: 45, isUrgent: true },
    { id: "4", time: "10:30", petName: "Bella", ownerName: "Emily Brown", service: "Dental Cleaning", status: "SCHEDULED", duration: 60, isUrgent: false },
    { id: "5", time: "11:00", petName: "Rocky", ownerName: "David Lee", service: "Post-op Check", status: "SCHEDULED", duration: 20, isUrgent: false },
  ]

  const myPatients: Patient[] = [
    { id: "1", name: "Max", species: "Dog", breed: "Golden Retriever", age: 5, owner: "John Smith", lastVisit: "2024-12-10", nextAppointment: "2024-12-15" },
    { id: "2", name: "Luna", species: "Cat", breed: "Persian", age: 3, owner: "Sarah Davis", lastVisit: "2024-12-08", nextAppointment: "2024-12-20" },
    { id: "3", name: "Charlie", species: "Dog", breed: "Labrador", age: 7, owner: "Mike Wilson", lastVisit: "2024-12-12", criticalNotes: "Allergic to penicillin" },
    { id: "4", name: "Bella", species: "Cat", breed: "Siamese", age: 2, owner: "Emily Brown", lastVisit: "2024-12-05", nextAppointment: "2024-12-18" },
    { id: "5", name: "Rocky", species: "Dog", breed: "Bulldog", age: 4, owner: "David Lee", lastVisit: "2024-12-11", nextAppointment: "2024-12-22" },
  ]

  const pendingLabResults: LabResult[] = [
    { id: "1", patientName: "Charlie", test: "Blood Chemistry", result: "Elevated liver enzymes", status: "ABNORMAL", date: "2024-12-14" },
    { id: "2", patientName: "Max", test: "Urinalysis", result: "Normal", status: "NORMAL", date: "2024-12-14" },
    { id: "3", patientName: "Bella", test: "Fecal Float", result: "Parasites detected", status: "CRITICAL", date: "2024-12-13" },
    { id: "4", patientName: "Rocky", test: "X-ray", result: "Fracture healing", status: "NORMAL", date: "2024-12-13" },
    { id: "5", patientName: "Luna", test: "Complete Blood Count", result: "Mild anemia", status: "ABNORMAL", date: "2024-12-12" },
  ]

  const recentPrescriptions: Prescription[] = [
    { id: "1", patientName: "Charlie", medication: "Carprofen", dosage: "75mg twice daily", refills: 2, lastFilled: "2024-12-10" },
    { id: "2", patientName: "Max", medication: "Heartgard Plus", dosage: "1 chewable monthly", refills: 6, lastFilled: "2024-12-08" },
    { id: "3", patientName: "Bella", medication: "Amoxicillin", dosage: "250mg twice daily", refills: 1, lastFilled: "2024-12-12" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED": return "bg-blue-100 text-blue-800"
      case "CHECKED_IN": return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS": return "bg-green-100 text-green-800"
      case "COMPLETED": return "bg-gray-100 text-gray-800"
      case "NORMAL": return "bg-green-100 text-green-800"
      case "ABNORMAL": return "bg-yellow-100 text-yellow-800"
      case "CRITICAL": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredAppointments = todayAppointments.filter(apt =>
    apt.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.service.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPatients = myPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.owner.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Veterinarian Dashboard</h1>
          <p className="text-muted-foreground">
            Manage patient care, appointments, and clinical workflows
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <CalendarDays className="h-4 w-4 mr-2" />
            My Schedule
          </Button>
          <Button>
            <Stethoscope className="h-4 w-4 mr-2" />
            Start Visit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Schedule</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {todayStats.completed} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{todayStats.criticalCases}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Results</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{todayStats.pendingResults}</div>
            <p className="text-xs text-muted-foreground">
              Lab results awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Patients</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{todayStats.newPatients}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
          <TabsTrigger value="patients">My Patients</TabsTrigger>
          <TabsTrigger value="lab">Lab Results</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
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
                Patient View
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
                    Your schedule for today
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium min-w-16">{appointment.time}</div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{appointment.petName}</div>
                              {appointment.isUrgent && (
                                <Badge className="bg-red-100 text-red-800">URGENT</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">{appointment.ownerName}</div>
                            <div className="text-sm text-muted-foreground">{appointment.service}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status.replace("_", " ")}
                          </Badge>
                          <div className="text-sm text-muted-foreground">{appointment.duration}min</div>
                          <div className="flex gap-1">
                            {appointment.status === "CHECKED_IN" && (
                              <Button size="sm">
                                Start Visit
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              View
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
                      <span className="text-sm">New SOAP Note</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Pill className="h-6 w-6 mb-2" />
                      <span className="text-sm">Prescribe</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <FileText className="h-6 w-6 mb-2" />
                      <span className="text-sm">Order Lab</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Heart className="h-6 w-6 mb-2" />
                      <span className="text-sm">Vitals</span>
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
                  <CardTitle>Today's Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scheduled</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {todayAppointments.filter(a => a.status === "SCHEDULED").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Checked In</span>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {todayAppointments.filter(a => a.status === "CHECKED_IN").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">In Progress</span>
                    <Badge className="bg-green-100 text-green-800">
                      {todayAppointments.filter(a => a.status === "IN_PROGRESS").length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed</span>
                    <Badge className="bg-gray-100 text-gray-800">
                      {todayStats.completed}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Critical Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle>Critical Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div className="text-sm">
                      <div className="font-medium">Charlie - Allergic reaction</div>
                      <div className="text-red-600">Requires immediate attention</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Thermometer className="h-4 w-4 text-yellow-500" />
                    <div className="text-sm">
                      <div className="font-medium">Bella - High fever</div>
                      <div className="text-yellow-600">Monitor closely</div>
                    </div>
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
                    <span className="text-sm">Completed annual exam for Max</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Lab results ready for Luna</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Pill className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Prescribed antibiotics for Bella</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Charlie showing improvement</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback>
                          {patient.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{patient.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {patient.breed}
                        </CardDescription>
                      </div>
                    </div>
                    {patient.criticalNotes && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Species:</span>
                      <div className="font-medium">{patient.species}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Age:</span>
                      <div className="font-medium">{patient.age} years</div>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Owner:</span>
                    <div className="font-medium">{patient.owner}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Last Visit:</span>
                    <div className="font-medium">{patient.lastVisit}</div>
                  </div>
                  {patient.nextAppointment && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Next Visit:</span>
                      <div className="font-medium text-green-600">{patient.nextAppointment}</div>
                    </div>
                  )}
                  {patient.criticalNotes && (
                    <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                      {patient.criticalNotes}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lab" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Lab Results</CardTitle>
              <CardDescription>Lab results requiring your review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingLabResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{result.patientName}</div>
                        <div className="text-sm text-muted-foreground">{result.test}</div>
                        <div className="text-sm text-muted-foreground">{result.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                      <div className="text-sm font-medium">{result.result}</div>
                      <Button size="sm">
                        Review
                      </Button>
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
              <CardTitle>Recent Prescriptions</CardTitle>
              <CardDescription>Prescriptions you've written recently</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPrescriptions.map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <div className="font-medium">{prescription.patientName}</div>
                        <div className="text-sm text-muted-foreground">{prescription.medication}</div>
                        <div className="text-sm text-muted-foreground">{prescription.dosage}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-muted-foreground">
                        {prescription.refills} refills left
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Last filled: {prescription.lastFilled}
                      </div>
                      <Button size="sm" variant="outline">
                        Refill
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