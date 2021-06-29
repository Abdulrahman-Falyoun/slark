import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/entities/user';
import { SLARK_USER } from '../../utils/schema-names';

@Schema({
  timestamps: true,
})
export class Workspace extends Document {
  @Prop() name: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: SLARK_USER }] })
  _users: User[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
