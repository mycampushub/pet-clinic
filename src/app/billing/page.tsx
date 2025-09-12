"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
  Mail,
  Phone,
  User,
  Calendar,
  Edit,
  Eye,
  Receipt,
  CreditCard as CardIcon
} from "lucide-react"
import { Invoice, Payment, InvoiceItem, Pet, Owner } from "@prisma/client"

interface InvoiceWithDetails extends Invoice {
  visit?: {
    pet: Pet & {
      owner: Owner
    }
  }
  owner?: Owner
  items: InvoiceItem[]
  payments: Payment[]
}

export default function BillingPage() {
  const { data: session } = useSession()
  const [invoices, setInvoices] = useState<InvoiceWithDetails[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<InvoiceWithDetails[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvoices()
  }, [])

  useEffect(() => {
    if (invoices.length > 0) {
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
      setFilteredInvoices(filtered)
    }
  }, [invoices, searchTerm])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockInvoices: InvoiceWithDetails[] = [
        {
          id: "1",
          tenantId: "1",
          clinicId: "1",
          visitId: "1",
          ownerId: null,
          invoiceNumber: "INV-2024-001",
          invoiceDate: new Date("2024-09-10"),
          dueDate: new Date("2024-09-24"),
          subtotal: 150.00,
          tax: 12.00,
          discount: 0.00,
          total: 162.00,
          status: "PAID",
          paymentStatus: "PAID",
          notes: "Annual checkup and vaccination",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          visit: {
            id: "1",
            tenantId: "1",
            clinicId: "1",
            petId: "1",
            userId: "1",
            visitType: "CONSULTATION",
            status: "COMPLETED",
            scheduledAt: new Date("2024-09-10T09:00:00"),
            checkedInAt: new Date("2024-09-10T08:45:00"),
            startedAt: new Date("2024-09-10T09:05:00"),
            completedAt: new Date("2024-09-10T09:45:00"),
            reason: "Annual checkup and vaccination",
            symptoms: null,
            diagnosis: null,
            treatment: null,
            notes: null,
            followUpRequired: false,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            pet: {
              id: "1",
              tenantId: "1",
              ownerId: "1",
              name: "Max",
              species: "Dog",
              breed: "Golden Retriever",
              gender: "MALE",
              isNeutered: true,
              dateOfBirth: new Date("2018-05-15"),
              microchipId: "985141000123456",
              color: "Golden",
              weight: 32.5,
              allergies: null,
              chronicConditions: null,
              notes: null,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              owner: {
                id: "1",
                tenantId: "1",
                firstName: "John",
                lastName: "Smith",
                email: "john.smith@email.com",
                phone: "+1-555-0123",
                address: "123 Main St",
                city: "Anytown",
                state: "CA",
                zipCode: "12345",
                country: "US",
                emergencyContact: null,
                notes: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            }
          },
          owner: null,
          items: [
            {
              id: "1",
              invoiceId: "1",
              description: "Office Visit - Consultation",
              quantity: 1,
              unitPrice: 75.00,
              total: 75.00,
              itemType: "SERVICE",
              referenceId: null,
              notes: null,
              createdAt: new Date()
            },
            {
              id: "2",
              invoiceId: "1",
              description: "DHPP Vaccination",
              quantity: 1,
              unitPrice: 45.00,
              total: 45.00,
              itemType: "SERVICE",
              referenceId: null,
              notes: null,
              createdAt: new Date()
            },
            {
              id: "3",
              invoiceId: "1",
              description: "Rabies Vaccination",
              quantity: 1,
              unitPrice: 30.00,
              total: 30.00,
              itemType: "SERVICE",
              referenceId: null,
              notes: null,
              createdAt: new Date()
            }
          ],
          payments: [
            {
              id: "1",
              invoiceId: "1",
              amount: 162.00,
              paymentMethod: "CARD",
              transactionId: "txn_123456789",
              reference: "****1234",
              status: "COMPLETED",
              notes: "Paid via credit card",
              processedAt: new Date("2024-09-10"),
              createdAt: new Date()
            }
          ]
        },
        {
          id: "2",
          tenantId: "1",
          clinicId: "1",
          visitId: "2",
          ownerId: null,
          invoiceNumber: "INV-2024-002",
          invoiceDate: new Date("2024-09-12"),
          dueDate: new Date("2024-09-26"),
          subtotal: 450.00,
          tax: 36.00,
          discount: 0.00,
          total: 486.00,
          status: "PENDING",
          paymentStatus: "UNPAID",
          notes: "Dental cleaning and polishing",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          visit: {
            id: "2",
            tenantId: "1",
            clinicId: "1",
            petId: "2",
            userId: "1",
            visitType: "DENTAL",
            status: "COMPLETED",
            scheduledAt: new Date("2024-09-12T10:00:00"),
            checkedInAt: new Date("2024-09-12T09:30:00"),
            startedAt: new Date("2024-09-12T10:15:00"),
            completedAt: new Date("2024-09-12T12:30:00"),
            reason: "Dental cleaning and examination",
            symptoms: null,
            diagnosis: null,
            treatment: null,
            notes: null,
            followUpRequired: false,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            pet: {
              id: "2",
              tenantId: "1",
              ownerId: "2",
              name: "Luna",
              species: "Cat",
              breed: "Persian",
              gender: "FEMALE",
              isNeutered: true,
              dateOfBirth: new Date("2020-02-10"),
              microchipId: "985141000123457",
              color: "White",
              weight: 4.2,
              allergies: null,
              chronicConditions: null,
              notes: null,
              isActive: true,
              createdAt: new Date(),
              updatedAt: new Date(),
              owner: {
                id: "2",
                tenantId: "1",
                firstName: "Sarah",
                lastName: "Johnson",
                email: "sarah.j@email.com",
                phone: "+1-555-0125",
                address: "456 Oak Ave",
                city: "Somewhere",
                state: "CA",
                zipCode: "12346",
                country: "US",
                emergencyContact: null,
                notes: null,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            }
          },
          owner: null,
          items: [
            {
              id: "4",
              invoiceId: "2",
              description: "Dental Cleaning - Anesthesia",
              quantity: 1,
              unitPrice: 200.00,
              total: 200.00,
              itemType: "SERVICE",
              referenceId: null,
              notes: null,
              createdAt: new Date()
            },
            {
              id: "5",
              invoiceId: "2",
              description: "Dental Scaling & Polishing",
              quantity: 1,
              unitPrice: 250.00,
              total: 250.00,
              itemType: "SERVICE",
              referenceId: null,
              notes: null,
              createdAt: new Date()
            }
          ],
          payments: []
        },
        {
          id: "3",
          tenantId: "1",
          clinicId: "1",
          visitId: null,
          ownerId: "3",
          invoiceNumber: "INV-2024-003",
          invoiceDate: new Date("2024-09-14"),
          dueDate: new Date("2024-09-28"),
          subtotal: 85.00,
          tax: 6.80,
          discount: 10.00,
          total: 81.80,
          status: "OVERDUE",
          paymentStatus: "PARTIALLY_PAID",
          notes: "Medication and supplies for home care",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          visit: null,
          owner: {
            id: "3",
            tenantId: "1",
            firstName: "Mike",
            lastName: "Davis",
            email: "mike.davis@email.com",
            phone: "+1-555-0126",
            address: "789 Pine St",
            city: "Elsewhere",
            state: "CA",
            zipCode: "12347",
            country: "US",
            emergencyContact: null,
            notes: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          items: [
            {
              id: "6",
              invoiceId: "3",
              description: "Antibiotic Course - Amoxicillin",
              quantity: 1,
              unitPrice: 45.00,
              total: 45.00,
              itemType: "MEDICATION",
              referenceId: null,
              notes: null,
              createdAt: new Date()
            },
            {
              id: "7",
              invoiceId: "3",
              description: "Medicated Shampoo",
              quantity: 1,
              unitPrice: 25.00,
              total: 25.00,
              itemType: "PRODUCT",
              referenceId: null,
              notes: null,
              createdAt: new Date()
            },
            {
              id: "8",
              invoiceId: "3",
              description: "E-Collar (Small)",
              quantity: 1,
              unitPrice: 25.00,
              total: 25.00,
              itemType: "PRODUCT",
              referenceId: null,
              notes: null,
              createdAt: new Date()
            }
          ],
          payments: [
            {
              id: "2",
              invoiceId: "3",
              amount: 50.00,
              paymentMethod: "CASH",
              transactionId: null,
              reference: "Cash payment",
              status: "COMPLETED",
              notes: "Partial payment",
              processedAt: new Date("2024-09-14"),
              createdAt: new Date()
            }
          ]
        }
      ]
      
      setInvoices(mockInvoices)
      setFilteredInvoices(mockInvoices)
    } catch (error) {
      console.error("Error fetching invoices:", error)
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
        return <CardIcon className="h-4 w-4" />
      case 'CASH':
        return <DollarSign className="h-4 w-4" />
      case 'CHECK':
        return <FileText className="h-4 w-4" />
      case 'ONLINE':
        return <CreditCard className="h-4 w-4" />
      case 'INSURANCE':
        return <Receipt className="h-4 w-4" />
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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-3xl font-bold text-gray-900">Invoice Management</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by invoice number, pet name, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${invoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {invoices.filter(inv => inv.paymentStatus === 'PAID').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Fully paid
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
                Balance due
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
                {invoices.filter(inv => inv.status === 'OVERDUE').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invoices List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Invoices Cards */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{invoice.invoiceNumber}</CardTitle>
                        <CardDescription>
                          {invoice.visit?.pet.name 
                            ? `${invoice.visit.pet.name} - ${invoice.visit.pet.owner.firstName} ${invoice.visit.pet.owner.lastName}`
                            : `${invoice.owner?.firstName} ${invoice.owner?.lastName}`
                          }
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                        <Badge className={getPaymentStatusColor(invoice.paymentStatus)}>
                          {invoice.paymentStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">
                            {invoice.visit?.visitType.replace('_', ' ') || 'Products & Supplies'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(invoice.invoiceDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${invoice.total.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">
                            Paid: ${getAmountPaid(invoice).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      {getBalanceDue(invoice) > 0 && (
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-sm font-medium text-red-600">Balance Due:</span>
                          <span className="text-sm font-bold text-red-600">
                            ${getBalanceDue(invoice).toFixed(2)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-3">
                        <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                        {getBalanceDue(invoice) > 0 && (
                          <Button size="sm">
                            <CreditCard className="h-3 w-3 mr-1" />
                            Process Payment
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Invoice Details Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>
                  {selectedInvoice ? "Selected invoice information" : "Select an invoice to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedInvoice ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">{selectedInvoice.invoiceNumber}</h3>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedInvoice.invoiceDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="text-sm">${selectedInvoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Tax:</span>
                        <span className="text-sm">${selectedInvoice.tax.toFixed(2)}</span>
                      </div>
                      {selectedInvoice.discount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Discount:</span>
                          <span className="text-sm">-${selectedInvoice.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t font-medium">
                        <span>Total:</span>
                        <span>${selectedInvoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Items</h4>
                      <div className="space-y-2">
                        {selectedInvoice.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <div>
                              <p>{item.description}</p>
                              <p className="text-xs text-gray-500">{item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                            </div>
                            <span>${item.total.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedInvoice.payments.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Payments</h4>
                        <div className="space-y-2">
                          {selectedInvoice.payments.map((payment) => (
                            <div key={payment.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center">
                                {getPaymentMethodIcon(payment.paymentMethod)}
                                <span className="ml-2">{payment.paymentMethod}</span>
                              </div>
                              <div className="text-right">
                                <p>${payment.amount.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">{new Date(payment.processedAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-4 space-y-2">
                      <Button className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Mail className="h-4 w-4 mr-2" />
                        Email Invoice
                      </Button>
                      {getBalanceDue(selectedInvoice) > 0 && (
                        <Button variant="outline" className="w-full">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Client
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Select an invoice to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}