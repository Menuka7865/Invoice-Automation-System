import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CustomersModule } from './customers/customers.module';
import { QuotationsModule } from './quotations/quotations.module';
import { InvoicesModule } from './invoices/invoices.module';
import { AutomationModule } from './automation/automation.module';
import { AiModule } from './ai/ai.module';
import { ServicesModule } from './services/services.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoice'),
    BullModule.forRoot({
      redis: { host: process.env.REDIS_HOST || 'localhost', port: +(process.env.REDIS_PORT || 6379) },
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    CustomersModule,
    QuotationsModule,
    InvoicesModule,
    AutomationModule,
    AiModule,
    ServicesModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
