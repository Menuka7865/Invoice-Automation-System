import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project extends Document {
    @Prop({ required: true })
    name: string;

    @Prop()
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
    customer: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Quotation', required: true })
    quotation: Types.ObjectId;

    @Prop({ default: 'Planned' })
    status: string;

    @Prop()
    startDate: string;

    @Prop()
    endDate: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
