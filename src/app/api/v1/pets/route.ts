import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const tenantId = session.user.tenantId
    const clinicId = searchParams.get("clinicId") || session.user.clinicId
    const ownerId = searchParams.get("ownerId")
    const query = searchParams.get("query")

    // Build where clause
    let whereClause: any = {
      clinicId: clinicId,
      owner: {
        // Ensure we're filtering by tenant at the owner level too
        // This assumes owners are associated with pets that belong to the tenant
      }
    }

    if (ownerId) {
      whereClause.ownerId = ownerId
    }

    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { breed: { contains: query, mode: "insensitive" } },
        { species: { contains: query, mode: "insensitive" } },
        { owner: { name: { contains: query, mode: "insensitive" } } }
      ]
    }

    const pets = await prisma.pet.findMany({
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        clinic: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            visits: true,
            appointments: true,
            prescriptions: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json(pets)
  } catch (error) {
    console.error("Error fetching pets:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to create pets
    const canCreatePets = ["RECEPTIONIST", "VETERINARIAN", "VET_TECH", "MANAGER", "ADMIN"].includes(session.user.role)
    if (!canCreatePets) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, species, breed, ownerId, dob, microchip, sex, isNeutered, weight, color, notes } = body

    // Validate required fields
    if (!name || !species || !ownerId) {
      return NextResponse.json({ error: "Name, species, and owner ID are required" }, { status: 400 })
    }

    // Check if owner exists
    const owner = await prisma.owner.findUnique({
      where: { id: ownerId }
    })

    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 })
    }

    const pet = await prisma.pet.create({
      data: {
        name,
        species,
        breed,
        ownerId,
        clinicId: session.user.clinicId!,
        dob: dob ? new Date(dob) : null,
        microchip,
        sex,
        isNeutered: isNeutered || false,
        weight: weight ? parseFloat(weight) : null,
        color,
        notes
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    })

    return NextResponse.json(pet, { status: 201 })
  } catch (error) {
    console.error("Error creating pet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}