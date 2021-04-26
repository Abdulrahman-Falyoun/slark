import {Prop} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {User} from "../../user/entities/user";

export class Workspace extends Document {


    @Prop({type: [{type: Types.ObjectId, ref: 'user'}]})
    users: User[];
}
