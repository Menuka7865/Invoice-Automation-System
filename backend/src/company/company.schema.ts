
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CompanyProfile extends Document {
    @Prop({ required: true, default: 'My Agency Inc.' })
    name: string;

    @Prop({ required: true, default: 'billing@myagency.com' })
    email: string;

    @Prop({ default: '+1 (555) 000-0000' })
    phone: string;

    @Prop({ default: 'www.myagency.com' })
    website: string;

    @Prop({ default: '123 Innovation Drive, Silicon Valley, CA 94025' })
    address: string;

    @Prop()
    logo: string;

    @Prop({ default: 0 })
    taxRate: number;

    @Prop({ default: 'USD' })
    currency: string;

    @Prop()
    pdfHeaderImage: string; // Base64 or URL
}

export const CompanyProfileSchema = SchemaFactory.createForClass(CompanyProfile);
