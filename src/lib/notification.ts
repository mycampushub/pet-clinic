import nodemailer from 'nodemailer';
import { db } from './db';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

interface SMSConfig {
  accountSid: string;
  authToken: string;
  fromNumber: string;
}

interface NotificationData {
  to: string;
  subject?: string;
  message: string;
  type: 'EMAIL' | 'SMS';
  template?: string;
  data?: Record<string, any>;
}

interface AppointmentNotificationData {
  ownerName: string;
  petName: string;
  appointmentDate: string;
  appointmentTime: string;
  clinicName: string;
  clinicPhone: string;
}

interface ReminderNotificationData {
  ownerName: string;
  petName: string;
  reminderType: string;
  dueDate: string;
  clinicName: string;
}

export class NotificationService {
  private emailTransporter: nodemailer.Transporter | null = null;
  private smsConfig: SMSConfig | null = null;

  constructor() {
    this.initializeEmailTransporter();
    this.initializeSMSConfig();
  }

  private initializeEmailTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      this.emailTransporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  private initializeSMSConfig() {
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.smsConfig = {
        accountSid: process.env.TWILIO_ACCOUNT_SID,
        authToken: process.env.TWILIO_AUTH_TOKEN,
        fromNumber: process.env.TWILIO_FROM_NUMBER || '',
      };
    }
  }

  async sendNotification(data: NotificationData): Promise<boolean> {
    try {
      switch (data.type) {
        case 'EMAIL':
          return await this.sendEmail(data.to, data.subject || '', data.message, data.template, data.data);
        case 'SMS':
          return await this.sendSMS(data.to, data.message);
        default:
          throw new Error(`Unsupported notification type: ${data.type}`);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }

  private async sendEmail(to: string, subject: string, message: string, template?: string, data?: Record<string, any>): Promise<boolean> {
    if (!this.emailTransporter) {
      console.warn('Email transporter not configured');
      return false;
    }

    try {
      let htmlContent = message;
      
      // Use template if provided
      if (template && data) {
        htmlContent = this.renderTemplate(template, data);
      }

      const mailOptions = {
        from: process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER,
        to,
        subject,
        html: htmlContent,
        text: message,
      };

      await this.emailTransporter.sendMail(mailOptions);
      
      // Log notification
      await this.logNotification({
        type: 'EMAIL',
        recipient: to,
        subject,
        message,
        status: 'SENT',
      });

      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Log failed notification
      await this.logNotification({
        type: 'EMAIL',
        recipient: to,
        subject,
        message,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return false;
    }
  }

  private async sendSMS(to: string, message: string): Promise<boolean> {
    if (!this.smsConfig) {
      console.warn('SMS configuration not provided');
      return false;
    }

    try {
      // For demo purposes, we'll just log the SMS
      // In production, you would use Twilio or another SMS service
      console.log(`SMS would be sent to ${to}: ${message}`);
      
      // Log notification
      await this.logNotification({
        type: 'SMS',
        recipient: to,
        subject: '',
        message,
        status: 'SENT',
      });

      return true;
    } catch (error) {
      console.error('Error sending SMS:', error);
      
      // Log failed notification
      await this.logNotification({
        type: 'SMS',
        recipient: to,
        subject: '',
        message,
        status: 'FAILED',
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return false;
    }
  }

  private renderTemplate(template: string, data: Record<string, any>): string {
    const templates = {
      APPOINTMENT_CONFIRMATION: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Appointment Confirmation</h2>
          <p>Dear ${data.ownerName},</p>
          <p>Your appointment for ${data.petName} has been confirmed.</p>
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Date:</strong> ${data.appointmentDate}</p>
            <p><strong>Time:</strong> ${data.appointmentTime}</p>
            <p><strong>Clinic:</strong> ${data.clinicName}</p>
            <p><strong>Phone:</strong> ${data.clinicPhone}</p>
          </div>
          <p>Please arrive 10 minutes before your appointment time.</p>
          <p>If you need to reschedule, please call us at ${data.clinicPhone}.</p>
          <p>Best regards,<br>${data.clinicName} Team</p>
        </div>
      `,
      APPOINTMENT_REMINDER: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Appointment Reminder</h2>
          <p>Dear ${data.ownerName},</p>
          <p>This is a friendly reminder about your upcoming appointment for ${data.petName}.</p>
          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <p><strong>Date:</strong> ${data.appointmentDate}</p>
            <p><strong>Time:</strong> ${data.appointmentTime}</p>
            <p><strong>Clinic:</strong> ${data.clinicName}</p>
          </div>
          <p>Please remember to bring any previous medical records.</p>
          <p>We look forward to seeing you and ${data.petName}!</p>
          <p>Best regards,<br>${data.clinicName} Team</p>
        </div>
      `,
      REMINDER_NOTIFICATION: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Reminder for ${data.petName}</h2>
          <p>Dear ${data.ownerName},</p>
          <p>This is a reminder that ${data.petName} is due for ${data.reminderType.toLowerCase()}.</p>
          <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Pet:</strong> ${data.petName}</p>
            <p><strong>Reminder Type:</strong> ${data.reminderType}</p>
            <p><strong>Due Date:</strong> ${data.dueDate}</p>
          </div>
          <p>Please call ${data.clinicName} to schedule an appointment.</p>
          <p>Best regards,<br>${data.clinicName} Team</p>
        </div>
      `,
    };

    return templates[template as keyof typeof templates] || message;
  }

  private async logNotification(data: {
    type: 'EMAIL' | 'SMS';
    recipient: string;
    subject: string;
    message: string;
    status: 'SENT' | 'FAILED';
    error?: string;
  }) {
    try {
      await db.notificationLog.create({
        data: {
          type: data.type,
          recipient: data.recipient,
          subject: data.subject,
          message: data.message,
          status: data.status,
          error: data.error,
        },
      });
    } catch (error) {
      console.error('Error logging notification:', error);
    }
  }

  // Convenience methods for specific notification types
  async sendAppointmentConfirmation(data: AppointmentNotificationData, email: string, phone?: string): Promise<void> {
    const subject = `Appointment Confirmation for ${data.petName}`;
    const message = `Your appointment for ${data.petName} is confirmed on ${data.appointmentDate} at ${data.appointmentTime}.`;

    // Send email
    await this.sendNotification({
      to: email,
      subject,
      message,
      type: 'EMAIL',
      template: 'APPOINTMENT_CONFIRMATION',
      data,
    });

    // Send SMS if phone number provided
    if (phone) {
      await this.sendNotification({
        to: phone,
        message: `Appointment confirmed for ${data.petName} on ${data.appointmentDate} at ${data.appointmentTime}. ${data.clinicName}: ${data.clinicPhone}`,
        type: 'SMS',
      });
    }
  }

  async sendAppointmentReminder(data: AppointmentNotificationData, email: string, phone?: string): Promise<void> {
    const subject = `Appointment Reminder for ${data.petName}`;
    const message = `Reminder: Your appointment for ${data.petName} is on ${data.appointmentDate} at ${data.appointmentTime}.`;

    // Send email
    await this.sendNotification({
      to: email,
      subject,
      message,
      type: 'EMAIL',
      template: 'APPOINTMENT_REMINDER',
      data,
    });

    // Send SMS if phone number provided
    if (phone) {
      await this.sendNotification({
        to: phone,
        message: `Reminder: Appointment for ${data.petName} on ${data.appointmentDate} at ${data.appointmentTime}. Reply C to confirm or call ${data.clinicPhone}.`,
        type: 'SMS',
      });
    }
  }

  async sendReminderNotification(data: ReminderNotificationData, email: string, phone?: string): Promise<void> {
    const subject = `Reminder for ${data.petName} - ${data.reminderType}`;
    const message = `${data.petName} is due for ${data.reminderType.toLowerCase()} by ${data.dueDate}.`;

    // Send email
    await this.sendNotification({
      to: email,
      subject,
      message,
      type: 'EMAIL',
      template: 'REMINDER_NOTIFICATION',
      data,
    });

    // Send SMS if phone number provided
    if (phone) {
      await this.sendNotification({
        to: phone,
        message: `${data.petName} is due for ${data.reminderType} by ${data.dueDate}. Call ${data.clinicName} to schedule.`,
        type: 'SMS',
      });
    }
  }
}

// Singleton instance
export const notificationService = new NotificationService();