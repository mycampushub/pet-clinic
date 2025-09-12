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
    const reportType = searchParams.get('type') || 'overview'
    const dateRange = searchParams.get('dateRange') || '30'

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(endDate.getDate() - parseInt(dateRange))

    const tenantId = session.user.tenantId
    let reportData: any = {}

    switch (reportType) {
      case 'revenue':
        // Get revenue data from mock invoices
        const invoices = await mockDb.findInvoices(tenantId)
        const paidInvoices = invoices.filter(inv => inv.paymentStatus === 'PAID')
        
        // Generate mock daily revenue data
        const dailyRevenue = []
        for (let i = 0; i < parseInt(dateRange); i++) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          dailyRevenue.push({
            date: date.toISOString().split('T')[0],
            amount: Math.floor(Math.random() * 1000) + 200 // Mock revenue data
          })
        }

        reportData = {
          daily: dailyRevenue.reverse(),
          total: paidInvoices.reduce((sum, inv) => sum + inv.total, 0),
          count: paidInvoices.length
        }
        break

      case 'appointments':
        // Get appointments data
        const appointments = await mockDb.findVisits(tenantId)
        
        const statusCounts = appointments.reduce((acc, apt) => {
          acc[apt.status] = (acc[apt.status] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        reportData = {
          total: appointments.length,
          byStatus: statusCounts,
          utilization: (appointments.length / (parseInt(dateRange) * 10)) * 100 // Assuming 10 slots per day
        }
        break

      case 'patients':
        // Get patients data
        const pets = await mockDb.findPets(tenantId)
        
        const speciesCounts = pets.reduce((acc, pet) => {
          acc[pet.species] = (acc[pet.species] || 0) + 1
          return acc
        }, {} as Record<string, number>)

        reportData = {
          total: pets.length,
          new: pets.length, // Mock - would filter by date in real implementation
          bySpecies: speciesCounts
        }
        break

      case 'inventory':
        // Get inventory data
        const inventory = await mockDb.findInventory(tenantId)
        
        const lowStock = inventory.filter(item => item.quantity <= item.reorderPoint)
        const expiring = inventory.filter(item => 
          item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        )

        reportData = {
          totalItems: inventory.length,
          totalValue: inventory.reduce((sum, item) => sum + (item.quantity * (item.cost || 0)), 0),
          lowStock: lowStock.length,
          expiring: expiring.length,
          controlled: inventory.filter(item => item.isControlled).length
        }
        break

      default:
        // Overview report
        const [allAppointments, allPatients, allInvoices] = await Promise.all([
          mockDb.findVisits(tenantId),
          mockDb.findPets(tenantId),
          mockDb.findInvoices(tenantId)
        ])

        const completedAppointments = allAppointments.filter(apt => apt.status === 'COMPLETED')
        const paidInvoices = allInvoices.filter(inv => inv.paymentStatus === 'PAID')

        reportData = {
          appointments: {
            total: allAppointments.length,
            completed: completedAppointments.length
          },
          patients: {
            total: allPatients.length
          },
          revenue: {
            totalInvoices: paidInvoices.length,
            totalRevenue: paidInvoices.reduce((sum, inv) => sum + inv.total, 0)
          },
          inventory: {
            totalItems: (await mockDb.findInventory(tenantId)).length
          }
        }
    }

    return NextResponse.json(reportData)
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}