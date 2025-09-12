"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CreditCard, 
  DollarSign, 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"

interface InvoiceItem {
  id: string
  invoiceId: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  itemType: string
  referenceId?: string
  createdAt: Date
}

interface Payment {
  id: string
  invoiceId: string
  amount: number
  paymentMethod: string
  transactionId?: string
  reference?: string
  status: string
  notes?: string
  processedAt: Date
  createdAt: Date
}

interface Pet {
  id: string
  tenantId: string
  ownerId: string
  name: string
  species: string
  breed: string
  gender: string
  isNeutered: boolean
  dateOfBirth?: Date
  microchipId?: string
  color?: string
  weight?: number
  allergies?: string
  chronicConditions?: string
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface Owner {
  id: string
  tenantId: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  emergencyContact?: string
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface Visit {
  id: string
  tenantId: string
  clinicId: string
  petId: string
  userId?: string
  visitType: string
  status: string
  scheduledAt: Date
  checkedInAt?: Date
  startedAt?: Date
  completedAt?: Date
  reason?: string
  symptoms?: string
  diagnosis?: string
  treatment?: string
  notes?: string
  followUpRequired: boolean
  followUpDate?: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  pet: Pet
  user?: {
    id: string
    firstName: string
    lastName: string
  }
}

interface InvoiceWithDetails {
  id: string
  tenantId: string
  clinicId: string
  visitId?: string
  ownerId?: string
  invoiceNumber: string
  invoiceDate: Date
  dueDate?: Date
  subtotal: number
  tax: number
  discount: number
  total: number
  status: string
  paymentStatus: string
  notes?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  visit?: Visit
  owner?: Owner
  items: InvoiceItem[]
  payments: Payment[]
}

export default function BillingPage() {
  const { data: session } = useSession()
  const [invoices, setInvoices] = useState<InvoiceWithDetails[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchInvoices()
  }, [])

  useEffect(() => {
    const filtered = invoices.filter(invoice => {
      const searchLower = searchTerm.toLowerCase()
      
      // Search by invoice number
      if (invoice.invoiceNumber.toLowerCase().includes(searchLower)) {
        return true
      }
      
      // Search by pet name
      if (invoice.visit?.pet.name.toLowerCase().includes(searchLower)) {
        return true
      }
      
      // Search by owner name
      const ownerName = invoice.visit?.pet.owner 
        ? `${invoice.visit.pet.owner.firstName} ${invoice.visit.pet.owner.lastName}`.toLowerCase()
        : invoice.owner
        ? `${invoice.owner.firstName} ${invoice.owner.lastName}`.toLowerCase()
        : ""
        
      if (ownerName.includes(searchLower)) {
        return true
      }
      
      return false
    })
    
    // Apply status filter
    const statusFiltered = statusFilter === "all" 
      ? filtered 
      : filtered.filter(invoice => invoice.status === statusFilter)
    
    setFilteredInvoices(statusFiltered)
  }, [invoices, searchTerm, statusFilter])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/billing')
      if (response.ok) {
        const data = await response.json()
        setInvoices(data.invoices || [])
        setFilteredInvoices(data.invoices || [])
      } else {
        throw new Error('Failed to fetch invoices')
      }
    } catch (error) {
      console.error("Error fetching invoices:", error)
      // Set empty arrays on error
      setInvoices([])
      setFilteredInvoices([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-blue-100 text-blue-800'
      case 'OVERDUE':
        return 'bg-red-100 text-red-800'
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800'
      case 'REFUNDED':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'UNPAID':
        return 'bg-red-100 text-red-800'
      case 'PARTIALLY_PAID':
        return 'bg-yellow-100 text-yellow-800'
      case 'OVERPAID':
        return 'bg-blue-100 text-blue-800'
      case 'REFUNDED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'CARD':
        return <CreditCard className="h-4 w-4" />
      case 'CASH':
        return <DollarSign className="h-4 w-4" />
      case 'CHECK':
        return <FileText className="h-4 w-4" />
      case 'ONLINE':
        return <CreditCard className="h-4 w-4" />
      case 'INSURANCE':
        return <FileText className="h-4 w-4" />
      default:
        return <CreditCard className="h-4 w-4" />
    }
  }

  const getAmountPaid = (invoice: InvoiceWithDetails) => {
    return invoice.payments.reduce((sum, payment) => sum + payment.amount, 0)
  }

  const getBalanceDue = (invoice: InvoiceWithDetails) => {
    const paid = getAmountPaid(invoice)
    return Math.max(0, invoice.total - paid)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CreditCard className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                {session?.user?.role?.replace('_', ' ')}
              </Badge>
              <span className="text-sm text-gray-600">
                {session?.user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{invoices.length}</div>
              <p className="text-xs text-muted-foreground">
                {invoices.filter(i => i.status === 'PAID').length} paid
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${invoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                Total billed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${invoices.reduce((sum, inv) => sum + getBalanceDue(inv), 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                {invoices.filter(i => getBalanceDue(i) > 0).length} invoices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {invoices.filter(i => i.status === 'OVERDUE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Invoice
            </Button>
          </div>
        </div>

        {/* Invoices Table */}
        <Card>
          <CardHeader>
            <CardTitle>Invoices</CardTitle>
            <CardDescription>
              Manage and track all billing transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>
                          {format(invoice.invoiceDate, 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          {invoice.visit 
                            ? `${invoice.visit.pet.name} (${invoice.visit.pet.owner.firstName} ${invoice.visit.pet.owner.lastName})`
                            : invoice.owner
                            ? `${invoice.owner.firstName} ${invoice.owner.lastName}`
                            : 'Unknown'
                          }
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${invoice.total.toFixed(2)}</TableCell>
                        <TableCell>${getAmountPaid(invoice).toFixed(2)}</TableCell>
                        <TableCell>${getBalanceDue(invoice).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}