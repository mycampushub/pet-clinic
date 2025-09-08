"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, Activity, AlertTriangle, Plus, Search, Heart, Thermometer, Weight } from "lucide-react"

interface Task {
  id: string
  title: string
  patient: string
  priority: "HIGH" | "MEDIUM" | "LOW"
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
  assignedBy: string
  dueTime?: string
}

interface PatientMonitoring {
  id: string
  patientName: string
  species: string
  condition: string
  status: "STABLE" | "MONITORING" | "CRITICAL"
  lastCheck: string
  nextCheck: string
  vitals: {
    temperature?: number
    heartRate?: number
    weight?: number
  }
}

interface LabQueue {
  id: string
  patientName: string
  testType: string
  status: "COLLECTING" | "PROCESSING" | "COMPLETED" | "PENDING"
  priority: "ROUTINE" | "STAT"
  requestedBy: string
  requestedTime: string
}

interface ProcedureAssist {
  id: string
  procedure: string
  patientName: string
  veterinarian: string
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED"
  startTime: string
  duration: number
}

export function VetTechDashboard() {
  const [activeTab, setActiveTab] = useState("tasks")
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data specific to vet tech needs
  const tasks: Task[] = [
    { id: "1", title: "Pre-op preparation for Max", patient: "Max", priority: "HIGH", status: "PENDING", assignedBy: "Dr. Smith", dueTime: "09:15" },
    { id: "2", title: "Blood draw - Luna", patient: "Luna", priority: "MEDIUM", status: "IN_PROGRESS", assignedBy: "Dr. Johnson" },
    { id: "3", title: "Post-op monitoring - Bella", patient: "Bella", priority: "HIGH", status: "COMPLETED", assignedBy: "Dr. Smith" },
    { id: "4", title: "Vaccine preparation - Charlie", patient: "Charlie", priority: "LOW", status: "PENDING", assignedBy: "Dr. Johnson" },
    { id: "5", title: "X-ray assistance - Rex", patient: "Rex", priority: "MEDIUM", status: "PENDING", assignedBy: "Dr. Smith" },
  ]

  const patientMonitoring: PatientMonitoring[] = [
    { id: "1", patientName: "Bella", species: "Dog", condition: "Post-op recovery", status: "STABLE", lastCheck: "08:45", nextCheck: "09:15", vitals: { temperature: 38.2, heartRate: 80, weight: 25.5 } },
    { id: "2", patientName: "Max", species: "Cat", condition: "Diabetes monitoring", status: "MONITORING", lastCheck: "08:30", nextCheck: "09:00", vitals: { temperature: 38.5, heartRate: 120 } },
    { id: "3", patientName: "Luna", species: "Dog", condition: "IV fluid monitoring", status: "MONITORING", lastCheck: "08:15", nextCheck: "08:45", vitals: { temperature: 38.1, heartRate: 90, weight: 18.2 } },
  ]

  const labQueue: LabQueue[] = [
    { id: "1", patientName: "Rex", testType: "CBC", status: "COLLECTING", priority: "ROUTINE", requestedBy: "Dr. Smith", requestedTime: "08:00" },
    { id: "2", patientName: "Luna", testType: "Blood Chemistry", status: "PROCESSING", priority: "ROUTINE", requestedBy: "Dr. Johnson", requestedTime: "08:15" },
    { id: "3", patientName: "Max", testType: "Urinalysis", status: "PENDING", priority: "STAT", requestedBy: "Dr. Smith", requestedTime: "08:30" },
    { id: "4", patientName: "Bella", testType: "Fecal Float", status: "COMPLETED", priority: "ROUTINE", requestedBy: "Dr. Johnson", requestedTime: "07:45" },
  ]

  const procedureAssists: ProcedureAssist[] = [
    { id: "1", procedure: "Dental Cleaning", patientName: "Rex", veterinarian: "Dr. Smith", status: "SCHEDULED", startTime: "10:00", duration: 60 },
    { id: "2", procedure: "Wound Suture", patientName: "Luna", veterinarian: "Dr. Johnson", status: "IN_PROGRESS", startTime: "09:00", duration: 45 },
    { id: "3", procedure: "Spay Surgery", patientName: "Bella", veterinarian: "Dr. Smith", status: "COMPLETED", startTime: "08:00", duration: 90 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS": return "bg-blue-100 text-blue-800"
      case "COMPLETED": return "bg-green-100 text-green-800"
      case "STABLE": return "bg-green-100 text-green-800"
      case "MONITORING": return "bg-yellow-100 text-yellow-800"
      case "CRITICAL": return "bg-red-100 text-red-800"
      case "COLLECTING": return "bg-blue-100 text-blue-800"
      case "PROCESSING": return "bg-purple-100 text-purple-800"
      case "SCHEDULED": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-800"
      case "MEDIUM": return "bg-yellow-100 text-yellow-800"
      case "LOW": return "bg-green-100 text-green-800"
      case "STAT": return "bg-red-100 text-red-800"
      case "ROUTINE": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.patient.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vet Tech Dashboard</h1>
          <p className="text-muted-foreground">
            Your technical tasks and patient monitoring overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            Lab Results
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log Task
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => t.status !== "COMPLETED").length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.filter(t => t.priority === "HIGH").length} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients Monitoring</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientMonitoring.length}</div>
            <p className="text-xs text-muted-foreground">
              {patientMonitoring.filter(p => p.status === "CRITICAL").length} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Queue</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{labQueue.filter(l => l.status !== "COMPLETED").length}</div>
            <p className="text-xs text-muted-foreground">
              {labQueue.filter(l => l.priority === "STAT").length} stat orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procedure Assists</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{procedureAssists.filter(p => p.status !== "COMPLETED").length}</div>
            <p className="text-xs text-muted-foreground">
              Today's schedule
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="monitoring">Patient Monitoring</TabsTrigger>
          <TabsTrigger value="lab">Lab Queue</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Task List</CardTitle>
                  <CardDescription>Your assigned tasks and duties</CardDescription>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{task.title}</div>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Patient: {task.patient}</div>
                        <div className="text-xs text-muted-foreground">Assigned by: {task.assignedBy}</div>
                        {task.dueTime && (
                          <div className="text-xs text-orange-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due: {task.dueTime}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <div className="flex gap-1">
                        {task.status === "PENDING" && (
                          <Button size="sm">
                            Start
                          </Button>
                        )}
                        {task.status === "IN_PROGRESS" && (
                          <Button size="sm" variant="outline">
                            Complete
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

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Monitoring</CardTitle>
              <CardDescription>Patients requiring ongoing monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patientMonitoring.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{patient.patientName}</div>
                          <Badge variant="outline">{patient.species}</Badge>
                          <Badge className={getStatusColor(patient.status)}>
                            {patient.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Condition: {patient.condition}</div>
                        <div className="text-xs text-muted-foreground">
                          Last check: {patient.lastCheck} • Next check: {patient.nextCheck}
                        </div>
                        {patient.vitals.temperature && (
                          <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1">
                              <Thermometer className="h-3 w-3" />
                              {patient.vitals.temperature}°C
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {patient.vitals.heartRate} bpm
                            </div>
                            {patient.vitals.weight && (
                              <div className="flex items-center gap-1">
                                <Weight className="h-3 w-3" />
                                {patient.vitals.weight} kg
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        Update Vitals
                      </Button>
                      <Button size="sm">
                        Log Check
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Queue</CardTitle>
              <CardDescription>Lab tests and sample processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {labQueue.map((lab) => (
                  <div key={lab.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{lab.patientName}</div>
                          <Badge className={getPriorityColor(lab.priority)}>
                            {lab.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">Test: {lab.testType}</div>
                        <div className="text-xs text-muted-foreground">
                          Requested by: {lab.requestedBy} • {lab.requestedTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(lab.status)}>
                        {lab.status}
                      </Badge>
                      <div className="flex gap-1">
                        {lab.status === "PENDING" && (
                          <Button size="sm">
                            Collect
                          </Button>
                        )}
                        {lab.status === "COLLECTING" && (
                          <Button size="sm">
                            Process
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Procedure Assistance</CardTitle>
              <CardDescription>Scheduled procedures requiring assistance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {procedureAssists.map((procedure) => (
                  <div key={procedure.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="font-medium">{procedure.procedure}</div>
                        <div className="text-sm text-muted-foreground">Patient: {procedure.patientName}</div>
                        <div className="text-xs text-muted-foreground">
                          Veterinarian: {procedure.veterinarian} • Duration: {procedure.duration}min
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Start time: {procedure.startTime}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(procedure.status)}>
                        {procedure.status}
                      </Badge>
                      <div className="flex gap-1">
                        {procedure.status === "SCHEDULED" && (
                          <Button size="sm">
                            Prepare
                          </Button>
                        )}
                        {procedure.status === "IN_PROGRESS" && (
                          <Button size="sm" variant="outline">
                            Complete
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
      </Tabs>
    </div>
  )
}