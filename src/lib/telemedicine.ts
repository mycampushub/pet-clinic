import { db } from './db';

interface VideoConsultation {
  id: string;
  appointmentId: string;
  petId: string;
  ownerId: string;
  veterinarianId: string;
  scheduledAt: Date;
  duration: number; // in minutes
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  roomUrl?: string;
  recordingUrl?: string;
  notes?: string;
  diagnosis?: string;
  treatment?: string;
  prescription?: string;
}

interface ConsultationSettings {
  maxDuration: number;
  bufferTime: number; // minutes between consultations
  enabledSpecialties: string[];
  pricing: {
    standard: number;
    extended: number;
    followUp: number;
  };
}

export class TelemedicineService {
  private settings: ConsultationSettings = {
    maxDuration: 30,
    bufferTime: 15,
    enabledSpecialties: ['General Consultation', 'Behavioral', 'Dermatology', 'Nutrition'],
    pricing: {
      standard: 50,
      extended: 75,
      followUp: 30,
    },
  };

  async scheduleVideoConsultation(data: {
    appointmentId: string;
    petId: string;
    ownerId: string;
    veterinarianId: string;
    scheduledAt: Date;
    duration: number;
    specialty: string;
  }): Promise<VideoConsultation> {
    // Check if veterinarian is available
    const isAvailable = await this.checkVeterinarianAvailability(
      data.veterinarianId,
      data.scheduledAt,
      data.duration
    );

    if (!isAvailable) {
      throw new Error('Veterinarian is not available at the requested time');
    }

    // Generate unique room ID and URL
    const roomId = this.generateRoomId();
    const roomUrl = this.generateRoomUrl(roomId);

    // Create video consultation record
    const consultation = await db.videoConsultation.create({
      data: {
        appointmentId: data.appointmentId,
        petId: data.petId,
        ownerId: data.ownerId,
        veterinarianId: data.veterinarianId,
        scheduledAt: data.scheduledAt,
        duration: data.duration,
        status: 'SCHEDULED',
        roomUrl,
      },
    });

    // Update appointment status
    await db.appointment.update({
      where: { id: data.appointmentId },
      data: { status: 'CONFIRMED' },
    });

    // Send confirmation notifications
    await this.sendConsultationNotifications(consultation);

    return consultation;
  }

  async startVideoConsultation(consultationId: string, veterinarianId: string): Promise<VideoConsultation> {
    const consultation = await db.videoConsultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new Error('Consultation not found');
    }

    if (consultation.veterinarianId !== veterinarianId) {
      throw new Error('Unauthorized to start this consultation');
    }

    if (consultation.status !== 'SCHEDULED') {
      throw new Error('Consultation cannot be started');
    }

    // Check if it's time to start (within 5 minutes of scheduled time)
    const now = new Date();
    const scheduledTime = new Date(consultation.scheduledAt);
    const timeDiff = Math.abs(now.getTime() - scheduledTime.getTime());
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff > 5) {
      throw new Error('Consultation can only be started within 5 minutes of scheduled time');
    }

    // Update consultation status
    const updatedConsultation = await db.videoConsultation.update({
      where: { id: consultationId },
      data: { status: 'IN_PROGRESS' },
    });

    // Send notifications to pet owner
    await this.sendConsultationStartNotifications(updatedConsultation);

    return updatedConsultation;
  }

  async completeVideoConsultation(
    consultationId: string,
    veterinarianId: string,
    data: {
      notes?: string;
      diagnosis?: string;
      treatment?: string;
      prescription?: string;
      recordingUrl?: string;
    }
  ): Promise<VideoConsultation> {
    const consultation = await db.videoConsultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new Error('Consultation not found');
    }

    if (consultation.veterinarianId !== veterinarianId) {
      throw new Error('Unauthorized to complete this consultation');
    }

    if (consultation.status !== 'IN_PROGRESS') {
      throw new Error('Consultation is not in progress');
    }

    // Update consultation record
    const updatedConsultation = await db.videoConsultation.update({
      where: { id: consultationId },
      data: {
        status: 'COMPLETED',
        notes: data.notes,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        prescription: data.prescription,
        recordingUrl: data.recordingUrl,
      },
    });

    // Create medical record
    await db.medicalRecord.create({
      data: {
        petId: consultation.petId,
        type: 'Telemedicine Consultation',
        description: `Video consultation completed via telemedicine platform`,
        veterinarianId: consultation.veterinarianId,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        notes: data.notes,
      },
    });

    // Send completion notifications
    await this.sendConsultationCompleteNotifications(updatedConsultation);

    return updatedConsultation;
  }

  async cancelVideoConsultation(consultationId: string, userId: string, userRole: string): Promise<VideoConsultation> {
    const consultation = await db.videoConsultation.findUnique({
      where: { id: consultationId },
    });

    if (!consultation) {
      throw new Error('Consultation not found');
    }

    // Check authorization
    if (userRole === 'VETERINARIAN' && consultation.veterinarianId !== userId) {
      throw new Error('Unauthorized to cancel this consultation');
    }

    if (userRole === 'OWNER' && consultation.ownerId !== userId) {
      throw new Error('Unauthorized to cancel this consultation');
    }

    if (consultation.status !== 'SCHEDULED') {
      throw new Error('Only scheduled consultations can be cancelled');
    }

    // Update consultation status
    const updatedConsultation = await db.videoConsultation.update({
      where: { id: consultationId },
      data: { status: 'CANCELLED' },
    });

    // Update appointment status
    await db.appointment.update({
      where: { id: consultation.appointmentId },
      data: { status: 'CANCELLED' },
    });

    // Send cancellation notifications
    await this.sendConsultationCancelNotifications(updatedConsultation);

    return updatedConsultation;
  }

  async getVeterinarianSchedule(veterinarianId: string, date: Date): Promise<Array<{ time: string; available: boolean }>> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get existing consultations for the day
    const existingConsultations = await db.videoConsultation.findMany({
      where: {
        veterinarianId,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS'],
        },
      },
    });

    // Generate time slots (every 30 minutes from 9 AM to 5 PM)
    const timeSlots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const slotTime = new Date(date);
        slotTime.setHours(hour, minute, 0, 0);

        // Check if slot is available
        const isAvailable = this.isTimeSlotAvailable(slotTime, existingConsultations);
        
        timeSlots.push({ time, available: isAvailable });
      }
    }

    return timeSlots;
  }

  async getConsultationHistory(petId: string): Promise<VideoConsultation[]> {
    return await db.videoConsultation.findMany({
      where: { petId },
      include: {
        veterinarian: {
          select: { name: true, email: true },
        },
      },
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async getUpcomingConsultations(veterinarianId: string): Promise<VideoConsultation[]> {
    const now = new Date();
    return await db.videoConsultation.findMany({
      where: {
        veterinarianId,
        scheduledAt: { gte: now },
        status: 'SCHEDULED',
      },
      include: {
        pet: {
          include: {
            owner: {
              select: { name: true, email: true, phone: true },
            },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  private async checkVeterinarianAvailability(
    veterinarianId: string,
    scheduledAt: Date,
    duration: number
  ): Promise<boolean> {
    const endTime = new Date(scheduledAt.getTime() + duration * 60 * 1000);
    const bufferTime = this.settings.bufferTime * 60 * 1000; // Convert to milliseconds

    const conflictingConsultations = await db.videoConsultation.findMany({
      where: {
        veterinarianId,
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS'],
        },
        scheduledAt: {
          lte: new Date(endTime.getTime() + bufferTime),
        },
        OR: [
          {
            scheduledAt: {
              gte: new Date(scheduledAt.getTime() - bufferTime),
            },
          },
        ],
      },
    });

    return conflictingConsultations.length === 0;
  }

  private isTimeSlotAvailable(
    slotTime: Date,
    existingConsultations: VideoConsultation[]
  ): boolean {
    const slotEndTime = new Date(slotTime.getTime() + 30 * 60 * 1000); // 30 minutes slot
    const bufferTime = this.settings.bufferTime * 60 * 1000;

    return !existingConsultations.some(consultation => {
      const consultationStart = new Date(consultation.scheduledAt);
      const consultationEnd = new Date(
        consultationStart.getTime() + consultation.duration * 60 * 1000
      );

      return (
        (slotTime >= new Date(consultationStart.getTime() - bufferTime) &&
         slotTime <= new Date(consultationEnd.getTime() + bufferTime)) ||
        (slotEndTime >= new Date(consultationStart.getTime() - bufferTime) &&
         slotEndTime <= new Date(consultationEnd.getTime() + bufferTime))
      );
    });
  }

  private generateRoomId(): string {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateRoomUrl(roomId: string): string {
    // In a real implementation, this would use your video conferencing service
    return `${process.env.NEXT_PUBLIC_APP_URL}/telemedicine/room/${roomId}`;
  }

  private async sendConsultationNotifications(consultation: VideoConsultation): Promise<void> {
    // In a real implementation, this would send email/SMS notifications
    console.log(`Sending consultation notifications for ${consultation.id}`);
  }

  private async sendConsultationStartNotifications(consultation: VideoConsultation): Promise<void> {
    // In a real implementation, this would send notifications when consultation starts
    console.log(`Sending consultation start notifications for ${consultation.id}`);
  }

  private async sendConsultationCompleteNotifications(consultation: VideoConsultation): Promise<void> {
    // In a real implementation, this would send completion notifications
    console.log(`Sending consultation completion notifications for ${consultation.id}`);
  }

  private async sendConsultationCancelNotifications(consultation: VideoConsultation): Promise<void> {
    // In a real implementation, this would send cancellation notifications
    console.log(`Sending consultation cancellation notifications for ${consultation.id}`);
  }

  getSettings(): ConsultationSettings {
    return this.settings;
  }
}

export const telemedicineService = new TelemedicineService();