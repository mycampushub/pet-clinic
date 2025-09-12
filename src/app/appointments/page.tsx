"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  User, 
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Edit,
  Eye,
  Video,
  MapPin
} from "lucide-react"
import { Pet, Owner, Visit, User as UserType } from "@prisma/client"

interface VisitWithDetails extends Visit {
  pet: Pet & {
    owner: Owner
  }
  user?: {
    firstName: string
    lastName: string
  }
}

interface TimeSlot {
  time: string
  available: boolean
  appointment?: VisitWithDetails
}

export default function AppointmentsPage() {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState<VisitWithDetails[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<VisitWithDetails[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day')
  const [loading, setLoading] = useState(true)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    fetchAppointments()
    generateTimeSlots()
  }, [])

  useEffect(() => {
    if (appointments.length > 0) {
      const filtered = appointments.filter(appointment => 
        appointment.pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.pet.owner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.pet.owner.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.visitType.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredAppointments(filtered)
    }
  }, [appointments, searchTerm])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockAppointments: VisitWithDetails[] = [
        {
          id: "1",
          tenantId: "1",
          clinicId: "1",
          petId: "1",
          userId: "1",
          visitType: "CONSULTATION",
          status: "SCHEDULED",
          scheduledAt: new Date("2024-09-15T09:00:00"),
          reason: "Annual checkup and vaccination",
          symptoms: null,
          diagnosis: null,
          treatment: null,
          notes: null,
          followUpRequired: false,
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
            notes: null,
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
              notes: null,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          user: {
            firstName: "Dr. Sarah",
            lastName: "Johnson"
          }
        },
        {
          id: "2",
          tenantId: "1",
          clinicId: "1",
          petId: "2",
          userId: "2",
          visitType: "VACCINATION",
          status: "CONFIRMED",
          scheduledAt: new Date("2024-09-15T09:30:00"),
          reason: "Rabies vaccination booster",
          symptoms: null,
          diagnosis: null,
          treatment: null,
          notes: null,
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
            notes: null,
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
              notes: null,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          user: {
            firstName: "Dr. Mike",
            lastName: "Davis"
          }
        },
        {
          id: "3",
          tenantId: "1",
          clinicId: "1",
          petId: "3",
          userId: "1",
          visitType: "DENTAL",
          status: "SCHEDULED",
          scheduledAt: new Date("2024-09-15T11:00:00"),
          reason: "Dental cleaning and examination",
          symptoms: null,
          diagnosis: null,
          treatment: null,
          notes: "Patient has history of dental issues",
          followUpRequired: false,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          pet: {
            id: "3",
            tenantId: "1",
            ownerId: "3",
            name: "Charlie",
            species: "Dog",
            breed: "Beagle",
            gender: "MALE",
            isNeutered: false,
            dateOfBirth: new Date("2021-08-20"),
            microchipId: null,
            color: "Tri-color",
            weight: 12.8,
            allergies: null,
            chronicConditions: null,
            notes: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            owner: {
              id: "3",
              tenantId: "1",
              firstName: "Mike",
              lastName: "Davis",
              email: "mike.davis@email.com",
              phone: "+1-555-0126",
              address: "789 Pine St",
              city: "Elsewhere",
              state: "CA",
              zipCode: "12347",
              country: "US",
              emergencyContact: null,
              notes: null,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          user: {
            firstName: "Dr. Sarah",
            lastName: "Johnson"
          }
        },
        {
          id: "4",
          tenantId: "1",
          clinicId: "1",
          petId: "1",
          userId: "2",
          visitType: "TELEMEDICINE",
          status: "IN_PROGRESS",
          scheduledAt: new Date("2024-09-15T14:00:00"),
          reason: "Follow-up consultation for skin condition",
          symptoms: "Owner reports continued itching",
          diagnosis: null,
          treatment: null,
          notes: "Virtual follow-up",
          followUpRequired: false,
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
            notes: null,
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
              notes: null,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          },
          user: {
            firstName: "Dr. Mike",
            lastName: "Davis"
          }
        }
      ]
      
      setAppointments(mockAppointments)
      setFilteredAppointments(mockAppointments)
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = []
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time,
          available: Math.random() > 0.3 // 70% chance of being available
        })
      }
    }
    setTimeSlots(slots)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'NO_SHOW':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Clock className="h-4 w-4" />
      case 'CONFIRMED':
        return <CheckCircle className="h-4 w-4" />
      case 'IN_PROGRESS':
        return <AlertCircle className="h-4 w-4" />
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />
      case 'NO_SHOW':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.scheduledAt).toISOString().split('T')[0]
      return aptDate === date
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
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
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
            <h2 className="text-3xl font-bold text-gray-900">Schedule</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Appointment
            </Button>
          </div>
          
          {/* Date and View Controls */}
          <div className="flex gap-4 mb-6">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            <div className="flex rounded-md shadow-sm">
              {(['day', 'week', 'month'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 text-sm font-medium border ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search appointments..."
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
              <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getAppointmentsForDate(selectedDate).length}</div>
              <p className="text-xs text-muted-foreground">
                Scheduled for today
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(apt => apt.status === 'CONFIRMED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Ready for visit
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {appointments.filter(apt => apt.status === 'IN_PROGRESS').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently being seen
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Slots</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {timeSlots.filter(slot => slot.available).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Open for booking
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Calendar View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar/Schedule */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {new Date(selectedDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardTitle>
                <CardDescription>
                  Daily schedule overview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {timeSlots.map((slot, index) => {
                    const appointment = appointments.find(apt => {
                      const aptTime = new Date(apt.scheduledAt).toTimeString().slice(0, 5)
                      return aptTime === slot.time
                    })
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 min-h-[80px] ${
                          appointment
                            ? 'border-blue-200 bg-blue-50'
                            : slot.available
                            ? 'border-gray-200 bg-white hover:border-blue-300 cursor-pointer'
                            : 'border-gray-100 bg-gray-50'
                        }`}
                        onClick={() => {
                          if (!appointment && slot.available) {
                            // Handle booking new appointment
                            console.log('Book appointment for', slot.time)
                          }
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-600 w-16">
                              {slot.time}
                            </span>
                          </div>
                          
                          {appointment ? (
                            <div className="flex-1 ml-4">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-sm">
                                  {appointment.pet.name} - {appointment.pet.owner.firstName} {appointment.pet.owner.lastName}
                                </h4>
                                <Badge className={getStatusColor(appointment.status)}>
                                  {getStatusIcon(appointment.status)}
                                  <span className="ml-1">{appointment.status.replace('_', ' ')}</span>
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 mb-1">
                                {appointment.visitType.replace('_', ' ')} with {appointment.user?.firstName} {appointment.user?.lastName}
                              </p>
                              {appointment.reason && (
                                <p className="text-xs text-gray-500">
                                  {appointment.reason}
                                </p>
                              )}
                              
                              {appointment.visitType === 'TELEMEDICINE' && (
                                <div className="flex items-center mt-2">
                                  <Video className="h-3 w-3 text-blue-600 mr-1" />
                                  <span className="text-xs text-blue-600">Virtual Visit</span>
                                </div>
                              )}
                            </div>
                          ) : slot.available ? (
                            <div className="flex-1 ml-4 flex items-center">
                              <span className="text-sm text-gray-400">Available</span>
                            </div>
                          ) : (
                            <div className="flex-1 ml-4">
                              <span className="text-sm text-gray-400">Not available</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Today's Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Appointments:</span>
                    <span className="text-sm font-medium">{getAppointmentsForDate(selectedDate).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed:</span>
                    <span className="text-sm font-medium">
                      {getAppointmentsForDate(selectedDate).filter(apt => apt.status === 'COMPLETED').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">No Shows:</span>
                    <span className="text-sm font-medium">
                      {getAppointmentsForDate(selectedDate).filter(apt => apt.status === 'NO_SHOW').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Utilization:</span>
                    <span className="text-sm font-medium">
                      {Math.round((getAppointmentsForDate(selectedDate).length / timeSlots.length) * 100)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming</CardTitle>
                <CardDescription>Next appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {appointments
                    .filter(apt => apt.status === 'SCHEDULED' || apt.status === 'CONFIRMED')
                    .slice(0, 5)
                    .map((appointment) => (
                      <div key={appointment.id} className="flex items-center space-x-3 p-2 border rounded">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {appointment.pet.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className="text-xs">
                            {appointment.visitType.replace('_', ' ')}
                          </Badge>
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
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Walk-in Appointment
                </Button>
                <Button className="w-full" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Schedule Telemedicine
                </Button>
                <Button className="w-full" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Next Client
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}