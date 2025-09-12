// Mock database for development when Prisma is not working
import { UserRole, PetGender, VisitType, VisitStatus, PrescriptionStatus, InvoiceStatus, PaymentStatus, LabStatus, ReminderType, ReminderStatus } from '@prisma/client'

// Mock data types
interface MockTenant {
  id: string
  name: string
  slug: string
  domain?: string
  settings?: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface MockClinic {
  id: string
  tenantId: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  email?: string
  website?: string
  timezone: string
  isActive: boolean
  settings?: any
  createdAt: Date
  updatedAt: Date
}

interface MockUser {
  id: string
  tenantId: string
  clinicId?: string
  email: string
  emailVerified: boolean
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  permissions?: any
  isActive: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

interface MockOwner {
  id: string
  tenantId: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  emergencyContact?: any
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface MockPet {
  id: string
  tenantId: string
  ownerId: string
  name: string
  species: string
  breed?: string
  gender: PetGender
  isNeutered: boolean
  dateOfBirth?: Date
  microchipId?: string
  color?: string
  weight?: number
  allergies?: any
  chronicConditions?: any
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface MockVisit {
  id: string
  tenantId: string
  clinicId: string
  petId: string
  userId?: string
  visitType: VisitType
  status: VisitStatus
  scheduledAt: Date
  checkedInAt?: Date
  startedAt?: Date
  completedAt?: Date
  reason?: string
  symptoms?: string
  diagnosis?: string
  treatment?: string
  notes?: string
  followUpRequired: boolean
  followUpDate?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface MockInvoice {
  id: string
  tenantId: string
  clinicId: string
  visitId?: string
  ownerId?: string
  invoiceNumber: string
  invoiceDate: Date
  dueDate?: Date
  subtotal: number
  tax: number
  discount: number
  total: number
  status: InvoiceStatus
  paymentStatus: PaymentStatus
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface MockInventoryItem {
  id: string
  tenantId: string
  clinicId: string
  medicationId?: string
  sku?: string
  name: string
  description?: string
  category?: string
  quantity: number
  reorderPoint: number
  unit: string
  cost?: number
  price?: number
  lotNumber?: string
  expiryDate?: Date
  isControlled: boolean
  schedule?: string
  location?: string
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Mock data storage
let mockTenants: MockTenant[] = [
  {
    id: 'tenant-1',
    name: 'PetClinic Pro Demo',
    slug: 'petclinic-pro',
    domain: 'petclinic-pro.demo.com',
    settings: { theme: 'default', currency: 'USD', language: 'en' },
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'tenant-2',
    name: 'Happy Paws Veterinary',
    slug: 'happy-paws',
    domain: 'happypaws.vet',
    settings: { theme: 'blue', currency: 'USD', language: 'en' },
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'tenant-3',
    name: 'City Animal Hospital',
    slug: 'city-animal-hospital',
    domain: 'cityanimal.com',
    settings: { theme: 'green', currency: 'USD', language: 'en' },
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
]

let mockClinics: MockClinic[] = [
  {
    id: 'clinic-1',
    tenantId: 'tenant-1',
    name: 'Main Street Veterinary Clinic',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'US',
    phone: '+1-555-0123',
    email: 'info@mainstreetvet.com',
    website: 'https://mainstreetvet.com',
    timezone: 'America/Los_Angeles',
    isActive: true,
    settings: { capacity: 20, operatingHours: '9AM-6PM' },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'clinic-2',
    tenantId: 'tenant-1',
    name: 'Downtown Pet Care',
    address: '456 Oak Ave',
    city: 'Somewhere',
    state: 'CA',
    zipCode: '12346',
    country: 'US',
    phone: '+1-555-0124',
    email: 'contact@downtownpet.com',
    website: 'https://downtownpet.com',
    timezone: 'America/Los_Angeles',
    isActive: true,
    settings: { capacity: 15, operatingHours: '8AM-7PM' },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'clinic-3',
    tenantId: 'tenant-2',
    name: 'Happy Paws Main Clinic',
    address: '789 Pine St',
    city: 'Elsewhere',
    state: 'NY',
    zipCode: '10001',
    country: 'US',
    phone: '+1-555-0125',
    email: 'info@happypaws.com',
    website: 'https://happypaws.com',
    timezone: 'America/New_York',
    isActive: true,
    settings: { capacity: 25, operatingHours: '8AM-8PM' },
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'clinic-4',
    tenantId: 'tenant-3',
    name: 'City Animal Hospital - Downtown',
    address: '321 Elm St',
    city: 'Big City',
    state: 'TX',
    zipCode: '75001',
    country: 'US',
    phone: '+1-555-0126',
    email: 'downtown@cityanimal.com',
    website: 'https://cityanimal.com',
    timezone: 'America/Chicago',
    isActive: true,
    settings: { capacity: 30, operatingHours: '24/7' },
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
]

let mockUsers: MockUser[] = [
  {
    id: 'user-1',
    tenantId: 'tenant-1',
    clinicId: 'clinic-1',
    email: 'vet@petclinic.com',
    emailVerified: true,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6', // password123
    firstName: 'Sarah',
    lastName: 'Johnson',
    phone: '+1-555-0101',
    role: UserRole.VETERINARIAN,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-2',
    tenantId: 'tenant-1',
    clinicId: 'clinic-1',
    email: 'reception@petclinic.com',
    emailVerified: true,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6', // password123
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+1-555-0102',
    role: UserRole.RECEPTIONIST,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-3',
    tenantId: 'tenant-1',
    clinicId: 'clinic-1',
    email: 'manager@petclinic.com',
    emailVerified: true,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6', // password123
    firstName: 'Mike',
    lastName: 'Davis',
    phone: '+1-555-0103',
    role: UserRole.MANAGER,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'user-4',
    tenantId: 'tenant-2',
    clinicId: 'clinic-3',
    email: 'vet@happypaws.com',
    emailVerified: true,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6', // password123
    firstName: 'Emily',
    lastName: 'Brown',
    phone: '+1-555-0201',
    role: UserRole.VETERINARIAN,
    isActive: true,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01')
  },
  {
    id: 'user-5',
    tenantId: 'tenant-3',
    clinicId: 'clinic-4',
    email: 'vet@cityanimal.com',
    emailVerified: true,
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeZeUfkZMBs9kYZP6', // password123
    firstName: 'David',
    lastName: 'Wilson',
    phone: '+1-555-0301',
    role: UserRole.VETERINARIAN,
    isActive: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01')
  }
]

let mockOwners: MockOwner[] = [
  {
    id: 'owner-1',
    tenantId: 'tenant-1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0123',
    address: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    country: 'US',
    emergencyContact: { name: 'Jane Smith', phone: '+1-555-0124', relationship: 'Spouse' },
    notes: 'Regular client, prefers morning appointments',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'owner-2',
    tenantId: 'tenant-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@email.com',
    phone: '+1-555-0125',
    address: '456 Oak Ave',
    city: 'Somewhere',
    state: 'CA',
    zipCode: '12346',
    country: 'US',
    notes: 'New client, referred by neighbor',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'owner-3',
    tenantId: 'tenant-1',
    firstName: 'Mike',
    lastName: 'Davis',
    email: 'mike.davis@email.com',
    phone: '+1-555-0126',
    address: '789 Pine St',
    city: 'Elsewhere',
    state: 'CA',
    zipCode: '12347',
    country: 'US',
    notes: 'First-time pet owner',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

let mockPets: MockPet[] = [
  {
    id: 'pet-1',
    tenantId: 'tenant-1',
    ownerId: 'owner-1',
    name: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    gender: PetGender.MALE,
    isNeutered: true,
    dateOfBirth: new Date('2018-05-15'),
    microchipId: '985141000123456',
    color: 'Golden',
    weight: 32.5,
    allergies: ['Penicillin'],
    chronicConditions: ['Arthritis'],
    notes: 'Friendly dog, loves treats',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'pet-2',
    tenantId: 'tenant-1',
    ownerId: 'owner-2',
    name: 'Luna',
    species: 'Cat',
    breed: 'Persian',
    gender: PetGender.FEMALE,
    isNeutered: true,
    dateOfBirth: new Date('2020-02-10'),
    microchipId: '985141000123457',
    color: 'White',
    weight: 4.2,
    notes: 'Shy, needs gentle handling',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'pet-3',
    tenantId: 'tenant-1',
    ownerId: 'owner-3',
    name: 'Charlie',
    species: 'Dog',
    breed: 'Beagle',
    gender: PetGender.MALE,
    isNeutered: false,
    dateOfBirth: new Date('2021-08-20'),
    color: 'Tri-color',
    weight: 12.8,
    allergies: ['Chicken'],
    notes: 'Energetic, needs exercise',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

let mockVisits: MockVisit[] = [
  {
    id: 'visit-1',
    tenantId: 'tenant-1',
    clinicId: 'clinic-1',
    petId: 'pet-1',
    userId: 'user-1',
    visitType: VisitType.CONSULTATION,
    status: VisitStatus.COMPLETED,
    scheduledAt: new Date('2024-09-10T09:00:00'),
    checkedInAt: new Date('2024-09-10T08:45:00'),
    startedAt: new Date('2024-09-10T09:05:00'),
    completedAt: new Date('2024-09-10T09:45:00'),
    reason: 'Annual checkup and vaccination',
    symptoms: 'None reported',
    diagnosis: 'Healthy',
    treatment: 'Annual vaccination administered',
    notes: 'Patient is in good health. Weight stable.',
    followUpRequired: false,
    isActive: true,
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-09-10')
  },
  {
    id: 'visit-2',
    tenantId: 'tenant-1',
    clinicId: 'clinic-1',
    petId: 'pet-2',
    userId: 'user-1',
    visitType: VisitType.VACCINATION,
    status: VisitStatus.COMPLETED,
    scheduledAt: new Date('2024-09-12T10:00:00'),
    checkedInAt: new Date('2024-09-12T09:30:00'),
    startedAt: new Date('2024-09-12T10:15:00'),
    completedAt: new Date('2024-09-12T10:45:00'),
    reason: 'Rabies vaccination booster',
    symptoms: 'None',
    diagnosis: 'Up to date on vaccinations',
    treatment: 'Rabies vaccine administered',
    notes: 'Patient handled well, no adverse reactions',
    followUpRequired: false,
    isActive: true,
    createdAt: new Date('2024-09-12'),
    updatedAt: new Date('2024-09-12')
  },
  {
    id: 'visit-3',
    tenantId: 'tenant-1',
    clinicId: 'clinic-1',
    petId: 'pet-3',
    userId: 'user-1',
    visitType: VisitType.CHECKUP,
    status: VisitStatus.SCHEDULED,
    scheduledAt: new Date('2024-09-15T14:00:00'),
    reason: 'Regular checkup',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    notes: '',
    followUpRequired: false,
    isActive: true,
    createdAt: new Date('2024-09-13'),
    updatedAt: new Date('2024-09-13')
  }
]

let mockInvoices: MockInvoice[] = [
  {
    id: 'invoice-1',
    tenantId: 'tenant-1',
    clinicId: 'clinic-1',
    visitId: 'visit-1',
    ownerId: 'owner-1',
    invoiceNumber: 'INV-2024-001',
    invoiceDate: new Date('2024-09-10'),
    dueDate: new Date('2024-09-24'),
    subtotal: 150.00,
    tax: 12.00,
    discount: 0.00,
    total: 162.00,
    status: InvoiceStatus.PAID,
    paymentStatus: PaymentStatus.PAID,
    notes: 'Annual checkup and vaccination',
    isActive: true,
    createdAt: new Date('2024-09-10'),
    updatedAt: new Date('2024-09-10')
  },
  {
    id: 'invoice-2',
    tenantId: 'tenant-1',
    clinicId: 'clinic-1',
    visitId: 'visit-2',
    ownerId: 'owner-2',
    invoiceNumber: 'INV-2024-002',
    invoiceDate: new Date('2024-09-12'),
    dueDate: new Date('2024-09-26'),
    subtotal: 75.00,
    tax: 6.00,
    discount: 0.00,
    total: 81.00,
    status: InvoiceStatus.PAID,
    paymentStatus: PaymentStatus.PAID,
    notes: 'Rabies vaccination',
    isActive: true,
    createdAt: new Date('2024-09-12'),
    updatedAt: new Date('2024-09-12')
  }
]

let mockInventory: MockInventoryItem[] = [
  {
    id: 'inventory-1',
    tenantId: 'tenant-1',
    clinicId: 'clinic-1',
    name: 'Amoxicillin 250mg',
    description: 'Antibiotic capsules for bacterial infections',
    category: 'Antibiotics',
    quantity: 50,
    reorderPoint: 20,
    unit: 'capsules',
    cost: 0.45,
    price: 1.20,
    lotNumber: 'A12345',
    expiryDate: new Date('2025-06-30'),
    isControlled: false,
    location: 'Pharmacy Cabinet A',
    notes: 'Store at room temperature',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'inventory-2',
    tenantId: 'tenant-1',
    clinicId: 'clinic-1',
    name: 'Rabies Vaccine',
    description: 'Rabies vaccination for dogs and cats',
    category: 'Vaccines',
    quantity: 25,
    reorderPoint: 10,
    unit: 'doses',
    cost: 15.00,
    price: 35.00,
    lotNumber: 'V67890',
    expiryDate: new Date('2025-03-15'),
    isControlled: false,
    location: 'Vaccine Refrigerator',
    notes: 'Store at 2-8°C',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'inventory-3',
    tenantId: 'tenant-1',
    clinicId: 'clinic-1',
    name: 'Ibuprofen 200mg',
    description: 'Pain relief and anti-inflammatory',
    category: 'Pain Management',
    quantity: 15,
    reorderPoint: 30,
    unit: 'tablets',
    cost: 0.15,
    price: 0.50,
    lotNumber: 'P54321',
    expiryDate: new Date('2024-12-31'),
    isControlled: false,
    location: 'Pharmacy Cabinet B',
    notes: 'Low stock alert',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Mock database class
export class MockDatabase {
  // User operations
  async findUserByEmail(email: string): Promise<MockUser | null> {
    return mockUsers.find(user => user.email === email) || null
  }

  async findUserById(id: string): Promise<MockUser | null> {
    return mockUsers.find(user => user.id === id) || null
  }

  async createUser(userData: Omit<MockUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockUser> {
    const newUser: MockUser = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockUsers.push(newUser)
    return newUser
  }

  // Owner operations
  async findOwners(tenantId: string, search?: string): Promise<MockOwner[]> {
    let owners = mockOwners.filter(owner => owner.tenantId === tenantId && owner.isActive)
    
    if (search) {
      const searchLower = search.toLowerCase()
      owners = owners.filter(owner => 
        owner.firstName.toLowerCase().includes(searchLower) ||
        owner.lastName.toLowerCase().includes(searchLower) ||
        owner.email?.toLowerCase().includes(searchLower)
      )
    }
    
    return owners
  }

  async findOwnerById(id: string): Promise<MockOwner | null> {
    return mockOwners.find(owner => owner.id === id) || null
  }

  async createOwner(ownerData: Omit<MockOwner, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockOwner> {
    const newOwner: MockOwner = {
      ...ownerData,
      id: `owner-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockOwners.push(newOwner)
    return newOwner
  }

  // Pet operations
  async findPets(tenantId: string, search?: string): Promise<(MockPet & { owner: MockOwner })[]> {
    let pets = mockPets.filter(pet => pet.tenantId === tenantId && pet.isActive)
    
    if (search) {
      const searchLower = search.toLowerCase()
      pets = pets.filter(pet => {
        const owner = mockOwners.find(o => o.id === pet.ownerId)
        return (
          pet.name.toLowerCase().includes(searchLower) ||
          pet.species.toLowerCase().includes(searchLower) ||
          pet.breed?.toLowerCase().includes(searchLower) ||
          owner?.firstName.toLowerCase().includes(searchLower) ||
          owner?.lastName.toLowerCase().includes(searchLower)
        )
      })
    }
    
    return pets.map(pet => ({
      ...pet,
      owner: mockOwners.find(owner => owner.id === pet.ownerId)!
    }))
  }

  async findPetById(id: string): Promise<(MockPet & { owner: MockOwner }) | null> {
    const pet = mockPets.find(pet => pet.id === id && pet.isActive)
    if (!pet) return null
    
    const owner = mockOwners.find(owner => owner.id === pet.ownerId)
    return { ...pet, owner: owner! }
  }

  async createPet(petData: Omit<MockPet, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockPet> {
    const newPet: MockPet = {
      ...petData,
      id: `pet-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockPets.push(newPet)
    return newPet
  }

  // Visit operations
  async findVisits(tenantId: string, date?: string, status?: string): Promise<(MockVisit & { pet: MockPet & { owner: MockOwner }, user?: MockUser })[]> {
    let visits = mockVisits.filter(visit => visit.tenantId === tenantId && visit.isActive)
    
    if (date) {
      const targetDate = new Date(date)
      const startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate())
      const endDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate() + 1)
      
      visits = visits.filter(visit => {
        const visitDate = new Date(visit.scheduledAt)
        return visitDate >= startDate && visitDate < endDate
      })
    }
    
    if (status && status !== 'ALL') {
      visits = visits.filter(visit => visit.status === status)
    }
    
    return visits.map(visit => ({
      ...visit,
      pet: {
        ...mockPets.find(pet => pet.id === visit.petId)!,
        owner: mockOwners.find(owner => owner.id === mockPets.find(pet => pet.id === visit.petId)!.ownerId)!
      },
      user: visit.userId ? mockUsers.find(user => user.id === visit.userId) : undefined
    }))
  }

  async createVisit(visitData: Omit<MockVisit, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockVisit> {
    const newVisit: MockVisit = {
      ...visitData,
      id: `visit-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockVisits.push(newVisit)
    return newVisit
  }

  // Invoice operations
  async findInvoices(tenantId: string): Promise<MockInvoice[]> {
    return mockInvoices.filter(invoice => invoice.tenantId === tenantId && invoice.isActive)
  }

  async createInvoice(invoiceData: Omit<MockInvoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockInvoice> {
    const newInvoice: MockInvoice = {
      ...invoiceData,
      id: `invoice-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockInvoices.push(newInvoice)
    return newInvoice
  }

  // Inventory operations
  async findInventory(tenantId: string): Promise<MockInventoryItem[]> {
    return mockInventory.filter(item => item.tenantId === tenantId && item.isActive)
  }

  async createInventoryItem(itemData: Omit<MockInventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockInventoryItem> {
    const newItem: MockInventoryItem = {
      ...itemData,
      id: `inventory-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockInventory.push(newItem)
    return newItem
  }

  // Dashboard stats
  async getDashboardStats(tenantId: string) {
    const today = new Date()
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    
    const todayVisits = mockVisits.filter(visit => 
      visit.tenantId === tenantId && 
      visit.isActive && 
      visit.scheduledAt >= startOfDay && 
      visit.scheduledAt < endOfDay
    )
    
    const completedVisits = todayVisits.filter(visit => visit.status === VisitStatus.COMPLETED)
    const pendingInvoices = mockInvoices.filter(invoice => 
      invoice.tenantId === tenantId && 
      invoice.isActive && 
      invoice.paymentStatus === PaymentStatus.UNPAID
    )
    const lowInventoryItems = mockInventory.filter(item => 
      item.tenantId === tenantId && 
      item.isActive && 
      item.quantity <= item.reorderPoint
    )
    
    const revenueToday = mockInvoices
      .filter(invoice => 
        invoice.tenantId === tenantId && 
        invoice.isActive && 
        invoice.paymentStatus === PaymentStatus.PAID &&
        invoice.invoiceDate >= startOfDay &&
        invoice.invoiceDate < endOfDay
      )
      .reduce((sum, invoice) => sum + invoice.total, 0)
    
    return {
      todayAppointments: todayVisits.length,
      completedAppointments: completedVisits.length,
      pendingInvoices: pendingInvoices.length,
      lowInventoryItems: lowInventoryItems.length,
      upcomingReminders: 0, // Mock data
      newPatients: 0, // Mock data
      revenueToday: revenueToday
    }
  }

  // Tenant operations
  async findTenants(): Promise<MockTenant[]> {
    return mockTenants.filter(tenant => tenant.isActive)
  }

  async findTenantById(id: string): Promise<MockTenant | null> {
    return mockTenants.find(tenant => tenant.id === id && tenant.isActive) || null
  }

  async findTenantBySlug(slug: string): Promise<MockTenant | null> {
    return mockTenants.find(tenant => tenant.slug === slug && tenant.isActive) || null
  }

  async createTenant(tenantData: Omit<MockTenant, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockTenant> {
    const newTenant: MockTenant = {
      ...tenantData,
      id: `tenant-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockTenants.push(newTenant)
    return newTenant
  }

  async updateTenant(id: string, updateData: Partial<MockTenant>): Promise<MockTenant | null> {
    const tenantIndex = mockTenants.findIndex(tenant => tenant.id === id && tenant.isActive)
    if (tenantIndex === -1) return null
    
    mockTenants[tenantIndex] = {
      ...mockTenants[tenantIndex],
      ...updateData,
      updatedAt: new Date()
    }
    return mockTenants[tenantIndex]
  }

  async deleteTenant(id: string): Promise<boolean> {
    const tenantIndex = mockTenants.findIndex(tenant => tenant.id === id)
    if (tenantIndex === -1) return false
    
    mockTenants[tenantIndex].isActive = false
    mockTenants[tenantIndex].updatedAt = new Date()
    return true
  }

  // Clinic operations
  async findClinics(tenantId?: string): Promise<MockClinic[]> {
    let clinics = mockClinics.filter(clinic => clinic.isActive)
    if (tenantId) {
      clinics = clinics.filter(clinic => clinic.tenantId === tenantId)
    }
    return clinics
  }

  async findClinicById(id: string): Promise<MockClinic | null> {
    return mockClinics.find(clinic => clinic.id === id && clinic.isActive) || null
  }

  async findClinicsByTenant(tenantId: string): Promise<MockClinic[]> {
    return mockClinics.filter(clinic => clinic.tenantId === tenantId && clinic.isActive)
  }

  async createClinic(clinicData: Omit<MockClinic, 'id' | 'createdAt' | 'updatedAt'>): Promise<MockClinic> {
    const newClinic: MockClinic = {
      ...clinicData,
      id: `clinic-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockClinics.push(newClinic)
    return newClinic
  }

  async updateClinic(id: string, updateData: Partial<MockClinic>): Promise<MockClinic | null> {
    const clinicIndex = mockClinics.findIndex(clinic => clinic.id === id && clinic.isActive)
    if (clinicIndex === -1) return null
    
    mockClinics[clinicIndex] = {
      ...mockClinics[clinicIndex],
      ...updateData,
      updatedAt: new Date()
    }
    return mockClinics[clinicIndex]
  }

  async deleteClinic(id: string): Promise<boolean> {
    const clinicIndex = mockClinics.findIndex(clinic => clinic.id === id)
    if (clinicIndex === -1) return false
    
    mockClinics[clinicIndex].isActive = false
    mockClinics[clinicIndex].updatedAt = new Date()
    return true
  }

  // Helper method to get users by tenant
  async findUsersByTenant(tenantId: string): Promise<MockUser[]> {
    return mockUsers.filter(user => user.tenantId === tenantId && user.isActive)
  }

  // Helper method to get users by clinic
  async findUsersByClinic(clinicId: string): Promise<MockUser[]> {
    return mockUsers.filter(user => user.clinicId === clinicId && user.isActive)
  }
}

export const mockDb = new MockDatabase()