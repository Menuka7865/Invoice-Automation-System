import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [CompanyModule],
  providers: [PdfService],
  exports: [PdfService],
})
export class PdfModule { }
