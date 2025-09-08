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
    const category = searchParams.get("category")
    const lowStock = searchParams.get("lowStock") === "true"
    const expiring = searchParams.get("expiring") === "true"
    const controlled = searchParams.get("controlled") === "true"

    // Build where clause
    let whereClause: any = {
      clinicId: clinicId,
      isActive: true
    }

    if (category) {
      whereClause.category = category
    }

    if (lowStock) {
      whereClause.quantity = {
        lte: prisma.inventoryItem.fields.reorderPoint
      }
    }

    if (expiring) {
      const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      whereClause.expiryDate = {
        lte: thirtyDaysFromNow
      }
    }

    if (controlled) {
      whereClause.isControlled = true
    }

    const inventory = await prisma.inventoryItem.findMany({
      where: whereClause,
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            description: true,
            schedule: true
          }
        },
        clinic: {
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

    return NextResponse.json(inventory)
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user has permission to manage inventory
    const canManageInventory = ["PHARMACIST", "MANAGER", "ADMIN"].includes(session.user.role)
    if (!canManageInventory) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { name, description, category, quantity, unit, lotNumber, expiryDate, reorderPoint, cost, price, location, isControlled, schedule, medicationId } = body

    // Validate required fields
    if (!name || !category || !quantity || !unit) {
      return NextResponse.json({ error: "Name, category, quantity, and unit are required" }, { status: 400 })
    }

    // If medicationId is provided, verify it exists
    if (medicationId) {
      const medication = await prisma.medication.findUnique({
        where: { id: medicationId }
      })

      if (!medication) {
        return NextResponse.json({ error: "Medication not found" }, { status: 404 })
      }
    }

    // If controlled substance, validate schedule
    if (isControlled && !schedule) {
      return NextResponse.json({ error: "Schedule is required for controlled substances" }, { status: 400 })
    }

    const inventoryItem = await prisma.inventoryItem.create({
      data: {
        name,
        description,
        category,
        quantity: parseFloat(quantity),
        unit,
        lotNumber,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        reorderPoint: parseFloat(reorderPoint) || 0,
        cost: cost ? parseFloat(cost) : 0,
        price: price ? parseFloat(price) : 0,
        location,
        isControlled: isControlled || false,
        schedule,
        medicationId,
        clinicId: session.user.clinicId!
      },
      include: {
        medication: {
          select: {
            id: true,
            name: true,
            description: true,
            schedule: true
          }
        }
      }
    })

    return NextResponse.json(inventoryItem, { status: 201 })
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}