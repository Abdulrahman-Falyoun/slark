import {Prop, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {User, USER_SCHEMA_NAME} from "../../user/entities/user";
import {Space} from "../../space/entities/space.entity";

export class Workspace extends Document {
    @Prop({unique: true}) name: string;
    @Prop() createdAt: Date;
    @Prop({type: [{type: Types.ObjectId, ref: USER_SCHEMA_NAME}]}) users: User[];
    @Prop({type: [{type: Types.ObjectId, ref: 'space'}]}) spaces: Space[];
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
export const WORKSPACE_SCHEMA_NAME = 'workspace';
