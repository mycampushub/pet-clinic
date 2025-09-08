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

    const user = await prisma.user.findUnique({
      where: {
        id: params.id
      },
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
      }
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Ensure user can only access users from their tenant
    if (user.tenantId !== session.user.tenantId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Non-admin users can only see users from their clinic
    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER" && 
        user.clinicId !== session.user.clinicId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
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
    const { name, role, clinicId, phone, permissions, isActive } = body

    // Check if user exists and user has permission
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Ensure user can only modify users from their tenant
    if (existingUser.tenantId !== session.user.tenantId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check permissions for updating users
    const canUpdate = session.user.role === "ADMIN" || 
                     (session.user.role === "MANAGER" && existingUser.clinicId === session.user.clinicId)

    if (!canUpdate) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Users cannot change their own role or deactivate themselves
    if (params.id === session.user.id && (role || isActive === false)) {
      return NextResponse.json({ error: "Cannot modify your own role or status" }, { status: 400 })
    }

    // Validate role if provided
    if (role) {
      const validRoles = ["RECEPTIONIST", "VETERINARIAN", "VET_TECH", "PHARMACIST", "MANAGER", "ADMIN"]
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 })
      }
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

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(role !== undefined && { role }),
        ...(clinicId !== undefined && { clinicId }),
        ...(phone !== undefined && { phone }),
        ...(permissions !== undefined && { permissions }),
        ...(isActive !== undefined && { isActive })
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

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error updating user:", error)
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

    // Check if user exists and user has permission
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Users cannot delete themselves
    if (params.id === session.user.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 })
    }

    // Ensure user can only delete users from their tenant
    if (existingUser.tenantId !== session.user.tenantId && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Check permissions for deleting users
    const canDelete = session.user.role === "ADMIN" || 
                    (session.user.role === "MANAGER" && existingUser.clinicId === session.user.clinicId)

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}