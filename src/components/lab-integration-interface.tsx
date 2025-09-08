'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  FlaskConical, 
  Send, 
  Download, 
  Upload, 
  Settings,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  ExternalLink
} from 'lucide-react';

interface LabOrder {
  id: string;
  petName: string;
  petSpecies: string;
  veterinarianName: string;
  tests: string[];
  status: 'ORDERED' | 'COLLECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  orderedAt: string;
  collectedAt?: string;
  resultsAt?: string;
  priority: 'ROUTINE' | 'STAT' | 'ASAP';
  notes?: string;
  labSystemName: string;
}

interface LabResult {
  id: string;
  test: string;
  result: string;
  unit?: string;
  reference?: string;
  isAbnormal: boolean;
  notes?: string;
  receivedAt: string;
}

interface LabSystem {
  id: string;
  name: string;
  type: 'HL7' | 'FHIR';
  endpoint: string;
  isActive: boolean;
}

interface LabIntegrationInterfaceProps {
  visitId?: string;
  petId?: string;
}

export function LabIntegrationInterface({ visitId, petId }: LabIntegrationInterfaceProps) {
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [priority, setPriority] = useState<'ROUTINE' | 'STAT' | 'ASAP'>('ROUTINE');
  const [notes, setNotes] = useState('');
  const [selectedLabSystem, setSelectedLabSystem] = useState<string>('');
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [labSystems, setLabSystems] = useState<LabSystem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sample data
  const commonTests = [
    { code: 'CBC', name: 'Complete Blood Count', description: 'Comprehensive blood cell analysis' },
    { code: 'CHEM20', name: 'Chemistry Panel', description: '20-panel chemistry screen' },
    { code: 'T4', name: 'Thyroid Test', description: 'Thyroid hormone level' },
    { code: 'URINE', name: 'Urinalysis', description: 'Complete urine analysis' },
    { code: 'FELV', name: 'Feline Leukemia', description: 'Feline leukemia virus test' },
    { code: 'FIV', name: 'Feline Immunodeficiency', description: 'Feline immunodeficiency virus test' },
    { code: 'HEARTWORM', name: 'Heartworm Test', description: 'Canine heartworm antigen test' },
    { code: 'LYME', name: 'Lyme Disease', description: 'Lyme disease antibody test' },
  ];

  useEffect(() => {
    // Load sample data
    setLabOrders([
      {
        id: '1',
        petName: 'Rex',
        petSpecies: 'Dog',
        veterinarianName: 'Dr. Sarah Johnson',
        tests: ['CBC', 'CHEM20'],
        status: 'COMPLETED',
        orderedAt: '2024-12-10T10:00:00Z',
        resultsAt: '2024-12-11T15:30:00Z',
        priority: 'ROUTINE',
        labSystemName: 'LabCorp',
      },
      {
        id: '2',
        petName: 'Whiskers',
        petSpecies: 'Cat',
        veterinarianName: 'Dr. Michael Chen',
        tests: ['FELV', 'FIV'],
        status: 'IN_PROGRESS',
        orderedAt: '2024-12-12T14:00:00Z',
        collectedAt: '2024-12-12T14:30:00Z',
        priority: 'ASAP',
        notes: 'Patient showing symptoms of lethargy',
        labSystemName: 'Quest Diagnostics',
      },
    ]);

    setLabResults([
      {
        id: '1',
        test: 'CBC',
        result: '12.5',
        unit: 'g/dL',
        reference: '12.0-16.0',
        isAbnormal: false,
        receivedAt: '2024-12-11T15:30:00Z',
      },
      {
        id: '2',
        test: 'CHEM20',
        result: 'Normal',
        isAbnormal: false,
        receivedAt: '2024-12-11T15:30:00Z',
      },
    ]);

    setLabSystems([
      {
        id: 'labcorp',
        name: 'LabCorp',
        type: 'HL7',
        endpoint: 'https://api.labcorp.com/hl7',
        isActive: true,
      },
      {
        id: 'quest',
        name: 'Quest Diagnostics',
        type: 'FHIR',
        endpoint: 'https://api.questdiagnostics.com/fhir',
        isActive: true,
      },
    ]);

    setSelectedLabSystem('labcorp');
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ORDERED': return 'bg-blue-100 text-blue-800';
      case 'COLLECTED': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleTestToggle = (testCode: string) => {
    setSelectedTests(prev => 
      prev.includes(testCode) 
        ? prev.filter(code => code !== testCode)
        : [...prev, testCode]
    );
  };

  const handleSendOrder = async () => {
    if (selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }

    if (!selectedLabSystem) {
      alert('Please select a lab system');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Lab order sent successfully!');
      
      // Reset form
      setSelectedTests([]);
      setNotes('');
      setPriority('ROUTINE');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lab Integration</h1>
          <p className="text-muted-foreground">
            Manage laboratory orders and results with HL7/FHIR connectivity
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Lab Orders</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="systems">Lab Systems</TabsTrigger>
          <TabsTrigger value="new">New Order</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lab Orders</CardTitle>
                  <CardDescription>Track and manage laboratory orders</CardDescription>
                </div>
                <Button onClick={() => setActiveTab('new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {labOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FlaskConical className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">
                          {order.petName} ({order.petSpecies})
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.tests.join(', ')} • Dr. {order.veterinarianName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.labSystemName} • Priority: {order.priority}
                        </div>
                        {order.notes && (
                          <div className="text-sm text-gray-500 mt-1">{order.notes}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                      {order.status === 'COMPLETED' && (
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-2" />
                          View Results
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>
                ))}

                {labOrders.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No lab orders found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lab Results</CardTitle>
              <CardDescription>View and manage laboratory test results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {labResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${result.isAbnormal ? 'bg-red-100' : 'bg-green-100'}`}>
                        {result.isAbnormal ? (
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        ) : (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{result.test}</div>
                        <div className="text-sm text-gray-600">
                          Result: {result.result} {result.unit && `(${result.unit})`}
                        </div>
                        {result.reference && (
                          <div className="text-sm text-gray-500">
                            Reference: {result.reference}
                          </div>
                        )}
                        <div className="text-xs text-gray-500">
                          Received: {new Date(result.receivedAt).toLocaleDateString()}
                        </div>
                        {result.notes && (
                          <div className="text-sm text-gray-500 mt-1">{result.notes}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {result.isAbnormal && (
                        <Badge variant="destructive">
                          Abnormal
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}

                {labResults.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No lab results available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="systems" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lab Systems</CardTitle>
                  <CardDescription>Configure and manage laboratory system integrations</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add System
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {labSystems.map((system) => (
                  <div key={system.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FlaskConical className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{system.name}</div>
                        <div className="text-sm text-gray-600">
                          {system.type} • {system.endpoint}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={system.isActive ? 'default' : 'secondary'}>
                        {system.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                      <Button variant="outline" size="sm">
                        Test Connection
                      </Button>
                    </div>
                  </div>
                ))}

                {labSystems.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No lab systems configured
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>New Lab Order</CardTitle>
              <CardDescription>Create and send a new laboratory order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Lab System Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Lab System</label>
                <Select value={selectedLabSystem} onValueChange={setSelectedLabSystem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lab system" />
                  </SelectTrigger>
                  <SelectContent>
                    {labSystems.map((system) => (
                      <SelectItem key={system.id} value={system.id}>
                        {system.name} ({system.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={priority} onValueChange={(value: 'ROUTINE' | 'STAT' | 'ASAP') => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROUTINE">Routine</SelectItem>
                    <SelectItem value="STAT">Stat</SelectItem>
                    <SelectItem value="ASAP">ASAP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Test Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tests</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {commonTests.map((test) => (
                    <div key={test.code} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <input
                        type="checkbox"
                        id={test.code}
                        checked={selectedTests.includes(test.code)}
                        onChange={() => handleTestToggle(test.code)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor={test.code} className="text-sm font-medium cursor-pointer">
                          {test.name}
                        </label>
                        <p className="text-xs text-muted-foreground">{test.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  placeholder="Additional notes for the laboratory..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Lab System:</span>
                      <span className="text-sm font-medium">
                        {labSystems.find(s => s.id === selectedLabSystem)?.name || 'Not selected'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Priority:</span>
                      <span className="text-sm font-medium">{priority}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Tests Selected:</span>
                      <span className="text-sm font-medium">{selectedTests.length}</span>
                    </div>
                    {selectedTests.length > 0 && (
                      <div>
                        <span className="text-sm">Tests:</span>
                        <div className="text-sm text-muted-foreground mt-1">
                          {selectedTests.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Send Order Button */}
              <div className="flex justify-end">
                <Button 
                  onClick={handleSendOrder} 
                  disabled={isLoading || selectedTests.length === 0 || !selectedLabSystem}
                >
                  {isLoading ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Order
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}