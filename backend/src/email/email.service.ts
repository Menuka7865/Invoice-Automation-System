import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private logger = new Logger('EmailService');

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: +(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'user',
        pass: process.env.SMTP_PASS || 'pass',
      },
    });
  }

  async sendMail(opts: nodemailer.SendMailOptions) {
    try {
      const info = await this.transporter.sendMail(opts);
      this.logger.log(`Email sent: ${info.messageId}`);
      return info;
    } catch (err) {
      this.logger.error('Failed to send email', err as any);
      throw err;
    }
  }

  async sendMailWithAttachment(to: string, subject: string, text: string, filename: string, content: Buffer) {
    const from = process.env.SMTP_FROM || '"Invoice System" <' + (process.env.SMTP_USER || 'user') + '>';
    return this.sendMail({
      from,
      to,
      subject,
      text,
      attachments: [{ filename, content }],
    });
  }

  async sendHtmlMailWithAttachment(to: string, subject: string, html: string, filename: string, content: Buffer) {
    const from = process.env.SMTP_FROM || '"Invoice System" <' + (process.env.SMTP_USER || 'user') + '>';
    return this.sendMail({
      from,
      to,
      subject,
      html,
      attachments: [{ filename, content }],
    });
  }
}
