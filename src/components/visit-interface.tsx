"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  User, 
  Heart, 
  Thermometer, 
  Activity, 
  Weight, 
  Plus, 
  Save,
  FileText,
  Pill,
  Package,
  Stethoscope,
  Camera,
  Upload
} from "lucide-react"

interface Pet {
  id: string
  name: string
  species: string
  breed: string
  age: number
  sex: string
  weight: number
  microchip?: string
  ownerId: string
}

interface Owner {
  id: string
  name: string
  phone: string
  email: string
}

interface Visit {
  id: string
  petId: string
  providerId: string
  checkInAt: string
  status: "CHECKED_IN" | "IN_PROGRESS" | "COMPLETED"
  chiefComplaint?: string
  weight?: number
  temperature?: number
  heartRate?: number
  respiratoryRate?: number
}

interface SOAPNote {
  subjective?: string
  objective?: string
  assessment?: string
  plan?: string
}

interface Prescription {
  id: string
  medication: string
  dosage: string
  frequency: string
  duration: string
  instructions: string
}

interface Procedure {
  id: string
  name: string
  description: string
  amount: number
}

export function VisitInterface() {
  const [activeTab, setActiveTab] = useState("soap")
  const [visitStatus, setVisitStatus] = useState<"CHECKED_IN" | "IN_PROGRESS" | "COMPLETED">("IN_PROGRESS")
  const [soapNote, setSoapNote] = useState<SOAPNote>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: ""
  })
  const [vitals, setVitals] = useState({
    weight: 32.5,
    temperature: 38.5,
    heartRate: 80,
    respiratoryRate: 20
  })

  // Sample data
  const currentPet: Pet = {
    id: "1",
    name: "Rex",
    species: "Dog",
    breed: "Labrador Retriever",
    age: 5,
    sex: "Male",
    weight: 32.5,
    microchip: "985141000123456",
    ownerId: "1"
  }

  const currentOwner: Owner = {
    id: "1",
    name: "John Doe",
    phone: "(555) 123-4567",
    email: "john.doe@email.com"
  }

  const currentVisit: Visit = {
    id: "1",
    petId: "1",
    providerId: "1",
    checkInAt: "2024-12-15T09:30:00Z",
    status: "IN_PROGRESS",
    chiefComplaint: "Annual checkup and vaccination",
    weight: 32.5,
    temperature: 38.5,
    heartRate: 80,
    respiratoryRate: 20
  }

  const prescriptions: Prescription[] = [
    {
      id: "1",
      medication: "Heartgard Plus",
      dosage: "1 chewable",
      frequency: "Monthly",
      duration: "12 months",
      instructions: "Give once monthly for heartworm prevention"
    }
  ]

  const procedures: Procedure[] = [
    {
      id: "1",
      name: "Annual Examination",
      description: "Complete physical examination",
      amount: 45.00
    },
    {
      id: "2",
      name: "DHPP Vaccination",
      description: "Distemper, Hepatitis, Parvovirus, Parainfluenza",
      amount: 25.00
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CHECKED_IN": return "bg-yellow-100 text-yellow-800"
      case "IN_PROGRESS": return "bg-green-100 text-green-800"
      case "COMPLETED": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleSaveSOAP = () => {
    console.log("Saving SOAP note:", soapNote)
    // Save to backend
  }

  const handleCheckout = () => {
    setVisitStatus("COMPLETED")
    console.log("Checking out visit")
    // Process checkout and generate invoice
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Visit - {currentPet.name}</h1>
          <p className="text-muted-foreground">
            Clinical encounter and documentation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(visitStatus)}>
            {visitStatus.replace("_", " ")}
          </Badge>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Follow-up
          </Button>
          <Button onClick={handleCheckout}>
            <Save className="h-4 w-4 mr-2" />
            Complete & Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Info Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" />
                <AvatarFallback>
                  {currentPet.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{currentPet.name}</div>
                <div className="text-sm text-muted-foreground">
                  {currentPet.breed}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Species:</span>
                <span>{currentPet.species}</span>
              </div>
              <div className="flex justify-between">
                <span>Breed:</span>
                <span>{currentPet.breed}</span>
              </div>
              <div className="flex justify-between">
                <span>Age:</span>
                <span>{currentPet.age} years</span>
              </div>
              <div className="flex justify-between">
                <span>Sex:</span>
                <span>{currentPet.sex}</span>
              </div>
              <div className="flex justify-between">
                <span>Weight:</span>
                <span>{currentPet.weight} kg</span>
              </div>
              {currentPet.microchip && (
                <div className="flex justify-between">
                  <span>Microchip:</span>
                  <span className="text-xs">{currentPet.microchip}</span>
                </div>
              )}
            </div>

            <Separator />

            <div>
              <div className="font-medium mb-2">Owner</div>
              <div className="space-y-1 text-sm">
                <div>{currentOwner.name}</div>
                <div>{currentOwner.phone}</div>
                <div>{currentOwner.email}</div>
              </div>
            </div>

            <Separator />

            <div>
              <div className="font-medium mb-2">Visit Details</div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>Check-in: {new Date(currentVisit.checkInAt).toLocaleTimeString()}</span>
                </div>
                <div>Complaint: {currentVisit.chiefComplaint}</div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <Button variant="outline" size="sm" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Medical History
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Attach Photos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Vitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Vital Signs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      step="0.1"
                      value={vitals.weight}
                      onChange={(e) => setVitals({...vitals, weight: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Temperature (°C)</label>
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      step="0.1"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({...vitals, temperature: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Heart Rate (bpm)</label>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({...vitals, heartRate: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resp. Rate (bpm)</label>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="number"
                      value={vitals.respiratoryRate}
                      onChange={(e) => setVitals({...vitals, respiratoryRate: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SOAP Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                SOAP Notes
              </CardTitle>
              <CardDescription>
                Subjective, Objective, Assessment, and Plan documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="subjective">Subjective</TabsTrigger>
                  <TabsTrigger value="objective">Objective</TabsTrigger>
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="plan">Plan</TabsTrigger>
                </TabsList>

                <TabsContent value="subjective" className="space-y-2">
                  <Textarea
                    placeholder="Owner's description of the problem, patient history, symptoms reported..."
                    value={soapNote.subjective}
                    onChange={(e) => setSoapNote({...soapNote, subjective: e.target.value})}
                    rows={6}
                  />
                </TabsContent>

                <TabsContent value="objective" className="space-y-2">
                  <Textarea
                    placeholder="Vital signs, physical examination findings, diagnostic results..."
                    value={soapNote.objective}
                    onChange={(e) => setSoapNote({...soapNote, objective: e.target.value})}
                    rows={6}
                  />
                </TabsContent>

                <TabsContent value="assessment" className="space-y-2">
                  <Textarea
                    placeholder="Diagnosis, differential diagnoses, problem list..."
                    value={soapNote.assessment}
                    onChange={(e) => setSoapNote({...soapNote, assessment: e.target.value})}
                    rows={6}
                  />
                </TabsContent>

                <TabsContent value="plan" className="space-y-2">
                  <Textarea
                    placeholder="Treatment plan, medications prescribed, follow-up recommendations..."
                    value={soapNote.plan}
                    onChange={(e) => setSoapNote({...soapNote, plan: e.target.value})}
                    rows={6}
                  />
                </TabsContent>
              </Tabs>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSOAP}>
                  <Save className="h-4 w-4 mr-2" />
                  Save SOAP Notes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Prescriptions and Procedures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  Prescriptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prescriptions.map((prescription) => (
                  <div key={prescription.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{prescription.medication}</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>Dosage: {prescription.dosage}</div>
                      <div>Frequency: {prescription.frequency}</div>
                      <div>Duration: {prescription.duration}</div>
                      <div>Instructions: {prescription.instructions}</div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Prescription
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Procedures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {procedures.map((procedure) => (
                  <div key={procedure.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{procedure.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {procedure.description}
                        </div>
                      </div>
                      <div className="font-medium">${procedure.amount.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Procedure
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Attachments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Attachments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <div className="text-sm text-muted-foreground mb-2">
                  Drag and drop files here, or click to browse
                </div>
                <Button variant="outline" size="sm">
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}