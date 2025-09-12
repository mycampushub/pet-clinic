"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Plug, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink, 
  Plus,
  Trash2,
  RefreshCw,
  Shield,
  Database,
  MessageSquare,
  Calendar,
  CreditCard,
  FileText,
  BarChart3
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Integration {
  id: string
  name: string
  category: string
  description: string
  status: 'connected' | 'disconnected' | 'error'
  connectedAt?: string
  lastSync?: string
  settings: Record<string, any>
}

const availableIntegrations: Integration[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'Payment',
    description: 'Accept online payments and manage subscriptions',
    status: 'disconnected',
    settings: {}
  },
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    category: 'Accounting',
    description: 'Sync financial data and manage accounting',
    status: 'disconnected',
    settings: {}
  },
  {
    id: 'twilio',
    name: 'Twilio',
    category: 'Communication',
    description: 'Send SMS reminders and notifications',
    status: 'disconnected',
    settings: {}
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    category: 'Scheduling',
    description: 'Sync appointments with Google Calendar',
    status: 'disconnected',
    settings: {}
  },
  {
    id: 'idexx',
    name: 'IDEXX',
    category: 'Laboratory',
    description: 'Connect to IDEXX laboratory services',
    status: 'disconnected',
    settings: {}
  },
  {
    id: 'antech',
    name: 'Antech',
    category: 'Laboratory',
    description: 'Connect to Antech laboratory services',
    status: 'disconnected',
    settings: {}
  },
  {
    id: 'vetstreet',
    name: 'Vetstreet',
    category: 'Marketing',
    description: 'Online presence and client engagement',
    status: 'disconnected',
    settings: {}
  },
  {
    id: 'weave',
    name: 'Weave',
    category: 'Communication',
    description: 'Practice management and communication platform',
    status: 'disconnected',
    settings: {}
  }
]

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState("available")
  const [integrations, setIntegrations] = useState<Integration[]>(availableIntegrations)
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleConnect = async (integration: Integration) => {
    setIsConnecting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integration.id 
            ? { 
                ...int, 
                status: 'connected' as const,
                connectedAt: new Date().toISOString(),
                lastSync: new Date().toISOString()
              }
            : int
        )
      )
      
      toast({
        title: "Integration Connected",
        description: `${integration.name} has been successfully connected to your clinic.`,
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: `Failed to connect ${integration.name}. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async (integration: Integration) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integration.id 
            ? { 
                ...int, 
                status: 'disconnected' as const,
                connectedAt: undefined,
                lastSync: undefined
              }
            : int
        )
      )
      
      toast({
        title: "Integration Disconnected",
        description: `${integration.name} has been disconnected from your clinic.`,
      })
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: `Failed to disconnect ${integration.name}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const handleSync = async (integration: Integration) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setIntegrations(prev => 
        prev.map(int => 
          int.id === integration.id 
            ? { ...int, lastSync: new Date().toISOString() }
            : int
        )
      )
      
      toast({
        title: "Sync Complete",
        description: `${integration.name} data has been synchronized.`,
      })
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: `Failed to sync ${integration.name} data. Please try again.`,
        variant: "destructive",
      })
    }
  }

  const connectedIntegrations = integrations.filter(int => int.status === 'connected')
  const availableIntegrationsList = integrations.filter(int => int.status === 'disconnected')

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Payment':
        return <CreditCard className="h-5 w-5" />
      case 'Accounting':
        return <BarChart3 className="h-5 w-5" />
      case 'Communication':
        return <MessageSquare className="h-5 w-5" />
      case 'Scheduling':
        return <Calendar className="h-5 w-5" />
      case 'Laboratory':
        return <Database className="h-5 w-5" />
      case 'Marketing':
        return <FileText className="h-5 w-5" />
      default:
        return <Plug className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
      case 'disconnected':
        return <Badge variant="secondary">Disconnected</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Plug className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
              <p className="text-gray-600">Connect your clinic with third-party tools and services</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Plug className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Integrations</p>
                  <p className="text-2xl font-bold text-gray-900">{integrations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected</p>
                  <p className="text-2xl font-bold text-gray-900">{connectedIntegrations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-gray-900">{availableIntegrationsList.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { name: 'Payment Processing', icon: CreditCard, count: 1, color: 'bg-blue-100 text-blue-600' },
            { name: 'Accounting', icon: BarChart3, count: 1, color: 'bg-green-100 text-green-600' },
            { name: 'Communication', icon: MessageSquare, count: 2, color: 'bg-purple-100 text-purple-600' },
            { name: 'Scheduling', icon: Calendar, count: 1, color: 'bg-orange-100 text-orange-600' },
            { name: 'Laboratory', icon: Database, count: 2, color: 'bg-red-100 text-red-600' },
            { name: 'Marketing', icon: FileText, count: 1, color: 'bg-indigo-100 text-indigo-600' },
          ].map((category, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.count} integration{category.count !== 1 ? 's' : ''}</p>
                  </div>
                  <ExternalLink className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Integrations</CardTitle>
            <CardDescription>
              Connect and configure third-party services to extend your clinic's functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="available">Available Integrations</TabsTrigger>
                <TabsTrigger value="connected">Connected Integrations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="available" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableIntegrationsList.map((integration) => (
                    <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getCategoryIcon(integration.category)}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <CardDescription className="text-xs">{integration.category}</CardDescription>
                            </div>
                          </div>
                          {getStatusBadge(integration.status)}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600 mb-4">{integration.description}</p>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleConnect(integration)}
                            disabled={isConnecting}
                          >
                            {isConnecting ? (
                              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Plus className="h-4 w-4 mr-2" />
                            )}
                            Connect
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedIntegration(integration)
                              setShowSettings(true)
                            }}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="connected" className="space-y-4">
                {connectedIntegrations.length === 0 ? (
                  <div className="text-center py-12">
                    <Plug className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Connected Integrations</h3>
                    <p className="text-gray-600 mb-4">Connect third-party services to extend your clinic's functionality</p>
                    <Button onClick={() => setActiveTab("available")}>
                      Browse Integrations
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {connectedIntegrations.map((integration) => (
                      <Card key={integration.id} className="border-green-200 bg-green-50">
                        <CardHeader className="pb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                {getCategoryIcon(integration.category)}
                              </div>
                              <div>
                                <CardTitle className="text-lg">{integration.name}</CardTitle>
                                <CardDescription className="text-xs">{integration.category}</CardDescription>
                              </div>
                            </div>
                            {getStatusBadge(integration.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-3 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Connected:</span>
                              <span className="font-medium">
                                {integration.connectedAt ? new Date(integration.connectedAt).toLocaleDateString() : 'Unknown'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Last Sync:</span>
                              <span className="font-medium">
                                {integration.lastSync ? new Date(integration.lastSync).toLocaleDateString() : 'Never'}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleSync(integration)}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Sync
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedIntegration(integration)
                                setShowSettings(true)
                              }}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDisconnect(integration)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}