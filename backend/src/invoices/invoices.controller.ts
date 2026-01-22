import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { InvoicesService } from './invoices.service';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly svc: InvoicesService) { }

  @Post()
  create(@Body() body: any) {
    return this.svc.create(body);
  }

  @Get()
  list() {
    return this.svc.findAll();
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

  @Post(':id/download')
  async downloadPdf(@Param('id') id: string, @Body() body: any, @Res() res: any) {
    try {
      const pdf = await this.svc.generatePdf(id, body);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=invoice-${id}.pdf`);
      res.setHeader('Content-Length', pdf.length);
      res.send(pdf);
    } catch (error) {
      console.error('Error generating PDF:', error);
      res.status(500).json({ message: 'Error generating PDF', error: error.message });
    }
  }

  @Get(':id/pdf')
  async getPdf(@Param('id') id: string, @Res() res: any) {
    return this.downloadPdf(id, {}, res);
  }

  @Post(':id/send')
  sendEmail(@Param('id') id: string, @Body() body: { recipients?: string[], options?: any }) {
    return this.svc.sendEmail(id, body?.recipients || [], body?.options || {});
  }
}
