'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Users, 
  Package,
  Download,
  RefreshCw,
  DateRange
} from 'lucide-react';

interface DashboardData {
  revenue: {
    totalRevenue: number;
    paidInvoices: number;
    pendingInvoices: number;
    overdueInvoices: number;
    averageInvoiceValue: number;
    revenueByMonth: Array<{ month: string; revenue: number }>;
    revenueByService: Array<{ service: string; revenue: number; count: number }>;
  };
  appointments: {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    noShowAppointments: number;
    appointmentUtilization: number;
    appointmentsByMonth: Array<{ month: string; count: number }>;
    appointmentsByProvider: Array<{ provider: string; count: number; completed: number }>;
    popularServices: Array<{ service: string; count: number }>;
  };
  patients: {
    totalPatients: number;
    newPatients: number;
    activePatients: number;
    patientsBySpecies: Array<{ species: string; count: number }>;
    patientGrowth: Array<{ month: string; count: number }>;
    topProcedures: Array<{ procedure: string; count: number }>;
  };
  inventory: {
    totalInventoryValue: number;
    lowStockItems: number;
    outOfStockItems: number;
    inventoryTurnover: number;
    topSellingItems: Array<{ item: string; quantity: number; revenue: number }>;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const endDate = new Date();
      const startDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      const response = await fetch(
        `/api/reports/dashboard?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Failed to load dashboard data
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Business intelligence and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <DateRange className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchDashboardData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.revenue.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.revenue.paidInvoices} paid invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.appointments.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(dashboardData.appointments.appointmentUtilization)} completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.patients.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.patients.newPatients} new this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.inventory.totalInventoryValue)}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.inventory.lowStockItems} low stock items
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.revenue.revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
                <CardDescription>Revenue breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.revenue.revenueByService}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ service, revenue }) => `${service}: ${formatCurrency(revenue)}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {dashboardData.revenue.revenueByService.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Invoice Status Overview</CardTitle>
              <CardDescription>Current invoice status distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dashboardData.revenue.paidInvoices}</div>
                  <div className="text-sm text-muted-foreground">Paid</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{dashboardData.revenue.pendingInvoices}</div>
                  <div className="text-sm text-muted-foreground">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{dashboardData.revenue.overdueInvoices}</div>
                  <div className="text-sm text-muted-foreground">Overdue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatCurrency(dashboardData.revenue.averageInvoiceValue)}</div>
                  <div className="text-sm text-muted-foreground">Average Invoice</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Appointment Trends</CardTitle>
                <CardDescription>Monthly appointment volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.appointments.appointmentsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provider Performance</CardTitle>
                <CardDescription>Appointments by provider</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dashboardData.appointments.appointmentsByProvider} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="provider" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Appointment Status</CardTitle>
              <CardDescription>Current appointment status breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dashboardData.appointments.totalAppointments}</div>
                  <div className="text-sm text-muted-foreground">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dashboardData.appointments.completedAppointments}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{dashboardData.appointments.cancelledAppointments}</div>
                  <div className="text-sm text-muted-foreground">Cancelled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{dashboardData.appointments.noShowAppointments}</div>
                  <div className="text-sm text-muted-foreground">No Show</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Growth</CardTitle>
                <CardDescription>New patients over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.patients.patientGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patients by Species</CardTitle>
                <CardDescription>Patient distribution by species</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={dashboardData.patients.patientsBySpecies}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ species, count }) => `${species}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {dashboardData.patients.patientsBySpecies.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Patient Overview</CardTitle>
              <CardDescription>Current patient statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{dashboardData.patients.totalPatients}</div>
                  <div className="text-sm text-muted-foreground">Total Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{dashboardData.patients.newPatients}</div>
                  <div className="text-sm text-muted-foreground">New Patients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{dashboardData.patients.activePatients}</div>
                  <div className="text-sm text-muted-foreground">Active Patients</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
                <CardDescription>Current inventory status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{formatCurrency(dashboardData.inventory.totalInventoryValue)}</div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{dashboardData.inventory.inventoryTurnover}x</div>
                    <div className="text-sm text-muted-foreground">Turnover Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{dashboardData.inventory.lowStockItems}</div>
                    <div className="text-sm text-muted-foreground">Low Stock</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{dashboardData.inventory.outOfStockItems}</div>
                    <div className="text-sm text-muted-foreground">Out of Stock</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Selling Items</CardTitle>
                <CardDescription>Best performing inventory items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.inventory.topSellingItems.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{item.item}</div>
                          <div className="text-sm text-muted-foreground">{item.quantity} units</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.revenue)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}