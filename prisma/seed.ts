import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create a default tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'tenant-1' },
    update: {},
    create: {
      id: 'tenant-1',
      name: 'PetClinic Pro Demo',
      settings: {
        currency: 'USD',
        timezone: 'UTC',
        language: 'en'
      }
    }
  })

  // Create a default clinic
  const clinic = await prisma.clinic.upsert({
    where: { id: 'clinic-1' },
    update: {},
    create: {
      id: 'clinic-1',
      tenantId: tenant.id,
      name: 'Happy Paws Veterinary Clinic',
      address: '123 Main St, Anytown, ST 12345',
      phone: '(555) 123-4567',
      email: 'info@happypaws.com',
      timezone: 'America/New_York',
      hours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '9:00 AM - 2:00 PM',
        sunday: 'Closed'
      }
    }
  })

  // Create demo users
  const users = [
    {
      id: 'user-1',
      email: 'reception@petclinic.com',
      name: 'Sarah Johnson',
      role: 'RECEPTIONIST',
      clinicId: clinic.id,
      tenantId: tenant.id
    },
    {
      id: 'user-2',
      email: 'vet@petclinic.com',
      name: 'Dr. Michael Smith',
      role: 'VETERINARIAN',
      clinicId: clinic.id,
      tenantId: tenant.id
    },
    {
      id: 'user-3',
      email: 'tech@petclinic.com',
      name: 'Emily Davis',
      role: 'VET_TECH',
      clinicId: clinic.id,
      tenantId: tenant.id
    },
    {
      id: 'user-4',
      email: 'pharmacy@petclinic.com',
      name: 'James Wilson',
      role: 'PHARMACIST',
      clinicId: clinic.id,
      tenantId: tenant.id
    },
    {
      id: 'user-5',
      email: 'manager@petclinic.com',
      name: 'Lisa Anderson',
      role: 'MANAGER',
      clinicId: clinic.id,
      tenantId: tenant.id
    },
    {
      id: 'user-6',
      email: 'admin@petclinic.com',
      name: 'System Admin',
      role: 'ADMIN',
      tenantId: tenant.id
    }
  ]

  for (const userData of users) {
    await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        // In a real app, you'd hash the password
        // password: await bcrypt.hash('demo123', 12)
        isActive: true,
        permissions: []
      }
    })
  }

  // Create sample owners
  const owners = [
    {
      id: 'owner-1',
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, ST 12345',
      emergencyContact: 'Jane Doe - (555) 987-6543',
      notes: 'Prefers morning appointments'
    },
    {
      id: 'owner-2',
      name: 'Jane Smith',
      email: 'jane.smith@email.com',
      phone: '(555) 234-5678',
      address: '456 Oak Ave, Somewhere, ST 67890',
      emergencyContact: 'Bob Smith - (555) 876-5432'
    },
    {
      id: 'owner-3',
      name: 'Bob Wilson',
      email: 'bob.wilson@email.com',
      phone: '(555) 345-6789',
      address: '789 Pine Rd, Nowhere, ST 13579'
    }
  ]

  for (const ownerData of owners) {
    await prisma.owner.upsert({
      where: { id: ownerData.id },
      update: {},
      create: ownerData
    })
  }

  // Create sample pets
  const pets = [
    {
      id: 'pet-1',
      name: 'Rex',
      species: 'Dog',
      breed: 'Labrador Retriever',
      dob: new Date('2019-03-15'),
      microchip: '985141000123456',
      sex: 'Male',
      isNeutered: true,
      weight: 32.5,
      color: 'Golden',
      ownerId: 'owner-1',
      clinicId: clinic.id
    },
    {
      id: 'pet-2',
      name: 'Luna',
      species: 'Cat',
      breed: 'Domestic Shorthair',
      dob: new Date('2021-06-10'),
      sex: 'Female',
      isNeutered: true,
      weight: 4.2,
      color: 'Gray',
      ownerId: 'owner-2',
      clinicId: clinic.id
    },
    {
      id: 'pet-3',
      name: 'Max',
      species: 'Dog',
      breed: 'German Shepherd',
      dob: new Date('2017-11-20'),
      sex: 'Male',
      isNeutered: false,
      weight: 38.0,
      color: 'Black and Tan',
      ownerId: 'owner-3',
      clinicId: clinic.id
    }
  ]

  for (const petData of pets) {
    await prisma.pet.upsert({
      where: { id: petData.id },
      update: {},
      create: petData
    })
  }

  // Create sample medications
  const medications = [
    {
      id: 'med-1',
      name: 'Amoxicillin 250mg',
      description: 'Antibiotic capsules',
      ndcCode: '12345-678-90',
      schedule: 'NON_CONTROLLED',
      strength: '250mg',
      unit: 'capsules'
    },
    {
      id: 'med-2',
      name: 'Pain Relief Syrup',
      description: 'Analgesic for dogs and cats',
      schedule: 'NON_CONTROLLED',
      strength: '100mg/5ml',
      unit: 'bottles'
    },
    {
      id: 'med-3',
      name: 'Rabies Vaccine',
      description: '1 year rabies vaccine',
      schedule: 'NON_CONTROLLED',
      strength: '1ml',
      unit: 'vials'
    },
    {
      id: 'med-4',
      name: 'Tramadol 50mg',
      description: 'Controlled pain medication',
      schedule: 'SCHEDULE_4',
      strength: '50mg',
      unit: 'tablets'
    }
  ]

  for (const medicationData of medications) {
    await prisma.medication.upsert({
      where: { id: medicationData.id },
      update: {},
      create: medicationData
    })
  }

  // Create sample inventory items
  const inventoryItems = [
    {
      id: 'inv-1',
      medicationId: 'med-1',
      name: 'Amoxicillin 250mg',
      description: 'Antibiotic capsules',
      category: 'Medication',
      quantity: 50,
      unit: 'capsules',
      lotNumber: 'AMX-2024-001',
      expiryDate: new Date('2025-06-15'),
      reorderPoint: 20,
      cost: 0.50,
      price: 2.50,
      location: 'Cabinet A-1',
      isControlled: false,
      clinicId: clinic.id
    },
    {
      id: 'inv-2',
      medicationId: 'med-2',
      name: 'Pain Relief Syrup',
      description: 'Analgesic for dogs and cats',
      category: 'Medication',
      quantity: 25,
      unit: 'bottles',
      lotNumber: 'PR-2024-002',
      expiryDate: new Date('2024-12-22'),
      reorderPoint: 10,
      cost: 8.00,
      price: 15.00,
      location: 'Cabinet B-2',
      isControlled: false,
      clinicId: clinic.id
    },
    {
      id: 'inv-3',
      medicationId: 'med-4',
      name: 'Tramadol 50mg',
      description: 'Controlled pain medication',
      category: 'Medication',
      quantity: 30,
      unit: 'tablets',
      lotNumber: 'TRM-2024-004',
      expiryDate: new Date('2025-09-30'),
      reorderPoint: 15,
      cost: 0.75,
      price: 3.00,
      location: 'Controlled Cabinet',
      isControlled: true,
      schedule: 'SCHEDULE_4',
      clinicId: clinic.id
    }
  ]

  for (const inventoryData of inventoryItems) {
    await prisma.inventoryItem.upsert({
      where: { id: inventoryData.id },
      update: {},
      create: inventoryData
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })