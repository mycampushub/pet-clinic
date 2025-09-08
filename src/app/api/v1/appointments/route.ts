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
    const clinicId = session.user.clinicId
    const providerId = searchParams.get("providerId")
    const date = searchParams.get("date")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build where clause
    let whereClause: any = {
      clinicId: clinicId
    }

    if (providerId) {
      whereClause.providerId = providerId
    }

    if (date) {
      const targetDate = new Date(date)
      const nextDay = new Date(targetDate)
      nextDay.setDate(nextDay.getDate() + 1)
      
      whereClause.startTime = {
        gte: targetDate,
        lt: nextDay
      }
    }

    if (startDate && endDate) {
      whereClause.startTime = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }

    if (status) {
      whereClause.status = status
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        pet: {
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
        },
        provider: {
          select: {
            id: true,
            name: true,
            role: true
          }
        },
        clinic: {
          select: {
            id: true,
            name: true
          }
        },
        visits: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: {
        startTime: "asc"
      }
    })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to create appointments
    const canCreateAppointments = ["RECEPTIONIST", "VETERINARIAN", "VET_TECH", "MANAGER", "ADMIN"].includes(session.user.role)
    if (!canCreateAppointments) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { petId, providerId, serviceCode, title, description, startTime, endTime, duration, notes, source } = body

    // Validate required fields
    if (!petId || !providerId || !startTime || !endTime || !serviceCode) {
      return NextResponse.json({ error: "Pet ID, provider ID, start time, end time, and service code are required" }, { status: 400 })
    }

    // Check if pet exists and belongs to the same clinic
    const pet = await prisma.pet.findUnique({
      where: { id: petId },
      include: { owner: true }
    })

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    if (pet.clinicId !== session.user.clinicId) {
      return NextResponse.json({ error: "Pet does not belong to your clinic" }, { status: 403 })
    }

    // Check if provider exists and belongs to the same clinic
    const provider = await prisma.user.findUnique({
      where: { id: providerId }
    })

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    if (provider.clinicId !== session.user.clinicId) {
      return NextResponse.json({ error: "Provider does not belong to your clinic" }, { status: 403 })
    }

    // Check for scheduling conflicts
    const conflictingAppointments = await prisma.appointment.findMany({
      where: {
        providerId,
        clinicId: session.user.clinicId,
        status: { notIn: ["CANCELLED"] },
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } }
            ]
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } }
            ]
          },
          {
            AND: [
              { startTime: { gte: new Date(startTime) } },
              { endTime: { lte: new Date(endTime) } }
            ]
          }
        ]
      }
    })

    if (conflictingAppointments.length > 0) {
      return NextResponse.json({ error: "Scheduling conflict: provider already has an appointment during this time" }, { status: 409 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        petId,
        ownerId: pet.ownerId,
        clinicId: session.user.clinicId!,
        providerId,
        serviceCode,
        title: title || serviceCode,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: duration || Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000),
        status: "SCHEDULED",
        source: source || "STAFF",
        notes
      },
      include: {
        pet: {
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
        },
        provider: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(appointment, { status: 201 })
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}