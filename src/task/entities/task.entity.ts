import {Document, Types} from "mongoose";
import {Prop, SchemaFactory} from "@nestjs/mongoose";
import {User, USER_SCHEMA_NAME} from "../../user/entities/user";
import {Space} from "../../space/entities/space.entity";
import {List, LIST_SCHEMA_NAME} from "../../list/entities/list.entity";


export class Task extends Document {
    @Prop({unique: true}) name: string;
    @Prop() createdAt: Date;
    @Prop() description: string;
    @Prop({type: [{type: Types.ObjectId, ref: USER_SCHEMA_NAME}]}) assignedUsers: User[];
    @Prop({type: Types.ObjectId, ref: LIST_SCHEMA_NAME}) list: List;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
export const TASK_SCHEMA_NAME = 'task';
