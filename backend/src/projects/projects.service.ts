import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';

@Injectable()
export class ProjectsService {
    constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>) { }

    async create(data: Partial<Project>) {
        const project = new this.projectModel(data);
        return project.save();
    }

    async findAll() {
        return this.projectModel
            .find()
            .populate('customer')
            .populate('quotation')
            .sort({ createdAt: -1 })
            .lean();
    }

    async findById(id: string) {
        return this.projectModel
            .findById(id)
            .populate('customer')
            .populate('quotation')
            .lean();
    }

    async update(id: string, data: Partial<Project>) {
        return this.projectModel
            .findByIdAndUpdate(id, data, { new: true })
            .populate('customer')
            .populate('quotation')
            .lean();
    }

    async remove(id: string) {
        return this.projectModel.findByIdAndDelete(id);
    }
}
