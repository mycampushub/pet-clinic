import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/notification';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { appointmentId, sendEmail = true, sendSMS = true } = body;

    if (!appointmentId) {
      return NextResponse.json(
        { error: 'Appointment ID is required' },
        { status: 400 }
      );
    }

    // Get appointment details with related data
    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        pet: {
          include: {
            owner: true,
          },
        },
        clinic: true,
        provider: true,
      },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const appointmentData = {
      ownerName: appointment.pet.owner.name,
      petName: appointment.pet.name,
      appointmentDate: appointment.startTime.toLocaleDateString(),
      appointmentTime: appointment.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      clinicName: appointment.clinic.name,
      clinicPhone: appointment.clinic.phone || '',
    };

    let emailSent = false;
    let smsSent = false;

    // Send email confirmation
    if (sendEmail && appointment.pet.owner.email) {
      try {
        await notificationService.sendAppointmentConfirmation(
          appointmentData,
          appointment.pet.owner.email,
          sendSMS ? appointment.pet.owner.phone : undefined
        );
        emailSent = true;
      } catch (error) {
        console.error('Failed to send email confirmation:', error);
      }
    }

    // Send SMS confirmation (if not already sent with email)
    if (sendSMS && appointment.pet.owner.phone && !emailSent) {
      try {
        await notificationService.sendNotification({
          to: appointment.pet.owner.phone,
          message: `Appointment confirmed for ${appointmentData.petName} on ${appointmentData.appointmentDate} at ${appointmentData.appointmentTime}. ${appointmentData.clinicName}: ${appointmentData.clinicPhone}`,
          type: 'SMS',
        });
        smsSent = true;
      } catch (error) {
        console.error('Failed to send SMS confirmation:', error);
      }
    }

    // Update appointment status
    await db.appointment.update({
      where: { id: appointmentId },
      data: { status: 'CONFIRMED' },
    });

    return NextResponse.json({
      success: true,
      message: 'Appointment confirmation sent',
      emailSent,
      smsSent,
    });
  } catch (error) {
    console.error('Appointment confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}