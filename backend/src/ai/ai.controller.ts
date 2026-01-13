import { Controller, Get, Res } from '@nestjs/common';
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
  async insights() {
    return this.ai.summarize();
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
