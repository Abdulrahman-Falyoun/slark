import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserModel } from '../user/user.model';
import { SLARK_USER } from '../utils/schema-names';

@Schema({
  timestamps: true,
})
export class Workspace extends Document {
  @Prop() name: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: SLARK_USER }] })
  _users: UserModel[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
