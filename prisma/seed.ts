import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'petclinic-pro' },
    update: {},
    create: {
      name: 'PetClinic Pro Demo',
      slug: 'petclinic-pro',
      settings: {}
    }
  })

  // Create clinic
  const clinic = await prisma.clinic.upsert({
    where: { id: 'clinic-1' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Main Street Veterinary Clinic',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'US',
      phone: '+1-555-0123',
      email: 'info@mainstreetvet.com',
      timezone: 'America/Los_Angeles',
      settings: {}
    }
  })

  // Hash password for demo user
  const hashedPassword = await bcrypt.hash('password123', 12)

  // Create users with different roles
  const vetUser = await prisma.user.upsert({
    where: { email: 'vet@petclinic.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      clinicId: clinic.id,
      email: 'vet@petclinic.com',
      password: hashedPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'VETERINARIAN',
      isActive: true
    }
  })

  const receptionUser = await prisma.user.upsert({
    where: { email: 'reception@petclinic.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      clinicId: clinic.id,
      email: 'reception@petclinic.com',
      password: hashedPassword,
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'RECEPTIONIST',
      isActive: true
    }
  })

  const clinicAdminUser = await prisma.user.upsert({
    where: { email: 'manager@petclinic.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      clinicId: clinic.id,
      email: 'manager@petclinic.com',
      password: hashedPassword,
      firstName: 'Mike',
      lastName: 'Davis',
      role: 'CLINIC_ADMIN',
      isActive: true
    }
  })

  // Create owners
  const owner1 = await prisma.owner.upsert({
    where: { id: 'owner-1' },
    update: {},
    create: {
      tenantId: tenant.id,
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      phone: '+1-555-0123',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      country: 'US',
      emergencyContact: JSON.stringify({
        name: 'Jane Smith',
        phone: '+1-555-0124',
        relationship: 'Spouse'
      })
    }
  })

  const owner2 = await prisma.owner.upsert({
    where: { id: 'owner-2' },
    update: {},
    create: {
      tenantId: tenant.id,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.j@email.com',
      phone: '+1-555-0125',
      address: '456 Oak Ave',
      city: 'Somewhere',
      state: 'CA',
      zipCode: '12346',
      country: 'US'
    }
  })

  // Create pets
  const pet1 = await prisma.pet.upsert({
    where: { id: 'pet-1' },
    update: {},
    create: {
      tenantId: tenant.id,
      ownerId: owner1.id,
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      gender: 'MALE',
      isNeutered: true,
      dateOfBirth: new Date('2018-05-15'),
      microchipId: '985141000123456',
      color: 'Golden',
      weight: 32.5,
      allergies: JSON.stringify(['Penicillin']),
      chronicConditions: JSON.stringify(['Arthritis']),
      notes: 'Friendly dog, loves treats'
    }
  })

  const pet2 = await prisma.pet.upsert({
    where: { id: 'pet-2' },
    update: {},
    create: {
      tenantId: tenant.id,
      ownerId: owner2.id,
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian',
      gender: 'FEMALE',
      isNeutered: true,
      dateOfBirth: new Date('2020-02-10'),
      microchipId: '985141000123457',
      color: 'White',
      weight: 4.2,
      notes: 'Shy, needs gentle handling'
    }
  })

  // Create visits
  const visit1 = await prisma.visit.upsert({
    where: { id: 'visit-1' },
    update: {},
    create: {
      tenantId: tenant.id,
      clinicId: clinic.id,
      petId: pet1.id,
      userId: vetUser.id,
      visitType: 'CONSULTATION',
      status: 'COMPLETED',
      scheduledAt: new Date('2024-09-10T09:00:00'),
      checkedInAt: new Date('2024-09-10T08:45:00'),
      startedAt: new Date('2024-09-10T09:05:00'),
      completedAt: new Date('2024-09-10T09:45:00'),
      reason: 'Annual checkup and vaccination',
      symptoms: 'None reported',
      diagnosis: 'Healthy',
      treatment: 'Annual vaccination administered',
      notes: 'Patient is in good health. Weight stable.'
    }
  })

  const visit2 = await prisma.visit.upsert({
    where: { id: 'visit-2' },
    update: {},
    create: {
      tenantId: tenant.id,
      clinicId: clinic.id,
      petId: pet2.id,
      userId: vetUser.id,
      visitType: 'VACCINATION',
      status: 'COMPLETED',
      scheduledAt: new Date('2024-09-12T10:00:00'),
      checkedInAt: new Date('2024-09-12T09:30:00'),
      startedAt: new Date('2024-09-12T10:15:00'),
      completedAt: new Date('2024-09-12T10:45:00'),
      reason: 'Rabies vaccination booster',
      symptoms: 'None',
      diagnosis: 'Up to date on vaccinations',
      treatment: 'Rabies vaccine administered',
      notes: 'Patient handled well, no adverse reactions'
    }
  })

  // Create SOAP notes
  await prisma.sOAPNote.upsert({
    where: { id: 'soap-1' },
    update: {},
    create: {
      visitId: visit1.id,
      subjective: 'Owner reports Max has been healthy and active. No concerns noted since last visit.',
      objective: 'Patient alert and responsive. Body condition score 5/9. Mucous membranes pink and moist. Heart rate normal, lungs clear. Abdomen soft, no pain on palpation.',
      assessment: 'Healthy adult dog. No abnormalities detected on physical examination.',
      plan: '1. Continue current diet and exercise routine\n2. Administer DHPP and Rabies vaccines\n3. Recommend heartworm prevention\n4. Schedule next annual visit',
      weight: 32.5,
      temperature: 101.5,
      heartRate: 120,
      respiratoryRate: 24
    }
  })

  // Create medications
  const medication1 = await prisma.medication.upsert({
    where: { id: 'med-1' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Amoxicillin',
      description: 'Broad-spectrum antibiotic',
      category: 'Antibiotics',
      genericName: 'Amoxicillin trihydrate',
      brandName: 'Amoxil',
      strength: '250mg',
      dosageForm: 'Capsule',
      ndcCode: '12345-678-90',
      requiresPrescription: true
    }
  })

  // Create inventory items
  await prisma.inventoryItem.upsert({
    where: { id: 'inv-1' },
    update: {},
    create: {
      tenantId: tenant.id,
      clinicId: clinic.id,
      medicationId: medication1.id,
      sku: 'MED-001',
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
      notes: 'Store at room temperature'
    }
  })

  // Create invoices
  const invoice1 = await prisma.invoice.upsert({
    where: { invoiceNumber: 'INV-2024-001' },
    update: {},
    create: {
      id: 'inv-1',
      tenantId: tenant.id,
      clinicId: clinic.id,
      visitId: visit1.id,
      invoiceNumber: 'INV-2024-001',
      invoiceDate: new Date('2024-09-10'),
      dueDate: new Date('2024-09-24'),
      subtotal: 150.00,
      tax: 12.00,
      discount: 0.00,
      total: 162.00,
      status: 'PAID',
      paymentStatus: 'PAID',
      notes: 'Annual checkup and vaccination'
    }
  })

  // Create invoice items
  await prisma.invoiceItem.upsert({
    where: { id: 'inv-item-1' },
    update: {},
    create: {
      invoiceId: invoice1.id,
      description: 'Office Visit - Consultation',
      quantity: 1,
      unitPrice: 75.00,
      total: 75.00,
      itemType: 'SERVICE'
    }
  })

  await prisma.invoiceItem.upsert({
    where: { id: 'inv-item-2' },
    update: {},
    create: {
      invoiceId: invoice1.id,
      description: 'DHPP Vaccination',
      quantity: 1,
      unitPrice: 45.00,
      total: 45.00,
      itemType: 'SERVICE'
    }
  })

  await prisma.invoiceItem.upsert({
    where: { id: 'inv-item-3' },
    update: {},
    create: {
      invoiceId: invoice1.id,
      description: 'Rabies Vaccination',
      quantity: 1,
      unitPrice: 30.00,
      total: 30.00,
      itemType: 'SERVICE'
    }
  })

  // Create payments
  await prisma.payment.upsert({
    where: { id: 'payment-1' },
    update: {},
    create: {
      invoiceId: invoice1.id,
      amount: 162.00,
      paymentMethod: 'CARD',
      transactionId: 'txn_123456789',
      reference: '****1234',
      status: 'COMPLETED',
      notes: 'Paid via credit card',
      processedAt: new Date('2024-09-10')
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('🔑 Demo credentials:')
  console.log('   Veterinarian: vet@petclinic.com / password123')
  console.log('   Receptionist: reception@petclinic.com / password123')
  console.log('   Clinic Admin: manager@petclinic.com / password123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })