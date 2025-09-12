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
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const tenantId = session.user.tenantId

    // Get pets with search using real database
    const where = {
      tenantId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { species: { contains: search, mode: 'insensitive' } },
          { breed: { contains: search, mode: 'insensitive' } },
          {
            owner: {
              OR: [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } }
              ]
            }
          }
        ]
      })
    }

    const [pets, total] = await Promise.all([
      db.pet.findMany({
        where,
        include: {
          owner: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.pet.count({ where })
    ])

    return NextResponse.json({
      pets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching patients:', error)
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
      name,
      species,
      breed,
      gender,
      isNeutered,
      dateOfBirth,
      microchipId,
      color,
      weight,
      allergies,
      chronicConditions,
      notes,
      ownerId
    } = body

    // Validate required fields
    if (!name || !species || !gender || !ownerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if owner exists using real database
    const owner = await db.owner.findUnique({
      where: { id: ownerId }
    })

    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 })
    }

    // Create pet using real database
    const pet = await db.pet.create({
      data: {
        name,
        species,
        breed,
        gender,
        isNeutered: isNeutered || false,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        microchipId,
        color,
        weight: weight ? parseFloat(weight) : null,
        allergies: allergies ? JSON.stringify(allergies) : null,
        chronicConditions: chronicConditions ? JSON.stringify(chronicConditions) : null,
        notes,
        ownerId,
        tenantId: owner.tenantId
      },
      include: {
        owner: true
      }
    })

    return NextResponse.json(pet, { status: 201 })
  } catch (error) {
    console.error('Error creating pet:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}