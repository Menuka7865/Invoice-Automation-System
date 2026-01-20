import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quotation } from './quotation.schema';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PdfService } from '../pdf/pdf.service';
import { EmailService } from '../email/email.service';
import { Customer } from '../customers/customer.schema';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectModel(Quotation.name) private model: Model<Quotation>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private events: EventEmitter2,
    private pdfSvc: PdfService,
    private emailSvc: EmailService
  ) { }

  async create(data: Partial<Quotation>) {
    const doc = new this.model(data);
    const saved = await (await doc.save()).populate('customer');
    return { success: true, message: 'Quotation created', saved };
  }

  async update(id: string, data: Partial<Quotation> = {}) {
    const updated = await this.model.findByIdAndUpdate(id, data, { new: true }).populate('customer').lean();
    if (!updated) {
      return { error: 'Quotation not found' };
    }
    if (data.status && data.status === 'Accepted') {
      this.events.emit('quotation.accepted', updated);
    }
    return { success: true, message: 'Quotation updated', updated };
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).lean();
    if (!deleted) {
      return { error: 'Quotation not found' };
    }
    this.events.emit('quotation.deleted', deleted);
    return { success: true, message: 'Quotation deleted', deleted };
  }

  async findAll(query = {}) {
    return this.model.find(query).populate('customer').sort({ createdAt: -1 }).lean();
  }

  async findById(id: string) {
    return this.model.findById(id).populate('customer').lean();
  }

  async generatePdf(id: string, options: any = {}) {
    const quotation = await this.findById(id);
    if (!quotation) throw new Error('Quotation not found');
    const customer = (quotation.customer as any)?.name || 'Customer';
    // Pass options down
    return this.pdfSvc.generateQuotationPdf({ ...quotation, customer, options });
  }

  async sendEmail(id: string, recipients: string[] = []) {
    const quotation = await this.findById(id);
    if (!quotation) throw new Error('Quotation not found');
    const customer = quotation.customer as any;

    // Determine recipients
    const toAddresses = recipients.length > 0 ? recipients : [customer?.email].filter(Boolean);
    if (toAddresses.length === 0) throw new Error('No recipients found');

    const pdf = await this.generatePdf(id); // Use default options for email attachment
    const baseUrl = process.env.APP_URL || 'http://localhost:5000';
    const acceptUrl = `${baseUrl}/quotations/${id}/accept`;
    const declineUrl = `${baseUrl}/quotations/${id}/decline`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #1e293b;">New Quotation Received</h2>
        <p style="color: #475569;">Hello ${customer.name || 'valued customer'},</p>
        <p style="color: #475569;">Please find attached your professional quotation. You can review the details in the attached PDF.</p>
        <p style="color: #475569;">Would you like to accept this proposal?</p>
        
        <div style="margin: 30px 0; display: flex; gap: 15px;">
          <a href="${acceptUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accept Quotation</a>
          <a href="${declineUrl}" style="background-color: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; margin-left: 10px;">Decline Quotation</a>
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 20px;">
          This is an automated message from our Invoice Automation System.
        </p>
      </div>
    `;

    await this.emailSvc.sendHtmlMailWithAttachment(
      toAddresses.join(','),
      `Quotation from Invoice System`,
      html,
      `quotation-${id}.pdf`,
      pdf
    );

    // Update status to Sent if it was Draft
    if (quotation.status === 'Draft') {
      await this.update(id, { status: 'Sent' });
    }

    return { success: true, message: 'Email sent successfully' };
  }
}
