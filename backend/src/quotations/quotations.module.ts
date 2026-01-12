import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuotationsService } from './quotations.service';
import { QuotationsController } from './quotations.controller';
import { Quotation, QuotationSchema } from './quotation.schema';
import { CustomersModule } from '../customers/customers.module';
import { EmailModule } from '../email/email.module';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Quotation.name, schema: QuotationSchema }]), CustomersModule, EmailModule, PdfModule],
  providers: [QuotationsService],
  controllers: [QuotationsController],
  exports: [QuotationsService],
})
export class QuotationsModule { }
