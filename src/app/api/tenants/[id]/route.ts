import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/config'
import { mockDb } from '@/lib/mock-db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin users can view tenant details
    if (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const tenant = await mockDb.findTenantById(params.id)
    
    if (!tenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    return NextResponse.json(tenant)
  } catch (error) {
    console.error('Error fetching tenant:', error)
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

    // Only admin users can update tenants
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      slug,
      domain,
      settings,
      isActive
    } = body

    // Check if tenant exists
    const existingTenant = await mockDb.findTenantById(params.id)
    if (!existingTenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    // If slug is being updated, validate it
    if (slug && slug !== existingTenant.slug) {
      const slugRegex = /^[a-z0-9-]+$/
      if (!slugRegex.test(slug)) {
        return NextResponse.json({ error: 'Slug must contain only lowercase letters, numbers, and hyphens' }, { status: 400 })
      }

      // Check if another tenant with this slug already exists
      const tenantWithSameSlug = await mockDb.findTenantBySlug(slug)
      if (tenantWithSameSlug && tenantWithSameSlug.id !== params.id) {
        return NextResponse.json({ error: 'Tenant with this slug already exists' }, { status: 409 })
      }
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (slug !== undefined) updateData.slug = slug
    if (domain !== undefined) updateData.domain = domain
    if (settings !== undefined) updateData.settings = settings
    if (isActive !== undefined) updateData.isActive = isActive

    const updatedTenant = await mockDb.updateTenant(params.id, updateData)
    
    if (!updatedTenant) {
      return NextResponse.json({ error: 'Failed to update tenant' }, { status: 400 })
    }

    return NextResponse.json(updatedTenant)
  } catch (error) {
    console.error('Error updating tenant:', error)
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

    // Only admin users can delete tenants
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Check if tenant exists
    const existingTenant = await mockDb.findTenantById(params.id)
    if (!existingTenant) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
    }

    const success = await mockDb.deleteTenant(params.id)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to delete tenant' }, { status: 400 })
    }

    return NextResponse.json({ message: 'Tenant deleted successfully' })
  } catch (error) {
    console.error('Error deleting tenant:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}