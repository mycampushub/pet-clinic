'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Heart, 
  FileText, 
  CreditCard, 
  Bell,
  User,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  Mail
} from 'lucide-react';

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  avatar?: string;
}

interface Appointment {
  id: string;
  petId: string;
  petName: string;
  date: string;
  time: string;
  type: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  veterinarian: string;
  notes?: string;
}

interface MedicalRecord {
  id: string;
  petId: string;
  petName: string;
  date: string;
  type: string;
  description: string;
  veterinarian: string;
  diagnosis?: string;
  treatment?: string;
}

interface Invoice {
  id: string;
  petName: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE';
  services: string[];
}

export default function ClientPortal() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPet, setSelectedPet] = useState<string>('all');

  const handleScheduleAppointment = () => {
    router.push('/portal/appointments/schedule');
  };

  const handleViewMedicalRecord = (recordId: string) => {
    router.push(`/portal/medical/${recordId}`);
  };

  const handlePayInvoice = (invoiceId: string) => {
    router.push(`/portal/billing/pay/${invoiceId}`);
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    router.push(`/portal/appointments/reschedule/${appointmentId}`);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    router.push(`/portal/appointments/cancel/${appointmentId}`);
  };

  const handleViewNotifications = () => {
    router.push('/portal/notifications');
  };

  // Sample data
  const pets: Pet[] = [
    {
      id: '1',
      name: 'Rex',
      species: 'Dog',
      breed: 'Labrador Retriever',
      age: 3,
    },
    {
      id: '2',
      name: 'Whiskers',
      species: 'Cat',
      breed: 'Persian',
      age: 2,
    },
  ];

  const appointments: Appointment[] = [
    {
      id: '1',
      petId: '1',
      petName: 'Rex',
      date: '2024-12-20',
      time: '14:00',
      type: 'Annual Checkup',
      status: 'SCHEDULED',
      veterinarian: 'Dr. Sarah Johnson',
      notes: 'Regular annual examination and vaccinations',
    },
    {
      id: '2',
      petId: '2',
      petName: 'Whiskers',
      date: '2024-12-15',
      time: '10:30',
      type: 'Dental Cleaning',
      status: 'COMPLETED',
      veterinarian: 'Dr. Michael Chen',
    },
  ];

  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      petId: '1',
      petName: 'Rex',
      date: '2024-12-10',
      type: 'Vaccination',
      description: 'DHPP vaccination administered',
      veterinarian: 'Dr. Sarah Johnson',
      diagnosis: 'Healthy',
      treatment: 'DHPP vaccine, next due in 1 year',
    },
    {
      id: '2',
      petId: '2',
      petName: 'Whiskers',
      date: '2024-12-05',
      type: 'Examination',
      description: 'Routine health checkup',
      veterinarian: 'Dr. Emily Brown',
      diagnosis: 'Healthy',
      treatment: 'Continue current diet and exercise routine',
    },
  ];

  const invoices: Invoice[] = [
    {
      id: '1',
      petName: 'Rex',
      date: '2024-12-10',
      dueDate: '2024-12-25',
      amount: 150.00,
      status: 'PENDING',
      services: ['Annual Checkup', 'Vaccinations'],
    },
    {
      id: '2',
      petName: 'Whiskers',
      date: '2024-12-05',
      dueDate: '2024-12-20',
      amount: 200.00,
      status: 'PAID',
      services: ['Dental Cleaning', 'Blood Work'],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'PAID':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const upcomingAppointments = appointments.filter(apt => apt.status === 'SCHEDULED');
  const recentAppointments = appointments.filter(apt => apt.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">PetCare Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={handleViewNotifications}>
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm font-medium">John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, John!</h2>
          <p className="text-gray-600">Manage your pets' appointments, medical records, and billing information.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Pets</p>
                  <p className="text-2xl font-bold">{pets.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
                  <p className="text-2xl font-bold">{upcomingAppointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Medical Records</p>
                  <p className="text-2xl font-bold">{medicalRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                  <p className="text-2xl font-bold">{invoices.filter(inv => inv.status === 'PENDING').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pet Selector */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-medium">Select Pet:</h3>
            <div className="flex gap-2">
              <Button
                variant={selectedPet === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPet('all')}
              >
                All Pets
              </Button>
              {pets.map((pet) => (
                <Button
                  key={pet.id}
                  variant={selectedPet === pet.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedPet(pet.id)}
                >
                  {pet.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="medical">Medical Records</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <CardDescription>Your scheduled appointments</CardDescription>
                  </div>
                  <Button onClick={handleScheduleAppointment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{appointment.petName} - {appointment.type}</div>
                            <div className="text-sm text-gray-600">
                              {appointment.date} at {appointment.time} with {appointment.veterinarian}
                            </div>
                            {appointment.notes && (
                              <div className="text-sm text-gray-500 mt-1">{appointment.notes}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <Button variant="outline" size="sm" onClick={() => handleRescheduleAppointment(appointment.id)}>
                            Reschedule
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleCancelAppointment(appointment.id)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming appointments scheduled
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                  <CardDescription>Your completed appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentAppointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium text-sm">{appointment.petName}</div>
                          <div className="text-xs text-gray-600">{appointment.type}</div>
                          <div className="text-xs text-gray-500">{appointment.date}</div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)} variant="secondary">
                          {appointment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Medical Records</CardTitle>
                  <CardDescription>Your pets' medical history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {medicalRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium text-sm">{record.petName}</div>
                          <div className="text-xs text-gray-600">{record.type}</div>
                          <div className="text-xs text-gray-500">{record.date}</div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewMedicalRecord(record.id)}>
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Appointments</CardTitle>
                    <CardDescription>Your appointment history and upcoming visits</CardDescription>
                  </div>
                  <Button onClick={handleScheduleAppointment}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getStatusIcon(appointment.status)}
                        </div>
                        <div>
                          <div className="font-medium">{appointment.petName} - {appointment.type}</div>
                          <div className="text-sm text-gray-600">
                            {appointment.date} at {appointment.time}
                          </div>
                          <div className="text-sm text-gray-500">with {appointment.veterinarian}</div>
                          {appointment.notes && (
                            <div className="text-sm text-gray-500 mt-1">{appointment.notes}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        {appointment.status === 'SCHEDULED' && (
                          <>
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                            <Button variant="outline" size="sm">
                              Cancel
                            </Button>
                          </>
                        )}
                        <Button variant="outline" size="sm">
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
                <CardDescription>Your pets' complete medical history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-medium">{record.petName} - {record.type}</div>
                          <div className="text-sm text-gray-600">
                            {record.date} with {record.veterinarian}
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <span className="font-medium text-sm">Description: </span>
                          <span className="text-sm">{record.description}</span>
                        </div>
                        {record.diagnosis && (
                          <div>
                            <span className="font-medium text-sm">Diagnosis: </span>
                            <span className="text-sm">{record.diagnosis}</span>
                          </div>
                        )}
                        {record.treatment && (
                          <div>
                            <span className="font-medium text-sm">Treatment: </span>
                            <span className="text-sm">{record.treatment}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Invoices</CardTitle>
                <CardDescription>Your payment history and current invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <CreditCard className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">{invoice.petName}</div>
                          <div className="text-sm text-gray-600">
                            {invoice.services.join(', ')}
                          </div>
                          <div className="text-sm text-gray-500">
                            Due: {invoice.dueDate} • Amount: ${invoice.amount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                        {invoice.status === 'PENDING' && (
                          <Button size="sm">
                            Pay Now
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
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
    </div>
  );
}