import { NextRequest, NextResponse } from "next/server"
import { getValidatedSession } from "@/lib/session-utils"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validatedSession = await getValidatedSession()
    
    if (!validatedSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Fetching appointment:", params.id, "for clinic:", validatedSession.clinicId)

    const appointment = await db.appointment.findUnique({
      where: { 
        id: params.id,
        clinicId: validatedSession.clinicId 
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
      }
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error fetching appointment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validatedSession = await getValidatedSession()
    
    if (!validatedSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to update appointments
    const canUpdateAppointments = ["RECEPTIONIST", "VETERINARIAN", "VET_TECH", "MANAGER", "ADMIN"].includes(validatedSession.user.role)
    if (!canUpdateAppointments) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { petId, providerId, serviceCode, title, description, startTime, endTime, duration, status, notes } = body

    console.log("Updating appointment:", params.id, "for clinic:", validatedSession.clinicId, "by user:", validatedSession.user.email)

    // Check if appointment exists and belongs to the same clinic
    const existingAppointment = await db.appointment.findUnique({
      where: { id: params.id }
    })

    if (!existingAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    if (existingAppointment.clinicId !== validatedSession.clinicId) {
      return NextResponse.json({ error: "Appointment does not belong to your clinic" }, { status: 403 })
    }

    // Validate required fields
    if (!petId || !providerId || !startTime || !endTime || !serviceCode) {
      return NextResponse.json({ error: "Pet ID, provider ID, start time, end time, and service code are required" }, { status: 400 })
    }

    // Check if pet exists and belongs to the same clinic
    const pet = await db.pet.findUnique({
      where: { id: petId },
      include: { owner: true }
    })

    if (!pet) {
      return NextResponse.json({ error: "Pet not found" }, { status: 404 })
    }

    if (pet.clinicId !== validatedSession.clinicId) {
      return NextResponse.json({ error: "Pet does not belong to your clinic" }, { status: 403 })
    }

    // Check if provider exists and belongs to the same clinic
    const provider = await db.user.findUnique({
      where: { id: providerId }
    })

    if (!provider) {
      return NextResponse.json({ error: "Provider not found" }, { status: 404 })
    }

    if (provider.clinicId !== validatedSession.clinicId) {
      return NextResponse.json({ error: "Provider does not belong to your clinic" }, { status: 403 })
    }

    // Check for scheduling conflicts (excluding current appointment)
    const conflictingAppointments = await db.appointment.findMany({
      where: {
        providerId,
        clinicId: validatedSession.clinicId,
        status: { notIn: ["CANCELLED"] },
        id: { not: params.id },
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

    const appointment = await db.appointment.update({
      where: { id: params.id },
      data: {
        petId,
        ownerId: pet.ownerId,
        providerId,
        serviceCode,
        title: title || serviceCode,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        duration: duration || Math.round((new Date(endTime).getTime() - new Date(startTime).getTime()) / 60000),
        status: status || existingAppointment.status,
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

    return NextResponse.json(appointment)
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const validatedSession = await getValidatedSession()
    
    if (!validatedSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to delete appointments
    const canDeleteAppointments = ["RECEPTIONIST", "VETERINARIAN", "VET_TECH", "MANAGER", "ADMIN"].includes(validatedSession.user.role)
    if (!canDeleteAppointments) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    console.log("Deleting appointment:", params.id, "for clinic:", validatedSession.clinicId, "by user:", validatedSession.user.email)

    // Check if appointment exists and belongs to the same clinic
    const existingAppointment = await db.appointment.findUnique({
      where: { id: params.id }
    })

    if (!existingAppointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    if (existingAppointment.clinicId !== validatedSession.clinicId) {
      return NextResponse.json({ error: "Appointment does not belong to your clinic" }, { status: 403 })
    }

    await db.appointment.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Appointment deleted successfully" })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}