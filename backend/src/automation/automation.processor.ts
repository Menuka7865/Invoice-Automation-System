import { Processor, Process, OnQueueActive, InjectQueue } from '@nestjs/bull';
import type { Job, Queue } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { InvoicesService } from '../invoices/invoices.service';
import { CustomersService } from '../customers/customers.service';
import { EmailService } from '../email/email.service';
import { PdfService } from '../pdf/pdf.service';

@Processor('emails')
@Injectable()
export class AutomationProcessor {
  private readonly logger = new Logger('AutomationProcessor');
  constructor(private invoices: InvoicesService, private customers: CustomersService, private email: EmailService, private pdf: PdfService, @InjectQueue('emails') private queue: Queue) { }

  @OnEvent('quotation.accepted')
  async onQuotationAccepted(payload: any) {
    this.logger.log('Quotation accepted - creating invoice and queueing email');
    // create invoice from quotation (simple transform)
    const invoice = await this.invoices.create({ customer: payload.customer, quotation: payload._id, items: payload.items, total: payload.total, currency: payload.currency || 'USD', dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000) });
    const invDoc: any = invoice?.doc ?? invoice;
    const customer = await this.customers.findById(payload.customer.toString());
    if (!customer) {
      this.logger.error(`Customer not found for id ${payload.customer}`);
      return;
    }
    const pdf = await this.pdf.generateInvoicePdf(invDoc);
    await this.queue.add('send-email', { to: customer.email, subject: 'Invoice for your accepted quotation', invoiceId: invDoc._id, pdf: pdf.toString('base64') });
  }

  @Process('send-email')
  async sendEmail(job: Job) {
    const { to, subject, pdf, invoiceId } = job.data;
    await this.email.sendMail({ to, subject, attachments: [{ filename: `${invoiceId}.pdf`, content: Buffer.from(pdf, 'base64') }], html: `<p>Please find invoice ${invoiceId}</p>` });
  }

  @Process('weekly-report')
  async weeklyReport(job: Job) {
    // stub: generate weekly report and email admin
    await this.email.sendMail({ to: process.env.ADMIN_EMAIL || 'admin@example.com', subject: 'Weekly summary', html: '<p>Weekly summary stub</p>' });
  }
}
