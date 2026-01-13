import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from '../invoices/invoice.schema';
import { Customer, CustomerSchema } from '../customers/customer.schema';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }, { name: Customer.name, schema: CustomerSchema }]),
    PdfModule
  ],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule { }
