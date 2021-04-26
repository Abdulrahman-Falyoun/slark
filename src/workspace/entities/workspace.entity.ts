import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {User} from "../../user/entities/user";
import {Space} from "../../space/entities/space.entity";
import {SLARK_SPACE, SLARK_USER} from "../../utils/schema-names";

@Schema()
export class Workspace extends Document {
    @Prop() name: string;
    @Prop() createdAt: Date;
    @Prop({type: [{type: Types.ObjectId, ref: SLARK_USER}]}) _users: User[];
    @Prop({type: [{type: Types.ObjectId, ref: SLARK_SPACE}]}) _spaces: Space[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
