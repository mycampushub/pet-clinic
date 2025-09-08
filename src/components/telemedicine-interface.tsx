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
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  FileText,
  Plus,
  CheckCircle,
  XCircle,
  Pause,
  Play
} from 'lucide-react';

interface VideoConsultation {
  id: string;
  appointmentId: string;
  petName: string;
  ownerName: string;
  veterinarianName: string;
  scheduledAt: string;
  duration: number;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  roomUrl?: string;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
}

interface TelemedicineInterfaceProps {
  consultation?: VideoConsultation;
  onJoinConsultation?: (consultationId: string) => void;
  onStartConsultation?: (consultationId: string) => void;
  onEndConsultation?: (consultationId: string, data: any) => void;
  onCancelConsultation?: (consultationId: string) => void;
}

export function TelemedicineInterface({
  consultation,
  onJoinConsultation,
  onStartConsultation,
  onEndConsultation,
  onCancelConsultation,
}: TelemedicineInterfaceProps) {
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [prescription, setPrescription] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleJoinCall = () => {
    if (consultation) {
      setIsInCall(true);
      onJoinConsultation?.(consultation.id);
    }
  };

  const handleStartCall = () => {
    if (consultation) {
      setIsInCall(true);
      onStartConsultation?.(consultation.id);
    }
  };

  const handleEndCall = () => {
    if (consultation) {
      setIsInCall(false);
      onEndConsultation?.(consultation.id, {
        notes,
        diagnosis,
        treatment,
        prescription,
      });
    }
  };

  const handleCancelConsultation = () => {
    if (consultation) {
      onCancelConsultation?.(consultation.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-green-100 text-green-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!consultation) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Telemedicine Consultation</CardTitle>
          <CardDescription>No consultation selected</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please select a consultation to view details.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Consultation Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Video Consultation
              </CardTitle>
              <CardDescription>
                {consultation.petName} with Dr. {consultation.veterinarianName}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(consultation.status)}>
                {consultation.status}
              </Badge>
              {consultation.status === 'SCHEDULED' && (
                <Button variant="outline" size="sm" onClick={handleCancelConsultation}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{new Date(consultation.scheduledAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{new Date(consultation.scheduledAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{consultation.duration} minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Call Interface */}
      {isInCall ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Video Area */}
              <div className="relative bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Video Call in Progress</p>
                  <p className="text-sm opacity-75">{formatDuration(callDuration)}</p>
                </div>
                
                {/* Call Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                  >
                    {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                  >
                    {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={handleEndCall}
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Consultation Notes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Consultation Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Notes</label>
                      <Textarea
                        placeholder="Enter consultation notes..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Diagnosis</label>
                      <Textarea
                        placeholder="Enter diagnosis..."
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Treatment Plan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Treatment</label>
                      <Textarea
                        placeholder="Enter treatment plan..."
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Prescription</label>
                      <Textarea
                        placeholder="Enter prescription details..."
                        value={prescription}
                        onChange={(e) => setPrescription(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Join Video Consultation</CardTitle>
            <CardDescription>
              Click the button below to join the video consultation room
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Ready to join</span>
              </div>
              <p className="text-sm text-blue-700">
                The video consultation room is ready. Make sure you have a stable internet connection and your camera/microphone are working properly.
              </p>
            </div>

            <div className="flex gap-4">
              {consultation.status === 'SCHEDULED' && (
                <Button onClick={handleJoinCall} className="flex-1">
                  <Video className="h-4 w-4 mr-2" />
                  Join Consultation
                </Button>
              )}
              {consultation.status === 'IN_PROGRESS' && (
                <Button onClick={handleJoinCall} className="flex-1">
                  <Video className="h-4 w-4 mr-2" />
                  Rejoin Consultation
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consultation Details */}
      <Card>
        <CardHeader>
          <CardTitle>Consultation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Pet Name</label>
                  <p className="text-sm text-muted-foreground">{consultation.petName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Owner</label>
                  <p className="text-sm text-muted-foreground">{consultation.ownerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Veterinarian</label>
                  <p className="text-sm text-muted-foreground">Dr. {consultation.veterinarianName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Duration</label>
                  <p className="text-sm text-muted-foreground">{consultation.duration} minutes</p>
                </div>
              </div>

              {consultation.notes && (
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <p className="text-sm text-muted-foreground mt-1">{consultation.notes}</p>
                </div>
              )}

              {consultation.diagnosis && (
                <div>
                  <label className="text-sm font-medium">Diagnosis</label>
                  <p className="text-sm text-muted-foreground mt-1">{consultation.diagnosis}</p>
                </div>
              )}

              {consultation.treatment && (
                <div>
                  <label className="text-sm font-medium">Treatment</label>
                  <p className="text-sm text-muted-foreground mt-1">{consultation.treatment}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Consultation history will appear here</p>
              </div>
            </TabsContent>

            <TabsContent value="documents">
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Shared documents will appear here</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}