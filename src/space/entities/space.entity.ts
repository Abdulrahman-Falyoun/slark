import {Prop, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";
import {Workspace} from "../../workspace/entities/workspace.entity";
import {List} from "../../list/entities/list.entity";

export class Space extends Document {
    @Prop({unique: true}) name: string;
    @Prop({type: [{type: Types.ObjectId, ref: 'list'}]}) lists: List[];
    @Prop({type: Types.ObjectId, ref: 'workspace'}) workspace: Workspace;
}

export const SpaceSchema = SchemaFactory.createForClass(Space);
export const SCHEMA_NAME = 'space';
