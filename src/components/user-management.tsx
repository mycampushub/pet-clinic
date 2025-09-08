"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  UserPlus,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react"
import { useAuth, UserRole } from "@/lib/auth-context"

interface ClinicUser {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
}

interface CreateUserData {
  name: string
  email: string
  phone?: string
  role: UserRole
}

export function UserManagement() {
  const { user: currentUser, clinic, updateUserRole, hasPermission } = useAuth()
  const [users, setUsers] = useState<ClinicUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<ClinicUser[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<ClinicUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    phone: "",
    role: "RECEPTIONIST"
  })

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockUsers: ClinicUser[] = [
      {
        id: "1",
        name: "Dr. Sarah Johnson",
        email: "sarah@vetclinic.com",
        phone: "(555) 123-4567",
        role: "VETERINARIAN",
        isActive: true,
        lastLogin: new Date("2024-12-15T09:30:00"),
        createdAt: new Date("2024-01-15")
      },
      {
        id: "2",
        name: "Mike Chen",
        email: "mike@vetclinic.com",
        phone: "(555) 234-5678",
        role: "RECEPTIONIST",
        isActive: true,
        lastLogin: new Date("2024-12-15T08:15:00"),
        createdAt: new Date("2024-02-20")
      },
      {
        id: "3",
        name: "Emily Davis",
        email: "emily@vetclinic.com",
        phone: "(555) 345-6789",
        role: "VET_TECH",
        isActive: true,
        lastLogin: new Date("2024-12-14T16:45:00"),
        createdAt: new Date("2024-03-10")
      },
      {
        id: "4",
        name: "Dr. James Wilson",
        email: "james@vetclinic.com",
        phone: "(555) 456-7890",
        role: "VETERINARIAN",
        isActive: false,
        lastLogin: new Date("2024-12-10T14:20:00"),
        createdAt: new Date("2024-01-20")
      }
    ]
    setUsers(mockUsers)
    setFilteredUsers(mockUsers)
  }, [])

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [users, searchTerm])

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      RECEPTIONIST: "bg-blue-100 text-blue-800",
      VETERINARIAN: "bg-green-100 text-green-800",
      VET_TECH: "bg-purple-100 text-purple-800",
      PHARMACIST: "bg-orange-100 text-orange-800",
      MANAGER: "bg-red-100 text-red-800",
      ADMIN: "bg-gray-100 text-gray-800",
      CLINIC_OWNER: "bg-indigo-100 text-indigo-800"
    }
    return colors[role] || "bg-gray-100 text-gray-800"
  }

  const handleCreateUser = async () => {
    if (!hasPermission("manage_users")) {
      setMessage({ type: "error", text: "You don't have permission to create users." })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newUser: ClinicUser = {
        id: `user-${Date.now()}`,
        ...formData,
        isActive: true,
        createdAt: new Date()
      }

      setUsers(prev => [...prev, newUser])
      setFormData({ name: "", email: "", phone: "", role: "RECEPTIONIST" })
      setIsDialogOpen(false)
      setMessage({ type: "success", text: "User created successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to create user." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    if (!hasPermission("manage_users")) {
      setMessage({ type: "error", text: "You don't have permission to update user roles." })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ))
      
      setMessage({ type: "success", text: "User role updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update user role." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId: string, isActive: boolean) => {
    if (!hasPermission("manage_users")) {
      setMessage({ type: "error", text: "You don't have permission to manage users." })
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, isActive } : user
      ))
      
      setMessage({ 
        type: "success", 
        text: `User ${isActive ? 'activated' : 'deactivated'} successfully!` 
      })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update user status." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditUser = (user: ClinicUser) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    })
    setIsDialogOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!editingUser || !hasPermission("manage_users")) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ))
      
      setIsDialogOpen(false)
      setEditingUser(null)
      setFormData({ name: "", email: "", phone: "", role: "RECEPTIONIST" })
      setMessage({ type: "success", text: "User updated successfully!" })
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update user." })
    } finally {
      setIsLoading(false)
    }
  }

  const openDialog = () => {
    setEditingUser(null)
    setFormData({ name: "", email: "", phone: "", role: "RECEPTIONIST" })
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingUser(null)
    setFormData({ name: "", email: "", phone: "", role: "RECEPTIONIST" })
  }

  if (!hasPermission("manage_users")) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600">
              You don't have permission to access user management. Please contact your administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage users and roles for {clinic?.name}
          </p>
        </div>
        <Button onClick={openDialog}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              {users.filter(u => u.isActive).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Veterinarians</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.role === "VETERINARIAN").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Medical staff
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => ["RECEPTIONIST", "VET_TECH", "PHARMACIST"].includes(u.role)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Reception, techs, pharmacy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Management</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => ["MANAGER", "ADMIN", "CLINIC_OWNER"].includes(u.role)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Admin users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage user roles and permissions for your clinic
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <span className="text-sm font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value: UserRole) => handleUpdateUserRole(user.id, value)}
                      disabled={isLoading || user.id === currentUser?.id}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                        <SelectItem value="VETERINARIAN">Veterinarian</SelectItem>
                        <SelectItem value="VET_TECH">Vet Tech</SelectItem>
                        <SelectItem value="PHARMACIST">Pharmacist</SelectItem>
                        <SelectItem value="MANAGER">Manager</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="CLINIC_OWNER">Clinic Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${
                        user.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <Badge variant={user.isActive ? "default" : "secondary"}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <div className="text-sm">
                        <div>{user.lastLogin.toLocaleDateString()}</div>
                        <div className="text-muted-foreground">
                          {user.lastLogin.toLocaleTimeString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleUserStatus(user.id, !user.isActive)}
                        disabled={isLoading || user.id === currentUser?.id}
                      >
                        {user.isActive ? (
                          <XCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
            <DialogDescription>
              {editingUser 
                ? "Update user information and role."
                : "Create a new user account for your clinic."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full Name *
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter full name"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                disabled={!!editingUser}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role *
              </label>
              <Select value={formData.role} onValueChange={(value: UserRole) => 
                setFormData(prev => ({ ...prev, role: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RECEPTIONIST">Receptionist</SelectItem>
                  <SelectItem value="VETERINARIAN">Veterinarian</SelectItem>
                  <SelectItem value="VET_TECH">Veterinary Technician</SelectItem>
                  <SelectItem value="PHARMACIST">Pharmacist</SelectItem>
                  <SelectItem value="MANAGER">Manager</SelectItem>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                  <SelectItem value="CLINIC_OWNER">Clinic Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button 
                onClick={editingUser ? handleUpdateUser : handleCreateUser}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : editingUser ? "Update User" : "Create User"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}