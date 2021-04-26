import {Document, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {User, USER_SCHEMA_NAME} from "../../user/entities/user";
import {List} from "../../list/entities/list.entity";
import {SLARK_LISTS, SLARK_TASKS} from "../../utils/schema-names";

export const TASK_SCHEMA_NAME = 'task';

@Schema()
export class Task extends Document {
    @Prop({unique: true}) name: string;
    @Prop() createdAt: Date;
    @Prop() description: string;
    @Prop({type: [{type: Types.ObjectId, ref: SLARK_TASKS}]}) _subtasks: Task[];
    @Prop({type: [{type: Types.ObjectId, ref: USER_SCHEMA_NAME}]}) _assignedUsers: User[];
    @Prop({type: Types.ObjectId, ref: SLARK_LISTS}) _list: List;
}


// @ts-ignore
export const TaskSchema = SchemaFactory.createForClass(Task);
