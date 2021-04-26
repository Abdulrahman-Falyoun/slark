import {Prop} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {User} from "../../user/entities/user";
import {Space} from "../../space/entities/space.entity";

export class Workspace extends Document {
    @Prop({unique: true}) name: string;
    @Prop() createdAt: Date;
    @Prop({type: [{type: Types.ObjectId, ref: 'user'}]}) users: User[];
    @Prop({type: [{type: Types.ObjectId, ref: 'space'}]}) spaces: Space[];
}
