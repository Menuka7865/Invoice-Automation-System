
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) { }

    @Get()
    getProfile() {
        return this.companyService.getProfile();
    }

    @Post()
    updateProfile(@Body() body: any) {
        return this.companyService.updateProfile(body);
    }
}
