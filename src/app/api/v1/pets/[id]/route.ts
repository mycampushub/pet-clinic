import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const pet = await prisma.pet.findUnique({
      where: {
        id: params.id
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true
          }
        },
        clinic: {
          select: {
            id: true,
            name: true
          }
        },
        visits: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          },
          orderBy: {
            checkInAt: "desc"
          },
          take: 5 // Last 5 visits
        },
        appointments: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                role: true
              }
            }
          },
          orderBy: {
            startTime: "desc"
          },
          take: 5 // Next 5 appointments
        },
        prescriptions: {
          include: {
            medication: true,
            prescriber: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 10 // Last 10 prescriptions
        }
      }
    })

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    // Ensure user can only access pets from their clinic
    if (pet.clinicId !== session.user.clinicId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(pet)
  } catch (error) {
    console.error("Error fetching pet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, species, breed, ownerId, dob, microchip, sex, isNeutered, weight, color, notes, isActive } = body

    // Check if pet exists and user has permission
    const existingPet = await prisma.pet.findUnique({
      where: { id: params.id }
    })

    if (!existingPet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    // Ensure user can only modify pets from their clinic
    if (existingPet.clinicId !== session.user.clinicId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if user has permission to update pets
    const canUpdatePets = ["RECEPTIONIST", "VETERINARIAN", "VET_TECH", "MANAGER", "ADMIN"].includes(session.user.role)
    if (!canUpdatePets) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // If ownerId is provided, verify it exists
    if (ownerId) {
      const owner = await prisma.owner.findUnique({
        where: { id: ownerId }
      })

      if (!owner) {
        return NextResponse.json({ error: "Owner not found" }, { status: 404 })
      }
    }

    const pet = await prisma.pet.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(species !== undefined && { species }),
        ...(breed !== undefined && { breed }),
        ...(ownerId !== undefined && { ownerId }),
        ...(dob !== undefined && { dob: dob ? new Date(dob) : null }),
        ...(microchip !== undefined && { microchip }),
        ...(sex !== undefined && { sex }),
        ...(isNeutered !== undefined && { isNeutered }),
        ...(weight !== undefined && { weight: weight ? parseFloat(weight) : null }),
        ...(color !== undefined && { color }),
        ...(notes !== undefined && { notes }),
        ...(isActive !== undefined && { isActive })
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

    return NextResponse.json(pet)
  } catch (error) {
    console.error("Error updating pet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if pet exists and user has permission
    const existingPet = await prisma.pet.findUnique({
      where: { id: params.id }
    })

    if (!existingPet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    // Ensure user can only delete pets from their clinic
    if (existingPet.clinicId !== session.user.clinicId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if user has permission to delete pets
    const canDeletePets = ["RECEPTIONIST", "VETERINARIAN", "VET_TECH", "MANAGER", "ADMIN"].includes(session.user.role)
    if (!canDeletePets) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.pet.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Pet deleted successfully" })
  } catch (error) {
    console.error("Error deleting pet:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}