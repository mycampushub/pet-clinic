import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { mockDb } from '@/lib/mock-db'

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
    let invoices = await mockDb.findInvoices(tenantId)
    
    // Filter by status if provided
    if (status && status !== 'ALL') {
      invoices = invoices.filter(invoice => invoice.status === status)
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedInvoices = invoices.slice(startIndex, endIndex)
    
    const total = invoices.length

    return NextResponse.json({
      invoices: paginatedInvoices,
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
    const invoiceCount = (await mockDb.findInvoices(session.user.tenantId)).length
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(invoiceCount + 1).padStart(3, '0')}`

    // Create invoice
    const invoice = await mockDb.createInvoice({
      invoiceNumber,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      subtotal: parseFloat(subtotal),
      tax: parseFloat(tax) || 0,
      discount: parseFloat(discount) || 0,
      total: parseFloat(total),
      status: 'PENDING' as any,
      paymentStatus: 'UNPAID' as any,
      visitId,
      ownerId,
      tenantId: session.user.tenantId,
      clinicId: session.user.clinicId || 'clinic-1',
      notes: ''
    })

    return NextResponse.json(invoice, { status: 201 })
  } catch (error) {
    console.error('Error creating invoice:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}