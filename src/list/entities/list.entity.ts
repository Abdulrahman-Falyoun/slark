import {Prop} from "@nestjs/mongoose";
import {Types} from "mongoose";
import {Task} from "../../task/entities/task.entity";
import {Space} from "../../space/entities/space.entity";

export class List {
    @Prop({unique: true}) name: string;
    @Prop({type: [{type: Types.ObjectId, ref: 'task'}]}) tasks: Task[];
    @Prop({ type: Types.ObjectId, ref: 'space'}) space: Space;
}
