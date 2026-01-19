import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ContactPerson {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  designation: string;
}

export const ContactPersonSchema = SchemaFactory.createForClass(ContactPerson);

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

  @Prop()
  address: string; // Added validation for address based on user request "Company Address"

  @Prop({ type: [ContactPersonSchema], default: [] })
  contacts: ContactPerson[];

  @Prop({ default: true })
  active: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
