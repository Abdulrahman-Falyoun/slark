import {Schema, Prop, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {Workspace} from "../../workspace/entities/workspace.entity";
import {SLARK_ROLE, SLARK_WORKSPACE} from "../../utils/schema-names";
import {Role} from "../../role/entities/role.entity";

@Schema()
export class User extends Document {
    @Prop({unique: true}) name: string;
    @Prop({unique: true}) email: string;
    @Prop() password: string;
    @Prop() verified: boolean = false;
    @Prop() createdAt: Date;


    @Prop({type: [{type: Types.ObjectId, ref: SLARK_WORKSPACE}]})
    _workspaces: Workspace[];
    @Prop({type: [{type: Types.ObjectId, ref: SLARK_ROLE}]})
    _roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
export const USER_SCHEMA_NAME = 'user';
