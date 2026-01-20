import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { QuotationsService } from './quotations.service';
import * as express from 'express';

@Controller('quotations')
export class QuotationsController {
  constructor(private readonly svc: QuotationsService) {
    console.log('QuotationsController initialized');
  }

  @Post()
  create(@Body() body: any) {
    return this.svc.create(body);
  }

  @Get()
  list() {
    return this.svc.findAll();
  }

  @Post(':id/send')
  sendEmail(@Param('id') id: string, @Body() body: { recipients?: string[] }) {
    return this.svc.sendEmail(id, body?.recipients || []);
  }

  // Changed to POST to accept extensive options if needed, or stick to GET with Query if simple. 
  // User asked for "selected pdf heading", "designed header". This implies potentially large data (image).
  // Let's support both or just POST for "Download with Options".
  // Actually, browsers trigger download easier with GET. 
  // But if we are "designing" a header, we might need to send a payload.
  // Let's add a NEW endpoint for downloading with custom options.
  @Post(':id/download')
  async downloadPdf(@Param('id') id: string, @Body() body: any, @Res() res: any) {
    console.log('Generating customized PDF for quotation:', id);
    try {
      const pdf = await this.svc.generatePdf(id, body); // body contains { headerTitle, headerImage }
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=quotation-${id}.pdf`);
      res.setHeader('Content-Length', pdf.length);
      res.send(pdf);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
  }

  @Get(':id/pdf')
  async getPdf(@Param('id') id: string, @Res() res: any) {
    // Default download
    return this.downloadPdf(id, {}, res);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }

  @Get(':id/accept')
  async publicAccept(@Param('id') id: string, @Res() res: any) {
    await this.svc.update(id, { status: 'Accepted' });
    res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #10b981;">Quotation Accepted!</h1>
        <p>Thank you for accepting our proposal. We have received your confirmation.</p>
        <p>Your invoice will be generated and sent shortly.</p>
      </div>
    `);
  }

  @Get(':id/decline')
  async publicDecline(@Param('id') id: string, @Res() res: any) {
    await this.svc.update(id, { status: 'Declined' });
    res.send(`
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1 style="color: #ef4444;">Quotation Declined</h1>
        <p>We're sorry to hear that. Your response has been recorded.</p>
        <p>If you have any feedback, please feel free to reach out to us.</p>
      </div>
    `);
  }
}
