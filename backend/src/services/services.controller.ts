
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) { }

    @Post()
    create(@Body() body: any) {
        return this.servicesService.create(body);
    }

    @Get()
    findAll() {
        return this.servicesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.servicesService.findById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.servicesService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.servicesService.remove(id);
    }
}
