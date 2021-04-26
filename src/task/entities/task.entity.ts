import {Document, Types} from "mongoose";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {User, USER_SCHEMA_NAME} from "../../user/entities/user";
import {List} from "../../list/entities/list.entity";
import {SLARK_LIST, SLARK_TASK} from "../../utils/schema-names";

export const TASK_SCHEMA_NAME = 'task';

@Schema()
export class Task extends Document {
    @Prop({unique: true}) name: string;
    @Prop() createdAt: Date;
    @Prop() description: string;
    @Prop({type: [{type: Types.ObjectId, ref: SLARK_TASK}]}) _subtasks: Task[];
    @Prop({type: [{type: Types.ObjectId, ref: USER_SCHEMA_NAME}]}) _assignedUsers: User[];
    @Prop({type: Types.ObjectId, ref: SLARK_LIST}) _list: List;
}


// @ts-ignore
export const TaskSchema = SchemaFactory.createForClass(Task);
