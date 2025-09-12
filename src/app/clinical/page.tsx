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
import { Pet, Owner, Visit, SOAPNote, Procedure } from "@prisma/client"

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
      // Fetch SOAP notes from API
      const soapResponse = await fetch('/api/clinical/soap-notes')
      if (soapResponse.ok) {
        const soapData = await soapResponse.json()
        setSoapNotes(soapData)
      }

      // Fetch procedures from API
      const proceduresResponse = await fetch('/api/clinical/procedures')
      if (proceduresResponse.ok) {
        const proceduresData = await proceduresResponse.json()
        setProcedures(proceduresData)
      }

      // Set up default clinical workflows
      const defaultWorkflows: ClinicalWorkflow[] = [
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

      setWorkflows(defaultWorkflows)
    } catch (error) {
      console.error("Error fetching clinical data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSOAPSubmit = async () => {
    if (!activeVisit) return
    
    try {
      const response = await fetch('/api/clinical/soap-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitId: activeVisit.id,
          ...soapForm
        }),
      })

      if (response.ok) {
        // Refresh data
        fetchClinicalData()
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
      } else {
        console.error("Failed to save SOAP note")
      }
    } catch (error) {
      console.error("Error saving SOAP note:", error)
    }
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
                      {soapNotes.length === 0 ? (
                        <div className="text-center py-8">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No SOAP Notes</h3>
                          <p className="text-gray-600">Create your first SOAP note to get started</p>
                        </div>
                      ) : (
                        soapNotes.map((soapNote) => (
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
                                
                                {(soapNote.weight || soapNote.temperature || soapNote.heartRate) && (
                                  <div className="flex items-center space-x-4 text-sm">
                                    {soapNote.weight && (
                                      <div className="flex items-center">
                                        <Scale className="h-4 w-4 mr-1 text-gray-400" />
                                        <span>{soapNote.weight} kg</span>
                                      </div>
                                    )}
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
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SOAP Note Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>New SOAP Note</CardTitle>
                    <CardDescription>
                      Create clinical documentation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subjective</label>
                      <Textarea
                        placeholder="Owner's description and patient history..."
                        value={soapForm.subjective}
                        onChange={(e) => setSoapForm({...soapForm, subjective: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Objective</label>
                      <Textarea
                        placeholder="Physical examination findings..."
                        value={soapForm.objective}
                        onChange={(e) => setSoapForm({...soapForm, objective: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Assessment</label>
                      <Textarea
                        placeholder="Diagnosis and clinical judgment..."
                        value={soapForm.assessment}
                        onChange={(e) => setSoapForm({...soapForm, assessment: e.target.value})}
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Plan</label>
                      <Textarea
                        placeholder="Treatment plan and recommendations..."
                        value={soapForm.plan}
                        onChange={(e) => setSoapForm({...soapForm, plan: e.target.value})}
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Weight (kg)</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="32.5"
                          value={soapForm.weight}
                          onChange={(e) => setSoapForm({...soapForm, weight: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Temperature (°F)</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="101.5"
                          value={soapForm.temperature}
                          onChange={(e) => setSoapForm({...soapForm, temperature: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Heart Rate (bpm)</label>
                        <Input
                          type="number"
                          placeholder="120"
                          value={soapForm.heartRate}
                          onChange={(e) => setSoapForm({...soapForm, heartRate: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Respiratory Rate</label>
                        <Input
                          type="number"
                          placeholder="24"
                          value={soapForm.respiratoryRate}
                          onChange={(e) => setSoapForm({...soapForm, respiratoryRate: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notes</label>
                      <Textarea
                        placeholder="Additional notes..."
                        value={soapForm.notes}
                        onChange={(e) => setSoapForm({...soapForm, notes: e.target.value})}
                        rows={2}
                      />
                    </div>
                    
                    <Button onClick={handleSOAPSubmit} className="w-full">
                      <Save className="h-4 w-4 mr-2" />
                      Save SOAP Note
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="procedures">
            <Card>
              <CardHeader>
                <CardTitle>Recent Procedures</CardTitle>
                <CardDescription>
                  Medical procedures and interventions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {procedures.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Procedures</h3>
                      <p className="text-gray-600">No procedures have been recorded yet</p>
                    </div>
                  ) : (
                    procedures.map((procedure) => (
                      <Card key={procedure.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{procedure.description}</CardTitle>
                              <CardDescription>
                                {procedure.procedureType} • {new Date(procedure.createdAt).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            {procedure.anesthesiaUsed && (
                              <Badge variant="secondary">Anesthesia Used</Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-medium text-sm mb-1">Patient</h5>
                              <p className="text-sm text-gray-600">
                                {procedure.visit.pet.name} - {procedure.visit.pet.owner.firstName} {procedure.visit.pet.owner.lastName}
                              </p>
                            </div>
                            {procedure.code && (
                              <div>
                                <h5 className="font-medium text-sm mb-1">Code</h5>
                                <p className="text-sm text-gray-600">{procedure.code}</p>
                              </div>
                            )}
                            {procedure.anesthesiaNotes && (
                              <div>
                                <h5 className="font-medium text-sm mb-1">Anesthesia Notes</h5>
                                <p className="text-sm text-gray-600">{procedure.anesthesiaNotes}</p>
                              </div>
                            )}
                            {procedure.notes && (
                              <div>
                                <h5 className="font-medium text-sm mb-1">Notes</h5>
                                <p className="text-sm text-gray-600">{procedure.notes}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="workflows">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                    <CardDescription>{workflow.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Steps:</h5>
                      <ol className="text-sm text-gray-600 space-y-1">
                        {workflow.steps.map((step, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setSelectedWorkflow(workflow)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Templates</CardTitle>
                <CardDescription>
                  Pre-configured templates for common clinical scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Coming Soon</h3>
                  <p className="text-gray-600">Clinical templates will be available in a future update</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}