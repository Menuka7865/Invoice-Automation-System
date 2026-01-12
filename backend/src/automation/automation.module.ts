import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AutomationProcessor } from './automation.processor.js';
import { QuotationsModule } from '../quotations/quotations.module';
import { InvoicesModule } from '../invoices/invoices.module';
import { CustomersModule } from '../customers/customers.module';
import { EmailModule } from '../email/email.module';
import { PdfModule } from '../pdf/pdf.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'emails' }),
    QuotationsModule,
    InvoicesModule,
    CustomersModule,
    EmailModule,
    PdfModule,
  ],
  providers: [AutomationProcessor],
})
export class AutomationModule {}
