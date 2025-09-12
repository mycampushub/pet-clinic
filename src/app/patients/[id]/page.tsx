"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft,
  Heart,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  AlertTriangle,
  Edit,
  Plus,
  Download,
  Upload
} from "lucide-react"
import { Pet, Owner, Visit, Prescription, LabOrder } from "@prisma/client"

interface PetWithOwner extends Pet {
  owner: Owner
}

interface VisitWithDetails extends Visit {
  user?: {
    firstName: string
    lastName: string
  }
}

export default function PetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [pet, setPet] = useState<PetWithOwner | null>(null)
  const [visits, setVisits] = useState<VisitWithDetails[]>([])
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [labOrders, setLabOrders] = useState<LabOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPetDetails()
    }
  }, [params.id])

  const fetchPetDetails = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API calls
      const mockPet: PetWithOwner = {
        id: params.id as string,
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
        allergies: JSON.stringify(["Penicillin"]),
        chronicConditions: JSON.stringify(["Arthritis"]),
        notes: "Friendly dog, loves treats. Responds well to positive reinforcement. Has some anxiety during thunderstorms.",
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
          emergencyContact: JSON.stringify({ name: "Jane Smith", phone: "+1-555-0124", relationship: "Spouse" }),
          notes: "Regular client, prefers morning appointments. Very reliable.",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }

      const mockVisits: VisitWithDetails[] = [
        {
          id: "1",
          tenantId: "1",
          clinicId: "1",
          petId: params.id as string,
          userId: "1",
          visitType: "CONSULTATION",
          status: "COMPLETED",
          scheduledAt: new Date("2024-09-10T09:00:00"),
          checkedInAt: new Date("2024-09-10T08:45:00"),
          startedAt: new Date("2024-09-10T09:05:00"),
          completedAt: new Date("2024-09-10T09:45:00"),
          reason: "Annual checkup and vaccination",
          symptoms: "None reported",
          diagnosis: "Healthy",
          treatment: "Annual vaccination administered",
          notes: "Patient is in good health. Weight stable.",
          followUpRequired: false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            firstName: "Dr. Sarah",
            lastName: "Johnson"
          }
        },
        {
          id: "2",
          tenantId: "1",
          clinicId: "1",
          petId: params.id as string,
          userId: "1",
          visitType: "FOLLOW_UP",
          status: "COMPLETED",
          scheduledAt: new Date("2024-08-15T14:00:00"),
          checkedInAt: new Date("2024-08-15T13:50:00"),
          startedAt: new Date("2024-08-15T14:05:00"),
          completedAt: new Date("2024-08-15T14:30:00"),
          reason: "Follow-up for skin condition",
          symptoms: "Itching and redness on belly",
          diagnosis: "Allergic dermatitis",
          treatment: "Prescribed antihistamine and medicated shampoo",
          notes: "Condition improving. Continue current treatment.",
          followUpRequired: true,
          followUpDate: new Date("2024-09-01"),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            firstName: "Dr. Sarah",
            lastName: "Johnson"
          }
        }
      ]

      const mockPrescriptions: Prescription[] = [
        {
          id: "1",
          tenantId: "1",
          visitId: "2",
          medicationId: "1",
          userId: "1",
          petId: params.id as string,
          dosage: "10mg",
          frequency: "Twice daily",
          duration: "14 days",
          quantity: 28,
          refills: 0,
          instructions: "Give with food. Monitor for drowsiness.",
          notes: "For allergic dermatitis",
          status: "COMPLETED",
          dispensedAt: new Date("2024-08-15"),
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const mockLabOrders: LabOrder[] = [
        {
          id: "1",
          tenantId: "1",
          visitId: "1",
          petId: params.id as string,
          labProvider: "VetLab",
          testType: "Blood Work",
          tests: JSON.stringify(["CBC", "Chemistry Panel"]),
          status: "COMPLETED",
          requestedAt: new Date("2024-09-10"),
          completedAt: new Date("2024-09-12"),
          results: JSON.stringify({
            cbc: "Within normal ranges",
            chemistry: "All values normal",
            notes: "No abnormalities detected"
          }),
          notes: "Annual blood work",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      setPet(mockPet)
      setVisits(mockVisits)
      setPrescriptions(mockPrescriptions)
      setLabOrders(mockLabOrders)
    } catch (error) {
      console.error("Error fetching pet details:", error)
    } finally {
      setLoading(false)
    }
  }

  const getAge = (dateOfBirth: Date | null) => {
    if (!dateOfBirth) return "Unknown"
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age > 0 ? `${age} year${age > 1 ? 's' : ''} old` : "Less than 1 year old"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Pet Not Found</h2>
              <p className="text-gray-600 mb-4">The pet you're looking for doesn't exist.</p>
              <Button onClick={() => router.push("/patients")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patients
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
              <Button variant="ghost" onClick={() => router.push("/patients")} className="mr-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{pet.name}</h1>
                <p className="text-sm text-gray-600">{pet.breed} {pet.species}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                {session?.user?.role?.replace('_', ' ')}
              </Badge>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Pet Information Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Pet Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Species</label>
                  <p className="text-sm">{pet.species}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Breed</label>
                  <p className="text-sm">{pet.breed}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Age</label>
                  <p className="text-sm">{getAge(pet.dateOfBirth)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-sm">{pet.gender} {pet.isNeutered ? '(Neutered)' : '(Intact)'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Weight</label>
                  <p className="text-sm">{pet.weight} kg</p>
                </div>
                {pet.microchipId && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Microchip ID</label>
                    <p className="text-sm font-mono">{pet.microchipId}</p>
                  </div>
                )}
                
                {/* Alerts */}
                {(pet.allergies || pet.chronicConditions) && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2 text-red-600">Medical Alerts</h4>
                    {pet.allergies && (
                      <div className="mb-2">
                        <Badge variant="destructive" className="text-xs">
                          Allergies: {JSON.parse(pet.allergies).join(", ")}
                        </Badge>
                      </div>
                    )}
                    {pet.chronicConditions && (
                      <div>
                        <Badge variant="destructive" className="text-xs">
                          Chronic: {JSON.parse(pet.chronicConditions).join(", ")}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Owner Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <p className="font-medium">{pet.owner.firstName} {pet.owner.lastName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-sm">{pet.owner.phone}</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                  <p className="text-sm">{pet.owner.email}</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm">{pet.owner.address}</p>
                    <p className="text-sm">{pet.owner.city}, {pet.owner.state} {pet.owner.zipCode}</p>
                  </div>
                </div>
                {pet.owner.emergencyContact && (
                  <div className="pt-3 border-t">
                    <h4 className="font-medium text-sm mb-1">Emergency Contact</h4>
                    {(() => {
                      const emergency = JSON.parse(pet.owner.emergencyContact!)
                      return (
                        <div className="text-sm">
                          <p>{emergency.name}</p>
                          <p>{emergency.phone}</p>
                          {emergency.relationship && <p className="text-gray-500">{emergency.relationship}</p>}
                        </div>
                      )
                    })()}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="visits">Visits</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
                <TabsTrigger value="labs">Lab Results</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-6">
                  {/* Medical Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Vital Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Last Visit:</span>
                              <span>{visits.length > 0 ? new Date(visits[0].completedAt!).toLocaleDateString() : 'No visits'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total Visits:</span>
                              <span>{visits.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Active Prescriptions:</span>
                              <span>{prescriptions.filter(p => p.status === 'ACTIVE').length}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">Quick Actions</h4>
                          <div className="space-y-2">
                            <Button className="w-full">
                              <Plus className="h-4 w-4 mr-2" />
                              New Appointment
                            </Button>
                            <Button variant="outline" className="w-full">
                              <FileText className="h-4 w-4 mr-2" />
                              Add Medical Note
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {visits.slice(0, 3).map((visit) => (
                          <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Calendar className="h-5 w-5 text-blue-600" />
                              <div>
                                <p className="font-medium">{visit.visitType.replace('_', ' ')}</p>
                                <p className="text-sm text-gray-600">
                                  {visit.user?.firstName} {visit.user?.lastName} • {new Date(visit.scheduledAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Badge variant={visit.status === 'COMPLETED' ? 'default' : 'secondary'}>
                              {visit.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes */}
                  {pet.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>General Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">{pet.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="visits">
                <Card>
                  <CardHeader>
                    <CardTitle>Visit History</CardTitle>
                    <CardDescription>
                      All medical visits and consultations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {visits.map((visit) => (
                        <div key={visit.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{visit.visitType.replace('_', ' ')}</h4>
                              <p className="text-sm text-gray-600">
                                {new Date(visit.scheduledAt).toLocaleDateString()} • {visit.user?.firstName} {visit.user?.lastName}
                              </p>
                            </div>
                            <Badge variant={visit.status === 'COMPLETED' ? 'default' : 'secondary'}>
                              {visit.status}
                            </Badge>
                          </div>
                          
                          {visit.reason && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Reason: </span>
                              <span className="text-sm">{visit.reason}</span>
                            </div>
                          )}
                          
                          {visit.diagnosis && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Diagnosis: </span>
                              <span className="text-sm">{visit.diagnosis}</span>
                            </div>
                          )}
                          
                          {visit.treatment && (
                            <div className="mb-2">
                              <span className="text-sm font-medium">Treatment: </span>
                              <span className="text-sm">{visit.treatment}</span>
                            </div>
                          )}
                          
                          {visit.notes && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <p className="text-sm text-gray-700">{visit.notes}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="prescriptions">
                <Card>
                  <CardHeader>
                    <CardTitle>Prescriptions</CardTitle>
                    <CardDescription>
                      Current and past medications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {prescriptions.map((prescription) => (
                        <div key={prescription.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">Medication #{prescription.id}</h4>
                              <p className="text-sm text-gray-600">
                                Prescribed on {new Date(prescription.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={prescription.status === 'ACTIVE' ? 'default' : 'secondary'}>
                              {prescription.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Dosage:</span>
                              <p>{prescription.dosage}</p>
                            </div>
                            <div>
                              <span className="font-medium">Frequency:</span>
                              <p>{prescription.frequency}</p>
                            </div>
                            <div>
                              <span className="font-medium">Duration:</span>
                              <p>{prescription.duration}</p>
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span>
                              <p>{prescription.quantity}</p>
                            </div>
                          </div>
                          
                          {prescription.instructions && (
                            <div className="mt-3 p-3 bg-blue-50 rounded">
                              <p className="text-sm text-blue-800">{prescription.instructions}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="labs">
                <Card>
                  <CardHeader>
                    <CardTitle>Lab Results</CardTitle>
                    <CardDescription>
                    Laboratory tests and results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {labOrders.map((labOrder) => (
                        <div key={labOrder.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">{labOrder.testType}</h4>
                              <p className="text-sm text-gray-600">
                                {labOrder.labProvider} • {new Date(labOrder.requestedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant={labOrder.status === 'COMPLETED' ? 'default' : 'secondary'}>
                              {labOrder.status}
                            </Badge>
                          </div>
                          
                          {labOrder.tests && (
                            <div className="mb-3">
                              <span className="text-sm font-medium">Tests: </span>
                              <span className="text-sm">{JSON.parse(labOrder.tests).join(", ")}</span>
                            </div>
                          )}
                          
                          {labOrder.results && (
                            <div className="mt-3 p-3 bg-green-50 rounded">
                              <p className="text-sm text-green-800">
                                {(() => {
                                  const results = JSON.parse(labOrder.results)
                                  return typeof results === 'string' ? results : JSON.stringify(results, null, 2)
                                })()}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documents">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents & Files</CardTitle>
                    <CardDescription>
                      Medical records, images, and attachments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No documents uploaded</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Upload medical records, x-rays, vaccination certificates, and other important documents.
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}