import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './invoice.schema';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { EmailModule } from '../email/email.module';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    EmailModule,
    PdfModule,
  ],
  providers: [InvoicesService],
  controllers: [InvoicesController],
  exports: [InvoicesService],
})
export class InvoicesModule { }
