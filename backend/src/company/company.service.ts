
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CompanyProfile } from './company.schema';

@Injectable()
export class CompanyService {
    constructor(
        @InjectModel(CompanyProfile.name) private companyModel: Model<CompanyProfile>,
    ) { }

    async getProfile() {
        const profile = await this.companyModel.findOne().lean();
        if (!profile) {
            // Create a default profile if none exists
            const newProfile = await new this.companyModel({}).save();
            return newProfile.toObject();
        }
        return profile;
    }

    async updateProfile(data: Partial<CompanyProfile>) {
        let profile = await this.companyModel.findOne();
        if (!profile) {
            profile = new this.companyModel(data);
        } else {
            profile.set(data);
        }
        return profile.save();
    }
}
