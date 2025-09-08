export type UserRole = 
  | "RECEPTIONIST"
  | "VETERINARIAN" 
  | "VET_TECH"
  | "PHARMACIST"
  | "MANAGER"
  | "ADMIN"
  | "OWNER"
  | "AUDITOR"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  clinicId?: string
  tenantId: string
  isActive: boolean
  permissions?: string[]
}

export interface Clinic {
  id: string
  tenantId: string
  name: string
  address?: string
  phone?: string
  email?: string
  timezone: string
  hours?: Record<string, { open: string; close: string }>
  settings?: ClinicSettings
  isActive: boolean
}

export interface ClinicSettings {
  appointmentSettings: {
    defaultDuration: number
    allowOnlineBooking: boolean
    requireConfirmation: boolean
  }
  billingSettings: {
    currency: string
    taxRate: number
    autoGenerateInvoices: boolean
  }
  notificationSettings: {
    emailReminders: boolean
    smsReminders: boolean
    appointmentReminders: boolean
  }
}

export interface Tenant {
  id: string
  name: string
  settings?: TenantSettings
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TenantSettings {
  features: {
    telemedicine: boolean
    onlineBooking: boolean
    inventoryManagement: boolean
    reporting: boolean
  }
  branding: {
    logo?: string
    primaryColor?: string
    clinicName?: string
  }
}