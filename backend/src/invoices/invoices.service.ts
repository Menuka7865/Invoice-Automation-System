import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './invoice.schema';
import { PdfService } from '../pdf/pdf.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private model: Model<Invoice>,
    private readonly pdfService: PdfService,
    private readonly emailService: EmailService
  ) { }

  async create(data: Partial<Invoice>) {
    const doc = new this.model(data);
    return { success: true, message: 'Invoice created successfully', doc: await doc.save() };
  }

  async update(id: string, data: Partial<Invoice>) {
    const updated = await this.model.findByIdAndUpdate(id, data, { new: true }).populate('customer').lean();
    return { success: true, message: 'Invoice updated successfully', doc: updated };
  }

  async findAll(query = {}) {
    return this.model.find(query).populate('customer').sort({ createdAt: -1 }).lean();
  }

  async findById(id: string) {
    return this.model.findById(id).populate('customer').lean();
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id).lean();
    if (!deleted) {
      return { success: false, message: 'Invoice not found' };
    }
    return { success: true, message: 'Invoice deleted successfully', doc: deleted };
  }

  async generatePdf(id: string) {
    const invoice = await this.findById(id);
    if (!invoice) throw new NotFoundException('Invoice not found');
    return this.pdfService.generateInvoicePdf(invoice);
  }

  async sendEmail(id: string) {
    const invoice = await this.findById(id);
    if (!invoice) throw new NotFoundException('Invoice not found');
    const customer = invoice.customer as any;
    if (!customer?.email) throw new Error('Customer email not found');

    const pdf = await this.generatePdf(id);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
        <h2 style="color: #1e293b;">Invoice Received</h2>
        <p style="color: #475569;">Hello ${customer.name || 'valued customer'},</p>
        <p style="color: #475569;">Please find attached your invoice (INV-${id.slice(-6).toUpperCase()}). You can review the details in the attached PDF.</p>
        <p style="color: #475569;">Total Amount: <strong>$${invoice.total.toFixed(2)}</strong></p>
        <p style="color: #475569;">Due Date: <strong>${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}</strong></p>
        
        <p style="color: #94a3b8; font-size: 12px; margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 20px;">
          This is an automated message from our Invoice Automation System.
        </p>
      </div>
    `;

    await this.emailService.sendHtmlMailWithAttachment(
      customer.email,
      `Invoice from Invoice System`,
      html,
      `invoice-${id}.pdf`,
      pdf
    );

    // Update status to Sent if it was Draft
    if (invoice.status === 'Draft') {
      await this.update(id, { status: 'Sent' });
    }

    return { success: true, message: 'Email sent successfully' };
  }
}
