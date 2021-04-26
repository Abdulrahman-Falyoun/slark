import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {Workspace} from "../../workspace/entities/workspace.entity";

@Schema()
export class User extends Document {
    @Prop({unique: true}) name: string;
    @Prop({unique: true}) email: string;
    @Prop() password: string;
    @Prop() verified: boolean = false;
    @Prop() createdAt: Date;


    @Prop({type: [{type: Types.ObjectId, ref: 'workspace'}]})
    workspaces: Workspace[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const SCHEMA_NAME = 'user';
