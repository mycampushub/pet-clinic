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
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const tenantId = session.user.tenantId
    const pets = await mockDb.findPets(tenantId, search)
    
    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPets = pets.slice(startIndex, endIndex)
    
    const total = pets.length

    return NextResponse.json({
      pets: paginatedPets,
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

    // Check if owner exists
    const owner = await mockDb.findOwnerById(ownerId)

    if (!owner) {
      return NextResponse.json({ error: 'Owner not found' }, { status: 404 })
    }

    const pet = await mockDb.createPet({
      name,
      species,
      breed,
      gender,
      isNeutered: isNeutered || false,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      microchipId,
      color,
      weight: weight ? parseFloat(weight) : undefined,
      allergies,
      chronicConditions,
      notes,
      ownerId,
      tenantId: owner.tenantId
    })

    // Get the pet with owner information
    const petWithOwner = await mockDb.findPetById(pet.id)

    return NextResponse.json(petWithOwner, { status: 201 })
  } catch (error) {
    console.error('Error creating pet:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}