import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const lowStock = searchParams.get('lowStock')
    const expiring = searchParams.get('expiring')

    const tenantId = session.user.tenantId

    // Build where clause for inventory items
    const where: any = { tenantId }
    
    // Filter by category
    if (category) {
      where.category = category
    }
    
    // Filter for low stock items
    if (lowStock === 'true') {
      // This will be handled in application logic
    }

    // Filter for expiring items
    if (expiring === 'true') {
      // This will be handled in application logic
    }

    let inventory = await db.inventoryItem.findMany({
      where,
      include: {
        medication: true,
        clinic: true
      },
      orderBy: { createdAt: 'desc' }
    })
    
    // Apply additional filters in application logic
    if (lowStock === 'true') {
      inventory = inventory.filter(item => item.quantity <= item.reorderPoint)
    }

    if (expiring === 'true') {
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      inventory = inventory.filter(item => 
        item.expiryDate && new Date(item.expiryDate) <= thirtyDaysFromNow
      )
    }

    return NextResponse.json(inventory)
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    // Validate required fields
    if (!name || !category || !quantity || !reorderPoint || !unit) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const inventoryItem = await db.inventoryItem.create({
      data: {
        name,
        description,
        category,
        quantity: parseInt(quantity),
        reorderPoint: parseInt(reorderPoint),
        unit,
        cost: parseFloat(cost) || 0,
        price: parseFloat(price) || 0,
        lotNumber,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        isControlled: isControlled || false,
        schedule,
        location,
        notes,
        medicationId,
        tenantId: session.user.tenantId,
        clinicId: session.user.clinicId || 'clinic-1'
      },
      include: {
        medication: true,
        clinic: true
      }
    })

    return NextResponse.json(inventoryItem, { status: 201 })
  } catch (error) {
    console.error('Error creating inventory item:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}