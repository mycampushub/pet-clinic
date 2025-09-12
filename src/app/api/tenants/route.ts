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

    // Only admin users can view all tenants
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    let tenants = await mockDb.findTenants()
    
    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase()
      tenants = tenants.filter(tenant => 
        tenant.name.toLowerCase().includes(searchLower) ||
        tenant.slug.toLowerCase().includes(searchLower) ||
        tenant.domain?.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedTenants = tenants.slice(startIndex, endIndex)
    
    const total = tenants.length

    return NextResponse.json({
      tenants: paginatedTenants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin users can create tenants
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      slug,
      domain,
      settings
    } = body

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ error: 'Missing required fields: name and slug are required' }, { status: 400 })
    }

    // Validate slug format (alphanumeric and hyphens only)
    const slugRegex = /^[a-z0-9-]+$/
    if (!slugRegex.test(slug)) {
      return NextResponse.json({ error: 'Slug must contain only lowercase letters, numbers, and hyphens' }, { status: 400 })
    }

    // Check if tenant with this slug already exists
    const existingTenant = await mockDb.findTenantBySlug(slug)
    if (existingTenant) {
      return NextResponse.json({ error: 'Tenant with this slug already exists' }, { status: 409 })
    }

    const tenant = await mockDb.createTenant({
      name,
      slug,
      domain,
      settings: settings || {},
      isActive: true
    })

    return NextResponse.json(tenant, { status: 201 })
  } catch (error) {
    console.error('Error creating tenant:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}