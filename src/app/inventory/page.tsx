"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
  Download,
  Upload,
  Truck,
  Calendar,
  DollarSign,
  Scale,
  AlertCircle
} from "lucide-react"
import { InventoryItem, Medication } from "@prisma/client"

interface InventoryWithDetails extends InventoryItem {
  medication?: Medication
}

interface StockAlert {
  id: string
  itemId: string
  itemName: string
  type: 'LOW_STOCK' | 'EXPIRING' | 'OUT_OF_STOCK'
  message: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: Date
}

export default function InventoryPage() {
  const { data: session } = useSession()
  const [inventory, setInventory] = useState<InventoryWithDetails[]>([])
  const [filteredInventory, setFilteredInventory] = useState<InventoryWithDetails[]>([])
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItem, setSelectedItem] = useState<InventoryWithDetails | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInventory()
    fetchAlerts()
  }, [])

  useEffect(() => {
    if (inventory.length > 0) {
      const filtered = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.medication?.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredInventory(filtered)
    }
  }, [inventory, searchTerm])

  const fetchInventory = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockInventory: InventoryWithDetails[] = [
        {
          id: "1",
          tenantId: "1",
          clinicId: "1",
          medicationId: "1",
          sku: "MED-001",
          name: "Amoxicillin 250mg",
          description: "Antibiotic capsules for bacterial infections",
          category: "Antibiotics",
          quantity: 12,
          reorderPoint: 20,
          unit: "capsules",
          cost: 0.45,
          price: 1.20,
          lotNumber: "A12345",
          expiryDate: new Date("2025-06-30"),
          isControlled: false,
          schedule: null,
          location: "Pharmacy Cabinet A",
          notes: "Store at room temperature",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          medication: {
            id: "1",
            tenantId: "1",
            name: "Amoxicillin",
            description: "Broad-spectrum antibiotic",
            category: "Antibiotics",
            genericName: "Amoxicillin trihydrate",
            brandName: "Amoxil",
            strength: "250mg",
            dosageForm: "Capsule",
            ndcCode: "12345-678-90",
            schedule: null,
            requiresPrescription: true,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        {
          id: "2",
          tenantId: "1",
          clinicId: "1",
          medicationId: "2",
          sku: "MED-002",
          name: "Carprofen 75mg",
          description: "NSAID for pain and inflammation",
          category: "Analgesics",
          quantity: 45,
          reorderPoint: 30,
          unit: "tablets",
          cost: 0.85,
          price: 2.50,
          lotNumber: "B67890",
          expiryDate: new Date("2025-12-15"),
          isControlled: false,
          schedule: null,
          location: "Pharmacy Cabinet B",
          notes: "For canine use only",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          medication: {
            id: "2",
            tenantId: "1",
            name: "Carprofen",
            description: "Non-steroidal anti-inflammatory drug",
            category: "Analgesics",
            genericName: "Carprofen",
            brandName: "Rimadyl",
            strength: "75mg",
            dosageForm: "Tablet",
            ndcCode: "23456-789-01",
            schedule: null,
            requiresPrescription: true,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        {
          id: "3",
          tenantId: "1",
          clinicId: "1",
          medicationId: null,
          sku: "SUP-001",
          name: "Elizabethan Collar - Small",
          description: "Plastic recovery collar for small dogs and cats",
          category: "Supplies",
          quantity: 8,
          reorderPoint: 15,
          unit: "each",
          cost: 3.20,
          price: 8.95,
          lotNumber: "C11111",
          expiryDate: new Date("2027-03-01"),
          isControlled: false,
          schedule: null,
          location: "Supply Room",
          notes: "Various colors available",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: "4",
          tenantId: "1",
          clinicId: "1",
          medicationId: "3",
          sku: "MED-003",
          name: "Acepromazine 10mg",
          description: "Tranquilizer for pre-anesthetic sedation",
          category: "Tranquilizers",
          quantity: 25,
          reorderPoint: 15,
          unit: "tablets",
          cost: 0.30,
          price: 1.75,
          lotNumber: "D22222",
          expiryDate: new Date("2025-08-20"),
          isControlled: true,
          schedule: "IV",
          location: "Controlled Substance Cabinet",
          notes: "Controlled substance - log all dispensing",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          medication: {
            id: "3",
            tenantId: "1",
            name: "Acepromazine",
            description: "Phenothiazine tranquilizer",
            category: "Tranquilizers",
            genericName: "Acepromazine maleate",
            brandName: "Aceproject",
            strength: "10mg",
            dosageForm: "Tablet",
            ndcCode: "34567-890-12",
            schedule: "IV",
            requiresPrescription: true,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        },
        {
          id: "5",
          tenantId: "1",
          clinicId: "1",
          medicationId: null,
          sku: "SUP-002",
          name: "Syringe 3ml",
          description: "Disposable syringe with luer lock",
          category: "Medical Supplies",
          quantity: 150,
          reorderPoint: 100,
          unit: "each",
          cost: 0.15,
          price: 0.45,
          lotNumber: "E33333",
          expiryDate: new Date("2026-01-15"),
          isControlled: false,
          schedule: null,
          location: "Supply Room - Drawer 2",
          notes: "Sterile, individually wrapped",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]
      
      setInventory(mockInventory)
      setFilteredInventory(mockInventory)
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAlerts = async () => {
    try {
      // Mock alerts
      const mockAlerts: StockAlert[] = [
        {
          id: "1",
          itemId: "1",
          itemName: "Amoxicillin 250mg",
          type: "LOW_STOCK",
          message: "Stock below reorder point (12 remaining, reorder at 20)",
          severity: "MEDIUM",
          createdAt: new Date()
        },
        {
          id: "2",
          itemId: "3",
          itemName: "Elizabethan Collar - Small",
          type: "LOW_STOCK",
          message: "Stock below reorder point (8 remaining, reorder at 15)",
          severity: "LOW",
          createdAt: new Date()
        }
      ]
      
      setAlerts(mockAlerts)
    } catch (error) {
      console.error("Error fetching alerts:", error)
    }
  }

  const getStockStatus = (item: InventoryWithDetails) => {
    if (item.quantity === 0) return { status: 'OUT_OF_STOCK', color: 'bg-red-100 text-red-800' }
    if (item.quantity <= item.reorderPoint) return { status: 'LOW_STOCK', color: 'bg-yellow-100 text-yellow-800' }
    if (item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)) {
      return { status: 'EXPIRING_SOON', color: 'bg-orange-100 text-orange-800' }
    }
    return { status: 'IN_STOCK', color: 'bg-green-100 text-green-800' }
  }

  const getDaysUntilExpiry = (expiryDate: Date | null) => {
    if (!expiryDate) return null
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getTotalValue = () => {
    return inventory.reduce((sum, item) => sum + (item.quantity * item.cost), 0)
  }

  const getPotentialRevenue = () => {
    return inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0)
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
              <Package className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Pharmacy & Inventory</h1>
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
            <h2 className="text-3xl font-bold text-gray-900">Inventory Management</h2>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          
          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, SKU, category, or medication..."
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
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventory.length}</div>
              <p className="text-xs text-muted-foreground">
                Unique products
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${getTotalValue().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Cost value
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventory.filter(item => item.quantity <= item.reorderPoint).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Need reorder
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Controlled Substances</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {inventory.filter(item => item.isControlled).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Schedule tracking
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Inventory Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.map((alert) => (
                  <div key={alert.id} className="p-4 bg-white rounded-lg border">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm">{alert.itemName}</h4>
                        <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                      </div>
                      <Badge 
                        variant={alert.severity === 'HIGH' ? 'destructive' : 'outline'}
                        className={alert.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : ''}
                      >
                        {alert.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Truck className="h-3 w-3 mr-1" />
                        Reorder
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList>
            <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="supplies">Supplies</TabsTrigger>
            <TabsTrigger value="controlled">Controlled Substances</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inventory">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Inventory List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Items</CardTitle>
                    <CardDescription>
                      All medications and supplies in stock
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredInventory.map((item) => {
                        const stockStatus = getStockStatus(item)
                        const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate)
                        
                        return (
                          <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                            <CardHeader className="pb-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{item.name}</CardTitle>
                                  <CardDescription>
                                    {item.category} • SKU: {item.sku}
                                  </CardDescription>
                                </div>
                                <Badge className={stockStatus.color}>
                                  {stockStatus.status.replace('_', ' ')}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Quantity:</span>
                                    <p className="font-medium">{item.quantity} {item.unit}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Reorder:</span>
                                    <p className="font-medium">{item.reorderPoint} {item.unit}</p>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Value:</span>
                                    <p className="font-medium">${(item.quantity * item.cost).toFixed(2)}</p>
                                  </div>
                                </div>
                                
                                {item.lotNumber && (
                                  <div className="text-sm">
                                    <span className="text-gray-600">Lot: </span>
                                    <span>{item.lotNumber}</span>
                                  </div>
                                )}
                                
                                {item.expiryDate && (
                                  <div className="text-sm">
                                    <span className="text-gray-600">Expires: </span>
                                    <span className={daysUntilExpiry && daysUntilExpiry < 90 ? 'text-orange-600 font-medium' : ''}>
                                      {item.expiryDate.toLocaleDateString()}
                                      {daysUntilExpiry && daysUntilExpiry < 90 && ` (${daysUntilExpiry} days)`}
                                    </span>
                                  </div>
                                )}
                                
                                {item.isControlled && (
                                  <div className="flex items-center space-x-2">
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                    <span className="text-sm font-medium text-red-600">
                                      Controlled Substance - Schedule {item.schedule}
                                    </span>
                                  </div>
                                )}
                                
                                <div className="flex justify-between pt-3">
                                  <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                                    <Eye className="h-3 w-3 mr-1" />
                                    View Details
                                  </Button>
                                  {item.quantity <= item.reorderPoint && (
                                    <Button size="sm">
                                      <Truck className="h-3 w-3 mr-1" />
                                      Reorder
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Item Details Panel */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle>Item Details</CardTitle>
                    <CardDescription>
                      {selectedItem ? "Selected item information" : "Select an item to view details"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedItem ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold">{selectedItem.name}</h3>
                          <p className="text-sm text-gray-600">{selectedItem.description}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Category:</span>
                            <span className="text-sm">{selectedItem.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">SKU:</span>
                            <span className="text-sm font-mono">{selectedItem.sku}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Location:</span>
                            <span className="text-sm">{selectedItem.location}</span>
                          </div>
                        </div>
                        
                        <div className="border-t pt-3">
                          <h4 className="font-medium mb-2">Stock Information</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Current Stock:</span>
                              <span className="text-sm font-medium">{selectedItem.quantity} {selectedItem.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Reorder Point:</span>
                              <span className="text-sm">{selectedItem.reorderPoint} {selectedItem.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Cost:</span>
                              <span className="text-sm">${selectedItem.cost.toFixed(2)} per {selectedItem.unit}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Price:</span>
                              <span className="text-sm">${selectedItem.price.toFixed(2)} per {selectedItem.unit}</span>
                            </div>
                          </div>
                        </div>
                        
                        {selectedItem.lotNumber && (
                          <div>
                            <h4 className="font-medium mb-1">Lot Information</h4>
                            <p className="text-sm">Lot: {selectedItem.lotNumber}</p>
                            {selectedItem.expiryDate && (
                              <p className="text-sm">
                                Expires: {selectedItem.expiryDate.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {selectedItem.isControlled && (
                          <div className="p-3 bg-red-50 rounded-lg">
                            <h4 className="font-medium text-red-800 mb-1">Controlled Substance</h4>
                            <p className="text-sm text-red-700">
                              Schedule {selectedItem.schedule} - All dispensing must be logged
                            </p>
                          </div>
                        )}
                        
                        {selectedItem.notes && (
                          <div>
                            <h4 className="font-medium mb-1">Notes</h4>
                            <p className="text-sm text-gray-600">{selectedItem.notes}</p>
                          </div>
                        )}
                        
                        <div className="pt-4 space-y-2">
                          <Button className="w-full">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Item
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Truck className="h-4 w-4 mr-2" />
                            Create Purchase Order
                          </Button>
                          {selectedItem.isControlled && (
                            <Button variant="outline" className="w-full">
                              <Scale className="h-4 w-4 mr-2" />
                              Dispensing Log
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">
                        <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Select an item to view details</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="medications">
            <Card>
              <CardHeader>
                <CardTitle>Medication Inventory</CardTitle>
                <CardDescription>
                  All pharmaceutical products in stock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventory.filter(item => item.medication).map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {item.medication?.genericName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Stock:</span>
                            <span className="font-medium">{item.quantity} {item.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Strength:</span>
                            <span>{item.medication?.strength}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Form:</span>
                            <span>{item.medication?.dosageForm}</span>
                          </div>
                          {item.expiryDate && (
                            <div className="flex justify-between">
                              <span>Expires:</span>
                              <span className={getDaysUntilExpiry(item.expiryDate) && getDaysUntilExpiry(item.expiryDate)! < 90 ? 'text-orange-600' : ''}>
                                {item.expiryDate.toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="supplies">
            <Card>
              <CardHeader>
                <CardTitle>Medical Supplies</CardTitle>
                <CardDescription>
                  Non-pharmaceutical supplies and equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventory.filter(item => !item.medication).map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{item.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {item.category}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Stock:</span>
                            <span className="font-medium">{item.quantity} {item.unit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Location:</span>
                            <span>{item.location}</span>
                          </div>
                          {item.expiryDate && (
                            <div className="flex justify-between">
                              <span>Expires:</span>
                              <span>{item.expiryDate.toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="controlled">
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-800">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Controlled Substances
                </CardTitle>
                <CardDescription>
                  Schedule II-V substances requiring special handling and documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {inventory.filter(item => item.isControlled).length > 0 ? (
                  <div className="space-y-4">
                    {inventory.filter(item => item.isControlled).map((item) => (
                      <Card key={item.id} className="border-red-200 bg-red-50">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg text-red-800">{item.name}</CardTitle>
                              <CardDescription>
                                Schedule {item.schedule} • {item.medication?.genericName}
                              </CardDescription>
                            </div>
                            <Badge variant="destructive">
                              CONTROLLED
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Quantity:</span>
                              <p className="font-medium">{item.quantity} {item.unit}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Location:</span>
                              <p className="font-medium">{item.location}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Lot:</span>
                              <p className="font-medium">{item.lotNumber}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Expires:</span>
                              <p className="font-medium">{item.expiryDate?.toLocaleDateString()}</p>
                            </div>
                          </div>
                          
                          <div className="mt-4 p-3 bg-white rounded border">
                            <h5 className="font-medium text-red-800 mb-2">Security Requirements</h5>
                            <ul className="text-sm space-y-1">
                              <li>• Stored in locked cabinet</li>
                              <li>• Access limited to authorized personnel</li>
                              <li>• All dispensing must be logged</li>
                              <li>• Regular inventory counts required</li>
                            </ul>
                          </div>
                          
                          <div className="mt-4 flex space-x-2">
                            <Button size="sm">
                              <Scale className="h-3 w-3 mr-1" />
                              View Dispensing Log
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Update Count
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Controlled Substances</h3>
                    <p className="text-sm text-gray-600">
                      Your clinic currently has no controlled substances in inventory.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}