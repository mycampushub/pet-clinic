import { db } from './db';

interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface RevenueMetrics {
  totalRevenue: number;
  paidInvoices: number;
  pendingInvoices: number;
  overdueInvoices: number;
  averageInvoiceValue: number;
  revenueByMonth: Array<{ month: string; revenue: number }>;
  revenueByService: Array<{ service: string; revenue: number; count: number }>;
}

interface AppointmentMetrics {
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  appointmentUtilization: number;
  appointmentsByMonth: Array<{ month: string; count: number }>;
  appointmentsByProvider: Array<{ provider: string; count: number; completed: number }>;
  popularServices: Array<{ service: string; count: number }>;
}

interface PatientMetrics {
  totalPatients: number;
  newPatients: number;
  activePatients: number;
  patientsBySpecies: Array<{ species: string; count: number }>;
  patientGrowth: Array<{ month: string; count: number }>;
  topProcedures: Array<{ procedure: string; count: number }>;
}

interface InventoryMetrics {
  totalInventoryValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  inventoryTurnover: number;
  topSellingItems: Array<{ item: string; quantity: number; revenue: number }>;
}

export class ReportingService {
  async getRevenueMetrics(dateRange: DateRange): Promise<RevenueMetrics> {
    const { startDate, endDate } = dateRange;

    // Get invoice statistics
    const invoices = await db.invoice.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        lineItems: true,
        payments: true,
      },
    });

    const totalRevenue = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'PAID').length;
    const pendingInvoices = invoices.filter(inv => inv.status === 'PENDING').length;
    const overdueInvoices = invoices.filter(inv => inv.status === 'OVERDUE').length;
    const averageInvoiceValue = invoices.length > 0 ? totalRevenue / invoices.length : 0;

    // Revenue by month
    const revenueByMonth = await this.getRevenueByMonth(startDate, endDate);

    // Revenue by service type
    const revenueByService = await this.getRevenueByService(startDate, endDate);

    return {
      totalRevenue,
      paidInvoices,
      pendingInvoices,
      overdueInvoices,
      averageInvoiceValue,
      revenueByMonth,
      revenueByService,
    };
  }

  async getAppointmentMetrics(dateRange: DateRange): Promise<AppointmentMetrics> {
    const { startDate, endDate } = dateRange;

    const appointments = await db.appointment.findMany({
      where: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        provider: true,
      },
    });

    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(apt => apt.status === 'COMPLETED').length;
    const cancelledAppointments = appointments.filter(apt => apt.status === 'CANCELLED').length;
    const noShowAppointments = appointments.filter(apt => apt.status === 'NO_SHOW').length;
    const appointmentUtilization = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;

    // Appointments by month
    const appointmentsByMonth = await this.getAppointmentsByMonth(startDate, endDate);

    // Appointments by provider
    const appointmentsByProvider = await this.getAppointmentsByProvider(startDate, endDate);

    // Popular services
    const popularServices = await this.getPopularServices(startDate, endDate);

    return {
      totalAppointments,
      completedAppointments,
      cancelledAppointments,
      noShowAppointments,
      appointmentUtilization,
      appointmentsByMonth,
      appointmentsByProvider,
      popularServices,
    };
  }

  async getPatientMetrics(dateRange: DateRange): Promise<PatientMetrics> {
    const { startDate, endDate } = dateRange;

    const patients = await db.pet.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        visits: {
          include: {
            procedures: true,
          },
        },
      },
    });

    const totalPatients = await db.pet.count();
    const newPatients = patients.length;
    const activePatients = patients.filter(pet => pet.visits.length > 0).length;

    // Patients by species
    const patientsBySpecies = await this.getPatientsBySpecies();

    // Patient growth
    const patientGrowth = await this.getPatientGrowth(startDate, endDate);

    // Top procedures
    const topProcedures = await this.getTopProcedures(startDate, endDate);

    return {
      totalPatients,
      newPatients,
      activePatients,
      patientsBySpecies,
      patientGrowth,
      topProcedures,
    };
  }

  async getInventoryMetrics(): Promise<InventoryMetrics> {
    const inventoryItems = await db.inventoryItem.findMany({
      where: {
        isActive: true,
      },
    });

    const totalInventoryValue = inventoryItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const lowStockItems = inventoryItems.filter(item => 
      item.reorderPoint && item.quantity <= item.reorderPoint
    ).length;

    const outOfStockItems = inventoryItems.filter(item => item.quantity === 0).length;

    // Calculate inventory turnover (simplified)
    const inventoryTurnover = await this.calculateInventoryTurnover();

    // Top selling items
    const topSellingItems = await this.getTopSellingItems();

    return {
      totalInventoryValue,
      lowStockItems,
      outOfStockItems,
      inventoryTurnover,
      topSellingItems,
    };
  }

  private async getRevenueByMonth(startDate: Date, endDate: Date) {
    const monthlyRevenue = await db.$queryRaw`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        SUM(total) as revenue
      FROM invoices
      WHERE createdAt >= ${startDate} AND createdAt <= ${endDate}
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month
    ` as Array<{ month: string; revenue: number }>;

    return monthlyRevenue;
  }

  private async getRevenueByService(startDate: Date, endDate: Date) {
    const serviceRevenue = await db.$queryRaw`
      SELECT 
        COALESCE(li.type, 'UNKNOWN') as service,
        SUM(li.amount) as revenue,
        COUNT(*) as count
      FROM invoice_line_items li
      JOIN invoices i ON li.invoiceId = i.id
      WHERE i.createdAt >= ${startDate} AND i.createdAt <= ${endDate}
      GROUP BY li.type
      ORDER BY revenue DESC
    ` as Array<{ service: string; revenue: number; count: number }>;

    return serviceRevenue;
  }

  private async getAppointmentsByMonth(startDate: Date, endDate: Date) {
    const monthlyAppointments = await db.$queryRaw`
      SELECT 
        strftime('%Y-%m', startTime) as month,
        COUNT(*) as count
      FROM appointments
      WHERE startTime >= ${startDate} AND startTime <= ${endDate}
      GROUP BY strftime('%Y-%m', startTime)
      ORDER BY month
    ` as Array<{ month: string; count: number }>;

    return monthlyAppointments;
  }

  private async getAppointmentsByProvider(startDate: Date, endDate: Date) {
    const providerAppointments = await db.$queryRaw`
      SELECT 
        u.name as provider,
        COUNT(a.id) as count,
        SUM(CASE WHEN a.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed
      FROM appointments a
      JOIN users u ON a.providerId = u.id
      WHERE a.startTime >= ${startDate} AND a.startTime <= ${endDate}
      GROUP BY u.id, u.name
      ORDER BY count DESC
    ` as Array<{ provider: string; count: number; completed: number }>;

    return providerAppointments;
  }

  private async getPopularServices(startDate: Date, endDate: Date) {
    const popularServices = await db.$queryRaw`
      SELECT 
        serviceCode as service,
        COUNT(*) as count
      FROM appointments
      WHERE startTime >= ${startDate} AND startTime <= ${endDate}
        AND serviceCode IS NOT NULL
      GROUP BY serviceCode
      ORDER BY count DESC
      LIMIT 10
    ` as Array<{ service: string; count: number }>;

    return popularServices;
  }

  private async getPatientsBySpecies() {
    const speciesCount = await db.$queryRaw`
      SELECT 
        species,
        COUNT(*) as count
      FROM pets
      WHERE isActive = true
      GROUP BY species
      ORDER BY count DESC
    ` as Array<{ species: string; count: number }>;

    return speciesCount;
  }

  private async getPatientGrowth(startDate: Date, endDate: Date) {
    const monthlyGrowth = await db.$queryRaw`
      SELECT 
        strftime('%Y-%m', createdAt) as month,
        COUNT(*) as count
      FROM pets
      WHERE createdAt >= ${startDate} AND createdAt <= ${endDate}
      GROUP BY strftime('%Y-%m', createdAt)
      ORDER BY month
    ` as Array<{ month: string; count: number }>;

    return monthlyGrowth;
  }

  private async getTopProcedures(startDate: Date, endDate: Date) {
    const topProcedures = await db.$queryRaw`
      SELECT 
        description as procedure,
        COUNT(*) as count
      FROM procedures p
      JOIN visits v ON p.visitId = v.id
      WHERE v.createdAt >= ${startDate} AND v.createdAt <= ${endDate}
      GROUP BY description
      ORDER BY count DESC
      LIMIT 10
    ` as Array<{ procedure: string; count: number }>;

    return topProcedures;
  }

  private async calculateInventoryTurnover(): Promise<number> {
    // Simplified inventory turnover calculation
    // In a real implementation, this would be more complex
    return 4.5; // Example value
  }

  private async getTopSellingItems() {
    const topItems = await db.$queryRaw`
      SELECT 
        i.name as item,
        SUM(ii.quantity) as quantity,
        SUM(ii.amount) as revenue
      FROM invoice_line_items ii
      JOIN inventory_items i ON ii.description = i.name
      WHERE ii.type = 'PRODUCT'
      GROUP BY i.name
      ORDER BY quantity DESC
      LIMIT 10
    ` as Array<{ item: string; quantity: number; revenue: number }>;

    return topItems;
  }

  async getDashboardSummary(dateRange: DateRange) {
    const [revenueMetrics, appointmentMetrics, patientMetrics, inventoryMetrics] = await Promise.all([
      this.getRevenueMetrics(dateRange),
      this.getAppointmentMetrics(dateRange),
      this.getPatientMetrics(dateRange),
      this.getInventoryMetrics(),
    ]);

    return {
      revenue: revenueMetrics,
      appointments: appointmentMetrics,
      patients: patientMetrics,
      inventory: inventoryMetrics,
    };
  }
}

export const reportingService = new ReportingService();