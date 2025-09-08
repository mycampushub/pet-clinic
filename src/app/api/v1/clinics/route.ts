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
    const tenantId = searchParams.get("tenantId") || session.user.tenantId

    // Ensure user can only access clinics from their tenant
    if (session.user.tenantId !== tenantId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const clinics = await prisma.clinic.findMany({
      where: {
        tenantId: tenantId
      },
      include: {
        _count: {
          select: {
            users: true,
            pets: true,
            appointments: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    return NextResponse.json(clinics)
  } catch (error) {
    console.error("Error fetching clinics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to create clinics
    if (!["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, address, phone, email, timezone, hours, settings } = body

    // Validate required fields
    if (!name) {
      return NextResponse.json({ error: "Clinic name is required" }, { status: 400 })
    }

    const clinic = await prisma.clinic.create({
      data: {
        name,
        address,
        phone,
        email,
        timezone: timezone || "UTC",
        hours,
        settings,
        tenantId: session.user.tenantId
      }
    })

    return NextResponse.json(clinic, { status: 201 })
  } catch (error) {
    console.error("Error creating clinic:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}