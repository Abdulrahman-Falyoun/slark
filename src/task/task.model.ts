import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserModel } from '../user/user.model';
import { ListModel } from '../list/list.model';
import {
  SLARK_FILE,
  SLARK_LIST,
  SLARK_TASK,
  SLARK_USER,
} from '../utils/schema-names';
import { FileModel } from '../../libs/file-upload/src';

export const TASK_SCHEMA_NAME = 'task';

@Schema()
export class TaskModel extends Document {
  @Prop({ unique: true }) name: string;
  @Prop() createdAt: Date;
  @Prop() description: string;
  @Prop() comments: string[];
  @Prop({ type: [{ type: Types.ObjectId, ref: SLARK_TASK }] })
  _subtasks: TaskModel[];
  @Prop({ type: [{ type: Types.ObjectId, ref: SLARK_USER }] })
  _assignedUsers: UserModel[];
  @Prop({ type: Types.ObjectId, ref: SLARK_LIST }) _list: ListModel;

  @Prop({
    type: [
      {
        type: Types.ObjectId,
        ref: SLARK_FILE,
      },
    ],
  })
  assets: FileModel[];

  @Prop({
    type: Number,
  })
  priority: number;
}

// @ts-ignore
export const TaskSchema = SchemaFactory.createForClass(TaskModel);
