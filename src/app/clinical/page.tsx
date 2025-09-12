"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Stethoscope, 
  Plus, 
  Search, 
  FileText, 
  Activity,
  Heart,
  Thermometer,
  Scale,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Edit,
  Save,
  X,
  Upload,
  Download
} from "lucide-react"
import { Pet, Owner, Visit, SOAPNote, Procedure, Prescription, Medication } from "@prisma/client"

interface SOAPNoteWithDetails extends SOAPNote {
  visit: Visit & {
    pet: Pet & {
      owner: Owner
    }
    user?: {
      firstName: string
      lastName: string
    }
  }
}

interface ProcedureWithDetails extends Procedure {
  visit: Visit & {
    pet: Pet & {
      owner: Owner
    }
  }
}

interface ClinicalWorkflow {
  id: string
  name: string
  description: string
  steps: string[]
  isActive: boolean
}

export default function ClinicalPage() {
  const { data: session } = useSession()
  const [soapNotes, setSoapNotes] = useState<SOAPNoteWithDetails[]>([])
  const [procedures, setProcedures] = useState<ProcedureWithDetails[]>([])
  const [workflows, setWorkflows] = useState<ClinicalWorkflow[]>([])
  const [selectedWorkflow, setSelectedWorkflow] = useState<ClinicalWorkflow | null>(null)
  const [activeVisit, setActiveVisit] = useState<Visit | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingSOAP, setEditingSOAP] = useState<string | null>(null)

  // SOAP Note form state
  const [soapForm, setSoapForm] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
    weight: "",
    temperature: "",
    heartRate: "",
    respiratoryRate: "",
    notes: ""
  })

  useEffect(() => {
    fetchClinicalData()
  }, [])

  const fetchClinicalData = async () => {
    setLoading(true)
    try {
      // Mock SOAP Notes
      const mockSOAPNotes: SOAPNoteWithDetails[] = [
        {
          id: "1",
          visitId: "1",
          subjective: "Owner reports Max has been lethargic for the past 2 days. Not eating well. Some vomiting noticed yesterday.",
          objective: "Patient alert but quiet. Mucous membranes pink and moist. CRT < 2 seconds. Heart rate normal, lungs clear. Abdomen slightly tense on palpation.",
          assessment: "Gastrointestinal upset - possible dietary indiscretion or mild pancreatitis.",
          plan: "1. Recommend bland diet for 3-5 days\n2. Anti-nausea medication\n3. Recheck in 48 hours if no improvement\n4. Blood work if condition worsens",
          weight: "32.5",
          temperature: "101.5",
          heartRate: "120",
          respiratoryRate: "24",
          notes: "Owner very concerned. Discussed possibility of dietary indiscretion.",
          attachments: JSON.stringify([]),
          createdAt: new Date(),
          updatedAt: new Date(),
          visit: {
            id: "1",
            tenantId: "1",
            clinicId: "1",
            petId: "1",
            userId: "1",
            visitType: "CONSULTATION",
            status: "COMPLETED",
            scheduledAt: new Date("2024-09-10T09:00:00"),
            checkedInAt: new Date("2024-09-10T08:45:00"),
            startedAt: new Date("2024-09-10T09:05:00"),
            completedAt: new Date("2024-09-10T09:45:00"),
            reason: "Lethargy and decreased appetite",
            symptoms: "Lethargy, decreased appetite, vomiting",
            diagnosis: "Gastrointestinal upset",
            treatment: "Anti-nausea medication, dietary recommendation",
            notes: "Follow up in 48 hours",
            followUpRequired: true,
            followUpDate: new Date("2024-09-12"),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            pet: {
              id: "1",
              tenantId: "1",
              ownerId: "1",
              name: "Max",
              species: "Dog",
              breed: "Golden Retriever",
              gender: "MALE",
              isNeutered: true,
              dateOfBirth: new Date("2018-05-15"),
              microchipId: "985141000123456",
              color: "Golden",
              weight: 32.5,
              allergies: null,
              chronicConditions: null,
              notes: "Friendly dog, loves treats",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              owner: {
                id: "1",
                tenantId: "1",
                firstName: "John",
                lastName: "Smith",
                email: "john.smith@email.com",
                phone: "+1-555-0123",
                address: "123 Main St",
                city: "Anytown",
                state: "CA",
                zipCode: "12345",
                country: "US",
                emergencyContact: null,
                notes: "Regular client",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            },
            user: {
              firstName: "Dr. Sarah",
              lastName: "Johnson"
            }
          }
        }
      ]

      // Mock Procedures
      const mockProcedures: ProcedureWithDetails[] = [
        {
          id: "1",
          visitId: "2",
          code: "D0110",
          description: "Periodontal scaling and polishing",
          procedureType: "DENTAL",
          anesthesiaUsed: true,
          anesthesiaNotes: "Propofol induction, isoflurane maintenance. Uneventful anesthesia.",
          notes: "Moderate tartar buildup removed. Gingivitis present. Home care discussed.",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          visit: {
            id: "2",
            tenantId: "1",
            clinicId: "1",
            petId: "2",
            userId: "1",
            visitType: "DENTAL",
            status: "COMPLETED",
            scheduledAt: new Date("2024-09-12T10:00:00"),
            checkedInAt: new Date("2024-09-12T09:30:00"),
            startedAt: new Date("2024-09-12T10:15:00"),
            completedAt: new Date("2024-09-12T12:30:00"),
            reason: "Dental cleaning and examination",
            symptoms: "Tartar buildup, bad breath",
            diagnosis: "Periodontal disease",
            treatment: "Dental scaling and polishing",
            notes: "Patient recovered well from anesthesia",
            followUpRequired: false,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            pet: {
              id: "2",
              tenantId: "1",
              ownerId: "2",
              name: "Luna",
              species: "Cat",
              breed: "Persian",
              gender: "FEMALE",
              isNeutered: true,
              dateOfBirth: new Date("2020-02-10"),
              microchipId: "985141000123457",
              color: "White",
              weight: 4.2,
              allergies: null,
              chronicConditions: null,
              notes: "Shy, needs gentle handling",
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              owner: {
                id: "2",
                tenantId: "1",
                firstName: "Sarah",
                lastName: "Johnson",
                email: "sarah.j@email.com",
                phone: "+1-555-0125",
                address: "456 Oak Ave",
                city: "Somewhere",
                state: "CA",
                zipCode: "12346",
                country: "US",
                emergencyContact: null,
                notes: "New client",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            }
          }
        }
      ]

      // Mock Clinical Workflows
      const mockWorkflows: ClinicalWorkflow[] = [
        {
          id: "1",
          name: "Wellness Examination",
          description: "Standard wellness check for healthy patients",
          steps: [
            "Review patient history",
            "Vital signs assessment",
            "Physical examination",
            "Vaccination review",
            "Preventive care discussion",
            "Documentation"
          ],
          isActive: true
        },
        {
          id: "2",
          name: "Dental Procedure",
          description: "Complete dental cleaning and examination",
          steps: [
            "Pre-anesthetic evaluation",
            "Anesthesia induction",
            "Dental radiographs",
            "Scaling and polishing",
            "Oral examination",
            "Treatment planning",
            "Recovery monitoring",
            "Home care instructions"
          ],
          isActive: true
        },
        {
          id: "3",
          name: "Surgical Procedure",
          description: "General surgical workflow",
          steps: [
            "Pre-operative assessment",
            "Surgical consent",
            "Anesthetic preparation",
            "Surgical preparation",
            "Surgical procedure",
            "Recovery monitoring",
            "Discharge instructions",
            "Follow-up scheduling"
          ],
          isActive: true
        }
      ]

      setSoapNotes(mockSOAPNotes)
      setProcedures(mockProcedures)
      setWorkflows(mockWorkflows)
    } catch (error) {
      console.error("Error fetching clinical data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSOAPSubmit = () => {
    if (!activeVisit) return
    
    // In a real app, this would save to the database
    console.log("Saving SOAP note:", soapForm)
    setEditingSOAP(null)
    // Reset form
    setSoapForm({
      subjective: "",
      objective: "",
      assessment: "",
      plan: "",
      weight: "",
      temperature: "",
      heartRate: "",
      respiratoryRate: "",
      notes: ""
    })
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
              <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Clinical Workflow</h1>
            </div>
            <div className="flex items-center space-x-4">
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
        <Tabs defaultValue="soap" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
            <TabsTrigger value="procedures">Procedures</TabsTrigger>
            <TabsTrigger value="workflows">Clinical Workflows</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="soap">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* SOAP Notes List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent SOAP Notes</CardTitle>
                    <CardDescription>
                      Clinical documentation and assessments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {soapNotes.map((soapNote) => (
                        <Card key={soapNote.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">
                                  {soapNote.visit.pet.name} - {soapNote.visit.pet.owner.firstName} {soapNote.visit.pet.owner.lastName}
                                </CardTitle>
                                <CardDescription>
                                  {soapNote.visit.visitType.replace('_', ' ')} • {new Date(soapNote.visit.scheduledAt).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              <Badge variant="outline">
                                {soapNote.visit.user?.firstName} {soapNote.visit.user?.lastName}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-sm mb-1">Subjective</h5>
                                <p className="text-sm text-gray-600">{soapNote.subjective}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm mb-1">Objective</h5>
                                <p className="text-sm text-gray-600">{soapNote.objective}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm mb-1">Assessment</h5>
                                <p className="text-sm text-gray-600">{soapNote.assessment}</p>
                              </div>
                              <div>
                                <h5 className="font-medium text-sm mb-1">Plan</h5>
                                <p className="text-sm text-gray-600 whitespace-pre-line">{soapNote.plan}</p>
                              </div>
                              
                              {soapNote.weight && (
                                <div className="flex items-center space-x-4 text-sm">
                                  <div className="flex items-center">
                                    <Scale className="h-4 w-4 mr-1 text-gray-400" />
                                    <span>{soapNote.weight} kg</span>
                                  </div>
                                  {soapNote.temperature && (
                                    <div className="flex items-center">
                                      <Thermometer className="h-4 w-4 mr-1 text-gray-400" />
                                      <span>{soapNote.temperature}°F</span>
                                    </div>
                                  )}
                                  {soapNote.heartRate && (
                                    <div className="flex items-center">
                                      <Heart className="h-4 w-4 mr-1 text-gray-400" />
                                      <span>{soapNote.heartRate} bpm</span>
                                    </div>
                                  )}
                                </div>
                              )}
                              
                              <div className="flex justify-between pt-3">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-3 w-3 mr-1" />
                                  Export
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SOAP Note Form */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>New SOAP Note</CardTitle>
                    <CardDescription>
                      Create clinical documentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Patient</label>
                      <Input placeholder="Search patient..." />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-sm font-medium">Weight (kg)</label>
                        <Input
                          value={soapForm.weight}
                          onChange={(e) => setSoapForm({...soapForm, weight: e.target.value})}
                          placeholder="0.0"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Temperature (°F)</label>
                        <Input
                          value={soapForm.temperature}
                          onChange={(e) => setSoapForm({...soapForm, temperature: e.target.value})}
                          placeholder="101.5"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Heart Rate</label>
                        <Input
                          value={soapForm.heartRate}
                          onChange={(e) => setSoapForm({...soapForm, heartRate: e.target.value})}
                          placeholder="120"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Resp. Rate</label>
                        <Input
                          value={soapForm.respiratoryRate}
                          onChange={(e) => setSoapForm({...soapForm, respiratoryRate: e.target.value})}
                          placeholder="24"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Subjective</label>
                      <Textarea
                        value={soapForm.subjective}
                        onChange={(e) => setSoapForm({...soapForm, subjective: e.target.value})}
                        placeholder="Owner reports..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Objective</label>
                      <Textarea
                        value={soapForm.objective}
                        onChange={(e) => setSoapForm({...soapForm, objective: e.target.value})}
                        placeholder="Physical exam findings..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Assessment</label>
                      <Textarea
                        value={soapForm.assessment}
                        onChange={(e) => setSoapForm({...soapForm, assessment: e.target.value})}
                        placeholder="Diagnosis/Problem list..."
                        rows={2}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Plan</label>
                      <Textarea
                        value={soapForm.plan}
                        onChange={(e) => setSoapForm({...soapForm, plan: e.target.value})}
                        placeholder="Treatment plan..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea
                        value={soapForm.notes}
                        onChange={(e) => setSoapForm({...soapForm, notes: e.target.value})}
                        placeholder="Additional notes..."
                        rows={2}
                      />
                    </div>
                    
                    <Button className="w-full" onClick={handleSOAPSubmit}>
                      <Save className="h-4 w-4 mr-2" />
                      Save SOAP Note
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="procedures">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Procedures List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Procedures</CardTitle>
                    <CardDescription>
                      Surgical and medical procedures performed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {procedures.map((procedure) => (
                        <Card key={procedure.id} className="hover:shadow-md transition-shadow">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">
                                  {procedure.description}
                                </CardTitle>
                                <CardDescription>
                                  {procedure.visit.pet.name} • {new Date(procedure.visit.scheduledAt).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              <Badge variant="outline">
                                {procedure.procedureType}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <h5 className="font-medium text-sm mb-1">Procedure Details</h5>
                                <p className="text-sm text-gray-600">
                                  Code: {procedure.code} • Type: {procedure.procedureType}
                                </p>
                              </div>
                              
                              {procedure.anesthesiaUsed && (
                                <div>
                                  <h5 className="font-medium text-sm mb-1">Anesthesia</h5>
                                  <p className="text-sm text-gray-600">{procedure.anesthesiaNotes}</p>
                                </div>
                              )}
                              
                              {procedure.notes && (
                                <div>
                                  <h5 className="font-medium text-sm mb-1">Notes</h5>
                                  <p className="text-sm text-gray-600">{procedure.notes}</p>
                                </div>
                              )}
                              
                              <div className="flex justify-between pt-3">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm">
                                  <FileText className="h-3 w-3 mr-1" />
                                  View Report
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Procedure Form */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Quick Procedure</CardTitle>
                    <CardDescription>
                      Log a new procedure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Patient</label>
                      <Input placeholder="Search patient..." />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Procedure Type</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>DENTAL</option>
                        <option>SURGERY</option>
                        <option>EXAMINATION</option>
                        <option>VACCINATION</option>
                        <option>LABORATORY</option>
                        <option>RADIOLOGY</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        placeholder="Procedure description..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Code</label>
                      <Input placeholder="Procedure code" />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="anesthesia" className="rounded" />
                      <label htmlFor="anesthesia" className="text-sm">Anesthesia used</label>
                    </div>
                    
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Log Procedure
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="workflows">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Workflow List */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Clinical Workflows</CardTitle>
                    <CardDescription>
                      Standardized clinical procedures
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {workflows.map((workflow) => (
                        <div
                          key={workflow.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            selectedWorkflow?.id === workflow.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedWorkflow(workflow)}
                        >
                          <h4 className="font-medium text-sm">{workflow.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{workflow.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {workflow.steps.length} steps
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Workflow Details */}
              <div className="lg:col-span-2">
                {selectedWorkflow ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedWorkflow.name}</CardTitle>
                      <CardDescription>{selectedWorkflow.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-3">Procedure Steps</h4>
                          <div className="space-y-3">
                            {selectedWorkflow.steps.map((step, index) => (
                              <div key={index} className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm">{step}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t">
                          <div className="flex space-x-3">
                            <Button>
                              <Activity className="h-4 w-4 mr-2" />
                              Start Workflow
                            </Button>
                            <Button variant="outline">
                              <Edit className="h-4 w-4 mr-2" />
                              Customize
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Workflow</h3>
                        <p className="text-sm text-gray-600">
                          Choose a clinical workflow to view details and start the procedure.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Wellness Exam Template
                  </CardTitle>
                  <CardDescription>
                    Standard wellness examination template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive template for routine wellness examinations including vital signs, physical exam, and preventive care recommendations.
                  </p>
                  <Button variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Emergency Exam Template
                  </CardTitle>
                  <CardDescription>
                    Emergency/urgent care template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Template for emergency examinations with focus on triage, stabilization, and critical assessment.
                  </p>
                  <Button variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2" />
                    Cardiac Exam Template
                  </CardTitle>
                  <CardDescription>
                    Cardiology examination template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Specialized template for cardiac examinations including auscultation, ECG interpretation, and cardiac assessment.
                  </p>
                  <Button variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    Surgical Template
                  </CardTitle>
                  <CardDescription>
                    Pre/post-operative assessment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Template for surgical procedures including pre-op assessment, surgical planning, and post-op care instructions.
                  </p>
                  <Button variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Thermometer className="h-5 w-5 mr-2" />
                    Vaccination Template
                  </CardTitle>
                  <CardDescription>
                    Vaccination consultation template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Template for vaccination consultations including vaccine history, recommendations, and education.
                  </p>
                  <Button variant="outline" className="w-full">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Create Custom Template
                  </CardTitle>
                  <CardDescription>
                    Build your own template
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Create a custom SOAP note template tailored to your specific practice needs and preferences.
                  </p>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}