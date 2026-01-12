import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './customer.schema';

@Injectable()
export class CustomersService {
  constructor(@InjectModel(Customer.name) private customerModel: Model<Customer>) {}

  async create(data: Partial<Customer>) {
    const c = new this.customerModel(data);
    return c.save();
  }

  async findAll(query = {}) {
    return this.customerModel.find(query).lean();
  }

  async findById(id: string) {
    return this.customerModel.findById(id).lean();
  }

  async update(id: string, data: Partial<Customer>) {
    return this.customerModel.findByIdAndUpdate(id, data, { new: true }).lean();
  }

  async remove(id: string) {
    return this.customerModel.findByIdAndDelete(id);
  }
}
