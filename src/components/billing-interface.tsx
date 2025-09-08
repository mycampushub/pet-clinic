"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  DollarSign, 
  CreditCard, 
  Plus, 
  Save, 
  Printer,
  Mail,
  Download,
  Calendar,
  User,
  Package
} from "lucide-react"

interface Invoice {
  id: string
  invoiceNumber: string
  status: "DRAFT" | "PENDING" | "PAID" | "PARTIAL" | "OVERDUE" | "CANCELLED"
  issueDate: string
  dueDate: string
  subtotal: number
  tax: number
  total: number
  amountPaid: number
  balanceDue: number
}

interface InvoiceLineItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
  type: "SERVICE" | "MEDICATION" | "PRODUCT" | "PROCEDURE"
  code?: string
}

interface Payment {
  id: string
  amount: number
  method: "CASH" | "CARD" | "CHECK" | "ONLINE" | "INSURANCE"
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"
  transactionRef?: string
  date: string
}

interface Owner {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface Pet {
  id: string
  name: string
  species: string
  breed: string
}

export function BillingInterface() {
  const [activeTab, setActiveTab] = useState("invoice")
  const [invoiceStatus, setInvoiceStatus] = useState<"DRAFT" | "PENDING" | "PAID">("PENDING")
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "CHECK" | "ONLINE">("CARD")
  const [paymentAmount, setPaymentAmount] = useState(0)

  // Sample data
  const currentInvoice: Invoice = {
    id: "1",
    invoiceNumber: "INV-2024-001",
    status: "PENDING",
    issueDate: "2024-12-15",
    dueDate: "2024-12-30",
    subtotal: 85.00,
    tax: 6.38,
    total: 91.38,
    amountPaid: 0,
    balanceDue: 91.38
  }

  const lineItems: InvoiceLineItem[] = [
    {
      id: "1",
      description: "Annual Examination",
      quantity: 1,
      unitPrice: 45.00,
      amount: 45.00,
      type: "SERVICE",
      code: "EXAM-001"
    },
    {
      id: "2",
      description: "DHPP Vaccination",
      quantity: 1,
      unitPrice: 25.00,
      amount: 25.00,
      type: "PROCEDURE",
      code: "VACC-001"
    },
    {
      id: "3",
      description: "Heartgard Plus (6 month supply)",
      quantity: 1,
      unitPrice: 15.00,
      amount: 15.00,
      type: "MEDICATION",
      code: "MED-001"
    }
  ]

  const payments: Payment[] = [
    {
      id: "1",
      amount: 50.00,
      method: "CARD",
      status: "COMPLETED",
      transactionRef: "TXN-123456",
      date: "2024-12-15"
    }
  ]

  const currentOwner: Owner = {
    id: "1",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, ST 12345"
  }

  const currentPet: Pet = {
    id: "1",
    name: "Rex",
    species: "Dog",
    breed: "Labrador Retriever"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT": return "bg-gray-100 text-gray-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "PAID": return "bg-green-100 text-green-800"
      case "PARTIAL": return "bg-blue-100 text-blue-800"
      case "OVERDUE": return "bg-red-100 text-red-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      case "COMPLETED": return "bg-green-100 text-green-800"
      case "FAILED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleProcessPayment = () => {
    console.log("Processing payment:", { method: paymentMethod, amount: paymentAmount })
    // Process payment logic
  }

  const handleSaveInvoice = () => {
    console.log("Saving invoice")
    // Save invoice logic
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Invoices</h1>
          <p className="text-muted-foreground">
            Manage invoices, payments, and billing information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleSaveInvoice}>
            <Save className="h-4 w-4 mr-2" />
            Save Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Invoice Summary Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Invoice #</span>
                <span className="font-medium">{currentInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge className={getStatusColor(currentInvoice.status)}>
                  {currentInvoice.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Issue Date</span>
                <span>{currentInvoice.issueDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span>{currentInvoice.dueDate}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span>${currentInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tax (7.5%)</span>
                <span>${currentInvoice.tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${currentInvoice.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Paid</span>
                <span>${currentInvoice.amountPaid.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Balance Due</span>
                <span className="text-red-600">${currentInvoice.balanceDue.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            <div>
              <div className="font-medium mb-2">Bill To</div>
              <div className="space-y-1 text-sm">
                <div className="font-medium">{currentOwner.name}</div>
                <div>{currentOwner.address}</div>
                <div>{currentOwner.phone}</div>
                <div>{currentOwner.email}</div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-2">Patient</div>
              <div className="text-sm">
                {currentPet.name} - {currentPet.breed}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="invoice">Invoice Items</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="invoice" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Line Items</CardTitle>
                      <CardDescription>Services, medications, and products billed</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
                      <div className="col-span-5">Description</div>
                      <div className="col-span-2">Qty</div>
                      <div className="col-span-2">Unit Price</div>
                      <div className="col-span-2">Amount</div>
                      <div className="col-span-1"></div>
                    </div>
                    
                    {lineItems.map((item) => (
                      <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-2 border-b">
                        <div className="col-span-5">
                          <div className="font-medium">{item.description}</div>
                          <div className="text-sm text-muted-foreground">
                            <Badge variant="outline" className="text-xs mr-2">
                              {item.type}
                            </Badge>
                            {item.code}
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            className="w-20"
                            min="1"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.unitPrice}
                            className="w-24"
                            step="0.01"
                            min="0"
                          />
                        </div>
                        <div className="col-span-2 font-medium">
                          ${item.amount.toFixed(2)}
                        </div>
                        <div className="col-span-1">
                          <Button variant="ghost" size="sm">
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end mt-6 space-x-4">
                    <div className="text-right">
                      <div className="flex justify-between gap-8">
                        <span>Subtotal:</span>
                        <span>${currentInvoice.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-8">
                        <span>Tax (7.5%):</span>
                        <span>${currentInvoice.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-8 font-medium text-lg">
                        <span>Total:</span>
                        <span>${currentInvoice.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Payment History</CardTitle>
                      <CardDescription>Record and track payments for this invoice</CardDescription>
                    </div>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Payment
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="font-medium">${payment.amount.toFixed(2)}</span>
                        </div>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {payment.method} • {payment.date}
                        </span>
                        {payment.transactionRef && (
                          <span className="text-sm text-muted-foreground">
                            Ref: {payment.transactionRef}
                          </span>
                        )}
                      </div>
                      <Button variant="outline" size="sm">
                        Refund
                      </Button>
                    </div>
                  ))}

                  {payments.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No payments recorded for this invoice
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Process Payment</CardTitle>
                  <CardDescription>Record a new payment for this invoice</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Payment Method</label>
                      <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CASH">Cash</SelectItem>
                          <SelectItem value="CARD">Credit Card</SelectItem>
                          <SelectItem value="CHECK">Check</SelectItem>
                          <SelectItem value="ONLINE">Online Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount</label>
                      <Input
                        type="number"
                        value={paymentAmount || currentInvoice.balanceDue}
                        onChange={(e) => setPaymentAmount(parseFloat(e.target.value))}
                        step="0.01"
                        min="0"
                        max={currentInvoice.balanceDue}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Transaction Reference</label>
                      <Input placeholder="Optional" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button onClick={handleProcessPayment}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Process Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Settings</CardTitle>
                  <CardDescription>Configure invoice options and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Due Date (days from issue)</label>
                      <Input type="number" defaultValue="15" min="1" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tax Rate (%)</label>
                      <Input type="number" defaultValue="7.5" step="0.1" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Currency</label>
                      <Select defaultValue="USD">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Invoice Prefix</label>
                      <Input defaultValue="INV-" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes</label>
                    <Textarea 
                      placeholder="Additional notes to appear on the invoice"
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}