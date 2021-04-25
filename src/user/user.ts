import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ unique: true }) name: string;
  @Prop({ unique: true }) email: string;
  @Prop() password: string;
  @Prop() verified: boolean;
  @Prop() createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export const SCHEMA_NAME = 'user';
