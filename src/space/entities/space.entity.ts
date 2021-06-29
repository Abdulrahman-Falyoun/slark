import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Workspace } from '../../workspace/entities/workspace.entity';
import { List } from '../../list/entities/list.entity';
import { SLARK_LIST, SLARK_WORKSPACE } from '../../utils/schema-names';

@Schema({
  timestamps: true,
})
export class Space extends Document {
  @Prop({ unique: true }) name: string;
  @Prop({ type: Types.ObjectId, ref: SLARK_WORKSPACE }) _workspace: Workspace;
}

export const SpaceSchema = SchemaFactory.createForClass(Space);
