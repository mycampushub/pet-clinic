"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  AlertCircle,
  Trash2,
  Save
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
  
  // CRUD state
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [crudLoading, setCrudLoading] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    quantity: "",
    reorderPoint: "",
    unit: "",
    cost: "",
    price: "",
    lotNumber: "",
    expiryDate: "",
    isControlled: false,
    schedule: "",
    location: "",
    notes: "",
    medicationId: ""
  })

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
      const response = await fetch('/api/inventory')
      if (response.ok) {
        const inventoryData = await response.json()
        setInventory(inventoryData)
        setFilteredInventory(inventoryData)
      } else {
        console.error('Failed to fetch inventory')
      }
    } catch (error) {
      console.error("Error fetching inventory:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/inventory?lowStock=true')
      if (response.ok) {
        const lowStockItems = await response.json()
        
        // Generate alerts based on low stock items
        const generatedAlerts: StockAlert[] = lowStockItems.map((item: InventoryWithDetails, index: number) => ({
          id: `alert-${index}`,
          itemId: item.id,
          itemName: item.name,
          type: 'LOW_STOCK' as const,
          message: `Stock below reorder point (${item.quantity} remaining, reorder at ${item.reorderPoint})`,
          severity: item.quantity === 0 ? 'HIGH' : 'MEDIUM' as const,
          createdAt: new Date()
        }))
        
        setAlerts(generatedAlerts)
      }
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

  // CRUD Functions
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      quantity: "",
      reorderPoint: "",
      unit: "",
      cost: "",
      price: "",
      lotNumber: "",
      expiryDate: "",
      isControlled: false,
      schedule: "",
      location: "",
      notes: "",
      medicationId: ""
    })
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddItem = async () => {
    setCrudLoading(true)
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchInventory()
        await fetchAlerts()
        setIsAddDialogOpen(false)
        resetForm()
        alert('Inventory item added successfully!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to add inventory item')
      }
    } catch (error) {
      console.error('Error adding inventory item:', error)
      alert('Error adding inventory item')
    } finally {
      setCrudLoading(false)
    }
  }

  const handleEditItem = (item: InventoryWithDetails) => {
    setSelectedItem(item)
    setFormData({
      name: item.name,
      description: item.description || "",
      category: item.category,
      quantity: item.quantity.toString(),
      reorderPoint: item.reorderPoint.toString(),
      unit: item.unit,
      cost: item.cost.toString(),
      price: item.price.toString(),
      lotNumber: item.lotNumber || "",
      expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : "",
      isControlled: item.isControlled,
      schedule: item.schedule || "",
      location: item.location || "",
      notes: item.notes || "",
      medicationId: item.medicationId || ""
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateItem = async () => {
    if (!selectedItem) return
    
    setCrudLoading(true)
    try {
      const response = await fetch(`/api/inventory/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchInventory()
        await fetchAlerts()
        setIsEditDialogOpen(false)
        setSelectedItem(null)
        resetForm()
        alert('Inventory item updated successfully!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to update inventory item')
      }
    } catch (error) {
      console.error('Error updating inventory item:', error)
      alert('Error updating inventory item')
    } finally {
      setCrudLoading(false)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this inventory item? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/inventory/${itemId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchInventory()
        await fetchAlerts()
        alert('Inventory item deleted successfully!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete inventory item')
      }
    } catch (error) {
      console.error('Error deleting inventory item:', error)
      alert('Error deleting inventory item')
    }
  }

  const handleViewItem = (item: InventoryWithDetails) => {
    setSelectedItem(item)
    setIsViewDialogOpen(true)
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
            <Button onClick={() => setIsAddDialogOpen(true)}>
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

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
            <DialogDescription>
              Create a new inventory item for your pharmacy or supplies.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter item name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                  <SelectItem value="Analgesics">Analgesics</SelectItem>
                  <SelectItem value="Tranquilizers">Tranquilizers</SelectItem>
                  <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderPoint">Reorder Point *</Label>
              <Input
                id="reorderPoint"
                type="number"
                value={formData.reorderPoint}
                onChange={(e) => handleInputChange('reorderPoint', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="each">Each</SelectItem>
                  <SelectItem value="tablets">Tablets</SelectItem>
                  <SelectItem value="capsules">Capsules</SelectItem>
                  <SelectItem value="ml">ML</SelectItem>
                  <SelectItem value="mg">MG</SelectItem>
                  <SelectItem value="bottles">Bottles</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lotNumber">Lot Number</Label>
              <Input
                id="lotNumber"
                value={formData.lotNumber}
                onChange={(e) => handleInputChange('lotNumber', e.target.value)}
                placeholder="Lot number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Storage location"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Item description"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={crudLoading}>
              {crudLoading ? 'Adding...' : 'Add Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Inventory Item</DialogTitle>
            <DialogDescription>
              Update the inventory item information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Item Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter item name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                  <SelectItem value="Analgesics">Analgesics</SelectItem>
                  <SelectItem value="Tranquilizers">Tranquilizers</SelectItem>
                  <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
                  <SelectItem value="Supplies">Supplies</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity *</Label>
              <Input
                id="edit-quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-reorderPoint">Reorder Point *</Label>
              <Input
                id="edit-reorderPoint"
                type="number"
                value={formData.reorderPoint}
                onChange={(e) => handleInputChange('reorderPoint', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="each">Each</SelectItem>
                  <SelectItem value="tablets">Tablets</SelectItem>
                  <SelectItem value="capsules">Capsules</SelectItem>
                  <SelectItem value="ml">ML</SelectItem>
                  <SelectItem value="mg">MG</SelectItem>
                  <SelectItem value="bottles">Bottles</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-cost">Cost</Label>
              <Input
                id="edit-cost"
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => handleInputChange('cost', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lotNumber">Lot Number</Label>
              <Input
                id="edit-lotNumber"
                value={formData.lotNumber}
                onChange={(e) => handleInputChange('lotNumber', e.target.value)}
                placeholder="Lot number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-expiryDate">Expiry Date</Label>
              <Input
                id="edit-expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Storage location"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Item description"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input
                id="edit-notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Additional notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateItem} disabled={crudLoading}>
              {crudLoading ? 'Updating...' : 'Update Item'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Inventory Item Details</DialogTitle>
            <DialogDescription>
              View detailed information about this inventory item.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Item Name</Label>
                <p className="font-medium">{selectedItem.name}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Category</Label>
                <p className="font-medium">{selectedItem.category}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Quantity</Label>
                <p className="font-medium">{selectedItem.quantity} {selectedItem.unit}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Reorder Point</Label>
                <p className="font-medium">{selectedItem.reorderPoint} {selectedItem.unit}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Cost</Label>
                <p className="font-medium">${selectedItem.cost.toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Price</Label>
                <p className="font-medium">${selectedItem.price.toFixed(2)}</p>
              </div>
              {selectedItem.lotNumber && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Lot Number</Label>
                  <p className="font-medium">{selectedItem.lotNumber}</p>
                </div>
              )}
              {selectedItem.expiryDate && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Expiry Date</Label>
                  <p className="font-medium">{new Date(selectedItem.expiryDate).toLocaleDateString()}</p>
                </div>
              )}
              {selectedItem.location && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Location</Label>
                  <p className="font-medium">{selectedItem.location}</p>
                </div>
              )}
              {selectedItem.description && (
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Description</Label>
                  <p className="font-medium">{selectedItem.description}</p>
                </div>
              )}
              {selectedItem.notes && (
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-sm font-medium text-gray-500">Notes</Label>
                  <p className="font-medium">{selectedItem.notes}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedItem && (
              <Button onClick={() => {
                setIsViewDialogOpen(false)
                handleEditItem(selectedItem)
              }}>
                Edit Item
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}