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

    const where: any = {
      scheduledAt: {
        gte: new Date(`${date}T00:00:00`),
        lt: new Date(`${date}T23:59:59`)
      },
      isActive: true
    }

    if (status && status !== 'ALL') {
      where.status = status
    }

    const appointments = await db.visit.findMany({
      where,
      include: {
        pet: {
          include: {
            owner: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
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

    // Check if pet exists
    const pet = await db.pet.findUnique({
      where: { id: petId }
    })

    if (!pet) {
      return NextResponse.json({ error: 'Pet not found' }, { status: 404 })
    }

    const appointment = await db.visit.create({
      data: {
        petId,
        visitType,
        scheduledAt: new Date(scheduledAt),
        reason,
        userId: userId || null,
        status: 'SCHEDULED',
        tenantId: pet.tenantId,
        clinicId: pet.ownerId // This should be the clinic ID, needs to be fixed
      },
      include: {
        pet: {
          include: {
            owner: true
          }
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}