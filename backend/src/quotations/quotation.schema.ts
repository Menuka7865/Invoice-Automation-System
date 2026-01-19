import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type QuotationDocument = Quotation & Document;

@Schema({ timestamps: true })
export class Quotation extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ default: 'Draft' })
  status: string;

  @Prop({ type: Array, default: [] })
  items: any[];

  @Prop({ default: 0 })
  total: number;

  @Prop({ default: 0 })
  taxRate: number;

  @Prop({ default: Date.now })
  date: string;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop()
  templateName: string;
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);
