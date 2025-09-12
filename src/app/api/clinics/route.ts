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
    const search = searchParams.get('search') || ''
    const tenantId = searchParams.get('tenantId') || session.user.tenantId
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Check permissions - users can view clinics from their tenant
    // Admin and Manager users can view clinics from any tenant if specified
    if (tenantId !== session.user.tenantId && 
        session.user.role !== 'ADMIN' && 
        session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    let clinics = await mockDb.findClinics(tenantId)
    
    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      clinics = clinics.filter(clinic => 
        clinic.name.toLowerCase().includes(searchLower) ||
        clinic.city.toLowerCase().includes(searchLower) ||
        clinic.state.toLowerCase().includes(searchLower) ||
        clinic.phone.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedClinics = clinics.slice(startIndex, endIndex)
    
    const total = clinics.length

    return NextResponse.json({
      clinics: paginatedClinics,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching clinics:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin and manager users can create clinics
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      address,
      city,
      state,
      zipCode,
      country,
      phone,
      email,
      website,
      timezone,
      settings,
      tenantId
    } = body

    // Validate required fields
    if (!name || !address || !city || !state || !zipCode || !phone) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, address, city, state, zipCode, and phone are required' 
      }, { status: 400 })
    }

    // Set tenantId - if not provided, use current user's tenantId
    // Admin users can create clinics for any tenant
    const finalTenantId = tenantId || session.user.tenantId
    
    // Verify tenant exists and user has permission
    if (finalTenantId !== session.user.tenantId && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions to create clinic for this tenant' }, { status: 403 })
    }

    const tenant = await mockDb.findTenantById(finalTenantId)
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const clinic = await mockDb.createClinic({
      tenantId: finalTenantId,
      name,
      address,
      city,
      state,
      zipCode,
      country: country || 'US',
      phone,
      email,
      website,
      timezone: timezone || 'UTC',
      settings: settings || {},
      isActive: true
    })

    return NextResponse.json(clinic, { status: 201 })
  } catch (error) {
    console.error('Error creating clinic:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}