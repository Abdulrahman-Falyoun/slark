import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IFile extends mongoose.Document {
  name: string;
  url: string;
  thumbnail: string;
  ext: string;
  width: string;
  height: string;
  mimetype: string;
  size: number;
  originalName: string;
  dest: string;
}

@Schema({ timestamps: true })
export class FileModel extends Document {
  @Prop()
  name: string;
  @Prop()
  url: string;
  @Prop()
  thumbnail: string;
  @Prop()
  width: number;
  @Prop()
  height: number;
  @Prop()
  size: number;
}

export const FileSchema = SchemaFactory.createForClass(FileModel);
