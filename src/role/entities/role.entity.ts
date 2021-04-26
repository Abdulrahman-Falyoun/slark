import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document, Types} from "mongoose";


@Schema()
export class Role extends Document {
    @Prop({unique: true}) name: string;
    @Prop() number: number;
    @Prop() targetId: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
