import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserModel } from '../user/user.model';
import { ListModel } from '../list/list.model';
import { SLARK_LIST, SLARK_TASK, SLARK_USER } from '../utils/schema-names';

export const TASK_SCHEMA_NAME = 'task';

@Schema()
export class Task extends Document {
  @Prop({ unique: true }) name: string;
  @Prop() createdAt: Date;
  @Prop() description: string;
  @Prop() comments: string[];
  @Prop({ type: [{ type: Types.ObjectId, ref: SLARK_TASK }] })
  _subtasks: Task[];
  @Prop({ type: [{ type: Types.ObjectId, ref: SLARK_USER }] })
  _assignedUsers: UserModel[];
  @Prop({ type: Types.ObjectId, ref: SLARK_LIST }) _list: ListModel;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
