import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { FileModel } from '../../libs/file-upload/src';

@Schema({
  timestamps: true,
})
export class Workspace extends Document {
  @Prop() name: string;
  @Prop({
    type: Types.ObjectId,
  })
  image: FileModel;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
