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

    const clinic = await prisma.clinic.findUnique({
      where: {
        id: params.id
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true
          }
        },
        _count: {
          select: {
            pets: true,
            appointments: true,
            visits: true
          }
        }
      }
    })

    if (!clinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 })
    }

    // Ensure user can only access clinics from their tenant
    if (clinic.tenantId !== session.user.tenantId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(clinic)
  } catch (error) {
    console.error("Error fetching clinic:", error)
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
    const { name, address, phone, email, timezone, hours, settings } = body

    // Check if clinic exists and user has permission
    const existingClinic = await prisma.clinic.findUnique({
      where: { id: params.id }
    })

    if (!existingClinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 })
    }

    // Ensure user can only modify clinics from their tenant
    if (existingClinic.tenantId !== session.user.tenantId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if user has permission to update clinics
    if (!["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const clinic = await prisma.clinic.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(address !== undefined && { address }),
        ...(phone !== undefined && { phone }),
        ...(email !== undefined && { email }),
        ...(timezone !== undefined && { timezone }),
        ...(hours !== undefined && { hours }),
        ...(settings !== undefined && { settings })
      }
    })

    return NextResponse.json(clinic)
  } catch (error) {
    console.error("Error updating clinic:", error)
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

    // Check if clinic exists and user has permission
    const existingClinic = await prisma.clinic.findUnique({
      where: { id: params.id }
    })

    if (!existingClinic) {
      return NextResponse.json({ error: "Clinic not found" }, { status: 404 })
    }

    // Ensure user can only delete clinics from their tenant
    if (existingClinic.tenantId !== session.user.tenantId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check if user has permission to delete clinics
    if (!["ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.clinic.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "Clinic deleted successfully" })
  } catch (error) {
    console.error("Error deleting clinic:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}