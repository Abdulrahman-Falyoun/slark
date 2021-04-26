import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {Workspace, WORKSPACE_SCHEMA_NAME} from "../../workspace/entities/workspace.entity";
import {List} from "../../list/entities/list.entity";

@Schema()
export class Space extends Document {
    @Prop({unique: true}) name: string;
    @Prop({type: [{type: Types.ObjectId, ref: 'list'}]}) lists: List[];
    @Prop({type: Types.ObjectId, ref: WORKSPACE_SCHEMA_NAME}) workspace: Workspace;
}

export const SpaceSchema = SchemaFactory.createForClass(Space);
export const SPACE_SCHEMA_NAME = 'space';
