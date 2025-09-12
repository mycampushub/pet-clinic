import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'

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

    // Build where clause for visits
    const where: any = {
      tenantId
    }

    // Add date filter if provided
    if (date) {
      const searchDate = new Date(date)
      const nextDay = new Date(searchDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      where.scheduledAt = {
        gte: searchDate,
        lt: nextDay
      }
    }

    // Add status filter if provided
    if (status) {
      where.status = status
    }

    // Get appointments using real database
    const appointments = await db.visit.findMany({
      where,
      include: {
        pet: {
          include: {
            owner: true
          }
        },
        user: true,
        clinic: true
      },
      orderBy: { scheduledAt: 'asc' }
    })

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

    // Check if pet exists using real database
    const petWithOwner = await db.pet.findUnique({
      where: { id: petId },
      include: { owner: true }
    })

    if (!petWithOwner) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    // Create appointment using real database
    const appointment = await db.visit.create({
      data: {
        petId,
        visitType,
        scheduledAt: new Date(scheduledAt),
        reason,
        userId: userId || null,
        status: 'SCHEDULED',
        tenantId: petWithOwner.tenantId,
        clinicId: session.user.clinicId || 'clinic-1', // Use user's clinic or default
        isActive: true
      },
      include: {
        pet: {
          include: {
            owner: true
          }
        },
        user: true,
        clinic: true
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}