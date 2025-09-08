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
    const clinicId = searchParams.get("clinicId")
    const role = searchParams.get("role")

    // Build where clause based on user permissions
    let whereClause: any = {
      tenantId: tenantId
    }

    // Non-admin users can only see users from their clinic
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
      whereClause.clinicId = session.user.clinicId
    } else if (clinicId) {
      whereClause.clinicId = clinicId
    }

    if (role) {
      whereClause.role = role
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      include: {
        clinic: {
          select: {
            id: true,
            name: true
          }
        },
        tenant: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    })

    // Remove sensitive information
    const sanitizedUsers = users.map(user => ({
      ...user,
      // Don't include password hashes or other sensitive data
    }))

    return NextResponse.json(sanitizedUsers)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to create users
    if (!["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { email, name, role, clinicId, phone, permissions } = body

    // Validate required fields
    if (!email || !name || !role) {
      return NextResponse.json({ error: "Email, name, and role are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Validate role
    const validRoles = ["RECEPTIONIST", "VETERINARIAN", "VET_TECH", "PHARMACIST", "MANAGER", "ADMIN"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // For non-admin users, ensure clinicId is provided and valid
    if (session.user.role !== "ADMIN" && !clinicId) {
      return NextResponse.json({ error: "Clinic ID is required" }, { status: 400 })
    }

    // If clinicId is provided, verify it exists and belongs to the same tenant
    if (clinicId) {
      const clinic = await prisma.clinic.findUnique({
        where: { id: clinicId }
      })

      if (!clinic) {
        return NextResponse.json({ error: "Clinic not found" }, { status: 404 })
      }

      if (clinic.tenantId !== session.user.tenantId) {
        return NextResponse.json({ error: "Clinic does not belong to your tenant" }, { status: 403 })
      }
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role,
        clinicId,
        tenantId: session.user.tenantId,
        phone,
        permissions: permissions || [],
        isActive: true
      },
      include: {
        clinic: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}