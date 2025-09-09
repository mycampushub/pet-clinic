import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a default tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'tenant-1' },
    update: {},
    create: {
      id: 'tenant-1',
      name: 'PetClinic Pro',
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
      name: 'Veterinary Clinic',
      address: '123 Main St, Anytown, ST 12345',
      phone: '(555) 123-4567',
      email: 'info@vetclinic.com',
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

  // Create sample medications (for inventory)
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
    }
  ]

  for (const medicationData of medications) {
    await prisma.medication.upsert({
      where: { id: medicationData.id },
      update: {},
      create: medicationData
    })
  }

  console.log('Database seeded successfully!')
  console.log('No demo users created - please register a new account to get started.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })