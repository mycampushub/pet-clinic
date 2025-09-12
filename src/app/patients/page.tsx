"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Plus, 
  Filter, 
  Heart, 
  User, 
  Phone, 
  Mail,
  Calendar,
  FileText,
  AlertTriangle,
  MoreVertical,
  Edit,
  Eye,
  Trash2
} from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pet, Owner } from "@prisma/client"

interface PetWithOwner extends Pet {
  owner: Owner
}

export default function PatientsPage() {
  const { data: session } = useSession()
  const [pets, setPets] = useState<PetWithOwner[]>([])
  const [filteredPets, setFilteredPets] = useState<PetWithOwner[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedPet, setSelectedPet] = useState<PetWithOwner | null>(null)

  useEffect(() => {
    fetchPets()
  }, [])

  useEffect(() => {
    if (pets.length > 0) {
      const filtered = pets.filter(pet => 
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPets(filtered)
    }
  }, [pets, searchTerm])

  const fetchPets = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/patients')
      if (response.ok) {
        const data = await response.json()
        setPets(data.pets)
        setFilteredPets(data.pets)
      } else {
        throw new Error('Failed to fetch patients data')
      }
    } catch (error) {
      console.error("Error fetching pets:", error)
      // Set empty arrays on error
      setPets([])
      setFilteredPets([])
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

  const getPetAlerts = (pet: PetWithOwner) => {
    const alerts = []
    
    if (pet.allergies) {
      const allergies = JSON.parse(pet.allergies)
      if (allergies.length > 0) {
        alerts.push({ type: "allergy", message: `Allergies: ${allergies.join(", ")}` })
      }
    }
    
    if (pet.chronicConditions) {
      const conditions = JSON.parse(pet.chronicConditions)
      if (conditions.length > 0) {
        alerts.push({ type: "condition", message: `Chronic: ${conditions.join(", ")}` })
      }
    }
    
    return alerts
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
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Pet Records</h1>
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900">Patient Directory</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Patient
            </Button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by pet name, owner, species, or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pets.length}</div>
              <p className="text-xs text-muted-foreground">
                Active patients
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dogs</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pets.filter(p => p.species === 'Dog').length}</div>
              <p className="text-xs text-muted-foreground">
                Canine patients
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cats</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pets.filter(p => p.species === 'Cat').length}</div>
              <p className="text-xs text-muted-foreground">
                Feline patients
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pets.filter(p => p.allergies || p.chronicConditions).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Need special attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Patients List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patients Cards */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPets.map((pet) => (
                <Card key={pet.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{pet.name}</CardTitle>
                        <CardDescription>
                          {pet.breed} {pet.gender === 'MALE' ? '♂' : '♀'}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPet(pet)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {pet.owner.firstName} {pet.owner.lastName}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {pet.owner.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {getAge(pet.dateOfBirth)}
                      </div>
                      
                      {/* Alerts */}
                      {getPetAlerts(pet).length > 0 && (
                        <div className="space-y-1">
                          {getPetAlerts(pet).map((alert, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {alert.message}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" className="flex-1 mr-2">
                          <FileText className="h-3 w-3 mr-1" />
                          Records
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          Book
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pet Details Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Pet Details</CardTitle>
                <CardDescription>
                  {selectedPet ? "Selected patient information" : "Select a pet to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPet ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{selectedPet.name}</h3>
                      <p className="text-sm text-gray-600">{selectedPet.breed} {selectedPet.species}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Age:</span>
                        <span className="text-sm">{getAge(selectedPet.dateOfBirth)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Gender:</span>
                        <span className="text-sm">{selectedPet.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Weight:</span>
                        <span className="text-sm">{selectedPet.weight} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Neutered:</span>
                        <span className="text-sm">{selectedPet.isNeutered ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Owner Information</h4>
                      <div className="space-y-1">
                        <p className="text-sm">{selectedPet.owner.firstName} {selectedPet.owner.lastName}</p>
                        <p className="text-sm text-gray-600">{selectedPet.owner.phone}</p>
                        <p className="text-sm text-gray-600">{selectedPet.owner.email}</p>
                      </div>
                    </div>
                    
                    {selectedPet.microchipId && (
                      <div>
                        <h4 className="font-medium mb-1">Microchip</h4>
                        <p className="text-sm text-gray-600">{selectedPet.microchipId}</p>
                      </div>
                    )}
                    
                    <div className="pt-4 space-y-2">
                      <Button className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        View Full Record
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select a patient to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}