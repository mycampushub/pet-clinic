import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'
import { Pet, Owner } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const tenantId = session.user.tenantId

    const pets = await db.pet.findMany({
      where: {
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
      },
      include: {
        owner: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(pets)
  } catch (error) {
    console.error('Error fetching pets:', error)
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
      ownerId,
      allergies,
      chronicConditions,
      notes
    } = body

    const pet = await db.pet.create({
      data: {
        tenantId: session.user.tenantId,
        ownerId,
        name,
        species,
        breed,
        gender,
        isNeutered,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        microchipId,
        color,
        weight,
        allergies: allergies ? JSON.stringify(allergies) : null,
        chronicConditions: chronicConditions ? JSON.stringify(chronicConditions) : null,
        notes
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