import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { CompanyService } from '../company/company.service';

@Injectable()
export class PdfService {
  constructor(private readonly companyService: CompanyService) { }

  async generateInvoicePdf(invoice: any) {
    const company = await this.companyService.getProfile();
    return this.generateRichPdf('INVOICE', invoice, company);
  }

  async generateQuotationPdf(quotation: any) {
    const company = await this.companyService.getProfile();
    return this.generateRichPdf('QUOTATION', quotation, company);
  }

  private async generateRichPdf(title: string, data: any, company: any) {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (d) => chunks.push(d));

    const dateStr = data.date ? new Date(data.date).toLocaleDateString() : new Date().toLocaleDateString();
    const year = data.date ? new Date(data.date).getFullYear() : new Date().getFullYear();
    const prefix = title === 'QUOTATION' ? 'QUO' : 'INV';
    const ref = `${prefix}-${year}-${data._id.toString().slice(-4).toUpperCase()}`;

    // Logo & Header
    const logoToUse = data.logo || company.logo;
    if (logoToUse) {
      try {
        const logoData = logoToUse.replace(/^data:image\/\w+;base64,/, '');
        doc.image(Buffer.from(logoData, 'base64'), 50, 45, { width: 60 });
      } catch (e) {
        console.error('Error adding logo to PDF', e);
      }
    }

    doc.fillColor('#1e293b') // slate-800
      .fontSize(24)
      .text(title, 110, 50, { align: 'right' })
      .fontSize(10)
      .fillColor('#64748b') // slate-500
      .text(`REF: ${ref}`, 200, 80, { align: 'right' })
      .text(`Date: ${dateStr}`, 200, 95, { align: 'right' })
      .moveDown();

    // Gray line
    doc.strokeColor('#f1f5f9') // slate-100
      .lineWidth(1)
      .moveTo(50, 125)
      .lineTo(550, 125)
      .stroke();

    // Info Grid
    const infoY = 145;
    doc.fontSize(8).fillColor('#94a3b8').text('TO CUSTOMER', 50, infoY);
    doc.fontSize(8).fillColor('#94a3b8').text('FROM COMPANY', 320, infoY);

    const customer = data.customer as any;
    const customerName = typeof customer === 'string' ? customer : (customer?.name || 'Unspecified Customer');
    const customerEmail = typeof customer === 'object' ? (customer?.email || '') : '';
    const customerPhone = typeof customer === 'object' ? (customer?.phone || '') : '';
    const customerAddress = typeof customer === 'object' ? (customer?.address || '') : '';

    doc.fontSize(12).fillColor('#0f172a').font('Helvetica-Bold')
      .text(customerName, 50, infoY + 15)
      .font('Helvetica').fontSize(10).fillColor('#64748b')
      .text(customerEmail, 50, infoY + 32)
      .text(customerPhone, 50, infoY + 47)
      .text(customerAddress, 50, infoY + 62);

    doc.fontSize(12).fillColor('#0f172a').font('Helvetica-Bold')
      .text(company.name || 'Your Company Name', 320, infoY + 15)
      .font('Helvetica').fontSize(10).fillColor('#64748b')
      .text(company.address || '', 320, infoY + 32)
      .text(company.email || '', 320, infoY + 47)
      .text(company.phone || '', 320, infoY + 62);

    // Table Header
    const tableHeaderY = 280;
    doc.fontSize(8).fillColor('#94a3b8').font('Helvetica-Bold')
      .text('DESCRIPTION', 50, tableHeaderY)
      .text('QTY', 300, tableHeaderY, { width: 40, align: 'center' })
      .text('UNIT PRICE', 350, tableHeaderY, { width: 80, align: 'right' })
      .text('AMOUNT', 450, tableHeaderY, { width: 100, align: 'right' });

    doc.strokeColor('#0f172a')
      .lineWidth(2)
      .moveTo(50, tableHeaderY + 15)
      .lineTo(550, tableHeaderY + 15)
      .stroke();

    // Table Rows
    let currentY = tableHeaderY + 30;
    const items = data.items || [];
    let subtotal = 0;

    items.forEach((item: any) => {
      const qty = Number(item.quantity || 0);
      const price = Number(item.price || 0);
      const amount = qty * price;
      subtotal += amount;

      doc.fontSize(10).fillColor('#0f172a').font('Helvetica-Bold')
        .text(item.description || 'No description', 50, currentY, { width: 240 })
        .font('Helvetica')
        .text(qty.toString(), 300, currentY, { width: 40, align: 'center' })
        .text(`$${price.toFixed(2)}`, 350, currentY, { width: 80, align: 'right' })
        .font('Helvetica-Bold')
        .text(`$${amount.toFixed(2)}`, 450, currentY, { width: 100, align: 'right' });

      currentY += 30;
      doc.strokeColor('#f1f5f9')
        .lineWidth(1)
        .moveTo(50, currentY - 10)
        .lineTo(550, currentY - 10)
        .stroke();

      if (currentY > 650) {
        doc.addPage();
        currentY = 50;
      }
    });

    const taxRate = Number(data.taxRate || 0);
    const taxAmount = subtotal * (taxRate / 100);
    const finalTotal = subtotal + taxAmount;

    // Summary
    const summaryY = Math.max(currentY + 20, 500);
    doc.fontSize(10).fillColor('#64748b').font('Helvetica')
      .text('SUBTOTAL', 350, summaryY, { width: 80, align: 'right' })
      .text(`TAX (${taxRate}%)`, 350, summaryY + 20, { width: 80, align: 'right' });

    doc.fillColor('#0f172a').font('Helvetica-Bold')
      .text(`$${Number(subtotal).toFixed(2)}`, 450, summaryY, { width: 100, align: 'right' })
      .text(`$${Number(taxAmount).toFixed(2)}`, 450, summaryY + 20, { width: 100, align: 'right' });

    doc.fontSize(18).fillColor('#0f172a')
      .text('TOTAL', 350, summaryY + 45, { width: 80, align: 'right' })
      .text(`$${Number(finalTotal).toFixed(2)}`, 440, summaryY + 45, { width: 110, align: 'right' });

    // Footer
    doc.fontSize(8).fillColor('#94a3b8').font('Helvetica-Oblique')
      .text(`Thank you for choosing ${company.name || 'us'}.`, 0, 750, { align: 'center' });

    doc.end();
    await new Promise((res) => doc.on('end', res));
    return Buffer.concat(chunks);
  }

  async generateDashboardReport(stats: any) {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on('data', (d) => chunks.push(d));

    // Header
    doc.fillColor('#1e293b').fontSize(24).text('DASHBOARD REPORT', 50, 50);
    doc.fontSize(10).fillColor('#64748b').text(`Generated on: ${new Date().toLocaleString()}`, 50, 80);

    doc.strokeColor('#f1f5f9').lineWidth(1).moveTo(50, 100).lineTo(550, 100).stroke();

    // Stats Section
    doc.moveDown(2);
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(16).text('Business Overview', 50, 120);

    doc.moveDown();
    const statsY = 150;

    // Revenue Box
    doc.rect(50, statsY, 240, 60).fillAndStroke('#f8fafc', '#e2e8f0');
    doc.fillColor('#64748b').fontSize(10).text('TOTAL REVENUE', 60, statsY + 15);
    doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text(`$${stats.totalRevenue?.toLocaleString()}`, 60, statsY + 35);

    // Overdue Box
    doc.rect(300, statsY, 240, 60).fillAndStroke('#fef2f2', '#fecaca');
    doc.fillColor('#991b1b').fontSize(10).text('OVERDUE AMOUNT', 310, statsY + 15);
    doc.fillColor('#b91c1c').fontSize(14).font('Helvetica-Bold').text(`$${stats.overdue?.toLocaleString()}`, 310, statsY + 35);

    doc.moveDown(5);
    doc.fillColor('#0f172a').font('Helvetica-Bold').fontSize(12).text(`Active Customers: ${stats.customers}`, 50, statsY + 80);

    // Insights Section
    if (stats.insights) {
      doc.moveDown(2);
      doc.fillColor('#1e293b').fontSize(14).font('Helvetica-Bold').text('AI Business Insights', 50);
      doc.moveDown();
      doc.fillColor('#475569').fontSize(10).font('Helvetica').text(stats.insights, { width: 500, align: 'justify' });
    }

    doc.end();
    await new Promise((res) => doc.on('end', res));
    return Buffer.concat(chunks);
  }
}
