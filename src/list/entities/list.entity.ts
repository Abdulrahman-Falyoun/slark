import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {Task} from "../../task/entities/task.entity";
import {Space, SPACE_SCHEMA_NAME} from "../../space/entities/space.entity";
import {SLARK_TASKS} from "../../utils/schema-names";


@Schema()
export class List extends Document {
    @Prop({unique: true}) name: string;
    @Prop({type: [{type: Types.ObjectId, ref: SLARK_TASKS}]}) _tasks: Task[];
    @Prop({type: Types.ObjectId, ref: SPACE_SCHEMA_NAME}) _space: Space;
}

export const ListSchema = SchemaFactory.createForClass(List);
export const LIST_SCHEMA_NAME = 'list';