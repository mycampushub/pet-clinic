"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { 
  Calendar, 
  Heart, 
  FileText, 
  CreditCard, 
  Package, 
  BarChart3, 
  Users, 
  Settings,
  Home,
  LogOut,
  Menu,
  X,
  Shield,
  Building2,
  Plug
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TenantClinicSelector } from "@/tenant-clinic-selector"
import { UserRole } from "@prisma/client"

const getNavigationForRole = (role: UserRole) => {
  const baseNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Appointments", href: "/appointments", icon: Calendar },
    { name: "Patients", href: "/patients", icon: Heart },
    { name: "Clinical", href: "/clinical", icon: FileText },
    { name: "Billing", href: "/billing", icon: CreditCard },
    { name: "Inventory", href: "/inventory", icon: Package },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  // Add admin navigation items based on role
  if (role === UserRole.ADMIN) {
    return [
      ...baseNavigation,
      { name: "Tenant Admin", href: "/tenant-admin", icon: Building2 },
      { name: "Integrations", href: "/integrations", icon: Plug },
      { name: "SaaS Admin", href: "/admin", icon: Shield }
    ]
  } else if (role === UserRole.CLINIC_ADMIN) {
    return [
      ...baseNavigation,
      { name: "Tenant Admin", href: "/tenant-admin", icon: Building2 },
      { name: "Integrations", href: "/integrations", icon: Plug }
    ]
  }

  return baseNavigation
}

interface SidebarNavProps {
  className?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = session?.user?.role ? getNavigationForRole(session.user.role as UserRole) : []

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">PetClinic Pro</span>
            </Link>
          </div>

          {/* Tenant & Clinic Selector */}
          <div className="px-4 py-4 border-b">
            <TenantClinicSelector />
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="px-4 py-6 border-t">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {session?.user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.role?.replace('_', ' ') || 'Staff'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="w-full mt-4 justify-start"
              onClick={() => {
                // Handle logout
                window.location.href = '/api/auth/signout'
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}