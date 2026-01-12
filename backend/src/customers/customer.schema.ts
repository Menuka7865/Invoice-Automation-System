import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Customer extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  company: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop({ default: true })
  active: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
