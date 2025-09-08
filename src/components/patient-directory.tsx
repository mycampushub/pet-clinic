"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Phone, Mail, MapPin, Calendar, Heart, Edit, MoreHorizontal } from "lucide-react"

interface Owner {
  id: string
  name: string
  email: string
  phone: string
  address: string
  emergencyContact?: string
  notes?: string
}

interface Pet {
  id: string
  name: string
  species: string
  breed: string
  age: number
  sex: string
  isNeutered: boolean
  microchip?: string
  weight: number
  color: string
  ownerId: string
  lastVisit?: string
  nextAppointment?: string
  notes?: string
  allergies?: string[]
  medications?: string[]
}

export function PatientDirectory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSpecies, setSelectedSpecies] = useState("all")
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)

  // Sample data
  const owners: Owner[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@email.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, ST 12345",
      emergencyContact: "Jane Doe - (555) 987-6543",
      notes: "Prefers morning appointments"
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@email.com",
      phone: "(555) 234-5678",
      address: "456 Oak Ave, Somewhere, ST 67890",
      emergencyContact: "Bob Smith - (555) 876-5432"
    },
    {
      id: "3",
      name: "Bob Wilson",
      email: "bob.wilson@email.com",
      phone: "(555) 345-6789",
      address: "789 Pine Rd, Nowhere, ST 13579"
    }
  ]

  const pets: Pet[] = [
    {
      id: "1",
      name: "Rex",
      species: "Dog",
      breed: "Labrador Retriever",
      age: 5,
      sex: "Male",
      isNeutered: true,
      microchip: "985141000123456",
      weight: 32.5,
      color: "Golden",
      ownerId: "1",
      lastVisit: "2024-08-15",
      nextAppointment: "2024-12-15",
      allergies: ["Penicillin"],
      medications: ["Heartgard Plus"]
    },
    {
      id: "2",
      name: "Luna",
      species: "Cat",
      breed: "Domestic Shorthair",
      age: 3,
      sex: "Female",
      isNeutered: true,
      weight: 4.2,
      color: "Gray",
      ownerId: "2",
      lastVisit: "2024-09-01",
      nextAppointment: "2024-12-01"
    },
    {
      id: "3",
      name: "Max",
      species: "Dog",
      breed: "German Shepherd",
      age: 7,
      sex: "Male",
      isNeutered: false,
      weight: 38.0,
      color: "Black and Tan",
      ownerId: "3",
      lastVisit: "2024-08-20",
      nextAppointment: "2024-12-20",
      medications: ["Carprofen"]
    },
    {
      id: "4",
      name: "Bella",
      species: "Cat",
      breed: "Siamese",
      age: 2,
      sex: "Female",
      isNeutered: true,
      weight: 3.8,
      color: "Cream",
      ownerId: "2",
      lastVisit: "2024-09-10"
    }
  ]

  const getOwnerById = (ownerId: string) => owners.find(owner => owner.id === ownerId)
  const getPetsByOwner = (ownerId: string) => pets.filter(pet => pet.ownerId === ownerId)

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getOwnerById(pet.ownerId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSpecies = selectedSpecies === "all" || pet.species.toLowerCase() === selectedSpecies.toLowerCase()
    return matchesSearch && matchesSpecies
  })

  const filteredOwners = owners.filter(owner =>
    owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    owner.phone.includes(searchTerm)
  )

  const species = ["all", ...Array.from(new Set(pets.map(pet => pet.species)))]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Directory</h1>
          <p className="text-muted-foreground">
            Manage pet patients and their owners
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Patient
          </Button>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Owner
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by pet name, breed, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by species" />
          </SelectTrigger>
          <SelectContent>
            {species.map((spec) => (
              <SelectItem key={spec} value={spec}>
                {spec === "all" ? "All Species" : spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="pets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pets">Pets ({filteredPets.length})</TabsTrigger>
          <TabsTrigger value="owners">Owners ({filteredOwners.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pets" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPets.map((pet) => {
              const owner = getOwnerById(pet.ownerId)
              return (
                <Card key={pet.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {pet.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{pet.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {pet.breed}
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{pet.species}</Badge>
                      <Badge variant="outline">{pet.age} years</Badge>
                      <Badge variant="outline">{pet.sex}</Badge>
                      {pet.isNeutered && <Badge variant="secondary">Neutered</Badge>}
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Owner:</span>
                        <span>{owner?.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">Weight:</span>
                        <span>{pet.weight} kg</span>
                      </div>
                      {pet.lastVisit && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>Last visit: {pet.lastVisit}</span>
                        </div>
                      )}
                      {pet.nextAppointment && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Calendar className="h-3 w-3" />
                          <span>Next: {pet.nextAppointment}</span>
                        </div>
                      )}
                    </div>

                    {(pet.allergies && pet.allergies.length > 0) && (
                      <div className="text-sm">
                        <div className="flex items-center gap-1 text-red-600">
                          <Heart className="h-3 w-3" />
                          <span className="font-medium">Allergies:</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {pet.allergies.join(", ")}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedPet(pet)}>
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="owners" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOwners.map((owner) => {
              const ownerPets = getPetsByOwner(owner.id)
              return (
                <Card key={owner.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" />
                          <AvatarFallback>
                            {owner.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{owner.name}</CardTitle>
                          <CardDescription className="text-sm">
                            {ownerPets.length} pet{ownerPets.length !== 1 ? 's' : ''}
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{owner.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{owner.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="text-xs">{owner.address}</span>
                      </div>
                    </div>

                    {ownerPets.length > 0 && (
                      <div className="pt-2">
                        <div className="text-sm font-medium mb-1">Pets:</div>
                        <div className="flex flex-wrap gap-1">
                          {ownerPets.map((pet) => (
                            <Badge key={pet.id} variant="outline" className="text-xs">
                              {pet.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {owner.emergencyContact && (
                      <div className="text-xs text-muted-foreground pt-1">
                        <span className="font-medium">Emergency:</span> {owner.emergencyContact}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => setSelectedOwner(owner)}>
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Pet Details Modal/Panel would go here */}
      {selectedPet && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedPet.name} - Details</CardTitle>
                <CardDescription>Patient information and medical history</CardDescription>
              </div>
              <Button variant="outline" onClick={() => setSelectedPet(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Species:</span>
                      <span>{selectedPet.species}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Breed:</span>
                      <span>{selectedPet.breed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Age:</span>
                      <span>{selectedPet.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sex:</span>
                      <span>{selectedPet.sex}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Neutered:</span>
                      <span>{selectedPet.isNeutered ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weight:</span>
                      <span>{selectedPet.weight} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Color:</span>
                      <span>{selectedPet.color}</span>
                    </div>
                    {selectedPet.microchip && (
                      <div className="flex justify-between">
                        <span>Microchip:</span>
                        <span>{selectedPet.microchip}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Owner Information</h4>
                  {(() => {
                    const owner = getOwnerById(selectedPet.ownerId)
                    return owner ? (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span>{owner.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phone:</span>
                          <span>{owner.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Email:</span>
                          <span>{owner.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Address:</span>
                          <span className="text-right">{owner.address}</span>
                        </div>
                      </div>
                    ) : null
                  })()}
                </div>
              </div>

              <div className="space-y-4">
                {selectedPet.allergies && selectedPet.allergies.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Allergies</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedPet.allergies.map((allergy, index) => (
                        <Badge key={index} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPet.medications && selectedPet.medications.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Current Medications</h4>
                    <div className="space-y-1">
                      {selectedPet.medications.map((medication, index) => (
                        <div key={index} className="text-sm p-2 border rounded">
                          {medication}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Visit History</h4>
                  <div className="space-y-2 text-sm">
                    {selectedPet.lastVisit && (
                      <div className="flex justify-between">
                        <span>Last Visit:</span>
                        <span>{selectedPet.lastVisit}</span>
                      </div>
                    )}
                    {selectedPet.nextAppointment && (
                      <div className="flex justify-between">
                        <span>Next Appointment:</span>
                        <span className="text-green-600">{selectedPet.nextAppointment}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedPet.notes && (
                  <div>
                    <h4 className="font-medium mb-2">Notes</h4>
                    <p className="text-sm text-muted-foreground">{selectedPet.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button className="flex-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Patient
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}