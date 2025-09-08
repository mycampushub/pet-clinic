import { db } from './db';

interface HL7Message {
  messageType: string;
  triggerEvent: string;
  messageControlId: string;
  processingId: string;
  versionId: string;
  dateTime: string;
  messageTypeSpecific?: any;
}

interface FHIRResource {
  resourceType: string;
  id: string;
  meta?: {
    versionId: string;
    lastUpdated: string;
    source: string;
  };
  [key: string]: any;
}

interface LabSystemConfig {
  id: string;
  name: string;
  type: 'HL7' | 'FHIR';
  endpoint: string;
  apiKey?: string;
  username?: string;
  password?: string;
  isActive: boolean;
  settings: Record<string, any>;
}

interface LabOrder {
  id: string;
  visitId: string;
  petId: string;
  veterinarianId: string;
  labSystemId: string;
  externalOrderId?: string;
  tests: string[];
  status: 'ORDERED' | 'COLLECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  orderedAt: Date;
  collectedAt?: Date;
  resultsAt?: Date;
  notes?: string;
  priority: 'ROUTINE' | 'STAT' | 'ASAP';
}

interface LabResult {
  id: string;
  labOrderId: string;
  test: string;
  result: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal: boolean;
  notes?: string;
  fileUrl?: string;
  receivedAt: Date;
}

export class LabIntegrationService {
  private labSystems: Map<string, LabSystemConfig> = new Map();

  constructor() {
    this.initializeLabSystems();
  }

  private initializeLabSystems() {
    // Initialize with sample lab system configurations
    const sampleConfigs: LabSystemConfig[] = [
      {
        id: 'labcorp',
        name: 'LabCorp',
        type: 'HL7',
        endpoint: 'https://api.labcorp.com/hl7',
        isActive: true,
        settings: {
          facilityId: 'VET001',
          sendingFacility: 'PETCLINIC',
          receivingFacility: 'LABCORP',
        },
      },
      {
        id: 'quest',
        name: 'Quest Diagnostics',
        type: 'FHIR',
        endpoint: 'https://api.questdiagnostics.com/fhir',
        apiKey: 'sample-api-key',
        isActive: true,
        settings: {
          organizationId: 'pet-clinic-inc',
        },
      },
    ];

    sampleConfigs.forEach(config => {
      this.labSystems.set(config.id, config);
    });
  }

  async sendLabOrder(orderData: {
    visitId: string;
    petId: string;
    veterinarianId: string;
    tests: string[];
    priority: 'ROUTINE' | 'STAT' | 'ASAP';
    notes?: string;
    labSystemId: string;
  }): Promise<LabOrder> {
    const labSystem = this.labSystems.get(orderData.labSystemId);
    if (!labSystem) {
      throw new Error('Lab system not found');
    }

    if (!labSystem.isActive) {
      throw new Error('Lab system is not active');
    }

    // Create lab order in database
    const labOrder = await db.labOrder.create({
      data: {
        visitId: orderData.visitId,
        petId: orderData.petId,
        veterinarianId: orderData.veterinarianId,
        labSystemId: orderData.labSystemId,
        tests: orderData.tests,
        status: 'ORDERED',
        orderedAt: new Date(),
        priority: orderData.priority,
        notes: orderData.notes,
      },
    });

    try {
      // Send order to lab system
      const externalOrderId = await this.sendOrderToLabSystem(labOrder, labSystem);
      
      // Update lab order with external order ID
      await db.labOrder.update({
        where: { id: labOrder.id },
        data: { externalOrderId },
      });

      return { ...labOrder, externalOrderId };
    } catch (error) {
      console.error('Error sending lab order:', error);
      
      // Update order status to failed
      await db.labOrder.update({
        where: { id: labOrder.id },
        data: { status: 'CANCELLED' },
      });

      throw new Error('Failed to send lab order to external system');
    }
  }

  async receiveLabResults(payload: any, labSystemId: string): Promise<void> {
    const labSystem = this.labSystems.get(labSystemId);
    if (!labSystem) {
      throw new Error('Lab system not found');
    }

    try {
      let results: any[];

      if (labSystem.type === 'HL7') {
        results = await this.parseHL7Message(payload);
      } else if (labSystem.type === 'FHIR') {
        results = await this.parseFHIRMessage(payload);
      } else {
        throw new Error('Unsupported lab system type');
      }

      // Process and store results
      for (const result of results) {
        await this.processLabResult(result, labSystemId);
      }
    } catch (error) {
      console.error('Error processing lab results:', error);
      throw new Error('Failed to process lab results');
    }
  }

  async getLabOrders(visitId?: string, petId?: string): Promise<LabOrder[]> {
    const where: any = {};
    
    if (visitId) {
      where.visitId = visitId;
    }
    
    if (petId) {
      where.petId = petId;
    }

    return await db.labOrder.findMany({
      where,
      include: {
        pet: {
          select: { name: true, species: true },
        },
        veterinarian: {
          select: { name: true },
        },
        results: true,
      },
      orderBy: { orderedAt: 'desc' },
    });
  }

  async getLabResults(labOrderId: string): Promise<LabResult[]> {
    return await db.labResult.findMany({
      where: { labOrderId },
      orderBy: { receivedAt: 'asc' },
    });
  }

  async getLabSystems(): Promise<LabSystemConfig[]> {
    return Array.from(this.labSystems.values());
  }

  async configureLabSystem(config: LabSystemConfig): Promise<void> {
    // Validate configuration
    if (!config.name || !config.endpoint) {
      throw new Error('Lab system name and endpoint are required');
    }

    // Test connection
    const isConnected = await this.testLabSystemConnection(config);
    if (!isConnected) {
      throw new Error('Failed to connect to lab system');
    }

    // Store configuration (in a real implementation, this would be saved to database)
    this.labSystems.set(config.id, config);
  }

  private async sendOrderToLabSystem(order: LabOrder, labSystem: LabSystemConfig): Promise<string> {
    if (labSystem.type === 'HL7') {
      return await this.sendHL7Order(order, labSystem);
    } else if (labSystem.type === 'FHIR') {
      return await this.sendFHIROrder(order, labSystem);
    } else {
      throw new Error('Unsupported lab system type');
    }
  }

  private async sendHL7Order(order: LabOrder, labSystem: LabSystemConfig): Promise<string> {
    // Construct HL7 ORM message
    const message = this.constructHL7ORM(order, labSystem);
    
    // Send message to lab system
    const response = await this.sendHL7Message(message, labSystem);
    
    // Extract message control ID from response
    const externalOrderId = this.extractHL7MessageControlId(response);
    
    return externalOrderId;
  }

  private async sendFHIROrder(order: LabOrder, labSystem: LabSystemConfig): Promise<string> {
    // Construct FHIR ServiceRequest resource
    const serviceRequest = this.constructFHIRServiceRequest(order, labSystem);
    
    // Send to FHIR server
    const response = await this.sendFHIRResource(serviceRequest, labSystem);
    
    return response.id;
  }

  private constructHL7ORM(order: LabOrder, labSystem: LabSystemConfig): string {
    // Simplified HL7 ORM message construction
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const messageControlId = `MSG${Date.now()}`;
    
    // This is a simplified HL7 message structure
    // In a real implementation, you would use a proper HL7 library
    const message = `MSH|^~\\&|${labSystem.settings.sendingFacility}|${labSystem.settings.facilityId}|${labSystem.settings.receivingFacility}|LABCORP|${timestamp}||ORM^O01|${messageControlId}|P|2.5||||||UNICODE
PID|||${order.petId}||${order.petName}^^^||${order.petSpecies}|||${order.petBreed}|||||||||||
PV1|||OUTPATIENT|||||${order.veterinarianId}^^^${order.veterinarianName}|||||||||||||||||||||||||||||||||
ORC|${order.priority === 'STAT' ? 'STAT' : 'ROUTINE'}|${order.id}||${order.externalOrderId || ''}||||${order.orderedAt.toISOString().slice(0, 14)}||||||${order.veterinarianId}^^^${order.veterinarianName}|||||||||
OBR|1|${order.id}||${order.tests.join('^')}||${order.orderedAt.toISOString().slice(0, 14)}||||${order.veterinarianId}^^^${order.veterinarianName}|||||${order.priority === 'STAT' ? 'STAT' : 'ROUTINE'}|||||||||||||||||||`;

    return message;
  }

  private constructFHIRServiceRequest(order: LabOrder, labSystem: LabSystemConfig): FHIRResource {
    return {
      resourceType: 'ServiceRequest',
      id: order.id,
      meta: {
        versionId: '1',
        lastUpdated: new Date().toISOString(),
        source: labSystem.name,
      },
      status: 'active',
      intent: 'order',
      category: [{
        coding: [{
          system: 'http://snomed.info/sct',
          code: '108252007',
          display: 'Laboratory procedure',
        }],
      }],
      priority: order.priority.toLowerCase(),
      code: {
        coding: order.tests.map(test => ({
          system: 'http://loinc.org',
          code: test,
          display: test,
        })),
      },
      subject: {
        reference: `Patient/${order.petId}`,
      },
      requester: {
        reference: `Practitioner/${order.veterinarianId}`,
      },
      authoredOn: order.orderedAt.toISOString(),
      note: order.notes ? [{
        text: order.notes,
      }] : [],
    };
  }

  // TODO: Fix this method - currently causing parsing errors
  /*
  private async sendHL7Message(message: string, labSystem: LabSystemConfig): Promise<string> {
    // In a real implementation, this would send the HL7 message via MLLP or HTTP
    console.log(`Sending HL7 message to ${labSystem.name}:`, message);
    
    // Simulate response
    return `MSH|^~\\&|LABCORP|LAB|${labSystem.settings.sendingFacility}|${labSystem.settings.facilityId}|${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14)}||ACK^O01|ACK${Date.now()}|P|2.5` +
           `MSA|AA|${message.match(/MSH.*\|([^\|]*)\|/)?.[1]||`;
  }
  */

  private async sendFHIRResource(resource: FHIRResource, labSystem: LabSystemConfig): Promise<FHIRResource> {
    // In a real implementation, this would send the FHIR resource to the FHIR server
    console.log(`Sending FHIR resource to ${labSystem.name}:`, resource);
    
    // Simulate response
    return {
      ...resource,
      meta: {
        ...resource.meta,
        versionId: '2',
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  private async parseHL7Message(message: string): Promise<any[]> {
    // In a real implementation, this would parse the HL7 message using a proper HL7 parser
    console.log('Parsing HL7 message:', message);
    
    // Simulate parsed results
    return [
      {
        orderId: 'sample-order-id',
        results: [
          {
            test: 'CBC',
            result: '12.5',
            unit: 'g/dL',
            referenceRange: '12.0-16.0',
            isAbnormal: false,
          },
        ],
      },
    ];
  }

  private async parseFHIRMessage(message: any): Promise<any[]> {
    // In a real implementation, this would parse the FHIR message
    console.log('Parsing FHIR message:', message);
    
    // Simulate parsed results
    return [
      {
        orderId: 'sample-order-id',
        results: [
          {
            test: 'CHEM20',
            result: 'Normal',
            isAbnormal: false,
          },
        ],
      },
    ];
  }

  private async processLabResult(result: any, labSystemId: string): Promise<void> {
    // Find the corresponding lab order
    const labOrder = await db.labOrder.findFirst({
      where: {
        OR: [
          { externalOrderId: result.orderId },
          { id: result.orderId },
        ],
        labSystemId,
      },
    });

    if (!labOrder) {
      console.warn(`Lab order not found for result: ${result.orderId}`);
      return;
    }

    // Update lab order status
    await db.labOrder.update({
      where: { id: labOrder.id },
      data: {
        status: 'COMPLETED',
        resultsAt: new Date(),
      },
    });

    // Store individual results
    for (const testResult of result.results) {
      await db.labResult.create({
        data: {
          labOrderId: labOrder.id,
          test: testResult.test,
          result: testResult.result,
          unit: testResult.unit,
          referenceRange: testResult.referenceRange,
          isAbnormal: testResult.isAbnormal || false,
          notes: testResult.notes,
          receivedAt: new Date(),
        },
      });
    }
  }

  private extractHL7MessageControlId(message: string): string {
    // Extract message control ID from HL7 ACK message
    const match = message.match(/MSA\|AA\|([^\|]*)/);
    return match ? match[1] : '';
  }

  private async testLabSystemConnection(config: LabSystemConfig): Promise<boolean> {
    // In a real implementation, this would test the actual connection
    console.log(`Testing connection to ${config.name} at ${config.endpoint}`);
    
    // Simulate successful connection
    return true;
  }

  // Additional utility methods
  async getCommonLabTests(): Promise<Array<{ code: string; name: string; description: string }>> {
    return [
      { code: 'CBC', name: 'Complete Blood Count', description: 'Comprehensive blood cell analysis' },
      { code: 'CHEM20', name: 'Chemistry Panel', description: '20-panel chemistry screen' },
      { code: 'T4', name: 'Thyroid Test', description: 'Thyroid hormone level' },
      { code: 'URINE', name: 'Urinalysis', description: 'Complete urine analysis' },
      { code: 'FELV', name: 'Feline Leukemia', description: 'Feline leukemia virus test' },
      { code: 'FIV', name: 'Feline Immunodeficiency', description: 'Feline immunodeficiency virus test' },
      { code: 'HEARTWORM', name: 'Heartworm Test', description: 'Canine heartworm antigen test' },
      { code: 'LYME', name: 'Lyme Disease', description: 'Lyme disease antibody test' },
    ];
  }

  async validateLabTests(tests: string[]): Promise<{ valid: string[]; invalid: string[] }> {
    const commonTests = await this.getCommonLabTests();
    const validTestCodes = new Set(commonTests.map(test => test.code));
    
    const valid = tests.filter(test => validTestCodes.has(test));
    const invalid = tests.filter(test => !validTestCodes.has(test));
    
    return { valid, invalid };
  }
}

export const labIntegrationService = new LabIntegrationService();