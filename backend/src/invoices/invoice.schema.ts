import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Quotation' })
  quotation: Types.ObjectId;

  @Prop({ default: 'Draft' })
  status: string;

  @Prop({ type: Array, default: [] })
  items: any[];

  @Prop({ default: 0 })
  total: number;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop()
  dueDate: Date;

  @Prop()
  paidDate: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
