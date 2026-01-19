import { Controller, Get, Query, Res } from '@nestjs/common';
import { AiService } from './ai.service';
import { PdfService } from '../pdf/pdf.service';
import type { Response } from 'express';

@Controller('ai')
export class AiController {
  constructor(
    private ai: AiService,
    private pdfService: PdfService
  ) { }

  @Get('insights')
  async insights(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.ai.summarize(start, end);
  }

  @Get('report')
  async generateReport(@Res() res: Response) {
    const stats = await this.ai.summarize();
    const pdfBuffer = await this.pdfService.generateDashboardReport(stats);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=dashboard-report.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
