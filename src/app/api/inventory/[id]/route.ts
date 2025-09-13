import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const inventoryId = params.id

    // Check if inventory item exists and belongs to tenant
    const inventoryItem = await db.inventoryItem.findFirst({
      where: { 
        id: inventoryId,
        tenantId: session.user.tenantId
      },
      include: {
        medication: true,
        clinic: true
      }
    })

    if (!inventoryItem) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 })
    }

    return NextResponse.json(inventoryItem)
  } catch (error) {
    console.error('Error fetching inventory item:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const inventoryId = params.id
    const body = await request.json()
    const {
      name,
      description,
      category,
      quantity,
      reorderPoint,
      unit,
      cost,
      price,
      lotNumber,
      expiryDate,
      isControlled,
      schedule,
      location,
      notes,
      medicationId
    } = body

    // Check if inventory item exists and belongs to tenant
    const existingItem = await db.inventoryItem.findFirst({
      where: { 
        id: inventoryId,
        tenantId: session.user.tenantId
      }
    })

    if (!existingItem) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 })
    }

    // Update inventory item
    const updatedItem = await db.inventoryItem.update({
      where: { id: inventoryId },
      data: {
        name: name || existingItem.name,
        description: description !== undefined ? description : existingItem.description,
        category: category || existingItem.category,
        quantity: quantity !== undefined ? parseInt(quantity) : existingItem.quantity,
        reorderPoint: reorderPoint !== undefined ? parseInt(reorderPoint) : existingItem.reorderPoint,
        unit: unit || existingItem.unit,
        cost: cost !== undefined ? parseFloat(cost) : existingItem.cost,
        price: price !== undefined ? parseFloat(price) : existingItem.price,
        lotNumber: lotNumber !== undefined ? lotNumber : existingItem.lotNumber,
        expiryDate: expiryDate ? new Date(expiryDate) : existingItem.expiryDate,
        isControlled: isControlled !== undefined ? isControlled : existingItem.isControlled,
        schedule: schedule !== undefined ? schedule : existingItem.schedule,
        location: location !== undefined ? location : existingItem.location,
        notes: notes !== undefined ? notes : existingItem.notes,
        medicationId: medicationId !== undefined ? medicationId : existingItem.medicationId
      },
      include: {
        medication: true,
        clinic: true
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating inventory item:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const inventoryId = params.id

    // Check if inventory item exists and belongs to tenant
    const inventoryItem = await db.inventoryItem.findFirst({
      where: { 
        id: inventoryId,
        tenantId: session.user.tenantId
      }
    })

    if (!inventoryItem) {
      return NextResponse.json({ error: 'Inventory item not found' }, { status: 404 })
    }

    // Delete the inventory item
    await db.inventoryItem.delete({
      where: { id: inventoryId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inventory item:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}