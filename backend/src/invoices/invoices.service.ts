import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './invoice.schema';
import { PdfService } from '../pdf/pdf.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private model: Model<Invoice>,
    private readonly pdfService: PdfService
  ) { }

  async create(data: Partial<Invoice>) {
    const doc = new this.model(data);
    return { success: true, message: 'Invoice created successfully', doc: await doc.save() };
  }

  async update(id: string, data: Partial<Invoice>) {
    return { success: true, message: 'Invoice updated successfully', doc: await this.model.findByIdAndUpdate(id, data, { new: true }).populate('customer').lean() };
  }

  async findAll(query = {}) {
    return this.model.find(query).populate('customer').lean();
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
}
