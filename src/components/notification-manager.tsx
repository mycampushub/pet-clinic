'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Mail, 
  MessageSquare, 
  Bell, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Clock,
  Search
} from 'lucide-react';

interface NotificationLog {
  id: string;
  type: 'EMAIL' | 'SMS' | 'PUSH';
  recipient: string;
  subject?: string;
  message: string;
  status: 'SENT' | 'FAILED' | 'PENDING';
  error?: string;
  createdAt: string;
}

export function NotificationManager() {
  const [activeTab, setActiveTab] = useState('send');
  const [notificationType, setNotificationType] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample notification logs
  const notificationLogs: NotificationLog[] = [
    {
      id: '1',
      type: 'EMAIL',
      recipient: 'john.doe@email.com',
      subject: 'Appointment Confirmation',
      message: 'Your appointment for Rex has been confirmed...',
      status: 'SENT',
      createdAt: '2024-12-15T10:30:00Z',
    },
    {
      id: '2',
      type: 'SMS',
      recipient: '+1234567890',
      message: 'Appointment reminder for Rex tomorrow at 2:00 PM...',
      status: 'SENT',
      createdAt: '2024-12-14T15:45:00Z',
    },
    {
      id: '3',
      type: 'EMAIL',
      recipient: 'jane.smith@email.com',
      subject: 'Vaccination Reminder',
      message: 'Fluffy is due for annual vaccination...',
      status: 'FAILED',
      error: 'SMTP connection failed',
      createdAt: '2024-12-14T09:15:00Z',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SENT': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'EMAIL': return <Mail className="h-4 w-4" />;
      case 'SMS': return <MessageSquare className="h-4 w-4" />;
      case 'PUSH': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const handleSendNotification = async () => {
    if (!recipient || !message) {
      alert('Recipient and message are required');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipient,
          subject: notificationType === 'EMAIL' ? subject : undefined,
          message,
          type: notificationType,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Notification sent successfully!');
        // Reset form
        setRecipient('');
        setSubject('');
        setMessage('');
      } else {
        alert(`Failed to send notification: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification');
    } finally {
      setIsSending(false);
    }
  };

  const filteredLogs = notificationLogs.filter(log =>
    log.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (log.subject && log.subject.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notification Manager</h1>
          <p className="text-muted-foreground">
            Send and manage email/SMS notifications
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">Send Notification</TabsTrigger>
          <TabsTrigger value="logs">Notification Logs</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send New Notification</CardTitle>
              <CardDescription>
                Send email or SMS notifications to pet owners
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notification Type</label>
                  <Select value={notificationType} onValueChange={(value: 'EMAIL' | 'SMS') => setNotificationType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EMAIL">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email
                        </div>
                      </SelectItem>
                      <SelectItem value="SMS">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          SMS
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient</label>
                  <Input
                    placeholder={notificationType === 'EMAIL' ? 'email@example.com' : '+1234567890'}
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>
              </div>

              {notificationType === 'EMAIL' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="Notification subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Enter your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSendNotification} disabled={isSending}>
                  {isSending ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Notification
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Logs</CardTitle>
              <CardDescription>
                View history of sent notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mt-1">
                      {getTypeIcon(log.type)}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{log.recipient}</span>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status === 'SENT' && <CheckCircle className="w-3 h-3 mr-1" />}
                          {log.status === 'FAILED' && <XCircle className="w-3 h-3 mr-1" />}
                          {log.status}
                        </Badge>
                      </div>
                      
                      {log.subject && (
                        <div className="text-sm font-medium">{log.subject}</div>
                      )}
                      
                      <div className="text-sm text-muted-foreground">
                        {log.message.length > 100 
                          ? `${log.message.substring(0, 100)}...` 
                          : log.message}
                      </div>
                      
                      {log.error && (
                        <div className="text-sm text-red-600">
                          Error: {log.error}
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No notifications found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Templates</CardTitle>
              <CardDescription>
                Manage email and SMS templates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Appointment Confirmation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> Email & SMS</div>
                      <div><strong>Triggers:</strong> When appointment is confirmed</div>
                      <div><strong>Variables:</strong> Owner name, pet name, date, time, clinic info</div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4">
                      Edit Template
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Appointment Reminder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> Email & SMS</div>
                      <div><strong>Triggers:</strong> 24 hours before appointment</div>
                      <div><strong>Variables:</strong> Owner name, pet name, date, time, clinic info</div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4">
                      Edit Template
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vaccination Reminder</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> Email & SMS</div>
                      <div><strong>Triggers:</strong> When vaccination is due</div>
                      <div><strong>Variables:</strong> Owner name, pet name, due date, clinic info</div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4">
                      Edit Template
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Custom Template</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Type:</strong> Email & SMS</div>
                      <div><strong>Triggers:</strong> Manual</div>
                      <div><strong>Variables:</strong> Customizable</div>
                    </div>
                    <Button variant="outline" size="sm" className="mt-4">
                      Create Template
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}