import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {Task} from "../../task/entities/task.entity";
import {Space} from "../../space/entities/space.entity";
import {SLARK_SPACE, SLARK_TASK} from "../../utils/schema-names";


@Schema()
export class List extends Document {
    @Prop({unique: true}) name: string;
    @Prop({type: [{type: Types.ObjectId, ref: SLARK_TASK}]}) _tasks: Task[];
    @Prop({type: Types.ObjectId, ref: SLARK_SPACE}) _space: Space;
}

export const ListSchema = SchemaFactory.createForClass(List);
