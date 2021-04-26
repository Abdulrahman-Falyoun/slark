import {Prop, SchemaFactory} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {Task} from "../../task/entities/task.entity";
import {Space, SPACE_SCHEMA_NAME} from "../../space/entities/space.entity";

export class List {
    @Prop({unique: true}) name: string;
    @Prop({type: [{type: Types.ObjectId, ref: 'task'}]}) tasks: Task[];
    @Prop({type: Types.ObjectId, ref: SPACE_SCHEMA_NAME}) space: Space;
}

export const ListSchema = SchemaFactory.createForClass(List);
export const LIST_SCHEMA_NAME = 'list';