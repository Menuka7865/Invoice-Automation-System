
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { CompanyProfile, CompanyProfileSchema } from './company.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CompanyProfile.name, schema: CompanyProfileSchema },
        ]),
    ],
    controllers: [CompanyController],
    providers: [CompanyService],
    exports: [CompanyService],
})
export class CompanyModule { }
