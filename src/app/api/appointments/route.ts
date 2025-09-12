import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { mockDb } from '@/lib/mock-db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0]
    const status = searchParams.get('status')

    const tenantId = session.user.tenantId
    const appointments = await mockDb.findVisits(tenantId, date, status || undefined)

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      petId,
      visitType,
      scheduledAt,
      reason,
      userId
    } = body

    // Validate required fields
    if (!petId || !visitType || !scheduledAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if pet exists and get tenant info
    const petWithOwner = await mockDb.findPetById(petId)

    if (!petWithOwner) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    const appointment = await mockDb.createVisit({
      petId,
      visitType,
      scheduledAt: new Date(scheduledAt),
      reason,
      userId: userId || null,
      status: 'SCHEDULED',
      tenantId: petWithOwner.tenantId,
      clinicId: session.user.clinicId || 'clinic-1', // Use user's clinic or default
      checkedInAt: undefined,
      startedAt: undefined,
      completedAt: undefined,
      symptoms: '',
      diagnosis: '',
      treatment: '',
      notes: '',
      followUpRequired: false,
      followUpDate: undefined,
      isActive: true
    })

    // Get the complete appointment with related data
    const appointments = await mockDb.findVisits(petWithOwner.tenantId)
    const completeAppointment = appointments.find(v => v.id === appointment.id)

    return NextResponse.json(completeAppointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}