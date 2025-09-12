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
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const tenantId = session.user.tenantId

    // Build where clause for invoices
    const where: any = { tenantId }
    
    if (status && status !== 'ALL') {
      where.status = status
    }

    const [invoices, total] = await Promise.all([
      db.invoice.findMany({
        where,
        include: {
          visit: {
            include: {
              pet: {
                include: {
                  owner: true
                }
              }
            }
          },
          owner: true,
          clinic: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      db.invoice.count({ where })
    ])

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching invoices:', error)
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
      visitId,
      ownerId,
      items,
      subtotal,
      tax,
      discount,
      total
    } = body

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invoice must have at least one item' }, { status: 400 })
    }

    if (!subtotal || !total) {
      return NextResponse.json({ error: 'Missing financial information' }, { status: 400 })
    }

    // Generate invoice number
    const invoiceCount = await db.invoice.count({
      where: { tenantId: session.user.tenantId }
    })
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(3, '0')}`

    // Create invoice using real database
    const invoice = await db.invoice.create({
      data: {
        invoiceNumber,
        invoiceDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subtotal: parseFloat(subtotal),
        tax: parseFloat(tax) || 0,
        discount: parseFloat(discount) || 0,
        total: parseFloat(total),
        status: 'PENDING',
        paymentStatus: 'UNPAID',
        visitId,
        ownerId,
        tenantId: session.user.tenantId,
        clinicId: session.user.clinicId || 'clinic-1'
      },
      include: {
        visit: {
          include: {
            pet: {
              include: {
                owner: true
              }
            }
          }
        },
        owner: true,
        clinic: true
      }
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}