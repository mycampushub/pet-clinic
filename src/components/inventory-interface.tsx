"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Download,
  Upload,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react"

interface InventoryItem {
  id: string
  name: string
  description?: string
  category: string
  quantity: number
  unit: string
  lotNumber?: string
  expiryDate?: string
  reorderPoint: number
  cost: number
  price: number
  location?: string
  isControlled: boolean
  schedule?: "SCHEDULE_2" | "SCHEDULE_3" | "SCHEDULE_4" | "SCHEDULE_5" | "NON_CONTROLLED"
  isActive: boolean
  lastUpdated: string
}

interface StockMovement {
  id: string
  itemId: string
  type: "IN" | "OUT" | "ADJUSTMENT"
  quantity: number
  reason: string
  date: string
  user: string
}

interface PurchaseOrder {
  id: string
  orderNumber: string
  supplier: string
  status: "DRAFT" | "ORDERED" | "PARTIAL" | "RECEIVED" | "CANCELLED"
  orderDate: string
  expectedDate: string
  totalAmount: number
  items: {
    itemId: string
    quantity: number
    unitPrice: number
  }[]
}

export function InventoryInterface() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [lowStockOnly, setLowStockOnly] = useState(false)
  const [expiringOnly, setExpiringOnly] = useState(false)

  // Sample data
  const inventoryItems: InventoryItem[] = [
    {
      id: "1",
      name: "Amoxicillin 250mg",
      description: "Antibiotic capsules",
      category: "Medication",
      quantity: 5,
      unit: "capsules",
      lotNumber: "AMX-2024-001",
      expiryDate: "2025-06-15",
      reorderPoint: 20,
      cost: 0.50,
      price: 2.50,
      location: "Cabinet A-1",
      isControlled: false,
      schedule: "NON_CONTROLLED",
      isActive: true,
      lastUpdated: "2024-12-10"
    },
    {
      id: "2",
      name: "Pain Relief Syrup",
      description: "Analgesic for dogs and cats",
      category: "Medication",
      quantity: 12,
      unit: "bottles",
      lotNumber: "PR-2024-002",
      expiryDate: "2024-12-22",
      reorderPoint: 10,
      cost: 8.00,
      price: 15.00,
      location: "Cabinet B-2",
      isControlled: false,
      schedule: "NON_CONTROLLED",
      isActive: true,
      lastUpdated: "2024-12-08"
    },
    {
      id: "3",
      name: "Rabies Vaccine",
      description: "1 year rabies vaccine",
      category: "Vaccine",
      quantity: 0,
      unit: "vials",
      lotNumber: "RV-2024-003",
      expiryDate: "2025-03-15",
      reorderPoint: 5,
      cost: 12.00,
      price: 25.00,
      location: "Refrigerator 1",
      isControlled: true,
      schedule: "NON_CONTROLLED",
      isActive: true,
      lastUpdated: "2024-12-05"
    },
    {
      id: "4",
      name: "Surgical Gloves",
      description: "Latex examination gloves",
      category: "Supplies",
      quantity: 150,
      unit: "pairs",
      reorderPoint: 50,
      cost: 0.20,
      price: 1.00,
      location: "Supply Room",
      isControlled: false,
      isActive: true,
      lastUpdated: "2024-12-12"
    },
    {
      id: "5",
      name: "Tramadol 50mg",
      description: "Controlled pain medication",
      category: "Medication",
      quantity: 8,
      unit: "tablets",
      lotNumber: "TRM-2024-004",
      expiryDate: "2025-09-30",
      reorderPoint: 15,
      cost: 0.75,
      price: 3.00,
      location: "Controlled Cabinet",
      isControlled: true,
      schedule: "SCHEDULE_4",
      isActive: true,
      lastUpdated: "2024-12-11"
    }
  ]

  const stockMovements: StockMovement[] = [
    {
      id: "1",
      itemId: "1",
      type: "OUT",
      quantity: 5,
      reason: "Dispensed to patient Rex",
      date: "2024-12-15",
      user: "Dr. Smith"
    },
    {
      id: "2",
      itemId: "2",
      type: "OUT",
      quantity: 2,
      reason: "Dispensed to patient Luna",
      date: "2024-12-14",
      user: "Dr. Johnson"
    },
    {
      id: "3",
      itemId: "4",
      type: "IN",
      quantity: 200,
      reason: "Stock replenishment",
      date: "2024-12-12",
      user: "Admin"
    }
  ]

  const purchaseOrders: PurchaseOrder[] = [
    {
      id: "1",
      orderNumber: "PO-2024-001",
      supplier: "VetSupply Co.",
      status: "ORDERED",
      orderDate: "2024-12-10",
      expectedDate: "2024-12-20",
      totalAmount: 250.00,
      items: [
        { itemId: "1", quantity: 100, unitPrice: 0.50 },
        { itemId: "3", quantity: 20, unitPrice: 12.00 }
      ]
    }
  ]

  const categories = ["all", ...Array.from(new Set(inventoryItems.map(item => item.category)))]

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesLowStock = !lowStockOnly || item.quantity <= item.reorderPoint
    const matchesExpiring = !expiringOnly || 
      (item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    
    return matchesSearch && matchesCategory && matchesLowStock && matchesExpiring
  })

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity === 0) return { status: "OUT_OF_STOCK", color: "bg-red-100 text-red-800" }
    if (item.quantity <= item.reorderPoint) return { status: "LOW_STOCK", color: "bg-yellow-100 text-yellow-800" }
    if (item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) {
      return { status: "EXPIRING", color: "bg-orange-100 text-orange-800" }
    }
    return { status: "IN_STOCK", color: "bg-green-100 text-green-800" }
  }

  const getScheduleColor = (schedule?: string) => {
    switch (schedule) {
      case "SCHEDULE_2": return "bg-red-100 text-red-800"
      case "SCHEDULE_3": return "bg-orange-100 text-orange-800"
      case "SCHEDULE_4": return "bg-yellow-100 text-yellow-800"
      case "SCHEDULE_5": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const totalInventoryValue = inventoryItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0)
  const lowStockItems = inventoryItems.filter(item => item.quantity <= item.reorderPoint).length
  const expiringItems = inventoryItems.filter(item => 
    item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length
  const controlledItems = inventoryItems.filter(item => item.isControlled).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track medications, supplies, and manage stock levels
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInventoryValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {inventoryItems.length} unique items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Require reordering
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringItems}</div>
            <p className="text-xs text-muted-foreground">
              Within 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Controlled Substances</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{controlledItems}</div>
            <p className="text-xs text-muted-foreground">
              Require special handling
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="lowStock"
                checked={lowStockOnly}
                onChange={(e) => setLowStockOnly(e.target.checked)}
              />
              <label htmlFor="lowStock" className="text-sm">Low Stock Only</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="expiring"
                checked={expiringOnly}
                onChange={(e) => setExpiringOnly(e.target.checked)}
              />
              <label htmlFor="expiring" className="text-sm">Expiring Only</label>
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory Items ({filteredItems.length})</TabsTrigger>
          <TabsTrigger value="movements">Stock Movements</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>
                Manage your clinic's medication and supply inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground pb-2 border-b">
                  <div className="col-span-3">Item</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1">Stock</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Location</div>
                  <div className="col-span-1">Cost</div>
                  <div className="col-span-1">Price</div>
                  <div className="col-span-2">Actions</div>
                </div>
                
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item)
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-center py-3 border-b">
                      <div className="col-span-3">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.description}
                        </div>
                        {item.lotNumber && (
                          <div className="text-xs text-muted-foreground">
                            Lot: {item.lotNumber}
                          </div>
                        )}
                        {item.expiryDate && (
                          <div className="text-xs text-muted-foreground">
                            Expires: {item.expiryDate}
                          </div>
                        )}
                        {item.isControlled && (
                          <Badge className={`text-xs ${getScheduleColor(item.schedule)}`}>
                            {item.schedule?.replace("_", " ")}
                          </Badge>
                        )}
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <div className="col-span-1">
                        <div className="font-medium">{item.quantity} {item.unit}</div>
                        <div className="text-xs text-muted-foreground">
                          Reorder at {item.reorderPoint}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Badge className={stockStatus.color}>
                          {stockStatus.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="col-span-1 text-sm">
                        {item.location || "-"}
                      </div>
                      <div className="col-span-1 text-sm">
                        ${item.cost.toFixed(2)}
                      </div>
                      <div className="col-span-1 text-sm">
                        ${item.price.toFixed(2)}
                      </div>
                      <div className="col-span-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Package className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movements</CardTitle>
              <CardDescription>
                Track inventory changes and adjustments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockMovements.map((movement) => (
                  <div key={movement.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        movement.type === "IN" ? "bg-green-100" : 
                        movement.type === "OUT" ? "bg-red-100" : "bg-blue-100"
                      }`}>
                        {movement.type === "IN" ? <TrendingUp className="h-4 w-4 text-green-600" /> :
                         movement.type === "OUT" ? <TrendingDown className="h-4 w-4 text-red-600" /> :
                         <Package className="h-4 w-4 text-blue-600" />}
                      </div>
                      <div>
                        <div className="font-medium">
                          {movement.type} {movement.quantity} units
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {movement.reason}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{movement.date}</div>
                      <div className="text-sm text-muted-foreground">{movement.user}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>
                    Manage supplier orders and track deliveries
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {purchaseOrders.map((order) => (
                  <div key={order.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <div className="font-medium">{order.orderNumber}</div>
                        <Badge variant="outline">{order.status}</Badge>
                        <div className="text-sm text-muted-foreground">
                          {order.supplier}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${order.totalAmount.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          Expected: {order.expectedDate}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Order Date: {order.orderDate} • {order.items.length} items
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
              <CardDescription>
                Generate inventory analysis and reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Inventory Valuation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Current value of all inventory items
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Stock Level Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Analysis of current stock levels and trends
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Expiry Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Items approaching expiration date
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Usage Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Inventory usage patterns and consumption
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Controlled Substances</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Regulatory compliance report for controlled items
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Purchase History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Historical purchase orders and spending
                    </p>
                    <Button className="w-full">Generate Report</Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}