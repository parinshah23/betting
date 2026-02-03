/**
 * Email Service
 * 
 * Handles all email sending functionality for the platform.
 * Supports multiple providers through a unified interface.
 */

import nodemailer from 'nodemailer';
import { config } from '../config/env';

export interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    switch (config.email.provider) {
      case 'smtp':
        if (config.email.smtp && config.email.smtp.user && config.email.smtp.pass) {
          this.transporter = nodemailer.createTransport({
            host: config.email.smtp.host,
            port: config.email.smtp.port,
            secure: config.email.smtp.secure,
            auth: {
              user: config.email.smtp.user,
              pass: config.email.smtp.pass,
            },
          });
          console.log('✉️  Email service configured with SMTP:', config.email.smtp.host);
        }
        break;

      case 'sendgrid':
        // SendGrid SMTP relay
        if (config.email.apiKey) {
          this.transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            secure: false,
            auth: {
              user: 'apikey',
              pass: config.email.apiKey,
            },
          });
          console.log('✉️  Email service configured with SendGrid');
        }
        break;

      default:
        console.warn(`⚠️  Email provider ${config.email.provider} not configured`);
    }
  }

  async send(data: EmailData): Promise<boolean> {
    if (!this.transporter) {
      console.warn('Email transporter not configured. Email not sent:', data.subject);
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: data.from || `${config.email.fromName} <${config.email.from}>`,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.html,
      });
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Template methods for common emails

  async sendWelcomeEmail(to: string, firstName: string): Promise<boolean> {
    return this.send({
      to,
      subject: 'Welcome to Competition Platform!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Welcome ${firstName}!</h1>
          <p>Thank you for joining our competition platform. You're now ready to enter amazing competitions and win incredible prizes!</p>
          <p>Here's what you can do:</p>
          <ul>
            <li>Browse our current competitions</li>
            <li>Purchase tickets for your favorites</li>
            <li>Track your entries in your dashboard</li>
            <li>Win amazing prizes!</li>
          </ul>
          <p style="margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/competitions" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Browse Competitions
            </a>
          </p>
          <p style="color: #6B7280; font-size: 12px; margin-top: 40px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `,
      text: `Welcome ${firstName}!\n\nThank you for joining our competition platform. You're now ready to enter amazing competitions and win incredible prizes!\n\nBrowse competitions: ${process.env.FRONTEND_URL}/competitions`,
    });
  }

  async sendOrderConfirmation(to: string, orderNumber: string, amount: number | string, items: Array<{ title: string; quantity: number }>): Promise<boolean> {
    const itemsList = items.map(item => `<li>${item.quantity}x ${item.title}</li>`).join('');
    const formattedAmount = Number(amount).toFixed(2);

    return this.send({
      to,
      subject: `Order Confirmation #${orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Order Confirmed!</h1>
          <p>Thank you for your purchase. Your order details are below:</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Order Number:</strong> #${orderNumber}</p>
            <p style="margin: 10px 0 0;"><strong>Total:</strong> £${formattedAmount}</p>
          </div>
          <h3>Items Purchased:</h3>
          <ul>${itemsList}</ul>
          <p>Good luck in the competition!</p>
          <p style="margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/my-tickets" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View My Tickets
            </a>
          </p>
        </div>
      `,
      text: `Order Confirmed!\n\nOrder Number: #${orderNumber}\nTotal: £${formattedAmount}\n\nGood luck in the competition!`,
    });
  }

  async sendWinnerNotification(to: string, firstName: string, competitionTitle: string, ticketNumber: number, prizeValue: number): Promise<boolean> {
    return this.send({
      to,
      subject: '🎉 Congratulations! You\'ve Won!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Congratulations ${firstName}! 🎉</h1>
            <p style="margin: 10px 0 0; font-size: 18px;">You're a Winner!</p>
          </div>
          <div style="background: white; padding: 30px 20px; border: 1px solid #E5E7EB; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; color: #374151;">You've won the competition:</p>
            <h2 style="color: #4F46E5; margin: 15px 0;">${competitionTitle}</h2>
            <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #6B7280;">Winning Ticket Number</p>
              <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; color: #4F46E5;">#${ticketNumber.toString().padStart(6, '0')}</p>
            </div>
            <p style="font-size: 18px; color: #059669; font-weight: bold;">Prize Value: £${prizeValue.toFixed(2)}</p>
            <p style="margin-top: 30px; color: #374151;">Please claim your prize within 30 days by visiting your account.</p>
            <p style="margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL}/my-wins" 
                 style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Claim My Prize
              </a>
            </p>
          </div>
        </div>
      `,
      text: `Congratulations ${firstName}! You've won ${competitionTitle}! Winning ticket: #${ticketNumber}. Prize value: £${prizeValue.toFixed(2)}. Claim your prize at: ${process.env.FRONTEND_URL}/my-wins`,
    });
  }

  async sendPasswordResetEmail(to: string, firstName: string, resetToken: string): Promise<boolean> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    return this.send({
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Password Reset</h1>
          <p>Hi ${firstName},</p>
          <p>We received a request to reset your password. Click the button below to reset it:</p>
          <p style="margin-top: 30px;">
            <a href="${resetUrl}" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </p>
          <p style="margin-top: 30px; color: #6B7280; font-size: 14px;">
            Or copy and paste this link into your browser:<br>
            <span style="color: #4F46E5;">${resetUrl}</span>
          </p>
          <p style="color: #6B7280; font-size: 12px; margin-top: 40px;">
            This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
          </p>
        </div>
      `,
      text: `Password Reset\n\nHi ${firstName},\n\nWe received a request to reset your password. Click the link to reset it:\n${resetUrl}\n\nThis link will expire in 1 hour.`,
    });
  }

  async sendTicketPurchaseConfirmation(to: string, firstName: string, competitionTitle: string, ticketCount: number, ticketNumbers: number[]): Promise<boolean> {
    const ticketsList = ticketNumbers.map(num => `<span style="background: #EEF2FF; color: #4F46E5; padding: 4px 8px; border-radius: 4px; margin: 2px; display: inline-block;">#${num.toString().padStart(6, '0')}</span>`).join(' ');

    return this.send({
      to,
      subject: `Your Tickets for ${competitionTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Good Luck ${firstName}!</h1>
          <p>Your tickets for <strong>${competitionTitle}</strong> have been confirmed.</p>
          <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px;"><strong>Tickets Purchased:</strong> ${ticketCount}</p>
            <p style="margin: 0;"><strong>Your Ticket Numbers:</strong></p>
            <div style="margin-top: 10px;">${ticketsList}</div>
          </div>
          <p>The draw will take place soon. We'll notify you if you're a winner!</p>
          <p style="margin-top: 30px;">
            <a href="${process.env.FRONTEND_URL}/my-tickets" 
               style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View My Tickets
            </a>
          </p>
        </div>
      `,
      text: `Good Luck ${firstName}!\n\nYour tickets for ${competitionTitle} have been confirmed.\n\nTickets: ${ticketCount}\nTicket Numbers: ${ticketNumbers.map(n => '#' + n.toString().padStart(6, '0')).join(', ')}`,
    });
  }
}

export const emailService = new EmailService();
