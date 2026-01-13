
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './service.schema';

@Injectable()
export class ServicesService {
    constructor(@InjectModel(Service.name) private serviceModel: Model<Service>) { }

    async create(data: Partial<Service>) {
        const service = new this.serviceModel(data);
        return service.save();
    }

    async findAll() {
        return this.serviceModel.find().lean();
    }

    async findById(id: string) {
        return this.serviceModel.findById(id).lean();
    }

    async update(id: string, data: Partial<Service>) {
        return this.serviceModel.findByIdAndUpdate(id, data, { new: true }).lean();
    }

    async remove(id: string) {
        return this.serviceModel.findByIdAndDelete(id);
    }
}
