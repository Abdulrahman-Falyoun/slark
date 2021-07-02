import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FileModel } from '../../libs/file-upload/src';
import { SLARK_FILE } from '../utils/schema-names';

@Schema({
  timestamps: true,
})
export class Workspace extends Document {
  @Prop() name: string;
  @Prop({
    type: Types.ObjectId,
    ref: SLARK_FILE,
  })
  image: FileModel;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
